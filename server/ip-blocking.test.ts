import assert from 'node:assert/strict';
import test from 'node:test';
import express from 'express';
import { createIpBlocker, invalidateIpBlocks, normalizeIp } from './ip-blocking';

test('IP validation canonicalizes IPv6 and mapped IPv4 without accepting networks or URLs', () => {
  assert.equal(normalizeIp(' 192.0.2.1 '), '192.0.2.1');
  assert.equal(normalizeIp('2001:0DB8:0000:0000:0000:0000:0000:0001'), '2001:db8::1');
  assert.equal(normalizeIp('::ffff:192.0.2.1'), '192.0.2.1');
  for (const value of ['192.0.2.1/24', '999.1.2.3', 'https://example.com', 'fe80::1%eth0', '', null]) {
    assert.equal(normalizeIp(value), null);
  }
});

test('blocked IPs are refused, admin recovery works, cache refreshes after changes', async () => {
  let blocks = [{ ipAddress: '::ffff:127.0.0.1' }];
  let reads = 0;
  const app = express();
  app.use(createIpBlocker(async () => { reads++; return blocks; }));
  app.use((_req, res) => res.send('OK'));
  const server = app.listen(0, '127.0.0.1');
  await new Promise<void>(resolve => server.once('listening', resolve));
  const base = `http://127.0.0.1:${(server.address() as { port: number }).port}`;
  try {
    assert.equal((await fetch(base + '/fr/for-sale')).status, 403);
    assert.equal((await fetch(base + '/api/booking-inquiry', { method: 'POST' })).status, 403);
    assert.equal(reads, 1, 'reuses rules across requests');
    assert.equal((await fetch(base + '/admin')).status, 200);
    assert.equal((await fetch(base + '/api/admin/login')).status, 200);
    assert.equal((await fetch(base + '/healthz')).status, 200);
    assert.equal((await fetch(base + '/assets/admin.js')).status, 200, 'admin can load its JavaScript to recover access');
    blocks = [];
    invalidateIpBlocks();
    assert.equal((await fetch(base + '/fr/for-sale')).status, 200);
    assert.equal(reads, 2);
  } finally {
    await new Promise<void>(resolve => server.close(() => resolve()));
  }
});

test('a database outage retains the last successful block rules', async () => {
  let fail = false;
  const app = express();
  app.use(createIpBlocker(async () => {
    if (fail) throw new Error('Simulated outage');
    return [{ ipAddress: '127.0.0.1' }];
  }));
  app.use((_req, res) => res.send('OK'));
  const server = app.listen(0, '127.0.0.1');
  await new Promise<void>(resolve => server.once('listening', resolve));
  const base = `http://127.0.0.1:${(server.address() as { port: number }).port}`;
  try {
    assert.equal((await fetch(base + '/fr/')).status, 403);
    fail = true;
    invalidateIpBlocks();
    assert.equal((await fetch(base + '/fr/')).status, 403);
  } finally { await new Promise<void>(resolve => server.close(() => resolve())); }
});
