import test from 'node:test';
import assert from 'node:assert/strict';
import { getRatesForRange } from './pricing';

test('empty overrides preserve seasonal rates across season boundaries', async () => {
  const rates = await getRatesForRange('2027-05-31', '2027-06-01', undefined, async () => []);
  assert.deepEqual(rates.map(r => r.rate), [160, 210]);
  assert.ok(rates.every(r => r.source === 'seasonal'));
});
test('custom rates apply only to their day and long stays override them', async () => {
  const load = async () => [{id: 1, date: '2027-01-02', rate: 175, createdAt: null, updatedAt: null}];
  const short = await getRatesForRange('2027-01-01', '2027-01-03', 11, load);
  assert.deepEqual(short.map(r => r.rate), [130, 175, 130]);
  const long = await getRatesForRange('2027-01-01', '2027-01-03', 35, load);
  assert.ok(long.every(r => r.rate === 100 && r.source === 'long-stay'));
});
test('database failures are not silently replaced by seasonal prices', async () => {
  await assert.rejects(getRatesForRange('2027-01-01', '2027-01-02', 11, async () => { throw new Error('offline'); }), /offline/);
});
