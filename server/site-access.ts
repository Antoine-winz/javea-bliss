import type { IncomingMessage, ServerResponse } from 'node:http';
import { RENTALS_ENABLED, isRentalAPI, salesRedirect } from '../shared/site-access';

const SUPPORTED_LANGUAGES = ['en', 'nl', 'fr', 'it', 'de', 'es'];

// Runs before static files and API handlers, also in the local Vite preview.
export function siteAccess(req: IncomingMessage, res: ServerResponse, next: () => void) {
  const url = new URL(req.url || '/', 'http://localhost');
  if (RENTALS_ENABLED) return next();
  if (isRentalAPI(url.pathname)) {
    res.statusCode = 503;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Cache-Control', 'no-store');
    res.end(JSON.stringify({ code: 'RENTALS_DISABLED', message: 'This apartment is offered for sale. Rental enquiries are closed.' }));
    return;
  }
  // The rental pages are gone for good, so these are permanent: a 302 kept the
  // old rental URLs in the search index and the sale pages out of it.
  let destination = salesRedirect(url.pathname);
  let permanent = destination !== null;
  let search = url.search;

  if (url.pathname === '/') {
    const cookieLanguage = /(?:^|;\s*)preferredLanguage=(en|nl|fr|it|de|es)(?:;|$)/.exec(req.headers.cookie || '')?.[1];
    // ?lang=xx is the old site's language link, still linked from outside.
    const queryLanguage = SUPPORTED_LANGUAGES.includes(url.searchParams.get('lang') || '') ? url.searchParams.get('lang')! : undefined;
    const accepted = (req.headers['accept-language'] || '').split(',').map(part => {
      const [tag, ...params] = part.trim().toLowerCase().split(';');
      const quality = params.find(param => param.trim().startsWith('q='));
      return { language: tag.split('-')[0], quality: quality ? Number(quality.trim().slice(2)) : 1 };
    }).filter(item => SUPPORTED_LANGUAGES.includes(item.language) && item.quality > 0).sort((a, b) => b.quality - a.quality);
    destination = `/${cookieLanguage || queryLanguage || accepted[0]?.language || 'en'}/for-sale`;
    // The answer depends on the visitor's cookie and Accept-Language, so the
    // root redirect itself stays temporary and uncached, and says so.
    res.setHeader('Vary', 'Accept-Language, Cookie');
    permanent = false;
    url.searchParams.delete('lang');
    search = url.searchParams.toString() ? `?${url.searchParams}` : '';
  }
  if (destination) {
    res.statusCode = permanent ? 301 : 302;
    res.setHeader('Location', destination + search);
    // Capped so the redirect can still be changed without stale browser caches.
    res.setHeader('Cache-Control', permanent ? 'public, max-age=3600' : 'no-store');
    res.end();
    return;
  }
  next();
}
