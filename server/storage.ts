import { type BookingInquiry, type InsertBookingInquiry, type PromotionalOffer, type InsertPromotionalOffer, promotionalOffers, bookingInquiries, guestReviews, type GuestReview, type InsertGuestReview, dailyRates, type DailyRate, type InsertDailyRate, salesLeads, salesDownloads, blockedSalesIps, type SalesLead, type SalesDownload } from "@shared/schema";
import { db } from "./db";
import { eq, gte, lte, lt, and, inArray, sql, desc, ilike, or, type SQL } from "drizzle-orm";

async function retryTransientNeonResult<T>(operation: () => Promise<T>): Promise<T> {
  for (let attempt = 0; attempt < 4; attempt += 1) {
    try {
      return await operation();
    } catch (error) {
      const message = error instanceof Error ? error.message : "";
      if (!message.includes("reading 'map'") || attempt === 3) throw error;
      await new Promise((resolve) => setTimeout(resolve, 75 * 2 ** attempt));
    }
  }
  throw new Error("Database operation failed");
}

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  createBookingInquiry(inquiry: InsertBookingInquiry): Promise<BookingInquiry>;
  createPromotionalOffer(offer: InsertPromotionalOffer): Promise<PromotionalOffer>;
  getActivePromotionalOffers(): Promise<PromotionalOffer[]>;
  getPromotionalOfferById(id: number): Promise<PromotionalOffer | undefined>;
  updatePromotionalOffer(id: number, updates: Partial<InsertPromotionalOffer>): Promise<PromotionalOffer | undefined>;
  deletePromotionalOffer(id: number): Promise<boolean>;
  
  // Calendar methods
  
  // Visitor tracking methods
  
  // Guest reviews methods
  createGuestReview(review: InsertGuestReview): Promise<GuestReview>;
  getAllGuestReviews(): Promise<GuestReview[]>;
  getVisibleGuestReviews(): Promise<GuestReview[]>;
  updateGuestReview(id: number, updates: Partial<InsertGuestReview>): Promise<GuestReview | undefined>;
  deleteGuestReview(id: number): Promise<boolean>;
  
  // Daily rates methods
  getRatesByDateRange(startDate: string, endDate: string): Promise<DailyRate[]>;
  upsertDailyRates(rates: InsertDailyRate[]): Promise<void>;
  deleteDailyRates(dates: string[]): Promise<void>;

  // Private sale leads and brochure audit
  getSalesLeadByEmail(email: string): Promise<SalesLead | undefined>;
  getSalesLeadById(id: number): Promise<SalesLead | undefined>;
  upsertSalesLead(lead: typeof salesLeads.$inferInsert): Promise<SalesLead>;
  updateSalesLead(id: number, updates: Partial<typeof salesLeads.$inferInsert>): Promise<SalesLead | undefined>;
  claimSalesBrochureDownload(id: number, downloadedAt: Date): Promise<boolean>;
  releaseSalesBrochureDownload(id: number, downloadedAt: Date): Promise<void>;
  listSalesLeads(options?: { search?: string; status?: string; buyerType?: string }): Promise<SalesLead[]>;
  createSalesDownload(download: { leadId: number; language: string; reference: string }): Promise<SalesDownload>;
  getSalesDownloads(leadId: number): Promise<SalesDownload[]>;
  listBlockedIps(): Promise<(typeof blockedSalesIps.$inferSelect)[]>;
  isSalesIpBlocked(ipAddress: string): Promise<boolean>;
  blockSalesIp(block: { ipAddress: string; city?: string | null; country?: string | null }): Promise<void>;
  unblockSalesIp(ipAddress: string): Promise<void>;
  deleteExpiredSalesData(pendingBefore: Date, verifiedBefore: Date): Promise<void>;
}

