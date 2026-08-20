import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { createServer as createViteServer, createLogger } from "vite";
import { type Server } from "http";
import viteConfig from "../vite.config";
import { nanoid } from "nanoid";
import { getRouteSEO, injectSEOIntoHTML, isKnownPublicRoute } from "./seo-injection";

const viteLogger = createLogger();

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

export async function setupVite(app: Express, server: Server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true,
  };

  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      },
    },
    server: serverOptions,
    appType: "custom",
  });

  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      const clientTemplate = path.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html",
      );

      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`,
      );
      let page = await vite.transformIndexHtml(url, template);

      // Inject route-specific SEO meta tags for crawlers
      const urlPath = url.split("?")[0];
      const seo = getRouteSEO(urlPath);
      if (seo) {
        page = injectSEOIntoHTML(page, seo);
      }

      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

export function serveStatic(app: Express) {
  const distPath = path.resolve(import.meta.dirname, "public");

  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  app.use(express.static(distPath));

  // Catch-all: serve SPA shell for all routes, injecting SEO where known
  app.use("*", (req, res) => {
    const indexPath = path.resolve(distPath, "index.html");
    // Inside a middleware mounted at "*", Express rewrites req.path to "/", so it
    // can never identify the route. originalUrl keeps the real path — without this
    // no SEO was ever injected in production and every route returned 200.
    const urlPath = req.originalUrl.split("?")[0];

    try {
      let html = fs.readFileSync(indexPath, "utf-8");

      // Inject SEO for known routes (returns null for unknown routes)
      const seo = getRouteSEO(urlPath);
      if (seo) {
        html = injectSEOIntoHTML(html, seo);
      }

      // Return 404 status for unknown routes but still serve the SPA
      // so the client-side NotFound component renders
      if (!isKnownPublicRoute(urlPath)) {
        res.status(404).set({ "Content-Type": "text/html" }).send(html);
        return;
      }

      res.status(200).set({ "Content-Type": "text/html" }).send(html);
    } catch (e) {
      // If index.html can't be read, return a minimal error response
      // rather than crashing with an unhandled exception
      log(`Error serving ${urlPath}: ${(e as Error).message}`, "express");
      res.status(503).send("Service temporarily unavailable");
    }
  });
}
