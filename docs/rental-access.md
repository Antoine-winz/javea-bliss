# Rental access — closed, app code retained

The owner sells Jávea Bliss as a second home, without urgency. Since 13.11.2026
the rental period is over, not merely paused: the search-engine side of the site
is sale-only.

`RENTALS_ENABLED` in `shared/site-access.ts` is `false`. The same setting controls
the frontend, the Express server and the standalone Vite preview. The middleware
runs before static files and rental handlers. Previous homepages, rental guides,
promotions and flyers redirect **permanently (301)** to the sale presentation in
the same language. Rental APIs reject reads and writes with `503 RENTALS_DISABLED`,
including booking submissions from old pages. Rental controls are hidden in
administration.

Rental components, translations, calculation rules and database records were kept.
What was removed, on 13.11.2026, is the rental **search-engine** material:

- rental titles, descriptions and the nine English guide pages in `shared/seo.ts`;
- the `LodgingBusiness` structured data, which told Google the apartment is a
  holiday rental;
- `server/rental-content/` (the old rental sitemap and assistant summary).

All of it stays in the git history, before the commit that removed it.

## Why the redirects are permanent

Until 13.11.2026 the old rental URLs answered `302`. Google read that as
"temporary", kept the rental pages in its index and left the sale pages out: of
the eleven indexed pages, ten were rental URLs and only `/en/for-sale` was a sale
page. A `301` tells Google the move is final, so it drops the old URL and passes
its standing to the sale page.

The bare root `/` is the exception and stays `302`: its answer depends on the
visitor's cookie and `Accept-Language`, so it must not be cached. Known search and
AI crawlers asking for `/` get a `301` to `/en/for-sale`, the x-default page.

## Reactivation

Only after the owner's explicit request, set `RENTALS_ENABLED` to `true`, rebuild
and verify the rental paths and APIs. The rental router, content and components
will be used again, but **their SEO metadata has to be written again** — it is no
longer in the code. Browsers may also hold the `301` for up to an hour
(`Cache-Control: public, max-age=3600`), and search engines longer. Review rates,
availability and booking conditions before publishing. Update the production
monitoring check to expect an available calendar instead of `RENTALS_DISABLED`.

## Working and publishing

Make and verify changes locally. Do not replace the local version with Replit's
changes. Update GitHub only after the owner's explicit approval. Replit is reserved
for the later publication step; do not ask its agent to implement changes.
