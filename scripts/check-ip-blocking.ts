import assert from "node:assert/strict";
import express from "express";
import { createHmac, randomUUID } from "node:crypto";
import React, { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import SalesFAQ from "../client/src/components/SalesFAQ";

// tsx uses classic JSX here; the app itself uses Vite's automatic JSX runtime.
Object.assign(globalThis, { React });
// Only this isolated process uses synthetic credentials; the running app is unchanged.
process.env.NODE_ENV = "test";
process.env.ADMIN_PASSWORD = randomUUID();
process.env.SESSION_SECRET = randomUUID();
const { storage } = await import("../server/storage");
const { registerSalesRoutes } = await import("../server/sales-routes");
const { createIpBlocker } = await import("../server/ip-blocking");
const { sameOriginWrites } = await import("../server/security");
const app = express();
app.set("trust proxy", "loopback");
app.use(express.json());
app.use("/api", sameOriginWrites);
app.use(createIpBlocker(() => storage.listBlockedIps()));
registerSalesRoutes(app);
app.use((_req, res) => res.send("Isolated test page"));
const server = app.listen(0, "127.0.0.1");
await new Promise<void>(resolve => server.once("listening", resolve));
const base = `http://127.0.0.1:${(server.address() as { port: number }).port}`;
const ip = "192.0.2.254"; // RFC 5737: cannot be a real public visitor.
const baseline = await storage.listBlockedIps();
assert.ok(!baseline.some(rule => rule.ipAddress === ip), "Test IP exists; abort");
let cookie = "";
let created = false;
const call = (path: string, method = "GET", body?: unknown, headers = {}) =>
  fetch(base + path, { method, headers: { "Content-Type": "application/json", Cookie: cookie, ...headers },
    body: body === undefined ? undefined : JSON.stringify(body) });
try {
  assert.equal((await call("/api/admin/blocked-ips")).status, 401);
  assert.equal((await call("/api/admin/login", "POST", { password: "wrong-test-password" })).status, 401);
  const login = await call("/api/admin/login", "POST", { password: process.env.ADMIN_PASSWORD });
  assert.equal(login.status, 200);
  cookie = login.headers.get("set-cookie")!.split(";")[0];
  assert.equal((await call("/api/admin/session")).status, 200);
  assert.equal((await call("/api/admin/blocked-ips")).status, 200);
  assert.equal((await call("/api/admin/blocked-ips", "POST", { ip: "invalid" })).status, 400);
  assert.equal((await call("/api/admin/blocked-ips", "POST", { ip: "127.0.0.1" })).status, 400);
  assert.equal((await call("/api/admin/blocked-ips", "POST", { ip }, { Origin: "https://untrusted.example" })).status, 403);
  assert.equal((await call("/api/admin/blocked-ips", "POST", { ip })).status, 200);
  created = true;
  const listed = await (await call("/api/admin/blocked-ips")).json();
  assert.ok(listed.blocks.some((rule: any) => rule.ipAddress === ip));
  assert.equal(await storage.isSalesIpBlocked(ip), true);
  assert.equal((await call("/fr/for-sale", "GET", undefined, { "X-Forwarded-For": ip })).status, 403);
  assert.equal((await call("/api/admin/session", "GET", undefined, { "X-Forwarded-For": ip })).status, 200);
  assert.equal((await call("/api/admin/blocked-ips", "DELETE", { ip })).status, 200);
  created = false;
  assert.equal(await storage.isSalesIpBlocked(ip), false);
  assert.equal((await call("/fr/for-sale", "GET", undefined, { "X-Forwarded-For": ip })).status, 200);
  assert.equal((await call("/api/admin/blocked-ips", "DELETE", { ip })).status, 200);
  assert.deepEqual(await storage.listBlockedIps(), baseline);
  assert.equal((await call("/api/admin/logout", "POST")).status, 200);
  cookie = "";
  assert.equal((await call("/api/admin/session")).status, 401);
  console.log("PASS: real database read/add/remove, empty list, cache refresh, 403 block, admin recovery, authentication and CSRF");

  cookie = "";
  for (const lang of ["en", "fr", "es", "de", "nl", "it"]) {
    assert.equal((await call(`/api/sales/brochure?lang=${lang}`)).status, 401);
    const html = renderToStaticMarkup(createElement(SalesFAQ, { language: lang as any }));
    const href = html.match(/href="(mailto:[^"]+)"/)?.[1];
    assert.ok(href);
    const params = new URL(href.replaceAll("&amp;", "&").replaceAll("&#x27;", "'").replaceAll("&quot;", '"')).searchParams;
    assert.ok(params.get("subject")?.length);
    assert.ok(params.get("body")!.length > 300);
    const greetings = { en: "Hello", fr: "Bonjour", es: "Hola", de: "Guten Tag", nl: "Beste eigenaar", it: "Buongiorno" };
    assert.ok(params.get("body")!.startsWith(greetings[lang as keyof typeof greetings]));
    assert.doesNotMatch(html, /367[.,\s]?\s?900/);
    console.log(`PASS: ${lang} translated prefilled contact and anonymous brochure denied`);
  }
  assert.equal((await call("/api/sales/brochure", "GET", undefined, { Authorization: "Bearer invalid.signature" })).status, 401);
  const expired = Buffer.from(JSON.stringify({ leadId: -1, exp: Date.now() - 1000 })).toString("base64url");
  const signature = createHmac("sha256", process.env.SESSION_SECRET!).update(expired).digest("base64url");
  assert.equal((await call("/api/sales/brochure", "GET", undefined, { Authorization: `Bearer ${expired}.${signature}` })).status, 401);
  console.log("PASS: tampered and expired brochure tokens denied");

  // Isolated in-memory lead: exercise the actual protected PDF handler without
  // creating a real buyer, sending mail, or writing brochure audit records.
  const originals = {
    getSalesLeadById: storage.getSalesLeadById,
    claimSalesBrochureDownload: storage.claimSalesBrochureDownload,
    createSalesDownload: storage.createSalesDownload,
  };
  const lead: any = { id: -1, firstName: "Isolated", lastName: "Test",
    email: "audit@example.invalid", phone: "+34000000000", preferredLanguage: "fr",
    verificationStatus: "pending_verification", brochureDownloadedAt: null };
  let audits = 0;
  storage.getSalesLeadById = async id => id === -1 ? lead : undefined;
  storage.claimSalesBrochureDownload = async (_id, at) => {
    if (lead.brochureDownloadedAt) return false;
    lead.brochureDownloadedAt = at;
    return true;
  };
  storage.createSalesDownload = async record => { audits++; return record as any; };
  try {
    const encoded = Buffer.from(JSON.stringify({ leadId: -1, exp: Date.now() + 60000 })).toString("base64url");
    const signed = createHmac("sha256", process.env.SESSION_SECRET!).update(encoded).digest("base64url");
    const headers = { Authorization: `Bearer ${encoded}.${signed}` };
    assert.equal((await call("/api/sales/brochure?lang=fr", "GET", undefined, headers)).status, 401);
    lead.verificationStatus = "verified";
    const pdf = await call("/api/sales/brochure?lang=fr", "GET", undefined, headers);
    assert.equal(pdf.status, 200);
    assert.equal(pdf.headers.get("content-type"), "application/pdf");
    assert.match(pdf.headers.get("cache-control")!, /no-store/);
    assert.match(pdf.headers.get("set-cookie")!, /Max-Age=0/);
    assert.equal(Buffer.from(await pdf.arrayBuffer()).subarray(0, 4).toString(), "%PDF");
    assert.equal((await call("/api/sales/brochure?lang=fr", "GET", undefined, headers)).status, 409);
    assert.equal(audits, 1);
    console.log("PASS: unverified fixture denied, verified fixture receives private PDF exactly once; no database lead/audit writes");
  } finally {
    Object.assign(storage, originals);
  }
} finally {
  if (created) await storage.unblockSalesIp(ip);
  assert.deepEqual(await storage.listBlockedIps(), baseline, "Existing rules must remain unchanged");
  await new Promise<void>(resolve => server.close(() => resolve()));
}
