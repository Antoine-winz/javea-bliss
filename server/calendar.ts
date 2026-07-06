import { parse } from 'date-fns';

import { db } from './db';
import { calendarSettings, calendarEvents, type CalendarEvent as DBCalendarEvent } from '@shared/schema';
import { eq, desc, notInArray, sql } from 'drizzle-orm';

interface CalendarEvent {
  startDate: Date;
  endDate: Date;
  summary: string;
  uid: string;
}

interface AvailabilityCalendar {
  blockedDates: Date[];
  checkInDates: Date[];
  checkOutDates: Date[];
  events: CalendarEvent[];
  lastUpdated: Date;
}

export class CalendarService {
  private calendar: AvailabilityCalendar = {
    blockedDates: [],
    checkInDates: [],
    checkOutDates: [],
    events: [],
    lastUpdated: new Date()
  };
  
  private storedIcalUrl: string | null = null;
  private syncInterval: NodeJS.Timeout | null = null;
  private dailySyncInterval: NodeJS.Timeout | null = null;
  private isSyncing: boolean = false;

  constructor() {
    // Defer async initialization to prevent unhandled rejections crashing the process
    setTimeout(() => this.initialize(), 0);
  }

  private async initialize(): Promise<void> {
    try {
      await this.loadFromDatabase();
      if (this.storedIcalUrl) {
        console.log('Calendar loaded - triggering automatic sync on startup');
        try {
          await this.syncAirbnbCalendar(this.storedIcalUrl);
        } catch (syncError) {
          console.error('Failed to auto-sync calendar on startup (non-fatal):', syncError);
        }
      }
    } catch (error) {
      console.error('Failed to load calendar data during startup (non-fatal):', error);
      try {
        await this.setupDefaultSync();
      } catch (setupError) {
        console.error('Failed to setup default sync (non-fatal):', setupError);
      }
    }
  }

  /**
   * Load calendar data from database
   */
  private async loadFromDatabase(): Promise<void> {
    try {
      // Load calendar settings
      const [settings] = await db.select().from(calendarSettings).orderBy(desc(calendarSettings.id)).limit(1);
      
      if (settings) {
        this.storedIcalUrl = settings.icalUrl;
        this.calendar.lastUpdated = settings.lastSync || new Date();
        
        // If sync is active, restart it
        if (settings.isActive && settings.icalUrl) {
          this.setupDailySync(settings.icalUrl);
        }
      }

      // Load calendar events
      const events = await db.select().from(calendarEvents);
      this.calendar.events = events.map(event => ({
        startDate: new Date(event.startDate),
        endDate: new Date(event.endDate),
        summary: event.summary,
        uid: event.uid
      }));

      // Rebuild blocked dates from events
      this.rebuildBlockedDatesFromEvents();
      
    } catch (error) {
      console.error('Could not load calendar data from database:', error);
      // Initialize with empty calendar on database error
      this.calendar = {
        blockedDates: [],
        checkInDates: [],
        checkOutDates: [],
        events: [],
        lastUpdated: new Date()
      };
    }
  }

