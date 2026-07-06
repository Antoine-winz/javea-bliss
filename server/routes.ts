import type { Express } from "express";
import { createServer, type Server } from "http";
import path from "path";
import fs from "fs";
import { storage } from "./storage";
import { bookingInquirySchema, insertPromotionalOfferSchema, insertGuestReviewSchema, insertDailyRateSchema } from "@shared/schema";
import { calendarService } from "./calendar";
import { trackVisit, getVisitorStats } from "./visitor-tracking";
import { getRatesForRange } from "./pricing";


// Last-minute offers toggle (off by default — owner must enable explicitly)
let lastMinuteOffersEnabled = false;

// Simple rate limiting store with automatic cleanup
const rateLimitStore = new Map<string, { count: number; lastReset: number }>();
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const RATE_LIMIT_MAX_REQUESTS = 3; // Max 3 requests per 15 minutes
const RATE_LIMIT_CLEANUP_INTERVAL = 30 * 60 * 1000; // Clean up every 30 minutes

// Cleanup expired entries to prevent memory leaks
function cleanupRateLimitStore(): void {
  const now = Date.now();
  const keysToDelete: string[] = [];
  rateLimitStore.forEach((data, ip) => {
    if (now - data.lastReset > RATE_LIMIT_WINDOW) {
      keysToDelete.push(ip);
    }
  });
  keysToDelete.forEach(ip => rateLimitStore.delete(ip));
}

