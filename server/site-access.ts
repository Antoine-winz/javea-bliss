import type { IncomingMessage, ServerResponse } from 'node:http';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { RENTALS_ENABLED, isRentalAPI, salesRedirect } from '../shared/site-access';

// Runs before static files and API handlers, also in the local Vite preview.
export function siteAccess(req: IncomingMessage, res: ServerResponse, next: () => void) {
  const url = new URL(req.url || '/', 'http://localhost');
  if (RENTALS_ENABLED) {
    if ((req.method === 'GET' || req.method === 'HEAD') && ['/sitemap.xml', '/llms.txt'].includes(url.pathname)) {
      res.setHeader('Content-Type', url.pathname.endsWith('.xml') ? 'application/xml; charset=utf-8' : 'text/plain; charset=utf-8');
      res.end(req.method === 'HEAD' ? undefined : readFileSync(path.resolve(process.cwd(), 'server/rental-content', url.pathname.slice(1))));
      return;
    }
    return next();
  }
  if (isRentalAPI(url.pathname)) {
    res.statusCode = 503;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Cache-Control', 'no-store');
    res.end(JSON.stringify({ code: 'RENTALS_DISABLED', message: 'This apartment is offered for sale. Rental enquiries are closed.' }));
    return;
  }
  let destination = salesRedirect(url.pathname);
  if (url.pathname === '/') {
    const supported = ['en', 'nl', 'fr', 'it', 'de', 'es'];
    const cookieLanguage = /(?:^|;\s*)preferredLanguage=(en|nl|fr|it|de|es)(?:;|$)/.exec(req.headers.cookie || '')?.[1];
    const accepted = (req.headers['accept-language'] || '').split(',').map(part => {
      const [tag, ...params] = part.trim().toLowerCase().split(';');
      const quality = params.find(param => param.trim().startsWith('q='));
      return { language: tag.split('-')[0], quality: quality ? Number(quality.trim().slice(2)) : 1 };
    }).filter(item => supported.includes(item.language) && item.quality > 0).sort((a, b) => b.quality - a.quality);
    destination = `/${cookieLanguage || accepted[0]?.language || 'en'}/for-sale`;
  }
  if (destination) {
    res.statusCode = 302;
    res.setHeader('Location', destination + url.search);
    res.setHeader('Cache-Control', 'no-store');
    res.end();
    return;
  }
  next();
}