  /**
   * Save calendar data to database
   */
  private async saveToDatabase(): Promise<void> {
    try {
      // Save or update calendar settings
      if (this.storedIcalUrl) {
        // Check if settings exist
        const [existingSettings] = await db.select().from(calendarSettings).limit(1);
        
        if (existingSettings) {
          // Update existing settings
          await db.update(calendarSettings)
            .set({
              icalUrl: this.storedIcalUrl,
              isActive: this.dailySyncInterval !== null,
              lastSync: this.calendar.lastUpdated,
              updatedAt: new Date()
            })
            .where(eq(calendarSettings.id, existingSettings.id));
        } else {
          // Create new settings
          await db.insert(calendarSettings).values({
            icalUrl: this.storedIcalUrl,
            isActive: this.dailySyncInterval !== null,
            lastSync: this.calendar.lastUpdated
          });
        }
      }

      // Upsert events (insert or update on uid conflict - prevents duplicate key errors)
      if (this.calendar.events.length > 0) {
        const eventRows = this.calendar.events.map(event => ({
          uid: event.uid,
          summary: event.summary,
          startDate: event.startDate.toISOString().split('T')[0],
          endDate: event.endDate.toISOString().split('T')[0],
        }));
        
        await db.insert(calendarEvents)
          .values(eventRows)
          .onConflictDoUpdate({
            target: calendarEvents.uid,
            set: {
              summary: sql`excluded.summary`,
              startDate: sql`excluded.start_date`,
              endDate: sql`excluded.end_date`,
            }
          });
        
        // Remove Airbnb events no longer in the feed, but PRESERVE manual blocks (uid starts with 'manual-')
        const currentUids = this.calendar.events.map(e => e.uid);
        const allDbEvents = await db.select({ uid: calendarEvents.uid }).from(calendarEvents);
        const staleAirbnbUids = allDbEvents
          .map(e => e.uid)
          .filter(uid => !uid.startsWith('manual-') && !currentUids.includes(uid));
        if (staleAirbnbUids.length > 0) {
          await db.delete(calendarEvents).where(notInArray(calendarEvents.uid, [...currentUids, ...allDbEvents.map(e => e.uid).filter(u => u.startsWith('manual-'))]));
        }
      } else {
        // No events in Airbnb feed - only remove non-manual events
        await db.delete(calendarEvents).where(
          sql`uid NOT LIKE 'manual-%'`
        );
      }
      
    } catch (error) {
      console.error('Failed to save calendar data to database:', error);
    }
  }

  /**
   * Check if a "Not available" block is long-term (7+ days) and should be treated as blocked
   */
  private isLongTermBlock(startDate: Date, endDate: Date): boolean {
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 5; // Consider 5+ day blocks as actual bookings
  }

  /**
   * Rebuild blocked dates from loaded events
   */
  private rebuildBlockedDatesFromEvents(): void {
    this.calendar.blockedDates = [];
    this.calendar.checkInDates = [];
    this.calendar.checkOutDates = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (const event of this.calendar.events) {
      // Block dates for actual guest reservations AND manually blocked ranges
      const isReservation = event.summary.includes('Reserved') || event.summary.includes('Reservation');
      const isManualBlock = event.uid.startsWith('manual-');
      
      if (isReservation || isManualBlock) {
        // Get blocked dates EXCLUDING first and last day (they get half-day treatment)
        const blockedDates = this.getDateRangeExcludingBoundaries(event.startDate, event.endDate);
        this.calendar.blockedDates.push(...blockedDates);
        
        // Track check-in date (first day of booking) - shows as half available morning
        if (event.startDate >= today) {
          this.calendar.checkInDates.push(event.startDate);
        }
        
        // Track check-out date (last day of booking) - shows as half available afternoon
        // Only add if end date is different from start date (multi-day booking)
        if (event.endDate > event.startDate) {
          this.calendar.checkOutDates.push(event.endDate);
        }
      }
      // Skip ALL "Not available" blocks - owner accepts direct bookings regardless of Airbnb status
    }
  }
  
