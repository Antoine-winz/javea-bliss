# Jávea Bliss - Vacation Rental Website

## Overview

Jávea Bliss is a modern, multi-language vacation rental website for a luxury coastal apartment in Jávea, Spain. Its primary purpose is to serve as a marketing and booking inquiry platform for a short-term rental property near Arenal Beach on the Costa Blanca. Key capabilities include a sophisticated multi-language interface, iCal calendar integration for availability, and an inquiry management system. The project aims to maximize property occupancy through direct bookings and advanced SEO strategies, targeting international visitors and long-term stays.

## User Preferences

Preferred communication style: Simple, everyday language.
Business policy: Direct bookings can override Airbnb "Not available" blocks - owner has flexibility to accept guests even when Airbnb shows dates as unavailable.

## System Architecture

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom theming and Shadcn/ui, Radix UI primitives
- **State Management**: React Context for language, React Query for server state
- **Routing**: Wouter with language-prefixed URLs
- **Form Handling**: React Hook Form with Zod validation
- **UI/UX**: Responsive design with a mobile-first approach, custom SVG icons for amenities, EasyJet-style interactive calendar with drag and click selection.
- **Internationalization**: URL-based subdirectory routing supporting English, Dutch, French, Italian, German, and Spanish (/en/, /nl/, /fr/, /it/, /de/, /es/), with dynamic meta tag updates for SEO.
- **Key Features**:
    - **Landing Page**: Showcases property with photo gallery, amenities, location, testimonials, seasonal rates, and a booking inquiry form.
    - **Admin Dashboard**: Manages calendar synchronization and booking inquiries with password-based authentication.
    - **SEO**: Comprehensive and dynamic multilingual SEO targeting specific countries (UK, Netherlands, France, Spain, Germany), direct flights, local restaurants (e.g., Chabada, La Bambula), and long-term rental keywords. Includes dynamic promotional content targeting, structured data (JSON-LD), and hidden SEO content. Enhanced with advanced Jávea-specific SEO strategy including weather search targeting, tourism keywords, and comprehensive location-based meta tags.
    - **Performance**: Image optimization with responsive sizing, optimized calendar and gallery components, and general code cleanup for production readiness.

### Backend
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Calendar Management**: Automated daily Airbnb iCal feed synchronization (2:00 AM CET) with robust error handling, persistence, and logic to differentiate between actual bookings and "Not available" blocks (allowing owner override for direct bookings).
- **Booking Inquiries**: Form validation, rate limiting, spam protection, and email notifications.
- **Security**: HTTPS enforcement, security headers, Content Security Policy, rate limiting, input validation.
- **Promotional System**: Dynamic promotional offers with real-time pricing calculation, automatic expiration, and integrated SEO. Supports last-minute discounts.
- **Long-term Rentals**: Dedicated pricing logic (€100/day for 35+ nights) and integrated SEO targeting.

## Marketing & SEO Resources

- **MARKETING_STRATEGY.md**: Comprehensive digital marketing strategy document for increasing traffic and visibility across EU countries. Includes:
  - Technical SEO implementation (hreflang tags, structured data, sitemaps)
  - Keyword strategy for all 5 languages targeting UK, Germany, Netherlands, France, Spain
  - Content marketing calendar with 60+ blog post ideas
  - Google Ads campaign structure with country-specific targeting
  - Link building and partnership strategies
  - Social media and email marketing plans
  - OTA strategy to maximize then migrate to direct bookings
  - 12-month implementation timeline with projected ROI

## Recent Changes (December 2025)

