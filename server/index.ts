import { siteAccess } from "./site-access";
import { rootProbe } from "./root-probe";
import { languageRedirect } from "./language-redirect";
import express, { type Request, Response, NextFunction } from "express";
import path from "path";
import { sameOriginWrites } from "./security";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

import { createIpBlocker } from "./ip-blocking";
import { storage } from "./storage";

import { initializeVisitorTracking } from './visitor-tracking';

const app = express();
app.disable("x-powered-by");
app.set("trust proxy", 1);

// Health check endpoint - MUST be before any middleware that could redirect or block
// Replit probes both / and /healthz during startup
app.get("/healthz", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

// Root health probe, crawler redirect and www fallthrough — see root-probe.ts.
// Registered ahead of the language redirect below, which must never intercept
// a deployment probe: a 302 here fails the deploy.
app.get("/", rootProbe);

app.use(createIpBlocker(() => storage.listBlockedIps()));

// Serve static files from client/public (flyer.html, robots.txt, etc.)
const publicPath = path.resolve(process.cwd(), "client", "public");


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
    "script-src 'self' 'unsafe-inline' " + (process.env.NODE_ENV === "production" ? "" : "'unsafe-eval' ") + "https://replit.com https://cdn.emailjs.com https://www.googletagmanager.com; " +
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

app.get('/', languageRedirect);

app.use(siteAccess);
app.use(express.static(publicPath, { index: false }));
app.use(express.json({ limit: "32kb" }));
app.use(express.urlencoded({ extended: false, limit: "32kb" }));

app.use("/api", sameOriginWrites);

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;

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
    await initializeVisitorTracking();
    const server = await registerRoutes(app);
    app.use('/api', (_req, res) => res.status(404).json({ code: 'NOT_FOUND', message: 'API endpoint not found.' }));

    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = status >= 500 ? "Internal Server Error" : err.message || "Invalid request";
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
