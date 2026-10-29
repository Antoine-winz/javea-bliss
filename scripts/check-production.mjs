import assert from 'node:assert/strict';
import tls from 'node:tls';

const hosts = ['javeabliss.com', 'www.javeabliss.com'];
const languages = ['en', 'fr', 'es', 'de', 'nl', 'it'];

async function request(url, { status = 200, json = false } = {}) {
  const response = await fetch(url, {
    headers: { Accept: json ? 'application/json' : 'text/html' },
    signal: AbortSignal.timeout(25000),
  });
  assert.equal(response.status, status, `${url}: HTTP ${response.status}`);
  assert.equal(new URL(response.url).protocol, 'https:', `Insecure redirect: ${url}`);
  const body = json ? await response.json() : await response.text();
  console.log(`PASS ${url} → ${response.status} ${response.url}`);
  return { response, body };
}

async function checkCertificate(host) {
  await new Promise((resolve, reject) => {
    const socket = tls.connect({ host, port: 443, servername: host, rejectUnauthorized: true });
    socket.setTimeout(15000, () => socket.destroy(new Error(`TLS timeout: ${host}`)));
    socket.once('error', reject);
    socket.once('secureConnect', () => {
      try {
        assert(socket.authorized, `Invalid certificate: ${host}`);
        const cert = socket.getPeerCertificate();
        const days = (Date.parse(cert.valid_to) - Date.now()) / 86400000;
        assert(days > 14, `${host}: certificate expires in ${days.toFixed(1)} days`);
        console.log(`PASS TLS ${host}: ${Math.floor(days)} days remaining`);
        resolve();
      } catch (error) { reject(error); }
      finally { socket.end(); }
    });
  });
}

async function main() {
  for (const host of hosts) {
    await checkCertificate(host);
    for (const scheme of ['https', 'http']) {
      const { response, body } = await request(`${scheme}://${host}/en/`);
      assert.equal(new URL(response.url).hostname, 'javeabliss.com');
      assert.match(body, /<html[\s>]/i, 'Expected the actual page, not a health probe');
    }
  }
  for (const lang of languages) {
    const { body } = await request(`https://javeabliss.com/${lang}/for-sale`);
    assert.match(body, /<html[\s>]/i);
    const assets = [...body.matchAll(/(?:src|href)="(\/assets\/[^"?#]+\.(?:js|css))"/g)];
    assert(assets.some((match) => match[1].endsWith('.js')), `${lang}: JavaScript bundle missing`);
    if (lang === 'en') {
      for (const asset of new Set(assets.map((match) => match[1]))) {
        await request(`https://javeabliss.com${asset}`);
      }
    }
  }
  await request('https://javeabliss.com/sitemap.xml');
  await request('https://javeabliss.com/robots.txt');
  const { body } = await request('https://javeabliss.com/api/sales/session', { json: true });
  assert.deepEqual(body, { verified: false });
  await request('https://javeabliss.com/api/sales/brochure?lang=fr', { status: 401, json: true });
  await request('https://javeabliss.com/api/calendar/blocked-dates', { json: true });
  console.log('Production checks passed.');
}

main().catch((error) => {
  console.error('PRODUCTION CHECK FAILED:', error.message, error.cause?.message ?? '');
  process.exitCode = 1;
});
