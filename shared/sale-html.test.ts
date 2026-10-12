import test from 'node:test';
import assert from 'node:assert/strict';
import { getRouteSEO, injectSEOIntoHTML } from './seo';
import { saleContent, type SaleLanguage } from './sale-content';
import { salesFAQ } from './sales-faq';
test('all sale languages include visible inventory and complete FAQ before JavaScript', () => {
 const template = '<html lang="en"><head></head><body><div id="root"></div></body></html>';
 for (const lang of Object.keys(saleContent) as SaleLanguage[]) {
  const html = injectSEOIntoHTML(template, getRouteSEO(`/${lang}/for-sale`)!);
  assert.match(html, /data-sale-initial="true"/);
  assert.match(html, /<h1/);
  assert.equal((html.match(/<article /g) || []).length, salesFAQ[lang].items.length);
  assert.ok(html.includes(saleContent[lang].inventory));
  assert.ok(html.includes(`href="/${lang}/"`));
  assert.ok(!html.includes('<div id="root"></div>'));
 }
 assert.ok(!injectSEOIntoHTML(template, getRouteSEO('/admin')!).includes('data-sale-initial'));
});