  /**
   * Get date range EXCLUDING the first and last days (for half-day boundary treatment)
   */
  private getDateRangeExcludingBoundaries(startDate: Date, endDate: Date): Date[] {
    const dates: Date[] = [];
    
    // Normalize to local midnight to avoid timezone issues
    const start = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
    const end = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
    
    // Start from the day AFTER check-in
    const current = new Date(start);
    current.setDate(current.getDate() + 1);
    
    // Loop until we reach check-out day (exclusive)
    while (current.getTime() < end.getTime()) {
      dates.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    
    return dates;
  }

  /**
   * Fetch and parse Airbnb iCal calendar feed
   */
  async syncAirbnbCalendar(icalUrl: string): Promise<void> {
    // Prevent concurrent syncs - skip if already syncing
    if (this.isSyncing) {
      console.log('Calendar sync already in progress, skipping duplicate sync');
      return;
    }
    
    this.isSyncing = true;
    try {
      const response = await fetch(icalUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch calendar: ${response.status}`);
      }
      
      const icalData = await response.text();
      await this.parseICalData(icalData);
      this.calendar.lastUpdated = new Date();
      this.storedIcalUrl = icalUrl;
      
      // Save to database after successful sync
      await this.saveToDatabase();

    } catch (error) {
      console.error('Calendar sync failed:', error);
      throw error;
    } finally {
      this.isSyncing = false;
    }
  }

  /**
   * Parse iCal data and extract booking events
   */
  private async parseICalData(icalData: string): Promise<void> {
    const events: CalendarEvent[] = [];
    
    // Split into individual events
    const eventBlocks = icalData.split('BEGIN:VEVENT');
    
    for (let i = 1; i < eventBlocks.length; i++) {
      const eventBlock = eventBlocks[i];
      const event = this.parseEvent(eventBlock);
      
      if (event) {
        // Only store actual reservations - skip all "Not available" blocks
        // Direct bookings can always be accepted regardless of Airbnb availability settings
        const isNotAvailable = event.summary.toLowerCase().includes('not available');
        if (!isNotAvailable) {
          events.push(event);
        }
      }
    }
    
    // Reload manual blocks from DB and merge with Airbnb events
    try {
      const manualBlocks = await db.select().from(calendarEvents).where(sql`uid LIKE 'manual-%'`);
      for (const block of manualBlocks) {
        events.push({
          startDate: new Date(block.startDate),
          endDate: new Date(block.endDate),
          summary: block.summary,
          uid: block.uid,
        });
      }
    } catch (e) {
      console.error('Failed to reload manual blocks during parse:', e);
    }
    this.calendar.events = events;
    this.rebuildBlockedDatesFromEvents();
  }

  /**
   * Parse individual event from iCal block
   */
  private parseEvent(eventBlock: string): CalendarEvent | null {
    try {
      const lines = eventBlock.split('\n');
      let startDate: Date | null = null;
      let endDate: Date | null = null;
      let summary = '';
      let uid = '';

      for (const line of lines) {
        const trimmedLine = line.trim();
        
        if (trimmedLine.startsWith('DTSTART')) {
          const dateStr = trimmedLine.split(':')[1];
          startDate = this.parseICalDate(dateStr);
        } else if (trimmedLine.startsWith('DTEND')) {
          const dateStr = trimmedLine.split(':')[1];
          endDate = this.parseICalDate(dateStr);
        } else if (trimmedLine.startsWith('SUMMARY:')) {
          summary = trimmedLine.substring(8);
        } else if (trimmedLine.startsWith('UID:')) {
          uid = trimmedLine.substring(4);
        }
      }

      if (startDate && endDate) {
        return { startDate, endDate, summary, uid };
      }
      
      return null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Parse iCal date format (YYYYMMDD or YYYYMMDDTHHMMSSZ)
   */
  private parseICalDate(dateStr: string): Date {
    // Remove any timezone info for simplicity
    const cleanDateStr = dateStr.replace(/T.*$/, '');
    
    if (cleanDateStr.length === 8) {
      // YYYYMMDD format
      const year = parseInt(cleanDateStr.substring(0, 4));
      const month = parseInt(cleanDateStr.substring(4, 6)) - 1; // Month is 0-indexed
      const day = parseInt(cleanDateStr.substring(6, 8));
      return new Date(year, month, day);
    }
    
    throw new Error(`Invalid date format: ${dateStr}`);
  }

  /**
   * Get all dates between start and end date (start inclusive, end exclusive)
   * This matches hotel booking convention where check-out date is available
   */
  private getDateRange(startDate: Date, endDate: Date): Date[] {
    const dates: Date[] = [];
    const currentDate = new Date(startDate);
    
    // Use < instead of <= to exclude check-out date
    while (currentDate < endDate) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return dates;
  }

  /**
   * Get all dates between start and end date (both inclusive)
   * Used for "Not available" blocks that should block the entire period
   */
  private getDateRangeInclusive(startDate: Date, endDate: Date): Date[] {
    const dates: Date[] = [];
    const currentDate = new Date(startDate);
    
    // Use <= to include the end date
    while (currentDate <= endDate) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return dates;
  }

  /**
   * Check if a date is available (not blocked)
   */
  isDateAvailable(date: Date): boolean {
    const dateStr = this.formatDateForComparison(date);
    return !this.calendar.blockedDates.some(blockedDate => 
      this.formatDateForComparison(blockedDate) === dateStr
    );
  }

  /**
   * Check if a date range is available
   * Smart logic: A date range is available if:
   * 1. No dates in the range are blocked by actual reservations
   * 2. Check-in date can be the same as someone's check-out date
   * 3. Check-out date can be the same as someone's check-in date
   */
  isDateRangeAvailable(startDate: Date, endDate: Date): boolean {
    // Get all checkout dates (when people leave)
    const checkoutDates = this.getCheckOutDates();
    const checkoutDateStrings = checkoutDates.map(date => this.formatDateForComparison(date));
    
    // Get all checkin dates (when people arrive)  
    const checkinDates = this.getCheckInDates();
    const checkinDateStrings = checkinDates.map(date => this.formatDateForComparison(date));
    
    // Check our check-in date
    const startDateStr = this.formatDateForComparison(startDate);
    const endDateStr = this.formatDateForComparison(endDate);
    
    // Check if our check-in date is blocked
    const isStartBlocked = this.calendar.blockedDates.some(blockedDate => 
      this.formatDateForComparison(blockedDate) === startDateStr
    );
    
    // If start date is blocked, check if someone checks out on that date
    if (isStartBlocked && !checkoutDateStrings.includes(startDateStr)) {
      return false; // Start date is blocked and no one checks out
    }
    
    // Check all dates in our stay (excluding checkout date per hotel convention)
    const dates = this.getDateRange(startDate, endDate);
    
    for (const date of dates) {
      const dateStr = this.formatDateForComparison(date);
      
      // Skip the start date - we already checked it above
      if (dateStr === startDateStr) {
        continue;
      }
      
      // Check if this date is blocked by a reservation
      const isBlockedByReservation = this.calendar.blockedDates.some(blockedDate => {
        const blockedDateStr = this.formatDateForComparison(blockedDate);
        return blockedDateStr === dateStr;
      });
      
      if (isBlockedByReservation) {
        // This date is blocked and it's not our check-in date
        return false;
      }
    }
    
    // Additional check: if our checkout date is when someone checks in, that's OK
    // (This is already handled by getDateRange excluding the end date, but let's be explicit)
    
    return true;
  }

  /**
   * Get all blocked dates
   */
  getBlockedDates(): Date[] {
    return [...this.calendar.blockedDates];
  }

  /**
   * Get all check-in dates
   */
  getCheckInDates(): Date[] {
    return [...this.calendar.checkInDates];
  }

  /**
   * Get all checkout dates (end dates of bookings)
   */
  getCheckOutDates(): Date[] {
    return [...this.calendar.checkOutDates];
  }

  /**
   * Get calendar events
   */
  getEvents(): CalendarEvent[] {
    return [...this.calendar.events];
  }

  /**
   * Get cleaning schedule with cleaning reminders before each booking period
   */
  getCleaningSchedule(): Array<{
    date: Date;
    type: 'cleaning' | 'checkin' | 'checkout';
    event?: CalendarEvent;
    message?: string;
  }> {
    const schedule: Array<{
      date: Date;
      type: 'cleaning' | 'checkin' | 'checkout';
      event?: CalendarEvent;
      message?: string;
    }> = [];

    // Sort events by start date
    const sortedEvents = [...this.calendar.events].sort((a, b) => 
      a.startDate.getTime() - b.startDate.getTime()
    );

    // Group consecutive bookings
    const bookingPeriods: CalendarEvent[][] = [];
    let currentPeriod: CalendarEvent[] = [];
    let lastEndDate: Date | null = null;

    for (const event of sortedEvents) {
      if (lastEndDate && event.startDate.getTime() === lastEndDate.getTime()) {
        // Consecutive booking - add to current period
        currentPeriod.push(event);
      } else {
        // New period starts
        if (currentPeriod.length > 0) {
          bookingPeriods.push(currentPeriod);
        }
        currentPeriod = [event];
      }
      lastEndDate = event.endDate;
    }
    
    // Add the last period
    if (currentPeriod.length > 0) {
      bookingPeriods.push(currentPeriod);
    }

    // Generate cleaning reminders and schedule
    for (const period of bookingPeriods) {
      const firstBooking = period[0];
      const lastBooking = period[period.length - 1];
      
      // Add cleaning reminder before first booking
      const cleaningDate = new Date(firstBooking.startDate);
      const cleaningMessage = `🧹 *Gracias por limpiar antes de: ${this.formatSpanishDate(firstBooking.startDate)} antes de las 16:00*⏰`;
      
      schedule.push({
        date: cleaningDate,
        type: 'cleaning',
        event: firstBooking,
        message: cleaningMessage
      });

      // Add all bookings in this period
      for (const booking of period) {
        schedule.push({
          date: booking.startDate,
          type: 'checkin',
          event: booking
        });
        
        schedule.push({
          date: booking.endDate,
          type: 'checkout',
          event: booking
        });
      }
    }

    // Sort by date
    return schedule.sort((a, b) => a.date.getTime() - b.date.getTime());
  }

  /**
   * Format date in Spanish format for cleaning messages
   */
  private formatSpanishDate(date: Date): string {
    const days = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
    const months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 
                   'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
    
    const dayName = days[date.getDay()];
    const day = date.getDate();
    const month = months[date.getMonth()];
    
    return `${dayName}, ${day} de ${month}`;
  }

  /**
   * Get last sync time
   */
  getLastUpdated(): Date {
    return this.calendar.lastUpdated;
  }

  /**
   * Setup default sync with Airbnb URL if no settings exist
   */
  private async setupDefaultSync(): Promise<void> {
    try {
      const defaultUrl = 'https://www.airbnb.com/calendar/ical/1437724898890828336.ics?s=fa161fdacdd13bf8dd30a6eaf26e3c98';
      
      // Check if settings already exist
      const [existingSettings] = await db.select().from(calendarSettings).limit(1);
      
      if (!existingSettings) {

        
        // Create default settings
        await db.insert(calendarSettings).values({
          icalUrl: defaultUrl,
          isActive: true,
          lastSync: new Date(),
          createdAt: new Date(),
          updatedAt: new Date()
        });
        
        // Store the URL
        this.storedIcalUrl = defaultUrl;
        
        // Trigger initial sync
        await this.syncAirbnbCalendar(defaultUrl);
        
        // Setup daily sync
        this.setupDailySync(defaultUrl);
        
        console.log('Default calendar sync configured and initial sync completed');
      }
    } catch (error) {
      console.error('Failed to setup default calendar sync:', error);
    }
  }

  /**
   * Format date for consistent comparison
   */
  private formatDateForComparison(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  /**
   * Add custom blocked dates (for manual blocking)
   */
  addBlockedDates(dates: Date[]): void {
    this.calendar.blockedDates.push(...dates);
  }

  /**
   * Remove blocked dates
   */
  removeBlockedDates(dates: Date[]): void {
    const datesToRemove = dates.map(date => this.formatDateForComparison(date));
    this.calendar.blockedDates = this.calendar.blockedDates.filter(
      blockedDate => !datesToRemove.includes(this.formatDateForComparison(blockedDate))
    );
  }

  /**
   * Add a manual blocked date range (persisted to DB, survives iCal syncs)
   */
  async addManualBlock(startDate: string, endDate: string, label: string): Promise<{ uid: string }> {
    const uid = `manual-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    await db.insert(calendarEvents).values({
      uid,
      summary: label || 'Owner Block',
      startDate,
      endDate,
    });
    // Add to in-memory
    this.calendar.events.push({ startDate: new Date(startDate), endDate: new Date(endDate), summary: label || 'Owner Block', uid });
    this.rebuildBlockedDatesFromEvents();
    return { uid };
  }

  /**
   * Remove a manual blocked date range by uid
   */
  async removeManualBlock(uid: string): Promise<void> {
    if (!uid.startsWith('manual-')) throw new Error('Not a manual block');
    await db.delete(calendarEvents).where(eq(calendarEvents.uid, uid));
    this.calendar.events = this.calendar.events.filter(e => e.uid !== uid);
    this.rebuildBlockedDatesFromEvents();
  }

  /**
   * Get all manual blocks
   */
  async getManualBlocks(): Promise<{ uid: string; summary: string; startDate: string; endDate: string }[]> {
    const rows = await db.select().from(calendarEvents).where(sql`uid LIKE 'manual-%'`);
    return rows.map(r => ({
      uid: r.uid,
      summary: r.summary,
      startDate: typeof r.startDate === 'string' ? r.startDate : (r.startDate as Date).toISOString().split('T')[0],
      endDate: typeof r.endDate === 'string' ? r.endDate : (r.endDate as Date).toISOString().split('T')[0],
    }));
  }

  /**
   * Set up automatic daily synchronization at 2:00 AM CET
   * @param icalUrl - The Airbnb iCal URL to sync with
   */
  setupDailySync(icalUrl: string): void {
    this.storedIcalUrl = icalUrl;
    
    // Save settings to database
    this.saveToDatabase();
    
    // Clear existing interval if any
    if (this.dailySyncInterval) {
      clearInterval(this.dailySyncInterval);
    }

    // Start the robust daily sync timer
    this.startRobustDailySync();
  }

  /**
   * Start robust daily synchronization using check-based approach
   */
  private startRobustDailySync(): void {
    // Check every hour if it's time to sync
    this.dailySyncInterval = setInterval(() => {
      this.checkAndPerformDailySync();
    }, 60 * 60 * 1000); // Check every hour
    
    // Also check immediately on startup
    this.checkAndPerformDailySync();
  }

  /**
   * Check if it's time to perform daily sync and execute if needed
   */
  private async checkAndPerformDailySync(): Promise<void> {
    if (!this.storedIcalUrl) {
      return;
    }

    try {
      // Get current time in CET timezone
      const now = new Date();
      const cetTime = new Date(now.toLocaleString("en-US", { timeZone: "Europe/Amsterdam" }));
      
      // Check if we're in the 2:00 AM CET hour (2:00-2:59 AM)
      const currentHour = cetTime.getHours();
      const currentMinutes = cetTime.getMinutes();
      
      if (currentHour === 2) {
        // Check if we already synced today
        const lastSync = this.calendar.lastUpdated;
        const today = new Date(cetTime.toDateString());
        const lastSyncDate = new Date(lastSync.toDateString());
        
        // Only sync if we haven't synced today yet
        if (lastSyncDate < today) {
          await this.performDailySync();
        }
      }
    } catch (error) {
      console.error('Error checking daily sync time:', error);
    }
  }

  /**
   * Perform the daily sync operation
   */
  private async performDailySync(): Promise<void> {
    if (!this.storedIcalUrl) {
      return;
    }

    try {
      await this.syncAirbnbCalendar(this.storedIcalUrl);
    } catch (error) {
      console.error('Daily sync failed:', error);
      
      // Try again in 1 hour on failure
      setTimeout(() => {
        this.performDailySync();
      }, 60 * 60 * 1000);
    }
  }

  /**
   * Stop automatic daily synchronization
   */
  stopDailySync(): void {
    if (this.dailySyncInterval) {
      clearInterval(this.dailySyncInterval);
      this.dailySyncInterval = null;
      
      // Update database to reflect sync is stopped
      this.saveToDatabase();
    }
  }

  /**
   * Get current sync status
   */
  getSyncStatus(): { 
    isActive: boolean; 
    lastSync: Date; 
    nextSync: Date | null;
    syncUrl: string | null;
  } {
    // Check if daily sync is active - it's active if we have a stored URL and interval is set
    const isActive = !!this.storedIcalUrl && !!this.dailySyncInterval;
    
    let nextSync: Date | null = null;
    if (isActive) {
      // Calculate next 2:00 AM CET
      const now = new Date();
      const cetTime = new Date(now.toLocaleString("en-US", { timeZone: "Europe/Amsterdam" }));
      
      nextSync = new Date(cetTime);
      nextSync.setHours(2, 0, 0, 0);
      
      // If 2:00 AM has passed today, schedule for tomorrow
      if (nextSync <= cetTime) {
        nextSync.setDate(nextSync.getDate() + 1);
      }
      
      // Convert back to server timezone for display
      nextSync = new Date(nextSync.toLocaleString());
    }

    return {
      isActive,
      lastSync: this.calendar.lastUpdated,
      nextSync,
      syncUrl: this.storedIcalUrl
    };
  }
}

export const calendarService = new CalendarService();