export class DatabaseStorage implements IStorage {
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
      const deleted = await db.delete(guestReviews).where(eq(guestReviews.id, id)).returning({ id: guestReviews.id });
      return deleted.length > 0;
    } catch (error) {
      console.error("Error deleting guest review:", error);
      return false;
    }
  }

  async getRatesByDateRange(startDate: string, endDate: string): Promise<DailyRate[]> {
    try {
      // An aggregate always returns one row, including when no overrides exist.
      const [result] = await db.select({ items: sql<DailyRate[]>`
        COALESCE(json_agg(json_build_object(
          'id', ${dailyRates.id}, 'date', ${dailyRates.date}, 'rate', ${dailyRates.rate},
          'createdAt', ${dailyRates.createdAt}, 'updatedAt', ${dailyRates.updatedAt}
        ) ORDER BY ${dailyRates.date}), '[]'::json)` })
        .from(dailyRates).where(and(gte(dailyRates.date, startDate), lte(dailyRates.date, endDate)));
      if (!result || !Array.isArray(result.items)) throw new Error("Invalid daily rates result");
      return result.items.map(row => ({ ...row,
        createdAt: row.createdAt ? new Date(row.createdAt) : null,
        updatedAt: row.updatedAt ? new Date(row.updatedAt) : null,
      }));
    } catch (error) {
      console.error("Error fetching daily rates by date range:", error);
      throw error;
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

  async getSalesLeadByEmail(email: string): Promise<SalesLead | undefined> {
    const [lead] = await retryTransientNeonResult(() =>
      db.select().from(salesLeads).where(eq(salesLeads.email, email.toLowerCase()))
    );
    return lead || undefined;
  }

  async getSalesLeadById(id: number): Promise<SalesLead | undefined> {
    const [lead] = await retryTransientNeonResult(() =>
      db.select().from(salesLeads).where(eq(salesLeads.id, id))
    );
    return lead || undefined;
  }

  async upsertSalesLead(lead: typeof salesLeads.$inferInsert): Promise<SalesLead> {
    const normalizedEmail = lead.email.toLowerCase();
    await retryTransientNeonResult(() =>
      db.insert(salesLeads)
        .values({ ...lead, email: normalizedEmail })
        .onConflictDoUpdate({
          target: salesLeads.email,
          set: {
            firstName: lead.firstName,
            lastName: lead.lastName,
            phone: lead.phone,
            ipAddress: lead.ipAddress,
            ipCity: lead.ipCity,
            ipCountry: lead.ipCountry,
            buyerType: lead.buyerType,
            agencyName: lead.agencyName,
            preferredLanguage: lead.preferredLanguage,
            consentGiven: lead.consentGiven,
            consentTimestamp: lead.consentTimestamp,
            verificationStatus: lead.verificationStatus,
            verificationCodeHash: lead.verificationCodeHash,
            verificationCreatedAt: lead.verificationCreatedAt,
            verificationExpiresAt: lead.verificationExpiresAt,
            verificationAttempts: lead.verificationAttempts,
            lastCodeSentAt: lead.lastCodeSentAt,
            verifiedAt: sql`NULL`,
            brochureDownloadedAt: sql`NULL`,
            updatedAt: new Date(),
          },
        })
    );
    const result = await this.getSalesLeadByEmail(normalizedEmail);
    if (!result) throw new Error("Sales lead was not available after upsert");
    return result;
  }

  async updateSalesLead(id: number, updates: Partial<typeof salesLeads.$inferInsert>): Promise<SalesLead | undefined> {
    await retryTransientNeonResult(() =>
      db.update(salesLeads)
        .set({ ...updates, updatedAt: new Date() })
        .where(eq(salesLeads.id, id))
    );
    return this.getSalesLeadById(id);
  }

  async claimSalesBrochureDownload(id: number, downloadedAt: Date): Promise<boolean> {
    // Keep the claim atomic; COUNT also returns a row when a competing request wins.
    const result = await db.execute(sql`WITH claimed AS (
      UPDATE ${salesLeads}
      SET brochure_downloaded_at = ${downloadedAt}, updated_at = ${downloadedAt}
      WHERE id = ${id} AND verification_status = 'verified' AND brochure_downloaded_at IS NULL
      RETURNING id
    ) SELECT COUNT(*)::int AS count FROM claimed`);
    if (!result.rows[0]) throw new Error("Missing brochure claim result");
    return Number(result.rows[0].count) === 1;
  }

  async releaseSalesBrochureDownload(id: number, downloadedAt: Date): Promise<void> {
    await retryTransientNeonResult(() =>
      db.update(salesLeads)
        .set({ brochureDownloadedAt: sql`NULL`, updatedAt: new Date() })
        .where(and(
          eq(salesLeads.id, id),
          eq(salesLeads.brochureDownloadedAt, downloadedAt),
        ))
    );
  }

  async listSalesLeads(options: { search?: string; status?: string; buyerType?: string } = {}): Promise<SalesLead[]> {
    const filters: SQL[] = [];
    if (options.status) filters.push(eq(salesLeads.followUpStatus, options.status));
    if (options.buyerType) filters.push(eq(salesLeads.buyerType, options.buyerType === "private" ? "private_buyer" : options.buyerType));
    if (options.search) {
      const query = `%${options.search}%`;
      const searchFilter = or(
        ilike(salesLeads.firstName, query),
        ilike(salesLeads.lastName, query),
        ilike(salesLeads.email, query),
        ilike(salesLeads.phone, query),
        ilike(salesLeads.agencyName, query),
      );
      if (searchFilter) filters.push(searchFilter);
    }
    return retryTransientNeonResult(() =>
      db.select().from(salesLeads)
        .where(filters.length ? and(...filters) : undefined)
        .orderBy(desc(salesLeads.createdAt))
    );
  }

  async createSalesDownload(download: { leadId: number; language: string; reference: string }): Promise<SalesDownload> {
    await retryTransientNeonResult(() =>
      db.insert(salesDownloads).values(download)
    );
    const [created] = await retryTransientNeonResult(() =>
      db.select().from(salesDownloads).where(eq(salesDownloads.reference, download.reference))
    );
    if (!created) throw new Error("Sales download was not available after creation");
    return created;
  }

  async getSalesDownloads(leadId: number): Promise<SalesDownload[]> {
    return retryTransientNeonResult(() =>
      db.select().from(salesDownloads)
        .where(eq(salesDownloads.leadId, leadId))
        .orderBy(desc(salesDownloads.downloadedAt))
    );
  }

  async listBlockedIps() {
    type Rule = typeof blockedSalesIps.$inferSelect;
    // The HTTP driver's empty rowset can be null. Aggregate into one row so an
    // empty table is a valid [] without swallowing real database failures.
    const [result] = await retryTransientNeonResult(() =>
      db.select({
        blocks: sql<Array<Omit<Rule, "blockedAt"> & { blockedAt: number | null }>>`
          COALESCE(json_agg(json_build_object(
            'id', ${blockedSalesIps.id},
            'ipAddress', ${blockedSalesIps.ipAddress},
            'city', ${blockedSalesIps.city},
            'country', ${blockedSalesIps.country},
            'blockedAt', EXTRACT(EPOCH FROM ${blockedSalesIps.blockedAt}) * 1000
          ) ORDER BY ${blockedSalesIps.blockedAt} DESC), '[]'::json)
        `,
      }).from(blockedSalesIps)
    );
    if (!result || !Array.isArray(result.blocks)) {
      throw new Error("Invalid database result for IP block rules");
    }
    return result.blocks.map((rule): Rule => ({
      ...rule,
      blockedAt: rule.blockedAt === null ? null : new Date(rule.blockedAt),
    }));
  }

  async isSalesIpBlocked(ipAddress: string): Promise<boolean> {
    const [result] = await retryTransientNeonResult(() =>
      db.select({ count: sql<number>`COUNT(*)` })
        .from(blockedSalesIps)
        .where(eq(blockedSalesIps.ipAddress, ipAddress))
    );
    return Number(result?.count || 0) > 0;
  }

  async blockSalesIp(block: { ipAddress: string; city?: string | null; country?: string | null }): Promise<void> {
    await retryTransientNeonResult(() =>
      db.insert(blockedSalesIps)
        .values(block)
        .onConflictDoUpdate({
          target: blockedSalesIps.ipAddress,
          set: { city: block.city, country: block.country, blockedAt: new Date() },
        })
    );
  }

  async unblockSalesIp(ipAddress: string): Promise<void> {
    await retryTransientNeonResult(() =>
      db.delete(blockedSalesIps).where(eq(blockedSalesIps.ipAddress, ipAddress))
    );
  }

  async deleteExpiredSalesData(pendingBefore: Date, verifiedBefore: Date): Promise<void> {
    const staleCondition = or(
      and(
        eq(salesLeads.verificationStatus, "pending_verification"),
        lt(salesLeads.createdAt, pendingBefore),
      ),
      and(
        eq(salesLeads.verificationStatus, "verified"),
        lt(salesLeads.verifiedAt, verifiedBefore),
      ),
    );

    await retryTransientNeonResult(() =>
      db.delete(salesDownloads).where(inArray(
        salesDownloads.leadId,
        db.select({ id: salesLeads.id }).from(salesLeads).where(staleCondition),
      ))
    );
    await retryTransientNeonResult(() =>
      db.delete(salesLeads).where(staleCondition)
    );
  }
}

export const storage = new DatabaseStorage();
