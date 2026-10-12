import { Request, Response, NextFunction } from 'express';
import { isIP } from 'node:net';
import { db } from './db';
import { visitorStats, visitorDetails } from '@shared/schema';
import { eq, and, gte, lte, lt, desc, sql } from 'drizzle-orm';

export interface VisitorStatsData {
  recentVisits: Array<{
    id: number;
    visitedAt: Date | null;
    city: string | null;
    country: string | null;
    countryCode: string | null;
    ip: string | null;
    source: string | null;
  }>;
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

export { getLocationFromIP } from './visitor-location';
import { getLocationFromIP } from './visitor-location';

// Additive, idempotent migration for existing deployments. Retry after failure.
let locationSchemaReady: Promise<unknown> | undefined;
function ensureLocationSchema() {
  return locationSchemaReady ??= db.execute(sql`ALTER TABLE visitor_details ADD COLUMN IF NOT EXISTS city text`)
    .catch(error => { locationSchemaReady = undefined; throw error; });
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
    const pagePath = req.originalUrl.split('?')[0];
    if (pagePath.startsWith('/api/') || pagePath.includes('.')) {
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
    if (process.env.NODE_ENV !== 'production' || isReplitDevelopment || ip === '::1' || pagePath === '/admin' || pagePath === '/healthz') {
      return;
    }
    
    // Get country information
    await ensureLocationSchema();
    const { city, country, countryCode } = await getLocationFromIP(ip);
    
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
      city,
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
    await ensureLocationSchema();
    const today = new Date();
    const currentWeekStart = new Date(today);
    currentWeekStart.setUTCDate(today.getUTCDate() - today.getUTCDay()); // Start of current week (Sunday)
    currentWeekStart.setUTCHours(0, 0, 0, 0);

    const threeWeeksAgo = new Date(currentWeekStart);
    threeWeeksAgo.setUTCDate(currentWeekStart.getUTCDate() - 21); // 3 weeks ago

    // Get total visits
    const totalVisitsResult = await db
      .select({
        total: sql<number>`COALESCE(SUM(${visitorStats.visitCount}), 0)`
      })
      .from(visitorStats);

    const totalVisits = Number(totalVisitsResult[0]?.total || 0);

    // Get current week visits
    const currentWeekEnd = new Date(currentWeekStart);
    currentWeekEnd.setUTCDate(currentWeekStart.getUTCDate() + 6);
    currentWeekEnd.setUTCHours(23, 59, 59, 999);

    const currentWeekResult = await db
      .select({
        total: sql<number>`COALESCE(SUM(${visitorStats.visitCount}), 0)`
      })
      .from(visitorStats)
      .where(and(
        gte(visitorStats.visitDate, currentWeekStart.toISOString().split('T')[0]),
        lte(visitorStats.visitDate, currentWeekEnd.toISOString().split('T')[0])
      ));

    const currentWeekVisits = Number(currentWeekResult[0]?.total || 0);

    // Get last 3 weeks data for average calculation
    const lastThreeWeeksResult = await db
      .select({
        total: sql<number>`COALESCE(SUM(${visitorStats.visitCount}), 0)`
      })
      .from(visitorStats)
      .where(and(
        gte(visitorStats.visitDate, threeWeeksAgo.toISOString().split('T')[0]),
        lt(visitorStats.visitDate, currentWeekStart.toISOString().split('T')[0])
      ));

    const lastThreeWeeksVisits = Number(lastThreeWeeksResult[0]?.total || 0);
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
      weekStart.setUTCDate(date.getUTCDate() - date.getUTCDay());
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
        referrer: visitorDetails.referrerDomain,
        domain: visitorDetails.referrerDomain,
        visits: sql<number>`COUNT(*)`
      })
      .from(visitorDetails)
      .groupBy(visitorDetails.referrerDomain)
      .orderBy(desc(sql<number>`COUNT(*)`));

    const referrerStats = referrerStatsResult.map(row => ({
      referrer: row.referrer || 'Unknown',
      domain: row.domain || 'Unknown',
      visits: Number(row.visits),
      percentage: Math.round((Number(row.visits) / totalDetailVisits) * 100)
    }));

    const recentVisits = await db.select({
      id: visitorDetails.id,
      visitedAt: visitorDetails.visitedAt,
      city: visitorDetails.city,
      country: visitorDetails.country,
      countryCode: visitorDetails.countryCode,
      ip: visitorDetails.ip,
      source: visitorDetails.referrerDomain,
    }).from(visitorDetails)
      .orderBy(desc(visitorDetails.visitedAt), desc(visitorDetails.id))
      .limit(100);

    return {
      recentVisits,
      totalVisits,
      currentWeekVisits,
      averageWeeklyVisits,
      weeklyData: weeklyDataArray,
      countryStats,
      referrerStats
    };
  } catch (error) {
    console.error('Error getting visitor stats:', error);
    throw error;

  }
};

/**
 * Format week label for display
 */
function formatWeekLabel(weekStart: string): string {
  const date = new Date(weekStart);
  const weekEnd = new Date(date);
  weekEnd.setUTCDate(date.getUTCDate() + 6);
  
  const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', timeZone: 'UTC' };
  const start = date.toLocaleDateString('en-US', options);
  const end = weekEnd.toLocaleDateString('en-US', options);
  
  return `${start} - ${end}`;
}