import type { Request, Response, NextFunction } from "express";
import { RENTALS_ENABLED } from "../shared/site-access";

// Language negotiation for the bare root. A visitor's explicit choice (cookie,
// set by the language switcher) wins over the OS/browser preference
// (Accept-Language). No match at all → fall through and serve the x-default
// English page, which is also what header-less crawlers get.
const SUPPORTED_LANGS = ['en', 'nl', 'fr', 'it', 'de', 'es'];

export function negotiateLanguage(req: Request): string | null {
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

/**
 * Sends the bare root to the visitor's language homepage.
 *
 * While the apartment is for sale this does nothing: `siteAccess` owns the
 * root, runs the same negotiation and goes straight to `/<lang>/for-sale`.
 * Letting this handler answer instead would redirect to `/<lang>/`, an old
 * rental URL that only then redirects on — and it handed crawlers a 302 to
 * that old URL, which is what kept the rental pages in the search index.
 *
 * It must stay registered before `siteAccess`, so re-enabling rentals
 * restores the old behaviour without moving anything around.
 */
export function languageRedirect(req: Request, res: Response, next: NextFunction) {
  if (!RENTALS_ENABLED) return next();
  const lang = negotiateLanguage(req);
  if (!lang) return next();
  const query = req.originalUrl.slice(req.path.length);
  res.setHeader('Vary', 'Accept-Language, Cookie');
  res.redirect(302, `/${lang}/${query}`);
}
