import express, { type Request, Response, NextFunction } from "express";
import path from "path";
import fs from "fs";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

const app = express();

// Health check endpoint - MUST be before any middleware that could redirect or block
// Replit probes both / and /healthz during startup
app.get("/healthz", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

// Lightweight root health probe — returns 200 immediately so deployment
// healthchecks pass even before the full app is wired up. Registered ahead of
// the language redirect below, which must never intercept a probe: a 302 here
// fails the deploy.
app.get("/", (_req, res, next) => {
  // Only intercept in production for the healthcheck probe (no Accept: text/html)
  if (
    process.env.NODE_ENV === "production" &&
    !(_req.headers["accept"] || "").includes("text/html")
  ) {
    res.status(200).send("OK");
    return;
  }
  next();
});

// Serve static files from client/public (flyer.html, robots.txt, etc.)
const publicPath = path.resolve(process.cwd(), "client", "public");
app.use(express.static(publicPath));

// Security headers middleware
app.use((req, res, next) => {
  // Force HTTPS in production (but skip for health checks and internal probes)
  if (process.env.NODE_ENV === 'production' && req.header('x-forwarded-proto') !== 'https') {
    const host = req.header('host') || '';
    // Only redirect if we have a real host (not internal health probes)
    if (host && !host.includes('localhost') && !host.includes('127.0.0.1')) {
      res.redirect(`https://${host}${req.url}`);
      return;
    }
  }
  
  // Security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  
  // Content Security Policy
  res.setHeader('Content-Security-Policy', 
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://replit.com https://cdn.emailjs.com https://www.googletagmanager.com; " +
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
    "img-src 'self' data: https:; " +
    "font-src 'self' data: https://fonts.gstatic.com; " +
    "connect-src 'self' wss: ws: https://api.emailjs.com https://www.google.com https://www.google-analytics.com https://*.google-analytics.com https://api.open-meteo.com; " +
    "frame-src https://www.google.com; " +
    "frame-ancestors 'self' https://*.replit.com https://*.replit.dev https://*.repl.co;"
  );
  
  // HSTS header for HTTPS enforcement
  if (req.secure || req.header('x-forwarded-proto') === 'https') {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  }
  
  next();
});

// WWW redirect middleware - redirect www.javeabliss.com to javeabliss.com
app.use((req, res, next) => {
  const host = req.header('host');
  if (host && host.startsWith('www.')) {
    const newHost = host.replace('www.', '');
    const protocol = req.secure || req.header('x-forwarded-proto') === 'https' ? 'https' : 'http';
    const redirectUrl = `${protocol}://${newHost}${req.url}`;
    
    log(`WWW redirect: ${host} -> ${newHost}`, 'redirect');
    return res.redirect(301, redirectUrl);
  }
  next();
});

// Language negotiation for the bare root. A visitor's explicit choice (cookie,
// set by the language switcher) wins over the OS/browser preference
// (Accept-Language). No match at all → fall through and serve the x-default
// English page exactly as before, which is also what header-less crawlers get.
const SUPPORTED_LANGS = ['en', 'nl', 'fr', 'it', 'de', 'es'];

function negotiateLanguage(req: Request): string | null {
  const cookieMatch = /(?:^|;\s*)preferredLanguage=([a-z]{2})(?:;|$)/.exec(req.headers.cookie || '');
  if (cookieMatch && SUPPORTED_LANGS.includes(cookieMatch[1])) {
    return cookieMatch[1];
  }

  const header = req.headers['accept-language'];
  if (!header || typeof header !== 'string') return null;

  // "nl-NL,nl;q=0.9,en;q=0.8" → tags ranked by quality, matched on the primary subtag
  const ranked = header
    .split(',')
    .map((part) => {
      const [tag, ...params] = part.trim().split(';');
      const qParam = params.find((p) => p.trim().startsWith('q='));
      const q = qParam ? parseFloat(qParam.split('=')[1]) : 1;
      return { tag: tag.trim().toLowerCase(), q: Number.isFinite(q) ? q : 0 };
    })
    .filter((entry) => entry.tag && entry.q > 0)
    .sort((a, b) => b.q - a.q);

  for (const { tag } of ranked) {
    const primary = tag.split('-')[0];
    if (SUPPORTED_LANGS.includes(primary)) return primary;
  }
  return null;
}

app.get('/', (req, res, next) => {
  const lang = negotiateLanguage(req);
  if (!lang) return next();
  const query = req.originalUrl.slice(req.path.length);
  res.setHeader('Vary', 'Accept-Language, Cookie');
  res.redirect(302, `/${lang}/${query}`);
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  try {
    const server = await registerRoutes(app);

    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";
      console.error(`[Express Error] ${status}: ${message}`);
      if (!res.headersSent) {
        res.status(status).json({ message });
      }
    });

    // importantly only setup vite in development and after
    // setting up all the other routes so the catch-all route
    // doesn't interfere with the other routes
    if (app.get("env") === "development") {
      await setupVite(app, server);
    } else {
      serveStatic(app);
    }

    // Default port 5000 (Replit's unfirewalled port); PORT env overrides for local dev.
    // This serves both the API and the client.
    const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 5000;
    server.listen({
      port,
      host: "0.0.0.0",
    }, () => {
      log(`serving on port ${port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
})();
