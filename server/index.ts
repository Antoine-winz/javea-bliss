import express, { type Request, Response, NextFunction } from "express";
import path from "path";
import fs from "fs";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

const app = express();

// Health check endpoint - MUST be before any middleware that could redirect or block
app.get("/healthz", (_req, res) => {
  res.status(200).json({ status: "ok" });
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
    "connect-src 'self' wss: ws: https://api.emailjs.com https://www.google-analytics.com https://*.google-analytics.com https://api.open-meteo.com; " +
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
