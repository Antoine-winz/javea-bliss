import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
const base = process.env.SEO_AUDIT_BASE_URL || 'http://127.0.0.1:5173';
const canonicalBase = 'https://javeabliss.com';
const languages = ['en', 'fr', 'es', 'de', 'nl', 'it'];
const attribute = (tag, name) => tag.match(new RegExp(`\\b${name}="([^"]*)"`))?.[1];
const decode = value => value?.replaceAll('&amp;', '&').replaceAll('&quot;', '"').replaceAll('&lt;', '<').replaceAll('&gt;', '>');
const tags = (html, name) => [...html.matchAll(new RegExp(`<${name}\\b[^>]*>`, 'gi'))].map(match => match[0]);
const meta = (html, name) => decode(attribute(tags(html, 'meta').find(tag => attribute(tag, 'name') === name || attribute(tag, 'property') === name) || '', 'content'));
const report = { base, generatedAt: new Date().toISOString(), pages: [], redirects: [], checks: [] };
for (const language of languages) {
  const path = `/${language}/for-sale`;
  const response = await fetch(base + path, { headers: { Accept: 'text/html' } });
  assert.equal(response.status, 200, path); const html = await response.text();
  const title = decode(html.match(/<title>([^<]*)<\/title>/)?.[1]); const description = meta(html, 'description');
  const keywords = meta(html, 'keywords'); assert.ok(keywords && keywords.split(',').length >= 6, `${language}: localized sale keywords missing`);
  const links = tags(html, 'link'); const canonical = links.filter(tag => attribute(tag, 'rel') === 'canonical');
  assert.equal(canonical.length, 1); assert.equal(attribute(canonical[0], 'href'), canonicalBase + path);
  assert.equal(html.match(/<html\b[^>]*lang="([^"]+)"/)?.[1], language);
  assert.ok(title && description); assert.ok(!meta(html, 'robots').includes('noindex'));
  assert.equal(meta(html, 'og:title'), title); assert.equal(meta(html, 'og:description'), description); assert.equal(meta(html, 'og:url'), canonicalBase + path);
  assert.equal(meta(html, 'twitter:title'), title); assert.equal(meta(html, 'twitter:description'), description);
  assert.equal((html.match(/<h1\b/g) || []).length, 1);
  const alternates = links.filter(tag => attribute(tag, 'hreflang'));
  for (const lang of languages) assert.ok(alternates.some(tag => attribute(tag, 'hreflang') === lang && attribute(tag, 'href') === `${canonicalBase}/${lang}/for-sale`));
  assert.ok(alternates.some(tag => attribute(tag, 'hreflang') === 'x-default'));
  const graph = JSON.parse(html.match(/<script[^>]*data-schema="main"[^>]*>([\s\S]*?)<\/script>/)[1])['@graph'];
  const apartment = graph.find(item => item['@type'] === 'Apartment'); const listing = graph.find(item => item['@type'] === 'RealEstateListing');
  assert.equal(apartment.floorSize.value, 80); assert.equal(apartment.numberOfBedrooms, 2); assert.equal(listing.inLanguage, language); assert.ok(listing.offers.businessFunction.endsWith('#Sell'));
  assert.doesNotMatch(html, /Book direct|Réserver votre séjour|€130\/night|€100\/night|€210\/night|LodgingBusiness/i);
  const privacy = await (await fetch(`${base}/${language}/privacy-policy`)).text(); assert.ok(meta(privacy, 'robots').includes('noindex')); assert.ok(!tags(privacy, 'link').some(tag => attribute(tag, 'hreflang'))); assert.equal(meta(privacy, 'keywords'), undefined);
  report.pages.push({ language, title, titleLength: title.length, description, descriptionLength: description.length, keywords, canonical: attribute(canonical[0], 'href'), alternates: alternates.length, structuredData: 'Apartment + RealEstateListing', privacyNoindex: true });
  for (const old of [`/${language}/`, `/${language}/recommendations`, `/${language}/promo/1`, `/${language}/social-media/1`, `/${language}/for-sale/`]) {
    const redirected = await fetch(base + old, { redirect: 'manual' }); assert.equal(redirected.status, 302, old); assert.equal(redirected.headers.get('location'), path);
    report.redirects.push({ from: old, status: redirected.status, to: path });
  }
}
for (const old of ['/flyer.html', '/flyer2.html', '/qr-download.html', '/en/winter-rental-javea/', '/en/javea-3-day-itinerary/', '/for-sale']) {
  const response = await fetch(base + old, { redirect: 'manual' }); assert.equal(response.status, 302, old); report.redirects.push({ from: old, status: response.status, to: response.headers.get('location') });
}
const sitemap = await (await fetch(base + '/sitemap.xml')).text(); const locations = [...sitemap.matchAll(/<loc>([^<]*)<\/loc>/g)].map(match => match[1]);
assert.equal(locations.length, 6); for (const language of languages) assert.ok(locations.includes(`${canonicalBase}/${language}/for-sale`));
const robots = await (await fetch(base + '/robots.txt')).text(); assert.ok(robots.includes(`Sitemap: ${canonicalBase}/sitemap.xml`)); assert.doesNotMatch(robots, /Disallow:\s*\/$/m);
const summary = await (await fetch(base + '/llms.txt')).text(); assert.doesNotMatch(summary, /€130|€210|Winter Lets|Renovation Stays/);
const ogImage = await fetch(base + '/og-hero.jpg'); assert.equal(ogImage.status, 200); assert.ok(ogImage.headers.get('content-type').startsWith('image/'));
const plan = await fetch(base + '/javeabliss-floor-plan-HD.png', { method: 'HEAD' }); assert.equal(plan.status, 200);
report.assets = { floorPlanBytes: Number(plan.headers.get('content-length')), sharingImageBytes: Number(ogImage.headers.get('content-length')) };
report.checks = ['Six indexable sale pages', 'Localized sale keywords', 'Reciprocal hreflang and x-default', 'One H1 per page', 'Matching Open Graph and Twitter metadata', 'Sale-only structured data', 'Six-URL sale sitemap', 'Crawl rules and assistant summary', 'Rental routes redirected', 'Privacy excluded from indexing', 'Sharing image available'];
await mkdir('output', { recursive: true }); await writeFile('output/seo-audit.json', JSON.stringify(report, null, 2));
console.log(JSON.stringify({ pages: report.pages.map(({ language, titleLength, descriptionLength, alternates }) => ({ language, titleLength, descriptionLength, alternates })), redirects: report.redirects.length, assets: report.assets, checks: report.checks }, null, 2));
