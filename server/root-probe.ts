import type { Request, Response, NextFunction } from "express";
import { RENTALS_ENABLED } from "../shared/site-access";

// Known search and AI crawlers. They send no `Accept: text/html`, so without
// this they would get the deployment probe's "OK" instead of the sale page.
// Every agent allowed in client/public/robots.txt belongs here; the test in
// shared/discovery.test.ts fails if the two lists drift apart.
export const SEARCH_AND_AI_CRAWLER = new RegExp([
  // Search engines
  'Googlebot', 'bingbot', 'DuckDuckBot', 'YandexBot', 'Applebot',
  // AI assistants
  'GPTBot', 'OAI-SearchBot', 'ChatGPT-User',
  'ClaudeBot', 'Claude-SearchBot', 'Claude-User',
  'PerplexityBot', 'Perplexity-User', 'MistralAI-User',
  'meta-externalagent', 'Amazonbot', 'Bytespider', 'cohere-ai',
  'DuckAssistBot', 'YouBot', 'CCBot',
].join('|'), 'i');

/**
 * Answers the bare root `/`.
 *
 * Deployment healthchecks probe `/` before the app is wired up and fail on a
 * redirect, so they get a plain 200 "OK". Everything else falls through to the
 * language negotiation and the sale page:
 *
 * - browsers ask for `text/html`, so they never see the probe answer;
 * - crawlers send no `Accept` header, so they used to get "OK" — a blank page
 *   on the site's main URL. They now get a permanent redirect to the x-default
 *   sale page;
 * - `www` requests fall through to the canonical-host redirect, so the site is
 *   not served under a second hostname.
 */
export function rootProbe(req: Request, res: Response, next: NextFunction) {
  const host = (req.headers["host"] || "").toLowerCase();
  const accept = req.headers["accept"] || "";
  if (
    process.env.NODE_ENV === "production" &&
    !host.startsWith("www.") &&
    !accept.includes("text/html")
  ) {
    const userAgent = req.headers["user-agent"] || "";
    if (!RENTALS_ENABLED && SEARCH_AND_AI_CRAWLER.test(userAgent)) {
      res.redirect(301, "/en/for-sale");
      return;
    }
    res.status(200).send("OK");
    return;
  }
  next();
}
