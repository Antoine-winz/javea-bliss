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

/** Enrich historical rows for display without overwriting their recorded location. */
export async function enrichHistoricalLocation<T extends {
  ip: string | null; city: string | null; country: string | null; countryCode: string | null;
}>(visit: T) {
  const missingCity = !visit.city || visit.city === 'Unknown';
  const missingCountry = !visit.country || visit.country === 'Unknown';
  if (!visit.ip || (!missingCity && !missingCountry)) return { ...visit, locationEstimatedFromMaskedIp: false };
  const estimate = await getLocationFromIP(visit.ip);
  // Do not combine a recorded country with a contradictory network estimate.
  const compatible = missingCountry || visit.countryCode === estimate.countryCode;
  const city = missingCity && compatible && estimate.city !== 'Unknown' ? estimate.city : visit.city;
  const country = missingCountry && estimate.countryCode !== 'XX' ? estimate.country : visit.country;
  return {
    ...visit,
    city,
    country,
    countryCode: missingCountry && estimate.countryCode !== 'XX' ? estimate.countryCode : visit.countryCode,
    locationEstimatedFromMaskedIp: city !== visit.city || country !== visit.country,
  };
}
