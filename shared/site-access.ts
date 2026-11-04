// Re-enable rentals here only after the owner explicitly asks for them.
// Rental pages, forms and stored data are retained in the project.
export const RENTALS_ENABLED: boolean = false;

const guideSlugs = new Set([
  'holiday-apartment-javea-arenal-beach', '2-bedroom-apartment-javea',
  'where-to-stay-in-javea', 'javea-arenal-beach-guide', 'winter-rental-javea',
  'javea-without-car', 'restaurants-near-arenal-beach-javea',
  'best-beaches-near-javea-apartment', 'javea-3-day-itinerary',
]);

function normalizedPath(path: string): string {
  try { return decodeURIComponent(path.split(/[?#]/)[0]).replace(/\/{2,}/g, '/').toLowerCase(); }
  catch { return path.split(/[?#]/)[0].toLowerCase(); }
}

export function salesRedirect(path: string): string | null {
  const clean = normalizedPath(path);
  const match = clean.match(/^\/(en|nl|fr|it|de|es)(?:\/|$)/);
  const language = match?.[1] || 'en';
  const page = clean.replace(/^\/(en|nl|fr|it|de|es)(?=\/|$)/, '').replace(/\/$/, '') || '/';
  if (/^\/(for-sale|privacy-policy)$/.test(page)) {
    const canonical = `/${language}${page}`;
    return path.split(/[?#]/)[0] === canonical ? null : canonical;
  }
  const rentalPage = page === '/' || /^\/(recommendations|promo|promotional-offer|social-media)(?:\/|$)/.test(page)
    || guideSlugs.has(page.slice(1))
    || /^\/(?:flyer[^/]*\.html|qr-(?:download|code)\.html)$/.test(page);
  return rentalPage ? `/${language}/for-sale` : null;
}

export function isRentalAPI(path: string): boolean {
  return /^\/api\/(?:booking-inquiry|calendar|pricing|daily-rates|promotional-offers|last-minute-offers)(?:[/?#]|$)/.test(normalizedPath(path));
}
