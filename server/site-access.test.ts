import assert from 'node:assert/strict';
import test from 'node:test';
import express from 'express';
import { siteAccess } from './site-access';
import { RENTALS_ENABLED, salesRedirect } from '../shared/site-access';

process.env.NODE_ENV = 'test';
process.env.DATABASE_URL = 'postgresql://test:test@localhost/test';
process.env.ADMIN_PASSWORD = 'local-test-only';
process.env.SESSION_SECRET = 'local-test-only-session';
const { registerRoutes } = await import('./routes');

test('sales-only access blocks old rental entry points while sale and admin authentication still work', async () => {
  if (RENTALS_ENABLED) return;
  const app = express();
  app.use(siteAccess);
  app.use(express.json());
  const server = await registerRoutes(app);
  app.use((_req, res) => res.send('page'));
  await new Promise<void>(resolve => server.listen(0, '127.0.0.1', resolve));
  const base = `http://127.0.0.1:${(server.address() as { port: number }).port}`;
  try {
    for (const lang of ['en', 'fr', 'es', 'nl', 'de', 'it']) {
      for (const old of [`/${lang}/`, `/${lang}/recommendations`, `/${lang}/promo/1`, `/${lang}/promotional-offer/1`, `/${lang}/social-media/1`]) {
        const response = await fetch(base + old + '?utm_source=agency', { redirect: 'manual' });
        // Permanent: the rental pages are gone, so search engines must drop them.
        assert.equal(response.status, 301, old);
        assert.equal(response.headers.get('location'), `/${lang}/for-sale?utm_source=agency`);
      }
      assert.equal((await fetch(`${base}/${lang}/for-sale`)).status, 200);
      assert.equal((await fetch(`${base}/${lang}/privacy-policy`)).status, 200);
    }
    for (const old of ['/flyer.html', '/flyer2.html', '/%66lyer2.html', '/qr-download.html', '/en/winter-rental-javea/', '/recommendations', '/promo/2']) {
      assert.equal((await fetch(base + old, { redirect: 'manual' })).status, 301, old);
    }
    for (const endpoint of ['/api/booking-inquiry', '/API/BOOKING-INQUIRY', '/api/calendar/blocked-dates', '/api/calendar/check-availability', '/api/pricing', '/api/promotional-offers/1', '/api/last-minute-offers', '/api/daily-rates/bulk']) {
      for (const method of ['GET', 'POST', 'PUT', 'DELETE']) {
        const response = await fetch(base + endpoint, { method });
        assert.equal(response.status, 503, `${method} ${endpoint}`);
        assert.equal((await response.json()).code, 'RENTALS_DISABLED');
      }
    }
    const brochure = await fetch(base + '/api/sales/brochure?lang=fr');
    assert.equal(brochure.status, 401);
    assert.equal((await brochure.json()).code, 'VERIFICATION_REQUIRED');
    assert.deepEqual(await (await fetch(base + '/api/sales/session')).json(), { verified: false });
    const invalidRegistration = await fetch(base + '/api/sales/request-access', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' });
    assert.equal(invalidRegistration.status, 400);
    assert.equal((await invalidRegistration.json()).code, 'VALIDATION_ERROR');
    assert.equal((await fetch(base + '/api/admin/session')).status, 401);
    const login = await fetch(base + '/api/admin/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password: 'local-test-only' }) });
    assert.equal(login.status, 200);
    const cookie = login.headers.get('set-cookie')!.split(';')[0];
    assert.equal((await fetch(base + '/api/admin/session', { headers: { Cookie: cookie } })).status, 200);
    assert.equal(salesRedirect('/fr/for-sale'), null);
    assert.equal(salesRedirect('/fr/privacy-policy'), null);
    assert.equal(salesRedirect('/admin'), null);
    assert.equal(salesRedirect('/unrelated-page'), null);
    for (const [url, destination] of [['/for-sale', '/en/for-sale'], ['/fr/for-sale/', '/fr/for-sale'], ['/FR/FOR-SALE', '/fr/for-sale'], ['/privacy-policy', '/en/privacy-policy']]) {
      const response = await fetch(base + url, { redirect: 'manual' });
      assert.equal(response.status, 301); assert.equal(response.headers.get('location'), destination);
    }
    // The root answer varies by cookie and Accept-Language, so it stays temporary.
    const preferred = await fetch(base + '/', { redirect: 'manual', headers: { Cookie: 'preferredLanguage=fr', 'Accept-Language': 'en' } });
    assert.equal(preferred.status, 302);
    assert.equal(preferred.headers.get('location'), '/fr/for-sale');
    // The old site's ?lang= links still reach the right language.
    const legacy = await fetch(base + '/?lang=es', { redirect: 'manual', headers: { 'Accept-Language': 'en' } });
    assert.equal(legacy.headers.get('location'), '/es/for-sale');
    const legacyWithCampaign = await fetch(base + '/?lang=de&utm_source=flyer', { redirect: 'manual' });
    assert.equal(legacyWithCampaign.headers.get('location'), '/de/for-sale?utm_source=flyer');
  } finally { await new Promise<void>(resolve => server.close(() => resolve())); }
});
