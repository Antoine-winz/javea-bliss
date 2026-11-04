# Rental access — paused, not removed

The owner now wants to sell Jávea Bliss as a second home, without urgency.

`RENTALS_ENABLED` in `shared/site-access.ts` is currently `false`. The same setting
controls the frontend, Express server and standalone Vite preview. The middleware
runs before static files and rental handlers. Previous homepages, rental guides,
promotions and flyers redirect temporarily to the sale presentation in the same
language. Rental APIs reject reads and writes with `503 RENTALS_DISABLED`, including
booking submissions from old pages. Rental controls are hidden in administration.

No rental components, translations, calculation rules or database records were
removed. The original rental sitemap and assistant summary are retained under
`server/rental-content/`, outside the public directory. Sales-only discovery files
are served while rental access is disabled. Existing sale authentication, brochures,
prospects, visitor tracking and reviews remain in place.

## Reactivation

Only after the owner's explicit request, set `RENTALS_ENABLED` to `true`, rebuild
and verify the rental paths and APIs. The original rental router, content and
discovery files will be used again. Review rates, availability and booking conditions
before publishing. Update the production monitoring check to expect an available
calendar instead of `RENTALS_DISABLED`.

## Working and publishing

Make and verify changes locally. Do not replace the local version with Replit's
changes. Update GitHub only after the owner's explicit approval. Replit is reserved
for the later publication step; do not ask its agent to implement changes.
