import { storage } from "./storage";

export interface PriceInfo {
  date: string;
  rate: number;
  source: 'custom' | 'seasonal';
}

/**
 * Calculate seasonal rate for a given date
 * @param date - The date to calculate rate for
 * @param stayLength - Optional stay length in days
 * @returns Rate in EUR per night
 * 
 * Pricing Strategy:
 * - High Season (Jun-Sep): €210/night
 * - Mid Season (Apr, May, Oct): €160/night  
 * - Low Season (Nov-Mar): €130/night
 * - Long-term stays (35+ days): €100/night (intentionally below seasonal rates to encourage longer bookings)
 */
function getSeasonalRate(date: Date, stayLength?: number): number {
  const month = date.getMonth();
  let baseRate = 130;
  
  if (month >= 5 && month <= 8) baseRate = 210; // Jun-Sep (high season)
  else if (month === 3 || month === 4 || month === 9) baseRate = 160; // Apr, May, Oct (mid season)
  else baseRate = 130; // Nov-Mar (low season)
  
  // Long-term rental discount: €100/day for stays 35+ days
  // This rate is intentionally lower than all seasonal rates to encourage long-term bookings
  if (stayLength && stayLength >= 35) {
    return 100;
  }
  
  return baseRate;
}

function getDatesBetween(startDate: string, endDate: string): string[] {
  const dates: string[] = [];
  const current = new Date(startDate);
  const end = new Date(endDate);
  
  while (current <= end) {
    dates.push(current.toISOString().split('T')[0]);
    current.setDate(current.getDate() + 1);
  }
  
  return dates;
}

export async function getRatesForRange(startDate: string, endDate: string, stayLength?: number): Promise<PriceInfo[]> {
  const customRates = await storage.getRatesByDateRange(startDate, endDate);
  
  const customRateMap = new Map<string, number>();
  customRates.forEach(rate => {
    customRateMap.set(rate.date, rate.rate);
  });
  
  const allDates = getDatesBetween(startDate, endDate);
  
  return allDates.map(dateStr => {
    if (customRateMap.has(dateStr)) {
      return {
        date: dateStr,
        rate: customRateMap.get(dateStr)!,
        source: 'custom' as const
      };
    } else {
      const date = new Date(dateStr);
      return {
        date: dateStr,
        rate: getSeasonalRate(date, stayLength),
        source: 'seasonal' as const
      };
    }
  });
}