// Start periodic cleanup
setInterval(cleanupRateLimitStore, RATE_LIMIT_CLEANUP_INTERVAL);

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const userLimit = rateLimitStore.get(ip);
  
  if (!userLimit || now - userLimit.lastReset > RATE_LIMIT_WINDOW) {
    rateLimitStore.set(ip, { count: 1, lastReset: now });
    return true;
  }
  
  if (userLimit.count >= RATE_LIMIT_MAX_REQUESTS) {
    return false;
  }
  
  userLimit.count++;
  return true;
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Serve static flyer HTML file
  app.get("/flyer.html", (req, res) => {
    const flyerPath = path.resolve(process.cwd(), "client", "public", "flyer.html");
    if (fs.existsSync(flyerPath)) {
      res.sendFile(flyerPath);
    } else {
      res.status(404).send("Flyer not found");
    }
  });

  // Add visitor tracking middleware
  app.use(trackVisit);

  // Visitor statistics endpoint
  app.get("/api/visitor-stats", async (req, res) => {
    try {
      const stats = await getVisitorStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch visitor stats" });
    }
  });

  // Last minute booking offers endpoint
  // Get/set last-minute offers enabled state
  app.get("/api/last-minute-offers/settings", (req, res) => {
    res.json({ enabled: lastMinuteOffersEnabled });
  });

  app.post("/api/last-minute-offers/settings", (req, res) => {
    const { enabled } = req.body;
    if (typeof enabled !== 'boolean') {
      return res.status(400).json({ message: "enabled must be a boolean" });
    }
    lastMinuteOffersEnabled = enabled;
    res.json({ enabled: lastMinuteOffersEnabled });
  });

  app.get("/api/last-minute-offers", async (req, res) => {
    try {
      // Return inactive immediately if owner has not enabled last-minute offers
      if (!lastMinuteOffersEnabled) {
        return res.json({ isActive: false, availableDates: [] });
      }

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      // Get next 7 days
      const next7Days = [];
      for (let i = 1; i <= 7; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        next7Days.push(date.toISOString().split('T')[0]);
      }
      
      // Get blocked dates from calendar service
      const blockedDates = calendarService.getBlockedDates();
      const blockedDateStrings = blockedDates.map(date => date.toISOString().split('T')[0]);
      const blockedDateSet = new Set(blockedDateStrings);
      
      // Find available dates in the next 7 days
      const availableDates = next7Days.filter(dateStr => !blockedDateSet.has(dateStr));
      
      if (availableDates.length > 0) {
        const offer = {
          id: 'last-minute',
          title: 'Last Minute Booking - 20% OFF',
          description: `Book now for ${availableDates.length} available dates in the next 7 days!`,
          availableDates,
          discountPercentage: 20,
          originalPrice: 210,
          discountedPrice: 168,
          validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          isLastMinute: true,
          isActive: true
        };
        
        res.json(offer);
      } else {
        res.json({ isActive: false, availableDates: [] });
      }
    } catch (error) {
      console.error('Error fetching last minute offers:', error);
      res.status(500).json({ message: "Failed to fetch last minute offers" });
    }
  });

  // Booking inquiry route with spam protection and server-side validation
  app.post("/api/booking-inquiry", async (req, res) => {
    try {
      // Rate limiting check
      const clientIP = req.ip || req.connection.remoteAddress || 'unknown';
      if (!checkRateLimit(clientIP)) {
        return res.status(429).json({ 
          message: "Too many requests. Please try again later." 
        });
      }

      // Honeypot spam protection
      if (req.body.website && req.body.website.trim() !== '') {
        return res.status(400).json({ 
          message: "Spam detected" 
        });
      }

      // Server-side validation for guests (must be numeric 1-4)
      const guests = parseInt(req.body.guests);
      if (isNaN(guests) || guests < 1 || guests > 4) {
        return res.status(400).json({
          message: "Invalid number of guests. Must be between 1 and 4."
        });
      }

      // Server-side date validation
      const checkIn = new Date(req.body.checkIn);
      const checkOut = new Date(req.body.checkOut);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (isNaN(checkIn.getTime()) || isNaN(checkOut.getTime())) {
        return res.status(400).json({
          message: "Invalid date format for check-in or check-out."
        });
      }

      if (checkIn < today) {
        return res.status(400).json({
          message: "Check-in date cannot be in the past."
        });
      }

      if (checkOut <= checkIn) {
        return res.status(400).json({
          message: "Check-out date must be after check-in date."
        });
      }

      // Verify availability against calendar service
      const isAvailable = calendarService.isDateRangeAvailable(checkIn, checkOut);
      if (!isAvailable) {
        return res.status(400).json({
          message: "Selected dates are not available. Please choose different dates."
        });
      }

      const validation = bookingInquirySchema.safeParse(req.body);
      
      if (!validation.success) {
        return res.status(400).json({ 
          message: "Invalid form data", 
          errors: validation.error.format() 
        });
      }
      
      const inquiryData = validation.data;
      
      // Store inquiry in database
      const savedInquiry = await storage.createBookingInquiry(inquiryData);
      
      // Email notification would be sent to admin@javeabliss.com
      // In production, configure with real SMTP credentials
      const emailSent = true;
      
      if (emailSent) {
        return res.status(200).json({ 
          message: "Booking inquiry received successfully",
          inquiry: savedInquiry
        });
      } else {
        return res.status(500).json({ 
          message: "Failed to send email notification" 
        });
      }
    } catch (error) {
      console.error("Booking inquiry error:", error);
      return res.status(500).json({ 
        message: "Server error processing your request" 
      });
    }
  });

  // Calendar sync endpoint - sync with Airbnb calendar
  app.post("/api/calendar/sync", async (req, res) => {
    try {
      const { icalUrl } = req.body;
      
      if (!icalUrl || typeof icalUrl !== 'string') {
        return res.status(400).json({ 
          message: "iCal URL is required" 
        });
      }

      await calendarService.syncAirbnbCalendar(icalUrl);
      
      // Set up daily sync with this URL
      calendarService.setupDailySync(icalUrl);
      
      res.json({ 
        message: "Calendar synced successfully and daily sync enabled",
        lastUpdated: calendarService.getLastUpdated(),
        eventCount: calendarService.getEvents().length,
        dailySyncEnabled: true
      });
    } catch (error) {
      console.error("Calendar sync error:", error);
      res.status(500).json({ 
        message: "Failed to sync calendar" 
      });
    }
  });

  // Get sync status
  app.get("/api/calendar/sync-status", (req, res) => {
    try {
      const status = calendarService.getSyncStatus();
      res.json(status);
    } catch (error) {
      console.error("Error getting sync status:", error);
      res.status(500).json({ 
        message: "Failed to get sync status" 
      });
    }
  });

  // Get blocked dates
  app.get("/api/calendar/blocked-dates", (req, res) => {
    try {
      const blockedDates = calendarService.getBlockedDates();
      const checkInDates = calendarService.getCheckInDates();
      const checkOutDates = calendarService.getCheckOutDates();
      res.json({ 
        blockedDates: blockedDates.map(date => date.toISOString().split('T')[0]),
        checkInDates: checkInDates.map(date => date.toISOString().split('T')[0]),
        checkOutDates: checkOutDates.map(date => date.toISOString().split('T')[0]),
        lastUpdated: calendarService.getLastUpdated()
      });
    } catch (error) {
      console.error("Error getting blocked dates:", error);
      res.status(500).json({ 
        message: "Failed to get calendar data" 
      });
    }
  });

  // Manual block routes
  app.get("/api/calendar/manual-blocks", async (req, res) => {
    try {
      const blocks = await calendarService.getManualBlocks();
      res.json({ blocks });
    } catch (error) {
      res.status(500).json({ message: "Failed to get manual blocks" });
    }
  });

  app.post("/api/calendar/manual-block", async (req, res) => {
    try {
      const { startDate, endDate, label } = req.body;
      if (!startDate || !endDate) return res.status(400).json({ message: "startDate and endDate are required" });
      const result = await calendarService.addManualBlock(startDate, endDate, label || 'Owner Block');
      res.json({ success: true, uid: result.uid });
    } catch (error) {
      console.error("Error adding manual block:", error);
      res.status(500).json({ message: "Failed to add manual block" });
    }
  });

  app.delete("/api/calendar/manual-block/:uid", async (req, res) => {
    try {
      const uid = decodeURIComponent(req.params.uid);
      await calendarService.removeManualBlock(uid);
      res.json({ success: true });
    } catch (error) {
      console.error("Error removing manual block:", error);
      res.status(500).json({ message: "Failed to remove manual block" });
    }
  });

  // Get calendar events for cleaning schedule
  app.get("/api/calendar/events", (req, res) => {
    try {
      const events = calendarService.getEvents();
      res.json({ 
        events: events,
        lastUpdated: calendarService.getLastUpdated()
      });
    } catch (error) {
      console.error("Error getting calendar events:", error);
      res.status(500).json({ 
        message: "Failed to get calendar events" 
      });
    }
  });

  // Get cleaning schedule with cleaning reminders
  app.get("/api/calendar/cleaning-schedule", (req, res) => {
    try {
      const schedule = calendarService.getCleaningSchedule();
      res.json(schedule);
    } catch (error) {
      console.error("Error getting cleaning schedule:", error);
      res.status(500).json({ 
        message: "Failed to get cleaning schedule" 
      });
    }
  });

  // Check availability for date range
  app.post("/api/calendar/check-availability", (req, res) => {
    try {
      const { startDate, endDate } = req.body;
      
      if (!startDate || !endDate) {
        return res.status(400).json({ 
          message: "Start date and end date are required" 
        });
      }

      const start = new Date(startDate);
      const end = new Date(endDate);
      
      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        return res.status(400).json({ 
          message: "Invalid date format" 
        });
      }

      const isAvailable = calendarService.isDateRangeAvailable(start, end);
      
      res.json({ 
        available: isAvailable,
        startDate: start.toISOString().split('T')[0],
        endDate: end.toISOString().split('T')[0]
      });
    } catch (error) {
      console.error("Error checking availability:", error);
      res.status(500).json({ 
        message: "Failed to check availability" 
      });
    }
  });

  // Get calendar events
  app.get("/api/calendar/events", (req, res) => {
    try {
      const events = calendarService.getEvents();
      res.json({ 
        events: events.map(event => ({
          startDate: event.startDate.toISOString().split('T')[0],
          endDate: event.endDate.toISOString().split('T')[0],
          summary: event.summary,
          uid: event.uid
        })),
        lastUpdated: calendarService.getLastUpdated()
      });
    } catch (error) {
      console.error("Error getting events:", error);
      res.status(500).json({ 
        message: "Failed to get calendar events" 
      });
    }
  });

  // Promotional offers API routes
  app.post("/api/promotional-offers", async (req, res) => {
    try {
      // Convert validUntil string to Date if it's a string
      const processedBody = {
        ...req.body,
      };
      
      // Convert validUntil to Date object if it's a string
      if (req.body.validUntil && typeof req.body.validUntil === 'string') {
        processedBody.validUntil = new Date(req.body.validUntil);
      } else if (!req.body.validUntil) {
        // Default to 5 days from now if not provided
        const defaultDate = new Date();
        defaultDate.setDate(defaultDate.getDate() + 5);
        processedBody.validUntil = defaultDate;
      }
      
      const validation = insertPromotionalOfferSchema.safeParse(processedBody);
      
      if (!validation.success) {
        return res.status(400).json({ 
          message: "Invalid offer data", 
          errors: validation.error.format() 
        });
      }
      
      const savedOffer = await storage.createPromotionalOffer(validation.data);
      res.json(savedOffer);
    } catch (error) {
      console.error("Error creating promotional offer:", error);
      res.status(500).json({ message: "Failed to create promotional offer" });
    }
  });

  app.get("/api/promotional-offers", async (req, res) => {
    try {
      const offers = await storage.getActivePromotionalOffers();
      res.json(offers);
    } catch (error) {
      console.error("Error fetching promotional offers:", error);
      res.status(500).json({ message: "Failed to fetch promotional offers" });
    }
  });

  app.get("/api/promotional-offers/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const offer = await storage.getPromotionalOfferById(id);
      
      if (!offer) {
        return res.status(404).json({ message: "Promotional offer not found" });
      }
      
      res.json(offer);
    } catch (error) {
      console.error("Error fetching promotional offer:", error);
      res.status(500).json({ message: "Failed to fetch promotional offer" });
    }
  });

  app.put("/api/promotional-offers/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      // Convert validUntil string to Date if it's a string
      const processedBody = {
        ...req.body,
      };
      
      // Convert validUntil to Date object if it's a string
      if (req.body.validUntil && typeof req.body.validUntil === 'string') {
        processedBody.validUntil = new Date(req.body.validUntil);
      }
      
      const validation = insertPromotionalOfferSchema.partial().safeParse(processedBody);
      
      if (!validation.success) {
        return res.status(400).json({ 
          message: "Invalid offer data", 
          errors: validation.error.format() 
        });
      }
      
      const updatedOffer = await storage.updatePromotionalOffer(id, validation.data);
      
      if (!updatedOffer) {
        return res.status(404).json({ message: "Promotional offer not found" });
      }
      
      res.json(updatedOffer);
    } catch (error) {
      console.error("Error updating promotional offer:", error);
      res.status(500).json({ message: "Failed to update promotional offer" });
    }
  });

  app.delete("/api/promotional-offers/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deletePromotionalOffer(id);
      
      if (!deleted) {
        return res.status(404).json({ message: "Promotional offer not found" });
      }
      
      res.json({ message: "Promotional offer deleted successfully" });
    } catch (error) {
      console.error("Error deleting promotional offer:", error);
      res.status(500).json({ message: "Failed to delete promotional offer" });
    }
  });

  // Guest Reviews API routes
  
  // Get all reviews (admin)
  app.get("/api/reviews", async (req, res) => {
    try {
      const reviews = await storage.getAllGuestReviews();
      res.json(reviews);
    } catch (error) {
      console.error("Error fetching all reviews:", error);
      res.status(500).json({ message: "Failed to fetch reviews" });
    }
  });

  // Get visible reviews (public)
  app.get("/api/reviews/visible", async (req, res) => {
    try {
      const reviews = await storage.getVisibleGuestReviews();
      res.json(reviews);
    } catch (error) {
      console.error("Error fetching visible reviews:", error);
      res.status(500).json({ message: "Failed to fetch visible reviews" });
    }
  });

  // Create new review
  app.post("/api/reviews", async (req, res) => {
    try {
      const validation = insertGuestReviewSchema.safeParse(req.body);
      
      if (!validation.success) {
        return res.status(400).json({ 
          message: "Validation failed", 
          errors: validation.error.flatten().fieldErrors 
        });
      }

      const review = await storage.createGuestReview(validation.data);
      res.status(201).json(review);
    } catch (error) {
      console.error("Error creating review:", error);
      res.status(500).json({ message: "Failed to create review" });
    }
  });

  // Update review
  app.put("/api/reviews/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validation = insertGuestReviewSchema.partial().safeParse(req.body);
      
      if (!validation.success) {
        return res.status(400).json({ 
          message: "Validation failed", 
          errors: validation.error.flatten().fieldErrors 
        });
      }

      const updatedReview = await storage.updateGuestReview(id, validation.data);
      
      if (!updatedReview) {
        return res.status(404).json({ message: "Review not found" });
      }

      res.json(updatedReview);
    } catch (error) {
      console.error("Error updating review:", error);
      res.status(500).json({ message: "Failed to update review" });
    }
  });

  // Delete review
  app.delete("/api/reviews/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteGuestReview(id);
      
      if (!deleted) {
        return res.status(404).json({ message: "Review not found" });
      }

      res.json({ message: "Review deleted successfully" });
    } catch (error) {
      console.error("Error deleting review:", error);
      res.status(500).json({ message: "Failed to delete review" });
    }
  });

  // Get pricing for date range
  app.get("/api/pricing", async (req, res) => {
    try {
      const { start, end, stayLength } = req.query;
      
      if (!start || !end) {
        return res.status(400).json({ message: "start and end dates are required" });
      }
      
      // Validate and parse stayLength
      let stay: number | undefined;
      if (stayLength) {
        const parsed = parseInt(stayLength as string);
        if (isNaN(parsed) || parsed < 1 || parsed > 365) {
          return res.status(400).json({ message: "stayLength must be a number between 1 and 365" });
        }
        stay = parsed;
      }
      
      const rates = await getRatesForRange(start as string, end as string, stay);
      
      res.json(rates);
    } catch (error) {
      console.error("Error fetching pricing:", error);
      res.status(500).json({ message: "Failed to fetch pricing" });
    }
  });

  // Bulk upsert daily rates
  app.post("/api/daily-rates/bulk", async (req, res) => {
    try {
      const { rates } = req.body;
      
      if (!Array.isArray(rates) || rates.length === 0) {
        return res.status(400).json({ message: "rates array is required" });
      }
      
      const validatedRates = rates.map(rate => {
        const validation = insertDailyRateSchema.safeParse(rate);
        if (!validation.success) {
          throw new Error(`Invalid rate data: ${validation.error.message}`);
        }
        return validation.data;
      });
      
      await storage.upsertDailyRates(validatedRates);
      
      res.json({ message: `Successfully updated ${validatedRates.length} rates`, count: validatedRates.length });
    } catch (error) {
      console.error("Error upserting daily rates:", error);
      res.status(500).json({ message: "Failed to update daily rates" });
    }
  });

  // Delete daily rates
  app.delete("/api/daily-rates", async (req, res) => {
    try {
      const { dates } = req.body;
      
      if (!Array.isArray(dates) || dates.length === 0) {
        return res.status(400).json({ message: "dates array is required" });
      }
      
      await storage.deleteDailyRates(dates);
      
      res.json({ message: `Successfully deleted ${dates.length} rates`, count: dates.length });
    } catch (error) {
      console.error("Error deleting daily rates:", error);
      res.status(500).json({ message: "Failed to delete daily rates" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
