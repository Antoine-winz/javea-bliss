import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeSalesPhone } from './sales-phone';
test('sales phones accept domestic, international and pasted formats without duplicating country codes', () => {
  assert.equal(normalizeSalesPhone('06 12 34 56 78', '+33'), '+33612345678');
  assert.equal(normalizeSalesPhone('+41 79 123 45 67', '+34'), '+41791234567');
  assert.equal(normalizeSalesPhone('0041 79 123 45 67', '+34'), '+41791234567');
  assert.equal(normalizeSalesPhone('612 345 678', '+34'), '+34612345678');
  assert.equal(normalizeSalesPhone('abc', '+34'), null);
  assert.equal(normalizeSalesPhone('', '+33'), null);
});