- **Spanish Language Support (December 13, 2025)**: Added complete Spanish (es) language support across the entire website:
  - **URL Structure**: Added /es/ route for Spanish homepage and /es/recommendations for recommendations page
  - **LanguageContext**: Added 'es' to Language type, SUPPORTED_LANGUAGES array, browser language detection (es, es-ES, es-MX, es-AR, es-CO, es-CL), and timezone detection (Europe/Madrid, Atlantic/Canary)
  - **Translations**: Added ~300+ Spanish translation keys covering all UI elements, navigation, forms, amenities, location, testimonials, and booking sections
  - **LanguageSwitcher**: Added Spanish option with 🇪🇸 flag
  - **SEO**: Updated SEOHead.tsx with Spanish SEO content (title, description, keywords, locale), added 'es' to hreflang tags
  - **OptimizedSEOStrategy**: Added Spanish cases for getPromotionalSEOContent(), getBaseSEOContent(), and getHiddenContent()
  - **Sitemap**: Added Spanish hreflang links to all URL entries and new /es/ URL entries
  - **Files Modified**: `client/src/contexts/LanguageContext.tsx`, `client/src/components/LanguageSwitcher.tsx`, `client/src/components/SEOHead.tsx`, `client/src/components/OptimizedSEOStrategy.tsx`, `client/public/sitemap.xml`

- **URL-Based Language Routing (December 13, 2025)**: Implemented SEO-friendly subdirectory URL structure for all languages:
  - **URL Structure**: 
    - English (default): javeabliss.com/ or javeabliss.com/en/
    - French: javeabliss.com/fr/
    - German: javeabliss.com/de/
    - Dutch: javeabliss.com/nl/
    - Italian: javeabliss.com/it/
    - Spanish: javeabliss.com/es/
  - **LanguageContext Updates**: 
    - Added `getLanguageFromPath()` and `getPathWithoutLanguage()` helper functions
    - `setLanguage()` now navigates to new language URL
    - Added `getLocalizedPath()` for internal link generation
  - **Routing**: Updated App.tsx with language-prefixed routes for all pages
  - **Navigation**: Updated all internal links to use `getLocalizedPath()` function
  - **SEO**: Updated sitemap.xml and SEOHead.tsx with new URL structure and Italian translations
  - **Files Modified**: `client/src/contexts/LanguageContext.tsx`, `client/src/App.tsx`, `client/src/components/LanguageSwitcher.tsx`, `client/src/components/Navigation.tsx`, `client/src/components/LocationSection.tsx`, `client/src/components/ApartmentSection.tsx`, `client/src/components/SEOHead.tsx`, `client/public/sitemap.xml`

## Recent Changes (November 2025)

- **Pricing Management System (November 14, 2025)**: Implemented comprehensive custom daily rate management to manually sync with Airbnb pricing:
  - **Root Cause Analysis**: Discovered Airbnb iCal feed only provides availability data (blocked dates), NOT pricing information - requires manual rate management
  - **Database**: Added `dailyRates` table with date (unique), rate, and timestamps for custom pricing storage
  - **Backend Services**: 
    - Created `server/pricing.ts` service with `getRatesForRange()` function that checks custom rates first, then falls back to seasonal pricing (€210 high, €160 mid, €130 low, €100 long-term 35+ days)
    - Storage CRUD: `getRatesByDateRange()`, `upsertDailyRates()`, `deleteDailyRates()` with efficient date range queries
    - API Routes: GET `/api/pricing?start=YYYY-MM-DD&end=YYYY-MM-DD&stayLength=N` and POST `/api/daily-rates/bulk` for bulk updates
  - **Admin Dashboard**: Added "Pricing" tab (7th tab) with bulk rate management tool:
    - Date range picker (start/end date inputs)
    - Rate input field (€/night)
    - Bulk rate setting generates all dates in range and upserts to database
    - Success/error toast notifications, automatic cache invalidation
    - Clear documentation explaining Airbnb limitation and seasonal fallback rates
  - **Public Calendar Integration**: Updated `OptimizedCalendar.tsx` to fetch custom rates from backend:
    - React Query fetches pricing for 6-month rolling window (12hr cache, 30min refresh)
    - Creates Map<string, number> for O(1) date-to-rate lookups
    - `getRateForDate()` checks custom rates first, falls back to seasonal, preserves promotional overrides
    - Immediate cache invalidation when admin updates rates
  - **Testing**: End-to-end validation confirmed admin can set rates, API returns custom/seasonal correctly, public calendar displays pricing
  - **Files Modified**: `shared/schema.ts`, `server/storage.ts`, `server/pricing.ts`, `server/routes.ts`, `client/src/pages/Admin.tsx`, `client/src/components/OptimizedCalendar.tsx`

