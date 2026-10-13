import { Request, Response, NextFunction } from 'express';
import { isIP } from 'node:net';
import { db } from './db';
import { visitorStats, visitorDetails } from '@shared/schema';
import { and, gte, lte, lt, desc, sql } from 'drizzle-orm';

export interface VisitorStatsData {
  recentVisits: Array<{
    id: number;
    visitedAt: Date | null;
    locationEstimatedFromMaskedIp: boolean;
    fullIp: string | null;
    pagePath: string | null;
    language: string | null;
    userAgent: string | null;
    city: string | null;
    country: string | null;
    countryCode: string | null;
    ip: string | null;
    source: string | null;
  }>;
  hasMore: boolean;
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
import { getLocationFromIP, enrichHistoricalLocation } from './visitor-location';

// Run once before serving traffic, never from an analytics request.
export async function initializeVisitorTracking() {
  await db.execute(sql`ALTER TABLE visitor_details ADD COLUMN IF NOT EXISTS city text, ADD COLUMN IF NOT EXISTS full_ip text, ADD COLUMN IF NOT EXISTS page_path text, ADD COLUMN IF NOT EXISTS language text`);
  await db.execute(sql`WITH totals AS (
    SELECT visit_date, MIN(id) AS keep_id, SUM(visit_count) AS total FROM visitor_stats GROUP BY visit_date HAVING COUNT(*) > 1
  ), merged AS (
    UPDATE visitor_stats SET visit_count = totals.total FROM totals WHERE visitor_stats.id = totals.keep_id RETURNING visitor_stats.id
  ), deleted AS (
    DELETE FROM visitor_stats USING totals WHERE visitor_stats.visit_date = totals.visit_date AND visitor_stats.id <> totals.keep_id RETURNING visitor_stats.id
  )
  SELECT COUNT(*)::int AS deleted_count FROM deleted`);
  await db.execute(sql`CREATE UNIQUE INDEX IF NOT EXISTS visitor_stats_date_unique ON visitor_stats(visit_date)`);
  await db.execute(sql`CREATE INDEX IF NOT EXISTS visitor_details_recent_idx ON visitor_details(visited_at DESC, id DESC)`);
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

export const recordVisit = async (req: Request, navigationPath?: string) => {
  try {
    // Only track visits to the main pages, not API calls or assets
    const pagePath = navigationPath || req.originalUrl.split('?')[0];
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
    if (process.env.NODE_ENV !== 'production' || isReplitDevelopment || ip === '::1' || pagePath.startsWith('/admin') || pagePath === '/healthz') {
      return;
    }
    
    // Get country information
    const { city, country, countryCode } = await getLocationFromIP(ip);
    
    // Extract referrer domain
    const referrerDomain = referrer === 'Direct' ? 'Direct' : extractDomain(referrer);
    
    // Atomic upsert prevents duplicate days and lost counts during concurrent visits.
    await db.execute(sql`INSERT INTO visitor_stats (visit_date, visit_count) VALUES (${today}, 1)
      ON CONFLICT (visit_date) DO UPDATE SET visit_count = visitor_stats.visit_count + 1, updated_at = NOW()`);

    // Store detailed visitor information
    await db.insert(visitorDetails).values({
      visitDate: today,
      city,
      fullIp: isIP(ip) ? ip : null,
      pagePath: pagePath.slice(0, 500),
      language: /^\/(es|en|fr|de|nl|it)(?:\/|$)/.exec(pagePath)?.[1] || null,
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
export const getVisitorStats = async (search = "", page = 0): Promise<VisitorStatsData> => {
  try {
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

    const normalizedSearch = search.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/xabia/g, 'javea').trim();
    const searchPattern = '%' + normalizedSearch.replace(/[\\%_]/g, '\\$&') + '%';
    const locationFilter = normalizedSearch ? sql`replace(translate(lower(coalesce(${visitorDetails.city}, '') || ' ' || coalesce(${visitorDetails.country}, '') || ' ' || coalesce(${visitorDetails.countryCode}, '')), 'àáâäãåèéêëìíîïòóôöõùúûüçñ', 'aaaaaaeeeeiiiiooooouuuucn'), 'xabia', 'javea') LIKE ${searchPattern}` : undefined;
    const recentVisits = await db.select({
      id: visitorDetails.id,
      visitedAt: visitorDetails.visitedAt,
      city: visitorDetails.city,
      fullIp: visitorDetails.fullIp,
      pagePath: visitorDetails.pagePath,
      language: visitorDetails.language,
      userAgent: visitorDetails.userAgent,
      country: visitorDetails.country,
      countryCode: visitorDetails.countryCode,
      ip: visitorDetails.ip,
      source: visitorDetails.referrerDomain,
    }).from(visitorDetails)
      .where(locationFilter)
      .orderBy(desc(visitorDetails.visitedAt), desc(visitorDetails.id))
      .limit(101).offset(page * 100);

    return {
      recentVisits: await Promise.all(recentVisits.slice(0, 100).map(enrichHistoricalLocation)),
      hasMore: recentVisits.length > 100,
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