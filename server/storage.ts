import { users, type User, type InsertUser, type BookingInquiry, type InsertBookingInquiry, type PromotionalOffer, type InsertPromotionalOffer, promotionalOffers, bookingInquiries, calendarSettings, calendarEvents, type CalendarSettings, type InsertCalendarSettings, type CalendarEvent, type InsertCalendarEvent, visitorStats, visitorDetails, type VisitorStats, type InsertVisitorStats, type VisitorDetails, type InsertVisitorDetails, guestReviews, type GuestReview, type InsertGuestReview, dailyRates, type DailyRate, type InsertDailyRate } from "@shared/schema";
import { db } from "./db";
import { eq, gte, lte, and, inArray, sql, asc } from "drizzle-orm";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createBookingInquiry(inquiry: InsertBookingInquiry): Promise<BookingInquiry>;
  createPromotionalOffer(offer: InsertPromotionalOffer): Promise<PromotionalOffer>;
  getActivePromotionalOffers(): Promise<PromotionalOffer[]>;
  getPromotionalOfferById(id: number): Promise<PromotionalOffer | undefined>;
  updatePromotionalOffer(id: number, updates: Partial<InsertPromotionalOffer>): Promise<PromotionalOffer | undefined>;
  deletePromotionalOffer(id: number): Promise<boolean>;
  
  // Calendar methods
  getCalendarSettings(): Promise<CalendarSettings | undefined>;
  upsertCalendarSettings(settings: InsertCalendarSettings): Promise<CalendarSettings>;
  saveCalendarEvents(events: InsertCalendarEvent[]): Promise<void>;
  getCalendarEvents(): Promise<CalendarEvent[]>;
  clearCalendarEvents(): Promise<void>;
  
  // Visitor tracking methods
  trackVisitor(visitor: InsertVisitorDetails): Promise<void>;
  getVisitorStats(): Promise<{totalVisits: number, currentWeekVisits: number}>;
  
  // Guest reviews methods
  createGuestReview(review: InsertGuestReview): Promise<GuestReview>;
  getAllGuestReviews(): Promise<GuestReview[]>;
  getVisibleGuestReviews(): Promise<GuestReview[]>;
  getGuestReviewById(id: number): Promise<GuestReview | undefined>;
  updateGuestReview(id: number, updates: Partial<InsertGuestReview>): Promise<GuestReview | undefined>;
  deleteGuestReview(id: number): Promise<boolean>;
  
  // Daily rates methods
  getRatesByDateRange(startDate: string, endDate: string): Promise<DailyRate[]>;
  upsertDailyRates(rates: InsertDailyRate[]): Promise<void>;
  deleteDailyRates(dates: string[]): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async createBookingInquiry(insertInquiry: InsertBookingInquiry): Promise<BookingInquiry> {
    const [inquiry] = await db
      .insert(bookingInquiries)
      .values(insertInquiry)
      .returning();
    return inquiry;
  }

  async createPromotionalOffer(insertOffer: InsertPromotionalOffer): Promise<PromotionalOffer> {
    try {
      const [created] = await db.insert(promotionalOffers).values(insertOffer).returning();
      return created;
    } catch (error) {
      console.error("Error creating promotional offer:", error);
      throw error;
    }
  }

  async getActivePromotionalOffers(): Promise<PromotionalOffer[]> {
    try {
      const offers = await db.select().from(promotionalOffers).where(eq(promotionalOffers.isActive, true));
      return offers;
    } catch (error) {
      console.error("Error fetching active promotional offers:", error);
      return [];
    }
  }

  async getPromotionalOfferById(id: number): Promise<PromotionalOffer | undefined> {
    try {
      const result = await db.select().from(promotionalOffers).where(eq(promotionalOffers.id, id));
      return result[0];
    } catch (error) {
      console.error("Error fetching promotional offer by ID:", error);
      return undefined;
    }
  }

  async updatePromotionalOffer(id: number, updates: Partial<InsertPromotionalOffer>): Promise<PromotionalOffer | undefined> {
    try {
      const [updated] = await db.update(promotionalOffers)
        .set({ ...updates, updatedAt: new Date() })
        .where(eq(promotionalOffers.id, id))
        .returning();
      return updated;
    } catch (error) {
      console.error("Error updating promotional offer:", error);
      return undefined;
    }
  }

  async deletePromotionalOffer(id: number): Promise<boolean> {
    try {
      const result = await db.delete(promotionalOffers)
        .where(eq(promotionalOffers.id, id));
      return (result.rowCount || 0) > 0;
    } catch (error) {
      console.error("Error deleting promotional offer:", error);
      return false;
    }
  }

  // Calendar methods
  async getCalendarSettings(): Promise<CalendarSettings | undefined> {
    try {
      const [settings] = await db.select().from(calendarSettings).orderBy(calendarSettings.id).limit(1);
      return settings;
    } catch (error) {
      console.error("Error fetching calendar settings:", error);
      return undefined;
    }
  }

  async upsertCalendarSettings(settings: InsertCalendarSettings): Promise<CalendarSettings> {
    try {
      const existing = await this.getCalendarSettings();
      if (existing) {
        const [updated] = await db.update(calendarSettings)
          .set({ ...settings, updatedAt: new Date() })
          .where(eq(calendarSettings.id, existing.id))
          .returning();
        return updated;
      } else {
        const [created] = await db.insert(calendarSettings).values(settings).returning();
        return created;
      }
    } catch (error) {
      console.error("Error upserting calendar settings:", error);
      throw error;
    }
  }

  async saveCalendarEvents(events: InsertCalendarEvent[]): Promise<void> {
    try {
      if (events.length === 0) return;
      
      // Clear existing events first
      await this.clearCalendarEvents();
      
      // Insert new events
      await db.insert(calendarEvents).values(events);
    } catch (error) {
      console.error("Error saving calendar events:", error);
      throw error;
    }
  }

  async getCalendarEvents(): Promise<CalendarEvent[]> {
    try {
      return await db.select().from(calendarEvents);
    } catch (error) {
      console.error("Error fetching calendar events:", error);
      return [];
    }
  }

  async clearCalendarEvents(): Promise<void> {
    try {
      await db.delete(calendarEvents);
    } catch (error) {
      console.error("Error clearing calendar events:", error);
      throw error;
    }
  }

  // Visitor tracking methods
  async trackVisitor(visitor: InsertVisitorDetails): Promise<void> {
    try {
      await db.insert(visitorDetails).values(visitor);
    } catch (error) {
      console.error("Error tracking visitor:", error);
    }
  }

  async getVisitorStats(): Promise<{totalVisits: number, currentWeekVisits: number}> {
    try {
      const totalResult = await db.select().from(visitorDetails);
      const totalVisits = totalResult.length;
      
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      
      const weeklyResult = await db.select().from(visitorDetails).where(
        eq(visitorDetails.visitDate, oneWeekAgo.toISOString().split('T')[0])
      );
      const currentWeekVisits = weeklyResult.length;
      
      return { totalVisits, currentWeekVisits };
    } catch (error) {
      console.error("Error fetching visitor stats:", error);
      return { totalVisits: 0, currentWeekVisits: 0 };
    }
  }

  // Guest reviews methods
  async createGuestReview(insertReview: InsertGuestReview): Promise<GuestReview> {
    try {
      const [review] = await db.insert(guestReviews).values(insertReview).returning();
      return review;
    } catch (error) {
      console.error("Error creating guest review:", error);
      throw error;
    }
  }

  async getAllGuestReviews(): Promise<GuestReview[]> {
    try {
      return await db.select().from(guestReviews);
    } catch (error) {
      console.error("Error fetching all guest reviews:", error);
      return [];
    }
  }

  async getVisibleGuestReviews(): Promise<GuestReview[]> {
    try {
      return await db.select().from(guestReviews).where(eq(guestReviews.isVisible, true));
    } catch (error) {
      console.error("Error fetching visible guest reviews:", error);
      return [];
    }
  }

  async getGuestReviewById(id: number): Promise<GuestReview | undefined> {
    try {
      const [review] = await db.select().from(guestReviews).where(eq(guestReviews.id, id));
      return review || undefined;
    } catch (error) {
      console.error("Error fetching guest review by ID:", error);
      return undefined;
    }
  }

  async updateGuestReview(id: number, updates: Partial<InsertGuestReview>): Promise<GuestReview | undefined> {
    try {
      const [updated] = await db.update(guestReviews)
        .set({ ...updates, updatedAt: new Date() })
        .where(eq(guestReviews.id, id))
        .returning();
      return updated || undefined;
    } catch (error) {
      console.error("Error updating guest review:", error);
      return undefined;
    }
  }

  async deleteGuestReview(id: number): Promise<boolean> {
    try {
      const result = await db.delete(guestReviews).where(eq(guestReviews.id, id));
      return true;
    } catch (error) {
      console.error("Error deleting guest review:", error);
      return false;
    }
  }

  async getRatesByDateRange(startDate: string, endDate: string): Promise<DailyRate[]> {
    try {
      const rates = await db.select()
        .from(dailyRates)
        .where(and(
          gte(dailyRates.date, startDate),
          lte(dailyRates.date, endDate)
        ))
        .orderBy(asc(dailyRates.date));
      return rates;
    } catch (error) {
      console.error("Error fetching daily rates by date range:", error);
      return [];
    }
  }

  async upsertDailyRates(rates: InsertDailyRate[]): Promise<void> {
    try {
      if (rates.length === 0) return;
      
      await db.insert(dailyRates)
        .values(rates)
        .onConflictDoUpdate({
          target: dailyRates.date,
          set: {
            rate: sql`EXCLUDED.rate`,
            updatedAt: new Date()
          }
        });
    } catch (error) {
      console.error("Error upserting daily rates:", error);
      throw error;
    }
  }

  async deleteDailyRates(dates: string[]): Promise<void> {
    try {
      if (dates.length === 0) return;
      
      await db.delete(dailyRates)
        .where(inArray(dailyRates.date, dates));
    } catch (error) {
      console.error("Error deleting daily rates:", error);
      throw error;
    }
  }
}

export const storage = new DatabaseStorage();
