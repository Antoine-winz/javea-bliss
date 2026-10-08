import assert from 'node:assert/strict';
import test from 'node:test';
import express from 'express';
import { sameOriginWrites } from './security';
process.env.NODE_ENV = 'test';
process.env.DATABASE_URL = 'postgresql://test:test@localhost/test';
process.env.ADMIN_PASSWORD = 'test-only-password';
process.env.SESSION_SECRET = 'test-only-session-secret';
const { registerRoutes } = await import('./routes');

test('admin APIs enforce authentication, valid sessions work, cross-origin writes fail', async () => {
  const app = express();
  app.use(express.json());
  app.use('/api', sameOriginWrites);
  const server = await registerRoutes(app);
  await new Promise<void>(resolve => server.listen(0, '127.0.0.1', resolve));
  const address = server.address() as { port: number };
  const base = `http://127.0.0.1:${address.port}`;
  try {
    for (const [method, path] of [
      ['POST', '/api/calendar/sync'], ['POST', '/api/calendar/manual-block'],
      ['DELETE', '/api/calendar/manual-block/manual-test'], ['GET', '/api/calendar/events'],
      ['GET', '/api/calendar/sync-status'], ['GET', '/api/calendar/cleaning-schedule'],
      ['GET', '/api/calendar/manual-blocks'], ['GET', '/api/visitor-stats'], ['GET', '/api/reviews'],
      ['POST', '/api/reviews'], ['PUT', '/api/reviews/1'], ['DELETE', '/api/reviews/1'],
      ['POST', '/api/promotional-offers'], ['PUT', '/api/promotional-offers/1'], ['DELETE', '/api/promotional-offers/1'],
      ['POST', '/api/daily-rates/bulk'], ['DELETE', '/api/daily-rates'], ['POST', '/api/last-minute-offers/settings'],
    ]) {
      const response = await fetch(base + path, { method });
      assert.equal(response.status, 401, `${method} ${path}`);
    }
    const login = await fetch(base + '/api/admin/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password: 'test-only-password' }) });
    assert.equal(login.status, 200);
    const cookie = login.headers.get('set-cookie')!.split(';')[0];
    const session = await fetch(base + '/api/admin/session', { headers: { Cookie: cookie } });
    assert.equal(session.status, 200);
    const rejected = await fetch(base + '/api/last-minute-offers/settings', { method: 'POST', headers: { Cookie: cookie, Origin: 'https://untrusted.example', 'Content-Type': 'application/json' }, body: JSON.stringify({ enabled: true }) });
    assert.equal(rejected.status, 403);
    const accepted = await fetch(base + '/api/last-minute-offers/settings', { method: 'POST', headers: { Cookie: cookie, Origin: base, 'Content-Type': 'application/json' }, body: JSON.stringify({ enabled: false }) });
    assert.equal(accepted.status, 200);
    for (const query of ['start=2027-02-30&end=2027-03-10', 'start=2027-01-01&end=9999-01-01', 'start=2027-01-01&end=2027-01-10&stayLength=11junk']) {
      assert.equal((await fetch(base + '/api/pricing?' + query)).status, 400);
    }
    assert.equal((await fetch(base + '/api/unknown')).status, 404);
    assert.equal((await fetch(base + '/api/calendar/blocked-dates')).status, 503);
    const invalidSales = await fetch(base + '/api/sales/request-access', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: 'invalid' }) });
    assert.equal(invalidSales.status, 400);
    const brochure = await fetch(base + '/api/sales/brochure');
    assert.equal(brochure.status, 401);
  } finally {
    await new Promise<void>((resolve, reject) => server.close(error => error ? reject(error) : resolve()));
  }
});
