import geoip from 'geoip-lite';
import { normalizeIp } from './ip-blocking';

const countryNames = new Intl.DisplayNames(['fr'], { type: 'region' });
const unknown = { city: 'Unknown', country: 'Unknown', countryCode: 'XX' };

/** Local lookup: no visitor IP is sent to a third-party API. */
export async function getLocationFromIP(value: string) {
  const ip = normalizeIp(value);
  if (!ip) return { ...unknown };
  try {
    const location = geoip.lookup(ip);
    if (!location || !/^[A-Z]{2}$/.test(location.country)) return { ...unknown };
    return {
      city: location.city || 'Unknown',
      country: countryNames.of(location.country) || location.country,
      countryCode: location.country,
    };
  } catch {
    return { ...unknown };
  }
}
