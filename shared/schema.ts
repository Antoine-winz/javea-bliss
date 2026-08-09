import { pgTable, text, serial, integer, boolean, date, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table (kept from template)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Booking inquiries table
export const bookingInquiries = pgTable("booking_inquiries", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  checkIn: text("check_in").notNull(),
  checkOut: text("check_out").notNull(),
  guests: text("guests").notNull(),
  phone: text("phone").notNull(),
  message: text("message"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const bookingInquirySchema = createInsertSchema(bookingInquiries).pick({
  name: true,
  email: true,
  checkIn: true,
  checkOut: true,
  guests: true,
  phone: true,
  message: true,
});

export type InsertBookingInquiry = z.infer<typeof bookingInquirySchema>;
export type BookingInquiry = typeof bookingInquiries.$inferSelect;

// Calendar sync settings table
export const calendarSettings = pgTable("calendar_settings", {
  id: serial("id").primaryKey(),
  icalUrl: text("ical_url"),
  isActive: boolean("is_active").default(false),
  lastSync: timestamp("last_sync"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Calendar events table
export const calendarEvents = pgTable("calendar_events", {
  id: serial("id").primaryKey(),
  uid: text("uid").notNull().unique(),
  summary: text("summary").notNull(),
  startDate: date("start_date").notNull(),
  endDate: date("end_date").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertCalendarSettingsSchema = createInsertSchema(calendarSettings).pick({
  icalUrl: true,
  isActive: true,
});

export const insertCalendarEventSchema = createInsertSchema(calendarEvents).pick({
  uid: true,
  summary: true,
  startDate: true,
  endDate: true,
});

export type InsertCalendarSettings = z.infer<typeof insertCalendarSettingsSchema>;
export type CalendarSettings = typeof calendarSettings.$inferSelect;
export type InsertCalendarEvent = z.infer<typeof insertCalendarEventSchema>;
export type CalendarEvent = typeof calendarEvents.$inferSelect;

// Visitor tracking table
export const visitorStats = pgTable("visitor_stats", {
  id: serial("id").primaryKey(),
  visitDate: date("visit_date").notNull(),
  visitCount: integer("visit_count").default(1),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Detailed visitor tracking table
export const visitorDetails = pgTable("visitor_details", {
  id: serial("id").primaryKey(),
  visitDate: date("visit_date").notNull(),
  country: text("country"),
  countryCode: text("country_code"),
  referrer: text("referrer"),
  referrerDomain: text("referrer_domain"),
  userAgent: text("user_agent"),
  ip: text("ip"),
  visitedAt: timestamp("visited_at").defaultNow(),
});

export const insertVisitorStatsSchema = createInsertSchema(visitorStats).pick({
  visitDate: true,
  visitCount: true,
});

export const insertVisitorDetailsSchema = createInsertSchema(visitorDetails).pick({
  visitDate: true,
  country: true,
  countryCode: true,
  referrer: true,
  referrerDomain: true,
  userAgent: true,
  ip: true,
});

export type InsertVisitorStats = z.infer<typeof insertVisitorStatsSchema>;
export type VisitorStats = typeof visitorStats.$inferSelect;
export type InsertVisitorDetails = z.infer<typeof insertVisitorDetailsSchema>;
export type VisitorDetails = typeof visitorDetails.$inferSelect;

// Promotional offers table
export const promotionalOffers = pgTable("promotional_offers", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  startDate: date("start_date").notNull(),
  endDate: date("end_date").notNull(),
  originalPrice: integer("original_price").notNull(),
  discountedPrice: integer("discounted_price").notNull(),
  discountPercentage: integer("discount_percentage").notNull(),
  validUntil: timestamp("valid_until").notNull(),
  language: text("language").notNull().default("en"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertPromotionalOfferSchema = createInsertSchema(promotionalOffers).pick({
  title: true,
  description: true,
  startDate: true,
  endDate: true,
  originalPrice: true,
  discountedPrice: true,
  discountPercentage: true,
  validUntil: true,
  language: true,
  isActive: true,
});

export type InsertPromotionalOffer = z.infer<typeof insertPromotionalOfferSchema>;
export type PromotionalOffer = typeof promotionalOffers.$inferSelect;

// Guest reviews table
export const guestReviews = pgTable("guest_reviews", {
  id: serial("id").primaryKey(),
  guestName: text("guest_name").notNull(),
  country: text("country"),
  stayDate: text("stay_date"),
  rating: integer("rating").notNull(), // 1-5 stars
  reviewText: text("review_text").notNull(),
  language: text("language").notNull().default("en"),
  isVisible: boolean("is_visible").default(true),
  isVerified: boolean("is_verified").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertGuestReviewSchema = createInsertSchema(guestReviews).pick({
  guestName: true,
  country: true,
  stayDate: true,
  rating: true,
  reviewText: true,
  language: true,
  isVisible: true,
  isVerified: true,
});

export type InsertGuestReview = z.infer<typeof insertGuestReviewSchema>;
export type GuestReview = typeof guestReviews.$inferSelect;

// Daily rates table for custom pricing
export const dailyRates = pgTable("daily_rates", {
  id: serial("id").primaryKey(),
  date: date("date").notNull().unique(),
  rate: integer("rate").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertDailyRateSchema = createInsertSchema(dailyRates).pick({
  date: true,
  rate: true,
});

export type InsertDailyRate = z.infer<typeof insertDailyRateSchema>;
export type DailyRate = typeof dailyRates.$inferSelect;