## Recent Changes (October 2025)

- **Performance Optimization (October 13, 2025)**: Implemented comprehensive Google PageSpeed Insights optimizations achieving significant performance improvements:
  - **Eliminated render-blocking resources (~1,950ms savings)**: Moved Google Analytics to async loading after window.load event, added preconnect/DNS prefetch for GTM
  - **Optimized image delivery (~469 KiB savings)**: Implemented LazyImage component with IntersectionObserver API for lazy loading 18+ gallery images
  - **Prevented layout shifts**: Added explicit width/height attributes to all images (Navigation: 40x40, ApartmentHeader: 64x64, ApartmentSection: 600x400, Gallery: 400x250)
  - **Fixed critical lazy loading bug**: LazyImage component now properly omits src attribute until intersection (no redundant page requests)
  - Components updated: client/index.html, LazyImage.tsx (new), GallerySection.tsx, Navigation.tsx, ApartmentSection.tsx, ApartmentHeader.tsx
- **Complete German SEO Integration (October 11, 2025)**: Added German (de) language to all SEO infrastructure to complete multilingual coverage:
  - Updated SEOHead.tsx to include German in hreflang tags (now supporting all 5 languages: en, es, fr, nl, de)
  - Updated sitemap.xml to include German language entries for all URL nodes with current lastmod dates
  - Verified robots.txt properly references sitemap for search engine discovery
  - All technical SEO now fully supports German market targeting (Munich, Frankfurt, Berlin, Düsseldorf)
- **Enhanced Review Translation System (October 11, 2025)**: Updated testimonials to always display reviews translated to the selected website language by default, with a "See original" toggle button to view the text in the language the host originally wrote it. Added comprehensive translations for all 10 reviews across all 5 languages (English, Spanish, French, Dutch, German), ensuring every review appears translated regardless of the original language. This ensures consistent user experience across all languages.
- Completed reviews management system integration with full CRUD operations
- Updated "What Our Guests Say" section to display dynamic carousel from database API  
- Implemented Airbnb-style review translation system with "Show original" toggle functionality
- Added ReviewsManagement component with editing, approval, verification, and deletion capabilities
- **Deployed comprehensive multi-country SEO strategy with weather-targeted meta tags and hidden content for enhanced Jávea search visibility across all language regions**
- **MAJOR SEO OPTIMIZATION (August 21, 2025): Consolidated multiple overlapping SEO components (ComprehensiveSEO, JaveaSEOStrategy, WeatherSEOTargeting, ComprehensiveJaveaSEO, DynamicPromotionalSEO, DiscountSEO) into single OptimizedSEOStrategy component with:**
  - **Dynamic promotional content integration with real-time offer-based meta tag updates**
  - **Comprehensive weather targeting across all languages without duplication**
  - **Geographic targeting covering all 5 language regions with detailed city coverage**
  - **Unified structured data (JSON-LD) for accommodation, tourism, weather, and promotional offers**
  - **Eliminated content redundancy while maintaining full SEO coverage**
  - **Single component handles all meta tags, Open Graph, Twitter Cards, and structured data dynamically**

## External Dependencies

- **@neondatabase/serverless**: Neon PostgreSQL database connection
- **drizzle-orm**: Type-safe database ORM
- **@tanstack/react-query**: Server state management
- **@radix-ui/react-***: Accessible UI primitives
- **@emailjs/browser**: Client-side email service
- **@sendgrid/mail**: Server-side email service
- **Google Analytics (G-ZQ6FF9R1BQ)**: For comprehensive visitor and event tracking.
- **Airbnb iCal Feed**: For calendar synchronization.