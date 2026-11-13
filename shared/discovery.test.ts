import assert from 'node:assert/strict';
import test from 'node:test';
import { existsSync, readFileSync } from 'node:fs';
import { RENTALS_ENABLED } from './site-access';
import { saleHreflang, getRouteSEO } from './seo';
import { SEARCH_AND_AI_CRAWLER } from '../server/root-probe';

const BASE = 'https://javeabliss.com';
const LANGUAGES = ['en', 'nl', 'fr', 'it', 'de', 'es'];
const publicFile = (name: string) => readFileSync(new URL(`../client/public/${name}`, import.meta.url), 'utf8');

test('the sitemap lists exactly the indexable sale pages, with reciprocal alternates and real images', () => {
  if (RENTALS_ENABLED) return;
  const sitemap = publicFile('sitemap.xml');

  // Well-formed enough to parse: every opened tag is closed in order.
  const stack: string[] = [];
  for (const match of sitemap.matchAll(/<(\/?)([a-z][a-z0-9:]*)\b([^>]*?)(\/?)>/gi)) {
    const [, closing, name, attributes, selfClosing] = match;
    if (selfClosing === '/' || attributes.endsWith('/')) continue;
    if (closing) assert.equal(stack.pop(), name, `mismatched </${name}>`);
    else stack.push(name);
  }
  assert.deepEqual(stack, [], 'every sitemap tag must be closed');

  const locations = [...sitemap.matchAll(/<loc>([^<]*)<\/loc>/g)].map(match => match[1]);
  assert.deepEqual(locations, LANGUAGES.map(lang => `${BASE}/${lang}/for-sale`));

  for (const block of sitemap.matchAll(/<url>([\s\S]*?)<\/url>/g)) {
    const entry = block[1];
    // W3C date, which is what Google accepts.
    assert.match(entry, /<lastmod>\d{4}-\d{2}-\d{2}<\/lastmod>/);
    // Every page points at every language and at x-default, both ways.
    for (const language of [...LANGUAGES, 'x-default']) {
      const expected = `${BASE}/${language === 'x-default' ? 'en' : language}/for-sale`;
      assert.ok(
        entry.includes(`hreflang="${language}" href="${expected}"`),
        `missing hreflang ${language} -> ${expected}`,
      );
    }
    // Images must exist, or Google reports the sitemap as broken. Bundled
    // gallery photos carry a build hash, so only stable files belong here.
    for (const image of entry.matchAll(/<image:loc>([^<]*)<\/image:loc>/g)) {
      const path = image[1].replace(BASE, '').split('?')[0];
      assert.ok(image[1].startsWith(`${BASE}/`), `image must be absolute: ${image[1]}`);
      assert.ok(
        existsSync(new URL(`../client/public${path}`, import.meta.url)),
        `sitemap image missing from client/public: ${path}`,
      );
      assert.doesNotMatch(path, /\/assets\//, `hashed build asset must not be in the sitemap: ${path}`);
    }
  }

  // The sitemap and the pages' own hreflang tags must agree.
  for (const language of LANGUAGES) {
    const canonical = getRouteSEO(`/${language}/for-sale`)!.canonical;
    assert.ok(sitemap.includes(`<loc>${canonical}</loc>`), `${canonical} missing from the sitemap`);
  }
  assert.ok(saleHreflang.some(link => link.lang === 'x-default'));
});

test('robots.txt opens the sale pages to every search engine and AI assistant', () => {
  if (RENTALS_ENABLED) return;
  const robots = publicFile('robots.txt');

  assert.ok(robots.includes(`Sitemap: ${BASE}/sitemap.xml`));
  assert.match(robots, /^Allow: \/$/m);
  // A blanket Disallow would hide the sale pages from everyone.
  assert.doesNotMatch(robots, /^Disallow:\s*\/\s*$/m);
  for (const path of ['/admin', '/api/']) {
    assert.ok(robots.includes(`Disallow: ${path}`), `${path} must stay private`);
  }

  // Every crawler the server redirects at the root must also be named here,
  // so the two lists cannot drift apart.
  const named = [...robots.matchAll(/^User-agent:\s*(\S+)$/gm)].map(match => match[1]);
  assert.ok(named.includes('*'));
  for (const bot of ['Googlebot', 'bingbot', 'GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'ClaudeBot', 'Claude-SearchBot', 'Claude-User', 'Google-Extended', 'PerplexityBot']) {
    assert.ok(named.includes(bot), `robots.txt does not name ${bot}`);
  }
  for (const bot of named) {
    if (bot === '*' || bot.endsWith('-Extended') || bot === 'anthropic-ai') continue;
    assert.match(bot, SEARCH_AND_AI_CRAWLER, `${bot} is allowed but the root would answer it "OK"`);
  }
});

test('the public sale pages never link back to the old rental homepages', () => {
  if (RENTALS_ENABLED) return;
  // Every internal link to / or /<lang>/ costs a crawler a redirect and keeps
  // the old rental URLs alive in Google's link graph.
  for (const page of ['pages/SalesAccess.tsx', 'pages/SalesPrivacy.tsx', 'pages/not-found.tsx']) {
    const source = readFileSync(new URL(`../client/src/${page}`, import.meta.url), 'utf8');
    assert.doesNotMatch(source, /href=["{]["'`]?\/["'`]?[}"]/, `${page} links to the bare root`);
    assert.doesNotMatch(source, /href=\{[^}]*`\/\$\{lang\}\/`/, `${page} links to /<lang>/`);
  }
});

test('llms.txt describes the sale, never a rental, and links every language', () => {
  if (RENTALS_ENABLED) return;
  const summary = publicFile('llms.txt');

  for (const language of LANGUAGES) {
    assert.ok(summary.includes(`${BASE}/${language}/for-sale`), `llms.txt omits ${language}`);
  }
  assert.ok(summary.includes(`${BASE}/sitemap.xml`), 'llms.txt should point at the sitemap');
  assert.ok(summary.startsWith('# '), 'llms.txt starts with a single H1');
  // Rental wording and nightly prices must never come back here.
  assert.doesNotMatch(summary, /€\s?\d+|\bper night\b|winter let|holiday let|vacation rental|Overwinteren/i);
  assert.match(summary, /for sale/i);
  // The facts the assistants quote must match the structured data.
  assert.ok(summary.includes('80 m²'));
  assert.ok(summary.includes('2 double bedrooms'));
});
