import { isIP } from 'node:net';
import type { RequestHandler } from 'express';

export function normalizeIp(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const ip = value.trim();
  if (!isIP(ip) || ip.includes('%')) return null;
  if (isIP(ip) === 4) return ip;
  const canonical = new URL(`http://[${ip}]/`).hostname.slice(1, -1);
  const mapped = /^::ffff:([a-f\d]+):([a-f\d]+)$/.exec(canonical);
  if (!mapped) return canonical;
  const high = parseInt(mapped[1], 16), low = parseInt(mapped[2], 16);
  return `${high >> 8}.${high & 255}.${low >> 8}.${low & 255}`;
}

let revision = 0;
export function invalidateIpBlocks() { revision++; }

// Persisted rules are cached to avoid a database query for every image or page.
// Keep the last successful rules during an outage, without taking the site down.
export function createIpBlocker(load: () => Promise<Array<{ ipAddress: string }>>): RequestHandler {
  let rules = new Set<string>();
  let expires = 0;
  let seenRevision = -1;
  let pending: Promise<void> | undefined;
  return async (req, res, next) => {
    if (req.path === '/healthz' || req.path === '/admin' || req.path === '/admin/' || req.path.startsWith('/assets/') || req.path.startsWith('/api/admin/')) return next();
    if (Date.now() >= expires || revision !== seenRevision) {
      if (!pending) {
        const currentRevision = revision;
        pending = load().then(rows => {
          rules = new Set(rows.map(row => normalizeIp(row.ipAddress)).filter((ip): ip is string => !!ip));
          seenRevision = currentRevision;
        }).catch(error => {
          console.error('Unable to refresh IP block rules:', error instanceof Error ? error.message : 'Database unavailable');
          seenRevision = currentRevision;
        }).finally(() => { expires = Date.now() + 30_000; pending = undefined; });
      }
      await pending;
    }
    const ip = normalizeIp(req.ip || req.socket.remoteAddress);
    if (ip && rules.has(ip)) {
      res.setHeader('Cache-Control', 'no-store');
      res.status(403).send('Access unavailable.');
      return;
    }
    next();
  };
}
