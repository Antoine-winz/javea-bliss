import assert from 'node:assert/strict';
import test from 'node:test';
import http from 'node:http';
import express from 'express';
import { rootProbe } from './root-probe';
import { RENTALS_ENABLED } from '../shared/site-access';

// fetch() refuses to set Host, so the www case goes through node:http.
function getWithHost(port: number, host: string): Promise<{ status: number; body: string }> {
  return new Promise((resolve, reject) => {
    const request = http.request({ host: '127.0.0.1', port, path: '/', headers: { Host: host } }, response => {
      let body = '';
      response.on('data', chunk => { body += chunk; });
      response.on('end', () => resolve({ status: response.statusCode!, body }));
    });
    request.on('error', reject);
    request.end();
  });
}

// The root is the site's main URL: a crawler that gets the deployment probe's
// "OK" there sees an empty site. Production is the only mode that answers it.
test('the bare root answers deployment probes without hiding the sale page from crawlers', async () => {
  if (RENTALS_ENABLED) return;
  const previousEnv = process.env.NODE_ENV;
  process.env.NODE_ENV = 'production';
  const app = express();
  app.get('/', rootProbe);
  app.get('/', (_req, res) => res.status(200).send('negotiated'));
  const server = app.listen(0, '127.0.0.1');
  await new Promise(resolve => server.once('listening', resolve));
  const base = `http://127.0.0.1:${(server.address() as { port: number }).port}`;
  try {
    // The deployment healthcheck must still get a plain 200, never a redirect.
    const probe = await fetch(base + '/', { redirect: 'manual' });
    assert.equal(probe.status, 200);
    assert.equal(await probe.text(), 'OK');

    for (const bot of ['Googlebot/2.1', 'bingbot/2.0', 'GPTBot/1.2', 'OAI-SearchBot/1.0', 'ChatGPT-User/1.0', 'ClaudeBot/1.0', 'Claude-SearchBot/1.0', 'PerplexityBot/1.0']) {
      const response = await fetch(base + '/', { redirect: 'manual', headers: { 'User-Agent': bot } });
      assert.equal(response.status, 301, bot);
      assert.equal(response.headers.get('location'), '/en/for-sale', bot);
    }

    // Browsers ask for HTML and reach the language negotiation instead.
    const browser = await fetch(base + '/', { redirect: 'manual', headers: { Accept: 'text/html,application/xhtml+xml' } });
    assert.equal(browser.status, 200);
    assert.equal(await browser.text(), 'negotiated');

    // www must fall through to the canonical-host redirect, not answer "OK".
    const port = (server.address() as { port: number }).port;
    assert.equal((await getWithHost(port, 'www.javeabliss.com')).body, 'negotiated');
    // The apex host still answers the probe.
    assert.equal((await getWithHost(port, 'javeabliss.com')).body, 'OK');
  } finally {
    process.env.NODE_ENV = previousEnv;
    await new Promise<void>(resolve => server.close(() => resolve()));
  }
});
