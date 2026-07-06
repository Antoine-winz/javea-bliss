import { useMemo } from "react";

export interface CalendarWeek {
  weeks: Date[][];
  year: number;
  month: number;
  today: Date;
}

export const useCalendarData = (currentDate: Date): CalendarWeek => {
  return useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const today = new Date();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const endDate = new Date(lastDay);
    endDate.setDate(endDate.getDate() + (6 - lastDay.getDay()));
    
    const weeks: Date[][] = [];
    const currentWeekDate = new Date(startDate);
    
    while (currentWeekDate <= endDate) {
      const week: Date[] = [];
      for (let i = 0; i < 7; i++) {
        week.push(new Date(currentWeekDate));
        currentWeekDate.setDate(currentWeekDate.getDate() + 1);
      }
      weeks.push(week);
    }
    
    return { weeks, year, month, today };
  }, [currentDate]);
};

export const formatDateString = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const createDateSet = (dates: string[]): Set<string> => {
  return new Set(dates.map(date => date.split('T')[0]));
};

export const isPastDate = (date: Date): boolean => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const checkDate = new Date(date);
  checkDate.setHours(0, 0, 0, 0);
  return checkDate < today;
};

export const isCurrentMonth = (date: Date, currentMonth: number): boolean => {
  return date.getMonth() === currentMonth;
};

export const getSeasonalRate = (date: Date, stayLength?: number): number => {
  const month = date.getMonth();
  let baseRate;
  
  if (month >= 5 && month <= 8) baseRate = 210; // Jun-Sep (high season)
  else if (month === 3 || month === 4 || month === 9) baseRate = 160; // Apr, May, Oct (mid season)
  else baseRate = 130; // Nov-Mar (low season)
  
  // Long-term rental rate: €100/day for stays 35+ days (5+ weeks)
  if (stayLength && stayLength >= 35) {
    return 100;
  }
  
  return baseRate;
};