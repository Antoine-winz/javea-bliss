import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { getRouteSEO, injectSEOIntoHTML, isKnownPublicRoute } from './seo';
test('all six languages deliver consistent metadata and inline structured data before JavaScript', () => {
  const template = readFileSync(new URL('../client/index.html', import.meta.url), 'utf8');
  for (const lang of ['en', 'nl', 'fr', 'it', 'de', 'es']) {
    for (const path of [`/${lang}/`, `/${lang}/recommendations`]) {
      const seo = getRouteSEO(path)!;
      const html = injectSEOIntoHTML(template, seo);
      assert.ok(html.includes(`<html lang="${lang}"`));
      assert.ok(html.includes(`href="${seo.canonical}"`));
      assert.equal((html.match(/rel="canonical"/g) || []).length, 1);
      assert.equal((html.match(/application\/ld\+json/g) || []).length, 1);
      const schema = JSON.parse(html.match(/data-schema="main">([\s\S]*?)<\/script>/)![1]);
      const page = schema['@graph'].find((item: any) => item['@type'] === 'WebPage');
      assert.equal(page.inLanguage, lang);
      assert.equal(page.name, seo.title);
      assert.equal(page.description, seo.description);
      assert.equal(page.url, seo.canonical);
      assert.equal(schema['@graph'][0].address.streetAddress, undefined);
      if (path.endsWith('/recommendations')) {
        assert.ok(seo.description.includes('La Fontana'));
        assert.ok(seo.description.includes('Ammos'));
        assert.equal(schema['@graph'].find((item: any) => item['@type'] === 'ItemList').itemListElement.length, 7);
      }
      // Repeated injection must not duplicate scripts during Vite development.
      assert.equal((injectSEOIntoHTML(html, seo).match(/application\/ld\+json/g) || []).length, 1);
    }
  }
});
test('privacy and administration pages retain private metadata', () => {
  for (const path of ['/fr/privacy-policy', '/admin']) {
    assert.equal(isKnownPublicRoute(path), true);
    assert.equal(getRouteSEO(path)?.noindex, true);
  }
  assert.equal(isKnownPublicRoute('/api/unknown'), false);
});
test('guide canonicals and alternates point to the guide, not the homepage', () => {
  const seo = getRouteSEO('/fr/recommendations')!;
  assert.equal(seo.canonical, 'https://javeabliss.com/fr/recommendations');
  assert.equal(seo.hreflang.find(link => link.lang === 'en')?.href, 'https://javeabliss.com/en/recommendations');
  assert.equal(seo.title.includes('2025'), false);
});
test('private server HTML does not inherit public indexing or language alternates', () => {
  const html = '<html lang="en"><title>Old</title><meta name="robots" content="index, follow"><link rel="alternate" hreflang="en" href="/en/"></html>';
  const result = injectSEOIntoHTML(html, getRouteSEO('/fr/privacy-policy')!);
  assert.ok(result.includes('noindex, nofollow'));
  assert.ok(result.includes('lang="fr"'));
  assert.ok(!result.includes('hreflang'));
});

test('sale pages are indexable in every language with regional alternates and sale facts', () => {
  const template = readFileSync(new URL('../client/index.html', import.meta.url), 'utf8');
  const sitemap = readFileSync(new URL('../client/public/sitemap.xml', import.meta.url), 'utf8');
  for (const lang of ['en', 'nl', 'fr', 'it', 'de', 'es']) {
    const seo = getRouteSEO(`/${lang}/for-sale`)!;
    const html = injectSEOIntoHTML(template, seo);
    assert.equal(seo.noindex, false);
    assert.ok(!html.includes('noindex'));
    assert.ok(sitemap.includes(seo.canonical));
    for (const region of ['en-GB', 'de-DE', 'nl-NL', 'fr-FR', 'it-IT', 'de-CH', 'fr-CH', 'it-CH']) {
      assert.ok(seo.hreflang.some(link => link.lang === region));
    }
    const graph = JSON.parse(html.match(/data-schema="main">([\s\S]*?)<\/script>/)![1])['@graph'];
    const listing = graph.find((item: any) => item['@type'] === 'RealEstateListing');
    assert.equal(listing.offers.price, 367900);
    assert.equal(graph[0].numberOfBedrooms, 2);
    assert.equal(graph[0].floorSize.value, 80);
  }
  assert.equal(getRouteSEO('/for-sale')?.canonical, 'https://javeabliss.com/en/for-sale');
});
