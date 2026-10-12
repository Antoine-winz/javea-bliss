import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { getRouteSEO, injectSEOIntoHTML } from "./shared/seo";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";

export default defineConfig({
  plugins: [
    react(),
    {
      name: "local-preview-calendar",
      apply: "serve",
      configureServer(server) {
        if (process.env.JAVEA_PREVIEW_LIVE_DATA !== "1") return;
        // The standalone preview reads public data only; never forward cookies or writes.
        const publicPaths = new Set(["/api/calendar/blocked-dates", "/api/pricing", "/api/promotional-offers"]);
        server.middlewares.use(async (req, res, next) => {
          const url = new URL(req.url || "/", "http://localhost");
          if (!publicPaths.has(url.pathname)) return next();
          if (req.method !== "GET") {
            res.statusCode = 405;
            res.end("Read-only preview");
            return;
          }
          try {
            const response = await fetch(`https://javeabliss.com${url.pathname}${url.search}`, {
              signal: AbortSignal.timeout(10000),
              headers: { Accept: "application/json" },
            });
            res.statusCode = response.status;
            res.setHeader("Content-Type", response.headers.get("content-type") || "application/json");
            res.setHeader("Cache-Control", "no-store");
            res.end(await response.text());
          } catch {
            res.statusCode = 503;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ message: "Live calendar unavailable in preview" }));
          }
        });
      },
    },
    {
      name: "route-seo-preview",
      apply: "serve",
      transformIndexHtml(html, context) {
        const seo = getRouteSEO(context.originalUrl || context.path);
        return seo ? injectSEOIntoHTML(html, seo) : html;
      },
    },
    runtimeErrorOverlay(),
    ...(process.env.NODE_ENV !== "production" &&
    process.env.REPL_ID !== undefined
      ? [
          await import("@replit/vite-plugin-cartographer").then((m) =>
            m.cartographer(),
          ),
        ]
      : []),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
  },
});
