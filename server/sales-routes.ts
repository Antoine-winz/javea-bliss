import type { Express, Request, Response, NextFunction } from "express";
import path from "path";
import fs from "fs/promises";
import crypto from "crypto";
import { createHmac, timingSafeEqual } from "crypto";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { isValidPhoneNumber } from "libphonenumber-js";
import { z } from "zod";
import { storage } from "./storage";
import { getLocationFromIP } from "./visitor-tracking";

const LANGUAGES = ["en", "fr", "es", "de", "nl", "it"] as const;
type SalesLanguage = (typeof LANGUAGES)[number];
const PRIVATE_BROCHURES = path.resolve(process.cwd(), "server/private/sales-brochures");
const ACCESS_COOKIE = "jb_sales_access";
const ADMIN_COOKIE = "jb_admin_session";
const SESSION_TTL_MS = 24 * 60 * 60 * 1000;
const CODE_TTL_MS = 10 * 60 * 1000;
const RESEND_COOLDOWN_MS = 60 * 1000;
const CODE_MAX_ATTEMPTS = 5;
const PENDING_RETENTION_MS = 48 * 60 * 60 * 1000;
const VERIFIED_RETENTION_MS = 365 * 24 * 60 * 60 * 1000;
const RETENTION_CLEANUP_INTERVAL_MS = 6 * 60 * 60 * 1000;
const DEFAULT_ADMIN_EMAIL = "admin@javeabliss.com";

const memoryRateLimits = new Map<string, { count: number; resetAt: number }>();
const configuredSessionSecret = process.env.SESSION_SECRET;
if (!configuredSessionSecret) {
  console.warn("[Sales] SESSION_SECRET is not configured; using a process-local fallback. Set it for persistent secure sessions.");
}
const sessionSecret = configuredSessionSecret || crypto.randomBytes(32).toString("hex");

const requestSchema = z.object({
  firstName: z.string().trim().min(1).max(80),
  lastName: z.string().trim().min(1).max(80),
  email: z.string().trim().email().max(320),
  phone: z.string().trim().regex(/^\+[1-9]\d{7,14}$/, "phone"),
  buyerType: z.enum(["private_buyer", "agency"]),
  agencyName: z.string().trim().max(160).optional().nullable(),
  preferredLanguage: z.enum(LANGUAGES),
  consentGiven: z.literal(true),
}).superRefine((value, ctx) => {
  if (!isValidPhoneNumber(value.phone)) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["phone"], message: "Invalid phone number" });
  }
  if (value.buyerType === "agency" && !value.agencyName) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["agencyName"], message: "Agency name is required" });
  }
});

const codeSchema = z.object({
  email: z.string().trim().email().max(320),
  code: z.string().regex(/^\d{6}$/),
});

function genericError(res: Response, status = 400, code = "INVALID_REQUEST") {
  return res.status(status).json({ code, message: "Please check your details and try again." });
}

function escapeHtml(value: unknown): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

type AsyncRoute = (req: Request, res: Response, next: NextFunction) => Promise<unknown>;
function safeAsync(handler: AsyncRoute): AsyncRoute {
  return async (req, res, next) => {
    try {
      await handler(req, res, next);
    } catch (error) {
      console.error("[Sales] request failed:", error);
      if (!res.headersSent) genericError(res, 500, "SERVER_ERROR");
    }
  };
}

function clientIp(req: Request): string {
  return (req.ip || req.socket.remoteAddress || "unknown").slice(0, 128);
}

