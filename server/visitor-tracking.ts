import { Request, Response, NextFunction } from 'express';
import { isIP } from 'node:net';
import { db } from './db';
import { visitorStats, visitorDetails } from '@shared/schema';
import { eq, and, gte, lte, desc, sql } from 'drizzle-orm';

export interface VisitorStatsData {
  totalVisits: number;
  currentWeekVisits: number;
  averageWeeklyVisits: number;
  weeklyData: Array<{
    week: string;
    visits: number;
  }>;
  countryStats: Array<{
    country: string;
    countryCode: string;
    visits: number;
    percentage: number;
  }>;
  referrerStats: Array<{
    referrer: string;
    domain: string;
    visits: number;
    percentage: number;
  }>;
}

/**
 * Get country information from IP address
 */
const geoCache = new Map<string, { expires: number; location: { city: string; country: string; countryCode: string } }>();

export async function getLocationFromIP(ip: string): Promise<{city: string, country: string, countryCode: string}> {
  if (!isIP(ip) || ip === "unknown" || ip.includes("127.0.0.1") || ip === "::1") {
    return { city: "Unknown", country: "Unknown", countryCode: "XX" };
  }
  const cached = geoCache.get(ip);
  if (cached && cached.expires > Date.now()) return cached.location;
  try {
    // Use ipapi.co for IP geolocation (free tier: 1000 requests/day)
    const response = await fetch(`https://ipapi.co/${encodeURIComponent(ip)}/json/`, { signal: AbortSignal.timeout(3000) });
    if (!response.ok) throw new Error('IP lookup failed');
    
    const data = await response.json();
    const location = {
      city: data.city || 'Unknown',
      country: data.country_name || 'Unknown',
      countryCode: data.country_code || 'XX'
    };
    if (geoCache.size >= 1000) geoCache.delete(geoCache.keys().next().value!);
    geoCache.set(ip, { expires: Date.now() + 60 * 60 * 1000, location });
    return location;
  } catch (error) {
    return {
      city: 'Unknown',
      country: 'Unknown',
      countryCode: 'XX'
    };
  }
}

/**
 * Extract domain from referrer URL
 */
function extractDomain(url: string): string {
  try {
    const domain = new URL(url).hostname;
    return domain.replace('www.', '');
  } catch {
    return url;
  }
}

/**
 * Middleware to track page visits
 */
export const trackVisit = (req: Request, res: Response, next: NextFunction) => {
  // Analytics work never holds up the HTML response or counts unsuccessful requests.
  res.once('finish', () => {
    if (req.method === 'GET' && res.statusCode === 200) void recordVisit(req);
  });
  next();
};

const recordVisit = async (req: Request) => {
  try {
    // Only track visits to the main pages, not API calls or assets
    if (req.path.startsWith('/api/') || req.path.includes('.')) {
      return;
    }

    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
    const ip = req.ip || req.connection.remoteAddress || 'unknown';
    const userAgent = req.get('User-Agent') || 'unknown';
    const referrer = req.get('Referer') || 'Direct';
    const host = req.get('Host') || '';
    
    // Exclude Replit development traffic and internal previews
    const isReplitDevelopment = host.includes('.replit.dev') || 
                               host.includes('.replit.co') || 
                               host.includes('.replit.com') ||
                               host.includes('replit.dev') ||
                               host.includes('replit.co') ||
                               host.includes('replit.com') ||
                               referrer.includes('.replit.dev') ||
                               referrer.includes('.replit.co') ||
                               referrer.includes('.replit.com') ||
                               referrer.includes('replit.dev') ||
                               referrer.includes('replit.co') ||
                               referrer.includes('replit.com') ||
                               userAgent.includes('replit') ||
                               ip.includes('127.0.0.1') ||
                               ip.includes('localhost') ||
                               /[a-f0-9\-]+\.replit\.dev/.test(host) ||
                               /[a-f0-9\-]+\.replit\.co/.test(host);
    
    // Skip tracking for development and internal traffic
    if (process.env.NODE_ENV !== 'production' || isReplitDevelopment || ip === '::1' || req.path === '/admin' || req.path === '/healthz') {
      return;
    }
    
    // Get country information
    const { country, countryCode } = await getLocationFromIP(ip);
    
    // Extract referrer domain
    const referrerDomain = referrer === 'Direct' ? 'Direct' : extractDomain(referrer);
    
    // Update daily visitor count
    const existingRecord = await db
      .select()
      .from(visitorStats)
      .where(eq(visitorStats.visitDate, today))
      .limit(1);

    if (existingRecord.length > 0) {
      await db
        .update(visitorStats)
        .set({
          visitCount: sql`${visitorStats.visitCount} + 1`,
          updatedAt: new Date()
        })
        .where(eq(visitorStats.visitDate, today));
    } else {
      await db.insert(visitorStats).values({
        visitDate: today,
        visitCount: 1,
      });
    }
    
    // Store detailed visitor information
    await db.insert(visitorDetails).values({
      visitDate: today,
      country,
      countryCode,
      referrer,
      referrerDomain,
      userAgent,
      ip: isIP(ip) === 4 ? ip.split('.').slice(0, 3).join('.') + '.0' : isIP(ip) === 6 ? ip.split(':').slice(0, 3).join(':') + '::' : null,
    });
    
  } catch (error) {
    // Don't break the application if visitor tracking fails
    console.error('Visitor tracking error:', error);
  }
  
};

