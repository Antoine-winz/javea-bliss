import test from 'node:test';
import assert from 'node:assert/strict';
import { salesFAQ } from './sales-faq';
import { saleContent } from './sale-content';
import { RENTALS_ENABLED } from './site-access';

test('sale FAQ answers the turnkey question directly, not with the rental inventory text', () => {
  for (const [lang, faq] of Object.entries(salesFAQ)) {
    const answer = faq.items[0][1];
    if (RENTALS_ENABLED) {
      assert.equal(answer, saleContent[lang as keyof typeof saleContent].inventory);
    } else {
      assert.notEqual(answer, saleContent[lang as keyof typeof saleContent].inventory, lang);
      assert.match(answer, /^(Yes|Oui|Sí|Ja|Sì)\./, lang);
    }
  }
});