function allowRateLimit(key: string, max: number, windowMs: number): boolean {
  const now = Date.now();
  const current = memoryRateLimits.get(key);
  if (!current || now >= current.resetAt) {
    memoryRateLimits.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (current.count >= max) return false;
  current.count += 1;
  return true;
}

function hashCode(email: string, code: string): string {
  return createHmac("sha256", sessionSecret).update(`${email.toLowerCase()}:${code}`).digest("hex");
}

function safeEqual(a: string, b: string): boolean {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}

function signToken(payload: Record<string, unknown>): string {
  const encoded = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = createHmac("sha256", sessionSecret).update(encoded).digest("base64url");
  return `${encoded}.${signature}`;
}

function readToken(value: string | undefined): Record<string, unknown> | null {
  if (!value) return null;
  const [encoded, signature] = value.split(".");
  if (!encoded || !signature) return null;
  const expected = createHmac("sha256", sessionSecret).update(encoded).digest("base64url");
  if (!safeEqual(expected, signature)) return null;
  try {
    const payload = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8")) as Record<string, unknown>;
    if (typeof payload.exp !== "number" || payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

function getCookie(req: Request, name: string): string | undefined {
  const header = req.headers.cookie || "";
  const match = header.split(";").map((part) => part.trim()).find((part) => part.startsWith(`${name}=`));
  return match?.slice(name.length + 1);
}

function setCookie(res: Response, name: string, value: string, maxAge: number) {
  res.setHeader("Set-Cookie", `${name}=${value}; Max-Age=${Math.floor(maxAge / 1000)}; Path=/; HttpOnly; SameSite=None; Secure`);
}

function clearCookie(res: Response, name: string) {
  res.setHeader("Set-Cookie", `${name}=; Max-Age=0; Path=/; HttpOnly; SameSite=None; Secure`);
}

function accessLeadId(req: Request): number | null {
  const authorization = req.headers.authorization;
  const bearerToken = authorization?.startsWith("Bearer ") ? authorization.slice(7) : undefined;
  const payload = readToken(bearerToken || getCookie(req, ACCESS_COOKIE));
  return typeof payload?.leadId === "number" ? payload.leadId : null;
}

function adminMiddleware(req: Request, res: Response, next: NextFunction) {
  const payload = readToken(getCookie(req, ADMIN_COOKIE));
  if (payload?.role !== "admin") return res.status(401).json({ code: "ADMIN_AUTH_REQUIRED", message: "Authentication required." });
  next();
}

function publicLead(lead: Awaited<ReturnType<typeof storage.getSalesLeadById>>) {
  if (!lead) return null;
  return {
    id: lead.id,
    firstName: lead.firstName,
    lastName: lead.lastName,
    email: lead.email,
    preferredLanguage: lead.preferredLanguage,
    verifiedAt: lead.verifiedAt,
  };
}

function crmLead(lead: Awaited<ReturnType<typeof storage.getSalesLeadById>>) {
  if (!lead) return null;
  const { verificationCodeHash, ...safe } = lead;
  return safe;
}

async function sendEmail(to: string, subject: string, text: string, html: string) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error("RESEND_API_KEY is not configured");
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.SALES_EMAIL_FROM || "Jávea Bliss <admin@javeabliss.com>",
      to: [to],
      subject,
      text,
      html,
    }),
  });
  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Resend returned ${response.status}: ${details}`);
  }
}

async function sendVerificationEmail(firstName: string, email: string, code: string, language: SalesLanguage) {
  const safeFirstName = escapeHtml(firstName);
  const messages: Record<SalesLanguage, {
    subject: string;
    greeting: (name: string) => string;
    thanks: string;
    codeLabel: string;
    validity: string;
    instruction: string;
  }> = {
    en: {
      subject: "Jávea Bliss · Private presentation access",
      greeting: (name) => `Hello ${name},`,
      thanks: "Thank you for your interest in Jávea Bliss.",
      codeLabel: "Your verification code is:",
      validity: "The code is valid for 10 minutes.",
      instruction: "Enter the code on the website to access the private property presentation.",
    },
    fr: {
      subject: "Jávea Bliss · Accès à la présentation privée",
      greeting: (name) => `Bonjour ${name},`,
      thanks: "Merci de l’intérêt que vous portez à Jávea Bliss.",
      codeLabel: "Votre code de vérification est :",
      validity: "Ce code est valable pendant 10 minutes.",
      instruction: "Saisissez-le sur le site pour accéder à la présentation privée du bien.",
    },
    es: {
      subject: "Jávea Bliss · Acceso a la presentación privada",
      greeting: (name) => `Hola ${name},`,
      thanks: "Gracias por su interés en Jávea Bliss.",
      codeLabel: "Su código de verificación es:",
      validity: "El código es válido durante 10 minutos.",
      instruction: "Introduzca el código en el sitio web para acceder a la presentación privada de la propiedad.",
    },
    de: {
      subject: "Jávea Bliss · Zugang zur privaten Präsentation",
      greeting: (name) => `Guten Tag ${name},`,
      thanks: "Vielen Dank für Ihr Interesse an Jávea Bliss.",
      codeLabel: "Ihr Bestätigungscode lautet:",
      validity: "Der Code ist 10 Minuten gültig.",
      instruction: "Geben Sie den Code auf der Website ein, um auf die private Immobilienpräsentation zuzugreifen.",
    },
    nl: {
      subject: "Jávea Bliss · Toegang tot de privépresentatie",
      greeting: (name) => `Hallo ${name},`,
      thanks: "Dank u voor uw interesse in Jávea Bliss.",
      codeLabel: "Uw verificatiecode is:",
      validity: "De code is 10 minuten geldig.",
      instruction: "Voer de code op de website in om toegang te krijgen tot de privépresentatie van de woning.",
    },
    it: {
      subject: "Jávea Bliss · Accesso alla presentazione privata",
      greeting: (name) => `Buongiorno ${name},`,
      thanks: "Grazie per il suo interesse in Jávea Bliss.",
      codeLabel: "Il suo codice di verifica è:",
      validity: "Il codice è valido per 10 minuti.",
      instruction: "Inserisca il codice sul sito per accedere alla presentazione privata dell’immobile.",
    },
  };
  const message = messages[language];
  const plainGreeting = message.greeting(firstName);
  const htmlGreeting = message.greeting(safeFirstName);
  await sendEmail(
    email,
    message.subject,
    `${plainGreeting}\n\n${message.thanks}\n\n${message.codeLabel} ${code}\n\n${message.validity}\n${message.instruction}\n\nJávea Bliss\nArenal · Jávea · Costa Blanca`,
    `<p>${htmlGreeting}</p><p>${message.thanks}</p><p>${message.codeLabel}</p><p style="font-size:28px;letter-spacing:8px"><strong>${escapeHtml(code)}</strong></p><p>${message.validity}</p><p>${message.instruction}</p><p>Jávea Bliss<br>Arenal · Jávea · Costa Blanca</p>`,
  );
}

async function notifyOwner(lead: NonNullable<Awaited<ReturnType<typeof storage.getSalesLeadById>>>) {
  const recipient = process.env.SALES_NOTIFICATION_EMAIL || DEFAULT_ADMIN_EMAIL;
  const safe = {
    firstName: escapeHtml(lead.firstName),
    lastName: escapeHtml(lead.lastName),
    buyerType: escapeHtml(lead.buyerType),
    agencyName: escapeHtml(lead.agencyName || "-"),
    email: escapeHtml(lead.email),
    phone: escapeHtml(lead.phone),
    preferredLanguage: escapeHtml(lead.preferredLanguage),
  };
  await sendEmail(
    recipient,
    "NEW VERIFIED JÁVEA BLISS SALE ENQUIRY",
    `Name: ${lead.firstName} ${lead.lastName}\nEnquiry type: ${lead.buyerType}\nAgency: ${lead.agencyName || "-"}\nEmail: ${lead.email}\nMobile: ${lead.phone}\nPreferred language: ${lead.preferredLanguage}\nEmail verified: ${lead.verifiedAt?.toISOString() || new Date().toISOString()}`,
    `<h2>New verified Jávea Bliss sale enquiry</h2><p><strong>Name:</strong> ${safe.firstName} ${safe.lastName}</p><p><strong>Enquiry type:</strong> ${safe.buyerType}</p><p><strong>Agency:</strong> ${safe.agencyName}</p><p><strong>Email:</strong> ${safe.email}</p><p><strong>Mobile:</strong> ${safe.phone}</p><p><strong>Preferred language:</strong> ${safe.preferredLanguage}</p>`,
  );
}

async function stampedBrochure(sourcePath: string, lead: NonNullable<Awaited<ReturnType<typeof storage.getSalesLeadById>>>, reference: string) {
  const source = await fs.readFile(sourcePath);
  const sourcePdf = await PDFDocument.load(source);
  const pdf = await PDFDocument.create();
  const copiedPages = await pdf.copyPages(sourcePdf, sourcePdf.getPageIndices());
  for (const page of copiedPages) pdf.addPage(page);
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const timestamp = new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Europe/Madrid",
  }).format(new Date());
  const stamp = `Private copy · ${lead.firstName} ${lead.lastName} · ${lead.email} · ${timestamp} · ${reference}`;
  for (const page of pdf.getPages()) {
    const { width } = page.getSize();
    const preferredFontSize = 6.5;
    const preferredWidth = font.widthOfTextAtSize(stamp, preferredFontSize);
    const fontSize = Math.min(preferredFontSize, ((width - 64) / preferredWidth) * preferredFontSize);
    const textWidth = font.widthOfTextAtSize(stamp, fontSize);
    const boxWidth = Math.min(width - 48, textWidth + 16);
    page.drawRectangle({ x: (width - boxWidth) / 2, y: 12, width: boxWidth, height: 13, color: rgb(0.95, 0.93, 0.88), opacity: 0.94 });
    page.drawText(stamp, { x: (width - textWidth) / 2, y: 16, size: fontSize, font, color: rgb(0.12, 0.17, 0.2), opacity: 0.9 });
  }
  // Traditional cross-reference tables are required for reliable compatibility
  // with macOS Preview and other strict PDF readers.
  return pdf.save({ useObjectStreams: false });
}

export function registerSalesRoutes(app: Express) {
  const cleanExpiredSalesData = async () => {
    try {
      const now = Date.now();
      await storage.deleteExpiredSalesData(
        new Date(now - PENDING_RETENTION_MS),
        new Date(now - VERIFIED_RETENTION_MS),
      );
    } catch (error) {
      console.error("[Sales] Lead retention cleanup failed:", error);
    }
  };
  void cleanExpiredSalesData();
  const retentionTimer = setInterval(cleanExpiredSalesData, RETENTION_CLEANUP_INTERVAL_MS);
  retentionTimer.unref();

  app.post("/api/sales/request-access", safeAsync(async (req, res) => {
    const ipAddress = clientIp(req);
    if (await storage.isSalesIpBlocked(ipAddress)) {
      return res.status(403).json({ code: "IP_BLOCKED", message: "Access is unavailable." });
    }
    const body = {
      ...req.body,
      buyerType: req.body?.buyerType === "private" ? "private_buyer" : req.body?.buyerType,
      phone: typeof req.body?.phone === "string" ? req.body.phone.replace(/[^\d+]/g, "") : req.body?.phone,
    };
    const parsed = requestSchema.safeParse(body);
    if (!parsed.success) return genericError(res, 400, "VALIDATION_ERROR");
    const email = parsed.data.email.toLowerCase();
    if (!allowRateLimit(`sales-ip:${clientIp(req)}`, 5, 15 * 60 * 1000) ||
        !allowRateLimit(`sales-email:${email}`, 5, 15 * 60 * 60 * 1000)) {
      return genericError(res, 429, "RATE_LIMITED");
    }
    const code = String(crypto.randomInt(100000, 1000000));
    const now = new Date();
    const location = await getLocationFromIP(ipAddress);
    const lead = await storage.upsertSalesLead({
      ...parsed.data,
      email,
      ipAddress,
      ipCity: location.city,
      ipCountry: location.country,
      consentTimestamp: now,
      verificationStatus: "pending_verification",
      verificationCodeHash: hashCode(email, code),
      verificationCreatedAt: now,
      verificationExpiresAt: new Date(now.getTime() + CODE_TTL_MS),
      verificationAttempts: 0,
      lastCodeSentAt: now,
    });
    try {
      await sendVerificationEmail(lead.firstName, lead.email, code, lead.preferredLanguage as SalesLanguage);
    } catch (error) {
      console.error("[Sales] verification email delivery failed:", error);
      return genericError(res, 503, "EMAIL_UNAVAILABLE");
    }
    return res.status(200).json({ ok: true, email: lead.email.replace(/^(.{2}).*(@.*)$/, "$1•••$2") });
  }));

  app.post("/api/sales/resend", safeAsync(async (req, res) => {
    const emailResult = z.object({ email: z.string().email() }).safeParse(req.body);
    if (!emailResult.success) return genericError(res, 400, "VALIDATION_ERROR");
    const email = emailResult.data.email.toLowerCase();
    if (!allowRateLimit(`sales-resend-ip:${clientIp(req)}`, 5, 15 * 60 * 1000) ||
        !allowRateLimit(`sales-resend-email:${email}`, 5, 15 * 60 * 60 * 1000)) {
      return genericError(res, 429, "RATE_LIMITED");
    }
    const lead = await storage.getSalesLeadByEmail(email);
    if (!lead) return res.status(200).json({ ok: true });
    if (lead.lastCodeSentAt && Date.now() - lead.lastCodeSentAt.getTime() < RESEND_COOLDOWN_MS) {
      return genericError(res, 429, "RESEND_COOLDOWN");
    }
    const code = String(crypto.randomInt(100000, 1000000));
    const now = new Date();
    await storage.updateSalesLead(lead.id, {
      verificationStatus: "pending_verification",
      verificationCodeHash: hashCode(email, code),
      verificationCreatedAt: now,
      verificationExpiresAt: new Date(now.getTime() + CODE_TTL_MS),
      verificationAttempts: 0,
      lastCodeSentAt: now,
    });
    try {
      await sendVerificationEmail(lead.firstName, email, code, lead.preferredLanguage as SalesLanguage);
    } catch (error) {
      console.error("[Sales] verification resend failed:", error);
      return genericError(res, 503, "EMAIL_UNAVAILABLE");
    }
    return res.json({ ok: true });
  }));

  app.post("/api/sales/verify", safeAsync(async (req, res) => {
    const parsed = codeSchema.safeParse(req.body);
    if (!parsed.success) return genericError(res, 400, "INVALID_CODE");
    const email = parsed.data.email.toLowerCase();
    const lead = await storage.getSalesLeadByEmail(email);
    if (!lead || lead.verificationStatus === "verified" && lead.verifiedAt) {
      return genericError(res, 400, "INVALID_CODE");
    }
    if ((lead.verificationAttempts || 0) >= CODE_MAX_ATTEMPTS) return genericError(res, 429, "TOO_MANY_ATTEMPTS");
    if (!lead.verificationExpiresAt || lead.verificationExpiresAt.getTime() < Date.now()) return genericError(res, 400, "CODE_EXPIRED");
    const valid = !!lead.verificationCodeHash && safeEqual(lead.verificationCodeHash, hashCode(email, parsed.data.code));
    if (!valid) {
      await storage.updateSalesLead(lead.id, { verificationAttempts: (lead.verificationAttempts || 0) + 1 });
      return genericError(res, 400, "INVALID_CODE");
    }
    const verifiedAt = new Date();
    const updated = await storage.updateSalesLead(lead.id, {
      verificationStatus: "verified",
      verifiedAt,
      verificationCodeHash: null,
      verificationAttempts: 0,
    });
    const accessToken = signToken({ leadId: lead.id, exp: Date.now() + SESSION_TTL_MS });
    setCookie(res, ACCESS_COOKIE, accessToken, SESSION_TTL_MS);
    res.setHeader("X-Sales-Access-Token", accessToken);
    if (updated && !updated.ownerNotifiedAt) {
      try {
        await notifyOwner({ ...updated, verifiedAt });
        await storage.updateSalesLead(updated.id, { ownerNotifiedAt: new Date() });
      } catch (error) {
        console.error("[Sales] owner notification failed:", error);
      }
    }
    return res.json({ ok: true, lead: publicLead(updated) });
  }));

  app.get("/api/sales/session", safeAsync(async (req, res) => {
    const id = accessLeadId(req);
    if (!id) return res.json({ verified: false });
    const lead = await storage.getSalesLeadById(id);
    if (!lead || lead.verificationStatus !== "verified") return res.json({ verified: false });
    return res.json({ verified: true, lead: publicLead(lead) });
  }));

  app.post("/api/sales/logout", (_req, res) => {
    clearCookie(res, ACCESS_COOKIE);
    res.json({ ok: true });
  });

  app.get("/api/sales/brochure", safeAsync(async (req, res) => {
    const leadId = accessLeadId(req);
    if (!leadId) return res.status(401).json({ code: "VERIFICATION_REQUIRED", message: "Verification required." });
    const lead = await storage.getSalesLeadById(leadId);
    if (!lead || lead.verificationStatus !== "verified") return res.status(401).json({ code: "VERIFICATION_REQUIRED", message: "Verification required." });
    if (lead.brochureDownloadedAt) {
      clearCookie(res, ACCESS_COOKIE);
      return res.status(409).json({ code: "DOWNLOAD_ALREADY_USED", message: "A new registration is required for another copy." });
    }
    const language = (typeof req.query.lang === "string" && LANGUAGES.includes(req.query.lang as SalesLanguage) ? req.query.lang : lead.preferredLanguage) as SalesLanguage;
    const sourcePath = path.join(PRIVATE_BROCHURES, `${language}.pdf`);
    try {
      await fs.access(sourcePath);
      const reference = `JB-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${crypto.randomBytes(4).toString("hex").toUpperCase()}`;
      const stamped = await stampedBrochure(sourcePath, lead, reference);
      const downloadedAt = new Date();
      const claimed = await storage.claimSalesBrochureDownload(lead.id, downloadedAt);
      if (!claimed) {
        clearCookie(res, ACCESS_COOKIE);
        return res.status(409).json({ code: "DOWNLOAD_ALREADY_USED", message: "A new registration is required for another copy." });
      }
      try {
        await storage.createSalesDownload({ leadId: lead.id, language, reference });
      } catch (error) {
        await storage.releaseSalesBrochureDownload(lead.id, downloadedAt);
        throw error;
      }
      const body = Buffer.from(stamped);
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `attachment; filename="Javea-Bliss-${language}-${reference}.pdf"`);
      res.setHeader("Content-Length", body.byteLength);
      res.setHeader("Cache-Control", "no-store, private");
      res.setHeader("X-Robots-Tag", "noindex, nofollow");
      clearCookie(res, ACCESS_COOKIE);
      return res.send(body);
    } catch (error) {
      console.error("[Sales] brochure generation failed:", error);
      return res.status(503).json({ code: "BROCHURE_UNAVAILABLE", message: "The presentation is temporarily unavailable." });
    }
  }));

  app.post("/api/admin/login", async (req, res) => {
    if (!allowRateLimit(`admin-login:${clientIp(req)}`, 10, 15 * 60 * 1000)) {
      return genericError(res, 429, "RATE_LIMITED");
    }
    const expected = process.env.ADMIN_PASSWORD;
    if (!expected) {
      console.error("[Sales] ADMIN_PASSWORD is not configured; CRM login is disabled.");
      return res.status(503).json({ code: "ADMIN_UNAVAILABLE", message: "Authentication is temporarily unavailable." });
    }
    const password = typeof req.body?.password === "string" ? req.body.password : "";
    if (!safeEqual(password, expected)) return res.status(401).json({ code: "INVALID_CREDENTIALS", message: "Invalid credentials." });
    setCookie(res, ADMIN_COOKIE, signToken({ role: "admin", exp: Date.now() + SESSION_TTL_MS }), SESSION_TTL_MS);
    res.json({ authenticated: true });
  });

  app.get("/api/admin/session", (req, res) => {
    const payload = readToken(getCookie(req, ADMIN_COOKIE));
    if (payload?.role !== "admin") return res.status(401).json({ authenticated: false });
    res.json({ authenticated: true });
  });

  app.post("/api/admin/logout", (_req, res) => {
    clearCookie(res, ADMIN_COOKIE);
    res.json({ ok: true });
  });

  app.get("/api/admin/sales-leads", adminMiddleware, safeAsync(async (req, res) => {
    const search = typeof req.query.search === "string" ? req.query.search.slice(0, 100) : undefined;
    const status = typeof req.query.status === "string" ? req.query.status.slice(0, 40) : undefined;
    const buyerType = typeof req.query.buyerType === "string" ? req.query.buyerType.slice(0, 40) : undefined;
    const leads = await storage.listSalesLeads({ search, status, buyerType });
    res.json({ leads: leads.map(crmLead) });
  }));

  app.get("/api/admin/sales-leads/:id", adminMiddleware, safeAsync(async (req, res) => {
    const lead = await storage.getSalesLeadById(Number(req.params.id));
    if (!lead) return res.status(404).json({ code: "NOT_FOUND", message: "Lead not found." });
    const downloads = await storage.getSalesDownloads(lead.id);
    const ipBlocked = lead.ipAddress ? await storage.isSalesIpBlocked(lead.ipAddress) : false;
    res.json({ ...crmLead(lead), ipBlocked, downloads: downloads.map((download) => ({ ...download, brochureLanguage: download.language })) });
  }));

  app.patch("/api/admin/sales-leads/:id", adminMiddleware, safeAsync(async (req, res) => {
    const parsed = z.object({
      followUpStatus: z.enum(["new", "contacted", "qualified", "not_interested", "closed", "archived"]).optional(),
      followUpNotes: z.string().max(5000).nullable().optional(),
      lastContactedAt: z.string().datetime().nullable().optional(),
    }).safeParse(req.body);
    if (!parsed.success) return genericError(res, 400, "VALIDATION_ERROR");
    const updates = {
      ...parsed.data,
      lastContactedAt: parsed.data.lastContactedAt === undefined ? undefined : parsed.data.lastContactedAt ? new Date(parsed.data.lastContactedAt) : null,
    };
    const lead = await storage.updateSalesLead(Number(req.params.id), updates);
    if (!lead) return res.status(404).json({ code: "NOT_FOUND", message: "Lead not found." });
    res.json(crmLead(lead));
  }));

  app.post("/api/admin/sales-leads/:id/block-ip", adminMiddleware, safeAsync(async (req, res) => {
    const lead = await storage.getSalesLeadById(Number(req.params.id));
    if (!lead) return res.status(404).json({ code: "NOT_FOUND", message: "Lead not found." });
    if (!lead.ipAddress) return res.status(400).json({ code: "IP_UNAVAILABLE", message: "No IP address is available for this enquiry." });
    await storage.blockSalesIp({ ipAddress: lead.ipAddress, city: lead.ipCity, country: lead.ipCountry });
    res.json({ blocked: true });
  }));

  app.delete("/api/admin/sales-leads/:id/block-ip", adminMiddleware, safeAsync(async (req, res) => {
    const lead = await storage.getSalesLeadById(Number(req.params.id));
    if (!lead) return res.status(404).json({ code: "NOT_FOUND", message: "Lead not found." });
    if (lead.ipAddress) await storage.unblockSalesIp(lead.ipAddress);
    res.json({ blocked: false });
  }));
}