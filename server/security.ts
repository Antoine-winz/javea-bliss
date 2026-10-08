import type { Request, Response, NextFunction } from 'express';

export function sameOriginWrites(req: Request, res: Response, next: NextFunction) {
  res.setHeader('Cache-Control', 'no-store');
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) return next();
  const origin = req.get('Origin');
  if (origin) {
    try {
      if (new URL(origin).host !== req.get('Host')) return res.status(403).json({ message: 'Cross-origin request rejected' });
    } catch {
      return res.status(403).json({ message: 'Invalid request origin' });
    }
  } else if (req.get('Sec-Fetch-Site') === 'cross-site') {
    return res.status(403).json({ message: 'Cross-origin request rejected' });
  }
  next();
}
