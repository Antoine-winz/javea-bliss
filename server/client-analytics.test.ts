import assert from 'node:assert/strict';
import test from 'node:test';
import { build } from 'esbuild';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

test('local previews and admin pages do not send analytics; public navigation sends explicit page views', async () => {
  const result = await build({ entryPoints: ['client/src/lib/analytics.ts'], bundle: true, write: false, format: 'esm', platform: 'node', define: { 'import.meta.env.PROD': 'true', 'import.meta.env.VITE_GA_MEASUREMENT_ID': '"G-LOCALTEST"' } });
  const oldWindow = (globalThis as any).window; const oldDocument = (globalThis as any).document;
  const scripts: unknown[] = [];
  const choices = new Map<string, string>();
  const fakeWindow: any = { location: { hostname: '127.0.0.1', pathname: '/fr/for-sale', origin: 'http://127.0.0.1:5173' }, dataLayer: [], localStorage: { getItem: (key: string) => choices.get(key) || null, setItem: (key: string, value: string) => choices.set(key, value) } };
  (globalThis as any).window = fakeWindow;
  (globalThis as any).document = { title: 'Appartement à vendre', createElement: () => ({}), head: { appendChild: (script: unknown) => scripts.push(script) } };
  try {
    const analytics = await import(`data:text/javascript;base64,${Buffer.from(result.outputFiles[0].text).toString('base64')}`);
    analytics.initGA(); analytics.trackPageView('/fr/for-sale'); assert.equal(scripts.length, 0);
    fakeWindow.location = { hostname: 'javeabliss.com', pathname: '/admin', origin: 'https://javeabliss.com' };
    analytics.initGA(); assert.equal(scripts.length, 0);
    fakeWindow.location.pathname = '/fr/for-sale'; analytics.initGA(); analytics.trackPageView('/fr/for-sale'); assert.equal(scripts.length, 0, 'public visits do not load Google without consent');
    analytics.setAnalyticsConsent('accepted'); analytics.initGA(); assert.equal(scripts.length, 1);
    assert.equal(analytics.getAnalyticsConsent(), 'accepted');
    analytics.trackPageView('/fr/for-sale');
    const commands = fakeWindow.dataLayer.map((entry: any) => Array.from(entry));
    const view = commands.find((entry: any[]) => entry[0] === 'event' && entry[1] === 'page_view');
    assert.equal(view[2].page_location, 'https://javeabliss.com/fr/for-sale'); assert.equal(view[2].page_title, 'Appartement à vendre');
    const count = fakeWindow.dataLayer.length; fakeWindow.location.pathname = '/admin'; analytics.trackPageView('/admin'); analytics.trackEvent('test'); assert.equal(fakeWindow.dataLayer.length, count);
    fakeWindow.location.pathname = '/fr/for-sale'; analytics.setAnalyticsConsent('declined');
    assert.equal(fakeWindow['ga-disable-G-LOCALTEST'], true);
    analytics.trackPageView('/fr/for-sale'); analytics.trackEvent('test'); assert.equal(fakeWindow.dataLayer.length, count, 'withdrawal stops further events');
    choices.set(analytics.ANALYTICS_CONSENT_KEY, JSON.stringify({ choice: 'accepted', expiresAt: Date.now() - 1 }));
    assert.equal(analytics.getAnalyticsConsent(), null); analytics.trackPageView('/fr/for-sale'); assert.equal(fakeWindow.dataLayer.length, count);
  } finally { (globalThis as any).window = oldWindow; (globalThis as any).document = oldDocument; }
});

test('updated form resolver preserves validation errors and parsed values', async () => {
  const resolver = zodResolver(z.object({ email: z.string().email(), consent: z.literal(true) }));
  const options: any = { fields: {}, shouldUseNativeValidation: false };
  const valid = await resolver({ email: 'buyer@example.com', consent: true }, {}, options);
  assert.equal(valid.values.email, 'buyer@example.com'); assert.deepEqual(valid.errors, {});
  const invalid = await resolver({ email: 'invalid', consent: false } as any, {}, options);
  assert.ok(invalid.errors.email); assert.ok(invalid.errors.consent); assert.deepEqual(invalid.values, {});
});
