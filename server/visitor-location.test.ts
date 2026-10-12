import { test } from 'node:test';
import assert from 'node:assert/strict';
import { getLocationFromIP, enrichHistoricalLocation } from './visitor-location';

test('invalid and local addresses do not invent locations', async () => {
  for (const ip of ['unknown', '', '127.0.0.1', '::1', '192.168.1.10', '10.0.0.1']) {
    assert.equal((await getLocationFromIP(ip)).countryCode, 'XX');
  }
});

test('public and IPv4-mapped addresses resolve consistently without network access', async () => {
  const location = await getLocationFromIP('8.8.8.8');
  assert.equal(location.countryCode, 'US');
  assert.equal(location.country, 'États-Unis');
  assert.deepEqual(await getLocationFromIP('::ffff:8.8.8.8'), location);
  assert.equal(typeof location.city, 'string');
});


test('historical enrichment preserves recorded locations and labels network estimates', async () => {
  const old = { ip: '8.8.8.0', city: null, country: 'Unknown', countryCode: 'XX' };
  const result = await enrichHistoricalLocation(old);
  assert.equal(result.countryCode, 'US');
  assert.equal(result.locationEstimatedFromMaskedIp, true);
  assert.equal(old.country, 'Unknown');
  const known = { ip: '8.8.8.0', city: 'Paris', country: 'France', countryCode: 'FR' };
  assert.deepEqual(await enrichHistoricalLocation(known), { ...known, locationEstimatedFromMaskedIp: false });
  const conflict = await enrichHistoricalLocation({ ...known, city: null });
  assert.equal(conflict.city, null);
  assert.equal(conflict.countryCode, 'FR');
  const unavailable = await enrichHistoricalLocation({ ...old, ip: null });
  assert.equal(unavailable.locationEstimatedFromMaskedIp, false);
});
