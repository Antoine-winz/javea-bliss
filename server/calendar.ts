import { isStayAvailable } from '@shared/availability';
import { isValidBookingDate } from '@shared/booking-rules';

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
  
  private ready = false;
  isReady(): boolean { return this.ready; }

  private storedIcalUrl: string | null = null;
  private dailySyncInterval: NodeJS.Timeout | null = null;
  private isSyncing: boolean = false;

  constructor() {
    if (process.env.NODE_ENV === "test") return;
    // Defer async initialization to prevent unhandled rejections crashing the process
    setTimeout(() => this.initialize(), 0);
  }

  private async initialize(): Promise<void> {
    try {
      await this.loadFromDatabase();
      if (!this.storedIcalUrl) await this.setupDefaultSync();
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
      this.ready = true;
      
    } catch (error) {
      console.error('Could not load calendar data from database:', error);
      throw error;
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
   * Rebuild blocked dates from loaded events
   */
  private rebuildBlockedDatesFromEvents(): void {
    this.calendar.blockedDates = [];
    this.calendar.checkInDates = [];
    this.calendar.checkOutDates = [];
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    for (const event of this.calendar.events) {
      // Block dates for actual guest reservations AND manually blocked ranges
      const isReservation = !/not available/i.test(event.summary);
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
    const start = new Date(Date.UTC(startDate.getUTCFullYear(), startDate.getUTCMonth(), startDate.getUTCDate()));
    const end = new Date(Date.UTC(endDate.getUTCFullYear(), endDate.getUTCMonth(), endDate.getUTCDate()));
    
    // Start from the day AFTER check-in
    const current = new Date(start);
    current.setUTCDate(current.getUTCDate() + 1);
    
    // Loop until we reach check-out day (exclusive)
    while (current.getTime() < end.getTime()) {
      dates.push(new Date(current));
      current.setUTCDate(current.getUTCDate() + 1);
    }
    
    return dates;
  }

  /**
   * Fetch and parse Airbnb iCal calendar feed
   */
  async syncAirbnbCalendar(icalUrl: string): Promise<void> {
    // Prevent concurrent syncs - skip if already syncing
    if (this.isSyncing) {
      throw new Error('Calendar sync already in progress');
    }
    
    this.isSyncing = true;
    try {
      const url = new URL(icalUrl);
      if (url.protocol !== 'https:' || url.username || url.password || url.port ||
          !/^(www\.)?airbnb\.(com|es|fr|de|it|nl|co\.uk)$/.test(url.hostname) ||
          !url.pathname.startsWith('/calendar/ical/')) {
        throw new Error('Only HTTPS Airbnb calendar export URLs are supported');
      }
      const response = await fetch(url, { signal: AbortSignal.timeout(15_000), redirect: 'error' });
      if (!response.ok) {
        throw new Error(`Failed to fetch calendar: ${response.status}`);
      }
      
      const icalData = await response.text();
      if (icalData.length > 2_000_000 || !icalData.includes('BEGIN:VCALENDAR') || !icalData.includes('END:VCALENDAR')) {
        throw new Error('Invalid calendar feed');
      }
      await this.parseICalData(icalData);
      this.calendar.lastUpdated = new Date();
      this.storedIcalUrl = icalUrl;
      this.ready = true;
      
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
      events.push(...this.calendar.events.filter(event => event.uid.startsWith('manual-')));
    }
    this.calendar.events = events;
    this.rebuildBlockedDatesFromEvents();
  }

  /**
   * Parse individual event from iCal block
   */
  private parseEvent(eventBlock: string): CalendarEvent | null {
    try {
      const lines = eventBlock.replace(/\r?\n[ \t]/g, '').split('\n');
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

      if (startDate && endDate && uid && endDate > startDate) {
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
      const dateOnly = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      if (!isValidBookingDate(dateOnly)) throw new Error("Invalid calendar date");
      return new Date(Date.UTC(year, month, day));
    }
    
    throw new Error(`Invalid date format: ${dateStr}`);
  }

  /**
   * Check if a date range is available
   * Smart logic: A date range is available if:
   * 1. No dates in the range are blocked by actual reservations
   * 2. Check-in date can be the same as someone's check-out date
   * 3. Check-out date can be the same as someone's check-in date
   */
  isDateRangeAvailable(startDate: Date, endDate: Date): boolean {
    return isStayAvailable(startDate, endDate, this.calendar.events);
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
      const defaultUrl = process.env.AIRBNB_ICAL_URL;
      if (!defaultUrl) return;
      
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