/**
 * Get visitor statistics for admin dashboard
 */
export const getVisitorStats = async (): Promise<VisitorStatsData> => {
  try {
    const today = new Date();
    const currentWeekStart = new Date(today);
    currentWeekStart.setDate(today.getDate() - today.getDay()); // Start of current week (Sunday)
    currentWeekStart.setHours(0, 0, 0, 0);

    const threeWeeksAgo = new Date(currentWeekStart);
    threeWeeksAgo.setDate(currentWeekStart.getDate() - 21); // 3 weeks ago

    // Get total visits
    const totalVisitsResult = await db
      .select({
        total: sql<number>`COALESCE(SUM(${visitorStats.visitCount}), 0)`
      })
      .from(visitorStats);

    const totalVisits = totalVisitsResult[0]?.total || 0;

    // Get current week visits
    const currentWeekEnd = new Date(currentWeekStart);
    currentWeekEnd.setDate(currentWeekStart.getDate() + 6);
    currentWeekEnd.setHours(23, 59, 59, 999);

    const currentWeekResult = await db
      .select({
        total: sql<number>`COALESCE(SUM(${visitorStats.visitCount}), 0)`
      })
      .from(visitorStats)
      .where(and(
        gte(visitorStats.visitDate, currentWeekStart.toISOString().split('T')[0]),
        lte(visitorStats.visitDate, currentWeekEnd.toISOString().split('T')[0])
      ));

    const currentWeekVisits = currentWeekResult[0]?.total || 0;

    // Get last 3 weeks data for average calculation
    const lastThreeWeeksResult = await db
      .select({
        total: sql<number>`COALESCE(SUM(${visitorStats.visitCount}), 0)`
      })
      .from(visitorStats)
      .where(and(
        gte(visitorStats.visitDate, threeWeeksAgo.toISOString().split('T')[0]),
        lte(visitorStats.visitDate, currentWeekStart.toISOString().split('T')[0])
      ));

    const lastThreeWeeksVisits = lastThreeWeeksResult[0]?.total || 0;
    const averageWeeklyVisits = Math.round(lastThreeWeeksVisits / 3);

    // Get all weekly data (no date filter, show full history)
    const weeklyData = await db
      .select({
        visitDate: visitorStats.visitDate,
        visitCount: visitorStats.visitCount,
      })
      .from(visitorStats)
      .orderBy(desc(visitorStats.visitDate));

    // Group by week
    const weeklyGroups: Record<string, number> = {};
    weeklyData.forEach(row => {
      const date = new Date(row.visitDate);
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - date.getDay());
      const weekKey = weekStart.toISOString().split('T')[0];
      
      weeklyGroups[weekKey] = (weeklyGroups[weekKey] || 0) + (row.visitCount || 0);
    });

    const weeklyDataArray = Object.entries(weeklyGroups)
      .map(([week, visits]) => ({
        week: formatWeekLabel(week),
        weekKey: week,
        visits
      }))
      .sort((a, b) => a.weekKey.localeCompare(b.weekKey)) // oldest first for chart
      .slice(-12) // last 12 weeks
      .map(({ weekKey, ...rest }) => rest);

    // Get country statistics, all time
    const countryStatsResult = await db
      .select({
        country: visitorDetails.country,
        countryCode: visitorDetails.countryCode,
        visits: sql<number>`COUNT(*)`
      })
      .from(visitorDetails)
      .groupBy(visitorDetails.country, visitorDetails.countryCode)
      .orderBy(desc(sql<number>`COUNT(*)`));

    const totalDetailVisits = countryStatsResult.reduce((sum, row) => sum + Number(row.visits), 0) || 1;
    const countryStats = countryStatsResult.map(row => ({
      country: row.country || 'Unknown',
      countryCode: row.countryCode || 'XX',
      visits: Number(row.visits),
      percentage: Math.round((Number(row.visits) / totalDetailVisits) * 100)
    }));

    // Get referrer statistics, all time
    const referrerStatsResult = await db
      .select({
        referrer: visitorDetails.referrer,
        domain: visitorDetails.referrerDomain,
        visits: sql<number>`COUNT(*)`
      })
      .from(visitorDetails)
      .groupBy(visitorDetails.referrer, visitorDetails.referrerDomain)
      .orderBy(desc(sql<number>`COUNT(*)`));

    const referrerStats = referrerStatsResult.map(row => ({
      referrer: row.referrer || 'Unknown',
      domain: row.domain || 'Unknown',
      visits: Number(row.visits),
      percentage: Math.round((Number(row.visits) / totalDetailVisits) * 100)
    }));

    return {
      totalVisits,
      currentWeekVisits,
      averageWeeklyVisits,
      weeklyData: weeklyDataArray,
      countryStats,
      referrerStats
    };
  } catch (error) {
    console.error('Error getting visitor stats:', error);
    return {
      totalVisits: 0,
      currentWeekVisits: 0,
      averageWeeklyVisits: 0,
      weeklyData: [],
      countryStats: [],
      referrerStats: []
    };
  }
};

/**
 * Format week label for display
 */
function formatWeekLabel(weekStart: string): string {
  const date = new Date(weekStart);
  const weekEnd = new Date(date);
  weekEnd.setDate(date.getDate() + 6);
  
  const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
  const start = date.toLocaleDateString('en-US', options);
  const end = weekEnd.toLocaleDateString('en-US', options);
  
  return `${start} - ${end}`;
}