import assert from 'node:assert/strict';
import test from 'node:test';
import express from 'express';
import { mkdtemp, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { PDFDocument } from 'pdf-lib';
import { siteAccess } from './site-access';
import { sameOriginWrites } from './security';

process.env.NODE_ENV = 'test';
process.env.DATABASE_URL = 'postgresql://test:test@localhost/test';
process.env.SESSION_SECRET = 'local-sales-flow-test';
process.env.ADMIN_PASSWORD = 'local-sales-flow-test';
process.env.RESEND_API_KEY = 'test-no-real-emails';
const directory = await mkdtemp(path.join(tmpdir(), 'javea-sales-test-'));
process.env.SALES_BROCHURES_DIR = directory;
const { storage } = await import('./storage');
const { registerSalesRoutes } = await import('./sales-routes');

test('sale registration, verification, protected PDF and CRM operate without production services', async t => {
  const pdf = await PDFDocument.create(); pdf.addPage([595, 842]); pdf.addPage([595, 842]);
  for (const language of ['en', 'fr', 'es', 'de', 'nl', 'it']) await writeFile(path.join(directory, `${language}.pdf`), await pdf.save());
  const leads = new Map<number, any>(); const downloads: any[] = []; const emails: any[] = [];
  let failEmail = false; let failAudit = false;
  const originalFetch = globalThis.fetch;
  const originals: Record<string, any> = {};
  const replacements: Record<string, any> = {
    isSalesIpBlocked: async () => false,
    upsertSalesLead: async (input: any) => {
      const old = [...leads.values()].find(lead => lead.email === input.email);
      const lead = { id: old?.id || leads.size + 1, createdAt: old?.createdAt || new Date(), followUpStatus: old?.followUpStatus || 'new', ownerNotifiedAt: old?.ownerNotifiedAt || null, ...input, verifiedAt: null, brochureDownloadedAt: null };
      leads.set(lead.id, lead); return { ...lead };
    },
    getSalesLeadByEmail: async (email: string) => { const lead = [...leads.values()].find(item => item.email === email); return lead ? { ...lead } : undefined; },
    getSalesLeadById: async (id: number) => leads.has(id) ? { ...leads.get(id) } : undefined,
    updateSalesLead: async (id: number, updates: any) => { Object.assign(leads.get(id), updates); return { ...leads.get(id) }; },
    claimSalesBrochureDownload: async (id: number, at: Date, verifiedAt: Date) => {
      const lead = leads.get(id); if (!lead || lead.brochureDownloadedAt || lead.verificationStatus !== 'verified' || lead.verifiedAt?.getTime() !== verifiedAt.getTime()) return false;
      lead.brochureDownloadedAt = at; return true;
    },
    releaseSalesBrochureDownload: async (id: number, at: Date) => { const lead = leads.get(id); if (lead.brochureDownloadedAt === at) lead.brochureDownloadedAt = null; },
    createSalesDownload: async (input: any) => { if (failAudit) throw new Error('Simulated audit outage'); const row = { id: downloads.length + 1, ...input, downloadedAt: new Date() }; downloads.push(row); return row; },
    listSalesLeads: async () => [...leads.values()],
    getSalesDownloads: async (id: number) => downloads.filter(item => item.leadId === id),
  };
  for (const [key, value] of Object.entries(replacements)) { originals[key] = (storage as any)[key]; (storage as any)[key] = value; }
  globalThis.fetch = (async (input: any, init: any) => {
    if (String(input) === 'https://api.resend.com/emails') {
      if (failEmail) return new Response('Simulated delivery outage', { status: 503 });
      emails.push(JSON.parse(init.body)); return new Response('{}', { status: 200 });
    }
    assert.ok(String(input).startsWith('http://127.0.0.1:'), 'Unexpected external request');
    return originalFetch(input, init);
  }) as typeof fetch;
  const app = express(); app.set('trust proxy', true); app.use(siteAccess); app.use(express.json()); app.use('/api', sameOriginWrites); registerSalesRoutes(app);
  const server = app.listen(0, '127.0.0.1'); await new Promise<void>(resolve => server.on('listening', resolve));
  const base = `http://127.0.0.1:${(server.address() as any).port}`;
  const post = (url: string, body: any, client = 1) => fetch(base + url, { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Forwarded-For': `192.0.2.${client}` }, body: JSON.stringify(body) });
  const registration = { firstName: 'Łukasz 李', lastName: 'Buyer', email: 'buyer@example.com', phone: '+34612345678', buyerType: 'private_buyer', preferredLanguage: 'fr', consentGiven: true };
  const codeFor = (email: string) => emails.filter(item => item.to.includes(email)).at(-1).text.match(/\b\d{6}\b/)![0];
  let token = ''; let leadId = 0;
  try {
    await t.test('private buyer and agency validation, blocked API and cross-origin protection', async () => {
      assert.equal((await post('/api/sales/request-access', { ...registration, buyerType: 'agency' })).status, 400);
      assert.equal((await post('/api/sales/request-access', { ...registration, consentGiven: false })).status, 400);
      assert.equal((await post('/api/booking-inquiry', registration)).status, 503);
      assert.equal((await fetch(base + '/api/sales/request-access', { method: 'POST', headers: { Origin: 'https://unrelated.example' } })).status, 403);
      assert.equal((await fetch(base + '/api/sales/brochure')).status, 401);
    });
    await t.test('verification code, resend cooldown, wrong code and owner notification', async () => {
      assert.equal((await post('/api/sales/request-access', registration)).status, 200);
      assert.equal((await post('/api/sales/resend', { email: registration.email })).status, 429);
      const code = codeFor(registration.email);
      assert.equal((await post('/api/sales/verify', { email: registration.email, code: code === '123456' ? '654321' : '123456' })).status, 400);
      const response = await post('/api/sales/verify', { email: registration.email, code });
      assert.equal(response.status, 200); token = response.headers.get('X-Sales-Access-Token')!; leadId = (await response.json()).lead.id;
      assert.equal(emails.filter(item => item.subject === 'NEW VERIFIED JÁVEA BLISS SALE ENQUIRY').length, 1);
    });
    await t.test('Unicode buyer names produce a valid PDF; HEAD never consumes access; concurrent downloads are single-use', async () => {
      const headers = { Authorization: `Bearer ${token}` };
      assert.equal((await fetch(base + '/api/sales/brochure', { method: 'HEAD', headers })).status, 405);
      assert.equal((await (await fetch(base + '/api/sales/session', { headers })).json()).verified, true);
      const responses = await Promise.all([fetch(base + '/api/sales/brochure?lang=fr', { headers }), fetch(base + '/api/sales/brochure?lang=fr', { headers })]);
      assert.deepEqual(responses.map(item => item.status).sort(), [200, 409]);
      const downloaded = responses.find(item => item.status === 200)!;
      assert.equal(downloaded.headers.get('content-type'), 'application/pdf');
      assert.equal((await PDFDocument.load(await downloaded.arrayBuffer())).getPageCount(), 2);
      assert.equal(downloads.length, 1);
      assert.equal((await (await fetch(base + '/api/sales/session', { headers })).json()).verified, false);
    });
    await t.test('new registration invalidates old sessions and failed audit writes preserve the new download', async () => {
      assert.equal((await post('/api/sales/request-access', registration, 2)).status, 200);
      const response = await post('/api/sales/verify', { email: registration.email, code: codeFor(registration.email) }, 2);
      assert.equal(response.status, 200); const replacement = response.headers.get('X-Sales-Access-Token')!;
      assert.equal((await fetch(base + '/api/sales/brochure', { headers: { Authorization: `Bearer ${token}` } })).status, 401);
      failAudit = true;
      assert.equal((await fetch(base + '/api/sales/brochure?lang=es', { headers: { Authorization: `Bearer ${replacement}` } })).status, 503);
      assert.equal(leads.get(leadId).brochureDownloadedAt, null); failAudit = false;
      assert.equal((await fetch(base + '/api/sales/brochure?lang=es', { headers: { Authorization: `Bearer ${replacement}` } })).status, 200);
      assert.equal(downloads.length, 2);
    });
    await t.test('delivery errors remain errors, agencies receive a code, and all six brochure languages load', async () => {
      failEmail = true;
      assert.equal((await post('/api/sales/request-access', { ...registration, email: 'delivery@example.com' }, 3)).status, 503); failEmail = false;
      for (const [index, language] of ['en', 'fr', 'es', 'de', 'nl', 'it'].entries()) {
        const email = `${language}@example.com`; const client = index + 10;
        assert.equal((await post('/api/sales/request-access', { ...registration, email, preferredLanguage: language, buyerType: 'agency', agencyName: 'Test Agency' }, client)).status, 200);
        const verified = await post('/api/sales/verify', { email, code: codeFor(email) }, client); assert.equal(verified.status, 200);
        const pdf = await fetch(`${base}/api/sales/brochure?lang=${language}`, { headers: { Authorization: `Bearer ${verified.headers.get('X-Sales-Access-Token')}` } });
        assert.equal(pdf.status, 200, language); assert.equal((await PDFDocument.load(await pdf.arrayBuffer())).getPageCount(), 2);
      }
    });
    await t.test('CRM remains private and returns preserved download history without verification secrets', async () => {
      assert.equal((await fetch(base + '/api/admin/sales-leads')).status, 401);
      const login = await post('/api/admin/login', { password: 'local-sales-flow-test' });
      assert.equal(login.status, 200); const headers = { Cookie: login.headers.get('set-cookie')!.split(';')[0] };
      const list = await (await fetch(base + '/api/admin/sales-leads', { headers })).json();
      assert.equal(list.leads.length, 8); assert.equal('verificationCodeHash' in list.leads[0], false);
      const detail = await (await fetch(`${base}/api/admin/sales-leads/${leadId}`, { headers })).json();
      assert.equal(detail.downloads.length, 2);
    });
  } finally {
    globalThis.fetch = originalFetch;
    for (const [key, value] of Object.entries(originals)) (storage as any)[key] = value;
    await new Promise<void>(resolve => server.close(() => resolve()));
    await rm(directory, { recursive: true, force: true });
  }
});
