import { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'wouter';

export type Language = 'en' | 'nl' | 'fr' | 'it' | 'de' | 'es';

export const SUPPORTED_LANGUAGES: Language[] = ['en', 'nl', 'fr', 'it', 'de', 'es'];

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  getLocalizedPath: (path: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Extract language from URL path
export const getLanguageFromPath = (path: string): Language | null => {
  const match = path.match(/^\/(en|nl|fr|it|de|es)(\/|$)/);
  return match ? (match[1] as Language) : null;
};

// Get path without language prefix
export const getPathWithoutLanguage = (path: string): string => {
  return path.replace(/^\/(en|nl|fr|it|de|es)(\/|$)/, '/') || '/';
};

// Function to detect user's preferred language (fallback when no URL language)
const detectUserLanguage = (): Language => {
  // First check if user has a saved language preference
  const savedLanguage = localStorage.getItem('preferredLanguage');
  if (savedLanguage && SUPPORTED_LANGUAGES.includes(savedLanguage as Language)) {
    return savedLanguage as Language;
  }

  // Get browser language preferences
  const browserLanguages = navigator.languages || [navigator.language];
  
  // Map browser language codes to our supported languages
  const languageMap: { [key: string]: Language } = {
    // English
    'en': 'en',
    'en-US': 'en',
    'en-GB': 'en',
    'en-CA': 'en',
    'en-AU': 'en',
    
    // Dutch
    'nl': 'nl',
    'nl-NL': 'nl',
    'nl-BE': 'nl',
    
    // French
    'fr': 'fr',
    'fr-FR': 'fr',
    'fr-CA': 'fr',
    'fr-BE': 'fr',
    'fr-CH': 'fr',
    
    // Italian
    'it': 'it',
    'it-IT': 'it',
    'it-CH': 'it',
    
    // German
    'de': 'de',
    'de-DE': 'de',
    'de-AT': 'de',
    'de-CH': 'de',
    
    // Spanish
    'es': 'es',
    'es-ES': 'es',
    'es-MX': 'es',
    'es-AR': 'es',
    'es-CO': 'es',
    'es-CL': 'es',
  };

  // Check each browser language preference
  for (const browserLang of browserLanguages) {
    const lang = languageMap[browserLang.toLowerCase()];
    if (lang) {
      return lang;
    }
    
    // Also check the base language (e.g., 'fr' from 'fr-FR')
    const baseLang = browserLang.split('-')[0].toLowerCase();
    const mappedBaseLang = languageMap[baseLang];
    if (mappedBaseLang) {
      return mappedBaseLang;
    }
  }

  // Try to detect timezone-based language as fallback
  try {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const timezoneLanguageMap: { [key: string]: Language } = {
      // European timezones that suggest specific languages
      'Europe/Amsterdam': 'nl',
      'Europe/Brussels': 'nl',
      'Europe/Paris': 'fr',
      'Europe/Geneva': 'fr',
      'Europe/Rome': 'it',
      'Europe/Milan': 'it',
      'Europe/London': 'en',
      'Europe/Dublin': 'en',
      'Europe/Berlin': 'de',
      'Europe/Vienna': 'de',
      'Europe/Zurich': 'de',
      'Europe/Madrid': 'es',
      'Atlantic/Canary': 'es',
    };
    
    const timezoneLanguage = timezoneLanguageMap[timezone];
    if (timezoneLanguage) {
      return timezoneLanguage;
    }
  } catch (error) {
    // Silent fallback on timezone detection failure
  }

  // Default to English if no match found
  return 'en';
};

const translations = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.apartment': 'Apartment',
    'nav.gallery': 'Gallery',
    'nav.rates': 'Rates',
    'nav.location': 'Location',
    'nav.booking': 'Book Now',
    'nav.recommendations': 'Recommendations',

    // Hero Section
    'hero.title': 'JÁVEA BLISS',
    'hero.eyebrow': "Jávea · Costa Blanca, Spain",
    'glance.eyebrow': "The essentials",
    'apartment.eyebrow': "Where you stay",
    'amenities.eyebrow': "Inside",
    'paradise.eyebrow': "The neighbourhood",
    'gallery.eyebrow': "Photographs",
    'testimonials.eyebrow': "Guest reviews",
    'rates.eyebrow': "Rates",
    'booking.eyebrow': "Enquire",
    'hero.subtitle': 'Holiday Apartment near Arenal Beach',
    'hero.tagline': "Renovated two-bedroom apartment for four, 250 m from Arenal Beach. Book direct from €130 a night.",
    'hero.description': 'Stay 250 metres from Arenal Beach, Jávea\'s sandy beach with its restaurant-lined promenade. The apartment is fully renovated, with air conditioning, fast fibre Wi-Fi and free parking. Alicante Airport is 75 minutes away, with direct flights from most UK and European cities.',
    'hero.bookButton': 'Book Your Stay',
    'hero.exploreButton': 'Explore the Apartment',

    // Apartment Section
    'apartment.title': 'The Apartment',
    'apartment.description': 'A fully renovated first-floor apartment on the quiet Nou Fontana canal, one street back from Arenal Beach. Two double bedrooms, a modern bathroom, an equipped kitchen and a private terrace over the water — plus a lift and your own parking space.',
    'apartment.restaurantProximity': 'Restaurants on Your Doorstep',
    'apartment.restaurantProximityDesc': 'Chabada, La Bambula, Masena and the rest of the Arenal promenade are a short walk away.',
    'apartment.viewAllRestaurants': 'See the Restaurant Guide',

    // At Glance Section
    'glance.title': 'At a Glance',
    'glance.sleeps': 'Sleeps 4 guests',
    'glance.bedrooms': '2 double bedrooms',
    'glance.bathroom': '1 modern bathroom',
    'glance.beach': '250 m to Arenal Beach',
    'glance.parking': 'Free private parking',
    'glance.wifi': 'Fast fibre Wi-Fi',
    'glance.ac': 'Air conditioning',
    'glance.terrace': 'Private terrace',

    // Amenities Section
    'amenities.title': 'Amenities',
    'amenities.kitchen': 'Fully Equipped Kitchen',
    'amenities.kitchenDesc': 'Induction hob, oven, dishwasher, microwave and a Nespresso machine — everything you need to cook at home.',
    'amenities.comfort': 'Heating & Air Conditioning',
    'amenities.comfortDesc': 'Zoned air conditioning and heating keep the apartment comfortable in August and in January alike.',
    'amenities.entertainment': 'Smart TV & Streaming',
    'amenities.entertainmentDesc': '55-inch smart TV and fibre Wi-Fi fast enough for streaming — or for a day of remote work.',
    'amenities.laundry': 'Washing Machine',
    'amenities.laundryDesc': 'Washing machine on the patio (no dryer).',
    'amenities.outdoor': 'Private Terrace',
    'amenities.outdoorDesc': 'A canal-side terrace for breakfast outside or an evening drink.',
    'amenities.parking': 'Free Parking',
    'amenities.parkingDesc': 'Your own allocated space — genuinely rare this close to Arenal Beach.',

    // Rates Section
    'rates.title': 'Rates & Policies',
    'rates.description': 'Straightforward seasonal pricing, and no platform fees when you book direct. Stays of 5 weeks or more get our €100/night long-stay rate — popular for wintering in Spain.',
    'rates.highSeason': 'High Season',
    'rates.highPeriod': 'June – September & holidays',
    'rates.highRate': 'From €210 per night',
    'rates.midSeason': 'Mid Season',
    'rates.midPeriod': 'April, May & October',
    'rates.midRate': 'From €160 per night',
    'rates.lowSeason': 'Low Season',
    'rates.lowPeriod': 'November – March (outside holidays)',
    'rates.lowRate': 'From €130 per night',
    'rates.policies': 'Booking Policies',
    'rates.policy1': 'Minimum 5 nights in high season',
    'rates.policy2': 'Minimum 3 nights the rest of the year',
    'rates.policy3': 'Check-in from 4:00 PM',
    'rates.policy4': 'Check-out by 12:00 noon',

    // Location Section (original entries)
    'location.title': 'The Location',
    'location.description': 'Marina Nou Fontana, the canal quarter of the Arenal — Jávea\'s liveliest neighbourhood, one street back from the beach.',
    'location.beach': 'Arenal Beach',
    'location.beachDesc': '250 m away — sandy, shallow and family-friendly',
    'location.restaurants': 'Restaurants',
    'location.restaurantsDesc': 'The promenade\'s bars and restaurants, 2–5 minutes on foot',
    'location.shops': 'Shops',
    'location.shopsDesc': 'Supermarkets and a pharmacy within a 5-minute walk',
    'location.transport': 'Getting Here',
    'location.transportDesc': 'About 75 minutes from Alicante Airport, 90 from Valencia',
    'location.restaurantTitle': 'Where the Locals Eat',
    'location.restaurantDesc': 'Chabada, La Bambula, Masena, Bohemians — our guide covers the places we actually go, all within walking distance of the apartment.',
    'location.viewRecommendations': 'View Restaurant Guide',

    // Booking Section
    'booking.title': 'Check Availability & Book Direct',
    'booking.description': 'Send an enquiry with your dates and we\'ll reply within 24 hours. You book directly with the owner — no platform fees, no commission.',
    'booking.name': 'Full Name',
    'booking.email': 'Email Address',
    'booking.phone': 'Phone Number',
    'booking.checkIn': 'Check-in Date',
    'booking.checkOut': 'Check-out Date',
    'booking.guests': 'Number of Guests',
    'booking.message': 'Additional Message (Optional)',
    'booking.submit': 'Send Enquiry',
    'booking.submitting': 'Sending...',
    'booking.success': 'Enquiry Sent!',
    'booking.successDesc': 'We\'ll get back to you as soon as possible.',
    'booking.error': 'Email Service Issue',
    'booking.contactInfo': 'Contact Information',
    'booking.contactDesc': 'Prefer to talk? Contact us directly with any questions about your stay.',
    'booking.emailLabel': 'Email',
    'booking.responseTime': 'We typically respond within 24 hours',

    // Footer
    'footer.tagline': 'A renovated holiday apartment 250 m from Arenal Beach, Jávea.',
    'footer.rights': 'All rights reserved.',
    'footer.quickLinks': 'Quick Links',
    'footer.guides': 'Javea Guides',
    'footer.followUs': 'Follow Us',

    // Form validation
    'form.nameRequired': 'Name must be at least 2 characters',
    'form.emailInvalid': 'Please enter a valid email address',
    'form.checkInRequired': 'Please select a check-in date',
    'form.checkOutRequired': 'Please select a check-out date',
    'form.checkOutMustBeAfterCheckIn': 'Check-out date must be after check-in date',
    'form.guestsRequired': 'Please select number of guests',
    'form.phoneRequired': 'Please enter a valid phone number',
    'form.spam': 'Spam protection triggered',

    // Guest options
    'guests.1': '1 Guest',
    'guests.2': '2 Guests',
    'guests.3': '3 Guests',
    'guests.4': '4 Guests',

    // Pricing
    'pricing.title': 'Pricing Information',
    'pricing.stayDuration': 'Stay Duration',
    'pricing.ratePerNight': 'Rate per night',
    'pricing.total': 'Total',
    'pricing.nights': 'nights',
    'pricing.longTermRate': 'Long-stay rate',
    'pricing.longTermDiscount': 'Long-stay discount applied!',
    'pricing.longTermMessage': 'Your stay of {nights} nights (5+ weeks) qualifies for our €100/night long-stay rate.',
    'pricing.discount': 'Discount',
    'pricing.cleaningFee': 'Cleaning Fee',
    'pricing.includedInTotal': 'included in total',
    'pricing.pricePerNight': 'Price per night',

    // Gallery Section
    'gallery.title': 'The Apartment in Photos',
    'gallery.description': 'Have a look around — living room, bedrooms, kitchen, bathroom and the terrace.',
    'gallery.showAll': "View all photographs",
    'gallery.livingAreas': 'Living Areas',
    'gallery.bedrooms': 'Bedrooms',
    'gallery.kitchen': 'Kitchen & Dining',
    'gallery.outdoor': 'Outdoor Spaces',
    'gallery.bathroom': 'Bathroom',
    'gallery.entrance': 'Entrance & Hallway',
    'gallery.overview': 'Apartment Overview',
    'gallery.livingRoom1': 'Living room with sofa and media wall',
    'gallery.livingRoom2': 'Living room with natural light',
    'gallery.livingRoom3': 'Living room seating area',
    'gallery.entertainment': '55-inch smart TV in the living room',
    'gallery.masterBedroom': 'Main bedroom with double bed',
    'gallery.bedroom1': 'Bedroom with built-in wardrobes',
    'gallery.bedroom2': 'Bright bedroom with natural light',
    'gallery.secondBedroom': 'Second bedroom',
    'gallery.bedroom3': 'Second bedroom with twin beds',
    'gallery.bedroom4': 'Bedroom storage',
    'gallery.bedroom5': 'Bedroom with coastal light',
    'gallery.modernKitchen': 'Forest-green fitted kitchen',
    'gallery.kitchenAppliances': 'Kitchen with induction hob and oven',
    'gallery.kitchenDining': 'Kitchen and dining area',
    'gallery.terrace1': 'Private terrace over the canal',
    'gallery.terrace2': 'Terrace dining table',
    'gallery.terrace3': 'Terrace at sunset',
    'gallery.modernBathroom': 'Renovated bathroom with rainfall shower',
    'gallery.apartmentEntrance': 'Apartment entrance',
    'gallery.hallway': 'Hallway',
    'gallery.overview1': 'Living area with canal view',
    'gallery.overview2': 'Kitchen with forest-green cabinetry',
    'gallery.overview3': 'Bedroom with quality mattress and storage',
    'gallery.overview4': 'Canal view from the apartment',

    // Testimonials Section
    'testimonials.title': 'What Our Guests Say',
    'testimonials.description': 'Real reviews from recent stays.',
    'testimonials.guest1Name': 'Carlos',
    'testimonials.guest1Location': 'Madrid, July 2025',
    'testimonials.guest1Text': 'One of the most complete holiday apartments I have stayed in — renovated, with full kitchen equipment, sheets, towels, even cooking basics. Very happy with our family weekend. Ideal location near the beach and restaurants, and unbeatable attention from Laurent.',
    'testimonials.guest2Name': 'Emma',
    'testimonials.guest2Location': 'Amsterdam, Netherlands, June 2025',
    'testimonials.guest2Text': 'We found exactly what we were looking for — a comfortable apartment within walking distance of the beach at a fair price. The terrace, beautifully lit at sunset, became our favourite spot. Impeccably clean.',
    'testimonials.guest3Name': 'Pierre & Marie',
    'testimonials.guest3Location': 'Lyon, France, June 2025',
    'testimonials.guest3Text': 'Truly just 3 minutes from the beach, surrounded by Jávea\'s best restaurants and bars — walking is the only transport you need. The kitchen is fully equipped, and the host even welcomed us with a bottle of cava.',

    // Reviews Translation
    'reviews.showOriginal': 'Show original ({lang})',
    'reviews.hideOriginal': 'Hide original ({lang})',

    // Interior Section
    'interior.title': 'Interior',
    'interior.bedrooms': 'Two double bedrooms, each with a hotel-quality mattress, blackout curtains and built-in wardrobes.',
    'interior.bathroom': 'Micro-cement bathroom with rainfall shower, wall-hung WC and soft indirect lighting.',
    'interior.kitchen': 'Forest-green fitted kitchen: induction hob, multifunction oven, dishwasher, Nespresso machine and LED task lighting.',
    'interior.lounge': 'Open-plan lounge with an oak-slat media wall, 55-inch smart TV and a sofa that converts to a single bed for an extra guest.',
    'interior.lighting': 'Dimmable LED lighting throughout for easy evenings.',
    'interior.patio': 'Private patio for slow breakfasts — or rinsing off sandy flip-flops.',
    'interior.laundry': 'Washing machine on the patio, with room to store a bike or windsurf gear.',
    'interior.connectivity': 'Zoned air conditioning and fast fibre Wi-Fi throughout.',

    // Building & Amenities Section
    'building.title': 'The Building',
    'building.security': 'Secure entrance, lift, and an allocated parking space — rare this close to the beach.',
    'building.marina': 'Moorings, SUP boards and small motorboats can be hired at Marina Nou Fontana, 150 m away.',
    'building.shopping': 'Supermarkets and a pharmacy are a five-minute walk away.',

    // Availability Calendar
    'checkAvailability': 'Check Availability',
    'availabilityDescription': 'Green dates are free, red dates are booked. The calendar syncs with our booking system daily.',
    'calendarNote': 'Found your dates? Send an enquiry below and we\'ll confirm within 24 hours.',
    'available': 'Available',
    'booked': 'Booked',
    'lastUpdated': 'Last updated',
    'datesSelected': 'Dates Selected',
    'specialOfferSelected': 'Special Offer Selected',
    'datesAutoFilled': 'Dates filled into the booking form below',
    'was': 'was',
    'specialOffer': 'Special Offer',
    'seasonalRates': 'Seasonal Rates',

    // Amenities List
    'amenityList.airConditioning': 'Air Conditioning',
    'amenityList.wifi': 'Fast Fibre Wi-Fi',
    'amenityList.smartTv': '55-inch Smart TV',
    'amenityList.kitchen': 'Fully Equipped Kitchen',
    'amenityList.waterFilter': 'Water Filter',
    'amenityList.washer': 'Washing Machine (no dryer)',
    'amenityList.parking': 'Free Private Parking',
    'amenityList.nespresso': 'Nespresso Machine',
    'amenityList.dishwasher': 'Dishwasher',
    'amenityList.showerTowels': 'Bath Towels',
    'amenityList.beachTowels': 'Beach Towels',
    'amenityList.noPets': 'No Pets',

    // Discover Paradise Section (replaces original location section)
    'paradise.title': 'Why Stay at the Arenal',
    'paradise.description1': 'The Arenal is Jávea\'s sandy beach: calm, shallow water, a long promenade of restaurants and bars, and everything you need within walking distance. It\'s the easiest base in town — you won\'t need the car.',
    'paradise.description2': 'Mornings on the beach, lunch on the promenade, an evening walk along the canal. And when you want more: coves, the old town and the Montgó Natural Park are minutes away. The neighbourhood stays open and alive all year, high season or deep winter.',
    'paradise.beach.title': 'Arenal Beach',
    'paradise.beach.description': 'Jávea\'s only sandy beach, 250 m from the door — shallow, family-friendly water, with the promenade\'s restaurants right behind it.',
    'paradise.watersports.title': 'Water Sports',
    'paradise.watersports.description': 'Kayak, paddle-board, jet-ski and diving operators cluster around the canal mouth, a few steps away.',
    'paradise.dining.title': 'Eating Out',
    'paradise.dining.description': 'Breakfast to late dinner without moving the car — canal-side rice dishes at Amarre 152, sunset drinks at Tosca, and the whole promenade in between.',
    'paradise.oldtown.title': 'The Old Town',
    'paradise.oldtown.description': '4 km away: Gothic church, covered market and weekly craft stalls. 15 minutes by bike, 5 by car.',
    'paradise.walks.title': 'Coastal Walks',
    'paradise.walks.description': 'Paths to Cap Prim and the Montgó Natural Park start just east of the Arenal promenade.',

    // Availability Section
    'availability.title': 'Check Availability & Pricing',
    'availability.subtitle': 'Live availability and seasonal rates — the calendar syncs with Airbnb daily',
    'availability.note': 'Dates blocked on Airbnb can sometimes still be booked direct — ask us before ruling yours out.',

    // Calendar
    'calendar.jan': 'Jan', 'calendar.feb': 'Feb', 'calendar.mar': 'Mar',
    'calendar.apr': 'Apr', 'calendar.may': 'May', 'calendar.jun': 'Jun',
    'calendar.jul': 'Jul', 'calendar.aug': 'Aug', 'calendar.sep': 'Sep',
    'calendar.oct': 'Oct', 'calendar.nov': 'Nov', 'calendar.dec': 'Dec',
    'calendar.sun': 'Sun', 'calendar.mon': 'Mon', 'calendar.tue': 'Tue',
    'calendar.wed': 'Wed', 'calendar.thu': 'Thu', 'calendar.fri': 'Fri', 'calendar.sat': 'Sat',
    'calendar.error': 'Error loading calendar', 'calendar.tryAgain': 'Please try again',
    'calendar.available': 'Available', 'calendar.past': 'Past',

    // Booking Information Section
    'booking.information': 'Booking Information',
    'booking.rates': 'Rates',
    'booking.highSeason': '• High season (June – September & holidays): from €210 per night',
    'booking.midSeason': '• Mid season (April, May & October): from €160 per night',
    'booking.lowSeason': '• Low season (November – March outside holidays): from €130 per night',
    'booking.minimumStay': 'Minimum Stay',
    'booking.minimumStayText': '5 nights in high season, 3 nights the rest of the year',
    'booking.checkInOut': 'Check-in & Check-out',
    'booking.checkInTime': '• Check-in: from 4:00 PM',
    'booking.checkOutTime': '• Check-out: by 12:00 noon',
    'booking.cancellation': 'Cancellation Policy',
    'booking.cancellationText': 'Free cancellation up to 30 days before check-in. Within 30 days, our cancellation policy applies.',
    'booking.directContact': 'Direct Contact',
    'booking.airbnb': 'Book on Airbnb',
    'booking.checkingAvailability': 'Checking availability...',
    'booking.datesAvailable': '✅ These dates are available — continue with your booking.',
    'booking.datesUnavailable': '❌ Those dates are taken. Try others — or ask us: Airbnb-blocked dates can sometimes be booked direct.',
    'booking.nextAvailable': 'Next available dates:',
    'booking.useSuggestedDates': 'Use These Dates',

    // Recommendations Page
    'recommendations.title': 'Where to Eat & What to Do',
    'recommendations.subtitle': 'Our honest shortlist for the Arenal and around — the places we send friends to.',
    'recommendations.restaurants': 'Restaurants',
    'recommendations.drinks': 'Bars & Drinks',
    'recommendations.breakfast': 'Breakfast & Bakery',

    // Restaurant descriptions
    'rec.chabada.desc': 'Beachside bar for drinks with your feet almost in the sand',
    'rec.chabada.hours': 'From 8am non-stop, happy hour 4–8pm, live music Thursday evenings',
    'rec.labambula.desc': 'Lively bar with live music and dancing',
    'rec.labambula.hours': '9am–1am (until 3am weekends), flamenco Sundays, swing Tuesdays, rock Fridays',
    'rec.lafontana.desc': 'Paella and Italian pizza right by the beach',
    'rec.lafontana.hours': 'Non-stop every day',
    'rec.bohemians.desc': 'Elegant dining with a polished atmosphere',
    'rec.bohemians.hours': '12pm–midnight daily',
    'rec.lamasena.desc': 'Refined cooking for a longer lunch or dinner',
    'rec.lamasena.hours': 'Mon 12:30–4:30pm; Wed–Sun 12:30–4:30pm & 7:30–10:30pm (till 11pm Sat/Sun), closed Tuesdays',
    'rec.loasis.desc': 'The place for steaks and grilled meat',
    'rec.loasis.hours': '12:30pm–11pm daily',
    'rec.casalili.desc': 'Fresh, authentic Asian cooking',
    'rec.casalili.hours': '12:30–4pm & 6:30–11pm daily',
    'rec.carnaval.desc': 'Modern fusion — sushi, burgers and poke bowls',
    'rec.carnaval.hours': 'Non-stop every day',
    'rec.caramel.desc': 'French-style bakery with fresh pastries and proper coffee',
    'rec.caramel.hours': '7:30am–7:30pm daily',

    // Common location terms
    'rec.location.beach': 'Arenal Beach',
    'rec.location.walk': 'min walk',
    'rec.location.taxi': 'min taxi',
    'rec.location.street': 'End of the street',
    'recommendations.beaches': 'Beaches',
    'recommendations.activities': 'Activities',
    'recommendations.shopping': 'Shopping',
    'recommendations.contact': 'Need a Hand?',
    'recommendations.contactText': 'Message us any time during your stay — for directions, bookings or a local tip.',
    'recommendations.backToHome': 'Back to Home',
    'contact.phone': 'Call me',
    'contact.whatsapp': 'Send me a WhatsApp',

    // Promotional Calendar
    'promotional.offerEndsIn': 'Offer ends in',
    'promotional.offerExpired': 'Offer expired',
    'promotional.discountedRate': 'Discounted Rate',
    'promotional.limitedTimeOffer': 'Limited time offer',
    'calendar.unavailable': 'Unavailable',
    'calendar.regularRate': 'Regular Rate',
  },
  nl: {
    // Navigation
    'nav.home': 'Home',
    'nav.apartment': 'Appartement',
    'nav.gallery': 'Galerij',
    'nav.rates': 'Tarieven',
    'nav.location': 'Locatie',
    'nav.booking': 'Boeken',
    'nav.recommendations': 'Aanbevelingen',

    // Hero Section
    'hero.title': 'JÁVEA BLISS',
    'hero.eyebrow': "Jávea · Costa Blanca, Spanje",
    'glance.eyebrow': "De essentie",
    'apartment.eyebrow': "Waar je verblijft",
    'amenities.eyebrow': "Binnen",
    'paradise.eyebrow': "De buurt",
    'gallery.eyebrow': "Foto's",
    'testimonials.eyebrow': "Beoordelingen",
    'rates.eyebrow': "Tarieven",
    'booking.eyebrow': "Aanvraag",
    'hero.subtitle': 'Vakantieappartement bij het Arenal strand',
    'hero.tagline': "Gerenoveerd appartement met twee slaapkamers voor vier, op 250 m van het Arenal strand. Boek direct vanaf €130 per nacht.",
    'hero.description': 'Verblijf op 250 meter van het Arenal strand, het enige zandstrand van Jávea, met een boulevard vol restaurants. Het appartement is volledig gerenoveerd, met airco, snelle wifi en gratis parkeren. Directe vluchten vanaf Amsterdam, Eindhoven en Rotterdam naar Alicante — vandaar is het nog ruim een uur rijden. Kom je met de auto? Er staat een eigen parkeerplek voor je klaar.',
    'hero.bookButton': 'Boek Je Verblijf',
    'hero.exploreButton': 'Bekijk het Appartement',

    // Apartment Section
    'apartment.title': 'Het Appartement',
    'apartment.description': 'Volledig gerenoveerd appartement op de eerste verdieping aan het rustige Nou Fontana-kanaal, één straat van het Arenal strand. Twee slaapkamers met tweepersoonsbedden, een moderne badkamer, een complete keuken en een eigen terras aan het water — plus een lift en een eigen parkeerplek.',
    'apartment.restaurantProximity': 'Restaurants om de hoek',
    'apartment.restaurantProximityDesc': 'Chabada, La Bambula, Masena en de rest van de Arenal-boulevard liggen op loopafstand.',
    'apartment.viewAllRestaurants': 'Bekijk de Restaurantgids',

    // At Glance Section
    'glance.title': 'In het kort',
    'glance.sleeps': 'Voor 4 personen',
    'glance.bedrooms': '2 slaapkamers',
    'glance.bathroom': '1 moderne badkamer',
    'glance.beach': '250 m van het Arenal strand',
    'glance.parking': 'Gratis eigen parkeerplek',
    'glance.wifi': 'Snelle glasvezel-wifi',
    'glance.ac': 'Airconditioning',
    'glance.terrace': 'Eigen terras',

    // Amenities Section
    'amenities.title': 'Voorzieningen',
    'amenities.kitchen': 'Complete Keuken',
    'amenities.kitchenDesc': 'Inductiekookplaat, oven, vaatwasser, magnetron en een Nespresso-apparaat — alles om zelf te koken.',
    'amenities.comfort': 'Verwarming & Airco',
    'amenities.comfortDesc': 'Airco én verwarming per zone — comfortabel in augustus, maar net zo goed in januari.',
    'amenities.entertainment': 'Smart TV & Streaming',
    'amenities.entertainmentDesc': '55-inch smart TV en glasvezel-wifi, snel genoeg om te streamen — of een dag thuis te werken.',
    'amenities.laundry': 'Wasmachine',
    'amenities.laundryDesc': 'Wasmachine op de patio (geen droger).',
    'amenities.outdoor': 'Eigen Terras',
    'amenities.outdoorDesc': 'Terras aan het kanaal — voor het ontbijt buiten of een borrel in de avond.',
    'amenities.parking': 'Gratis Parkeren',
    'amenities.parkingDesc': 'Een eigen parkeerplek — zeldzaam zo dicht bij het Arenal strand.',

    // Rates Section
    'rates.title': 'Tarieven & Voorwaarden',
    'rates.description': 'Heldere seizoensprijzen, zonder platformkosten als je direct boekt. Verblijf je 5 weken of langer? Dan geldt ons langverblijftarief van €100 per nacht — ideaal om te overwinteren aan de Costa Blanca.',
    'rates.highSeason': 'Hoogseizoen',
    'rates.highPeriod': 'Juni – september & feestdagen',
    'rates.highRate': 'Vanaf €210 per nacht',
    'rates.midSeason': 'Middenseizoen',
    'rates.midPeriod': 'April, mei & oktober',
    'rates.midRate': 'Vanaf €160 per nacht',
    'rates.lowSeason': 'Laagseizoen',
    'rates.lowPeriod': 'November – maart (buiten feestdagen)',
    'rates.lowRate': 'Vanaf €130 per nacht',
    'rates.policies': 'Boekingsvoorwaarden',
    'rates.policy1': 'Minimaal 5 nachten in het hoogseizoen',
    'rates.policy2': 'Minimaal 3 nachten in de rest van het jaar',
    'rates.policy3': 'Inchecken vanaf 16:00 uur',
    'rates.policy4': 'Uitchecken vóór 12:00 uur',

    // Location Section (original entries)
    'location.title': 'De Locatie',
    'location.description': 'Marina Nou Fontana, de kanaalwijk van het Arenal — de gezelligste buurt van Jávea, één straat van het strand.',
    'location.beach': 'Arenal strand',
    'location.beachDesc': 'Op 250 m — zandstrand, ondiep en kindvriendelijk',
    'location.restaurants': 'Restaurants',
    'location.restaurantsDesc': 'De bars en restaurants van de boulevard, 2 tot 5 minuten lopen',
    'location.shops': 'Winkels',
    'location.shopsDesc': 'Supermarkten en een apotheek op 5 minuten lopen',
    'location.transport': 'Bereikbaarheid',
    'location.transportDesc': 'Circa 75 minuten van Alicante Airport, 90 van Valencia',
    'location.restaurantTitle': 'Waar de locals eten',
    'location.restaurantDesc': 'Chabada, La Bambula, Masena, Bohemians — onze gids staat vol adressen waar we zelf komen, allemaal op loopafstand van het appartement.',
    'location.viewRecommendations': 'Bekijk de Restaurantgids',

    // Booking Section
    'booking.title': 'Check Beschikbaarheid & Boek Direct',
    'booking.description': 'Stuur een aanvraag met je data en je hoort binnen 24 uur van ons. Je boekt rechtstreeks bij de eigenaar — zonder platformkosten of commissie.',
    'booking.name': 'Volledige Naam',
    'booking.email': 'E-mailadres',
    'booking.phone': 'Telefoonnummer',
    'booking.checkIn': 'Incheckdatum',
    'booking.checkOut': 'Uitcheckdatum',
    'booking.guests': 'Aantal Gasten',
    'booking.message': 'Extra Bericht (Optioneel)',
    'booking.submit': 'Verstuur Aanvraag',
    'booking.submitting': 'Versturen...',
    'booking.success': 'Aanvraag Verstuurd!',
    'booking.successDesc': 'We nemen zo snel mogelijk contact met je op.',
    'booking.error': 'Probleem met e-mailservice',
    'booking.contactInfo': 'Contactgegevens',
    'booking.contactDesc': 'Liever even rechtstreeks contact? Stel je vraag over je verblijf gerust direct.',
    'booking.emailLabel': 'E-mail',
    'booking.responseTime': 'We reageren meestal binnen 24 uur',

    // Footer
    'footer.tagline': 'Gerenoveerd vakantieappartement op 250 m van het Arenal strand, Jávea.',
    'footer.rights': 'Alle rechten voorbehouden.',
    'footer.quickLinks': 'Snelle Links',
    'footer.guides': 'Jávea-gidsen (in het Engels)',
    'footer.followUs': 'Volg Ons',

    // Form validation
    'form.nameRequired': 'Naam moet minimaal 2 tekens bevatten',
    'form.emailInvalid': 'Vul een geldig e-mailadres in',
    'form.checkInRequired': 'Kies een incheckdatum',
    'form.checkOutRequired': 'Kies een uitcheckdatum',
    'form.checkOutMustBeAfterCheckIn': 'De uitcheckdatum moet na de incheckdatum liggen',
    'form.guestsRequired': 'Kies het aantal gasten',
    'form.phoneRequired': 'Vul een geldig telefoonnummer in',
    'form.spam': 'Spambeveiliging geactiveerd',

    // Guest options
    'guests.1': '1 Gast',
    'guests.2': '2 Gasten',
    'guests.3': '3 Gasten',
    'guests.4': '4 Gasten',

    // Pricing
    'pricing.title': 'Prijsinformatie',
    'pricing.stayDuration': 'Verblijfsduur',
    'pricing.ratePerNight': 'Tarief per nacht',
    'pricing.total': 'Totaal',
    'pricing.nights': 'nachten',
    'pricing.longTermRate': 'Langverblijftarief',
    'pricing.longTermDiscount': 'Langverblijfkorting toegepast!',
    'pricing.longTermMessage': 'Je verblijf van {nights} nachten (5+ weken) komt in aanmerking voor ons tarief van €100 per nacht.',
    'pricing.discount': 'Korting',
    'pricing.cleaningFee': 'Schoonmaakkosten',
    'pricing.includedInTotal': 'inbegrepen in totaal',
    'pricing.pricePerNight': 'Prijs per nacht',

    // Gallery Section
    'gallery.title': 'Het Appartement in Beeld',
    'gallery.description': 'Kijk rustig rond — woonkamer, slaapkamers, keuken, badkamer en het terras.',
    'gallery.showAll': "Bekijk alle foto's",
    'gallery.livingAreas': 'Woonruimtes',
    'gallery.bedrooms': 'Slaapkamers',
    'gallery.kitchen': 'Keuken & Eethoek',
    'gallery.outdoor': 'Buitenruimtes',
    'gallery.bathroom': 'Badkamer',
    'gallery.entrance': 'Entree & Hal',
    'gallery.overview': 'Overzicht',
    'gallery.livingRoom1': 'Woonkamer met bank en tv-wand',
    'gallery.livingRoom2': 'Woonkamer met veel daglicht',
    'gallery.livingRoom3': 'Zithoek in de woonkamer',
    'gallery.entertainment': '55-inch smart TV in de woonkamer',
    'gallery.masterBedroom': 'Hoofdslaapkamer met tweepersoonsbed',
    'gallery.bedroom1': 'Slaapkamer met inbouwkasten',
    'gallery.bedroom2': 'Lichte slaapkamer',
    'gallery.secondBedroom': 'Tweede slaapkamer',
    'gallery.bedroom3': 'Tweede slaapkamer met twee eenpersoonsbedden',
    'gallery.bedroom4': 'Kastruimte in de slaapkamer',
    'gallery.bedroom5': 'Slaapkamer met zeelicht',
    'gallery.modernKitchen': 'Keuken in flessengroen',
    'gallery.kitchenAppliances': 'Keuken met inductiekookplaat en oven',
    'gallery.kitchenDining': 'Keuken met eethoek',
    'gallery.terrace1': 'Eigen terras aan het kanaal',
    'gallery.terrace2': 'Eettafel op het terras',
    'gallery.terrace3': 'Het terras bij zonsondergang',
    'gallery.modernBathroom': 'Gerenoveerde badkamer met regendouche',
    'gallery.apartmentEntrance': 'Entree van het appartement',
    'gallery.hallway': 'Hal',
    'gallery.overview1': 'Woonruimte met zicht op het kanaal',
    'gallery.overview2': 'Keuken met flessengroene kasten',
    'gallery.overview3': 'Slaapkamer met goed matras en kastruimte',
    'gallery.overview4': 'Uitzicht op het kanaal vanuit het appartement',

    // Testimonials Section
    'testimonials.title': 'Wat Onze Gasten Zeggen',
    'testimonials.description': 'Echte beoordelingen van recente verblijven.',
    'testimonials.guest1Name': 'Carlos',
    'testimonials.guest1Location': 'Madrid, juli 2025',
    'testimonials.guest1Text': 'Een van de meest complete vakantieappartementen waar ik ooit heb gelogeerd — gerenoveerd, met volledig uitgeruste keuken, lakens, handdoeken en zelfs basisingrediënten. Heel blij met ons familieweekend. Ideale ligging bij het strand en de restaurants, en geweldige service van Laurent.',
    'testimonials.guest2Name': 'Emma',
    'testimonials.guest2Location': 'Amsterdam, juni 2025',
    'testimonials.guest2Text': 'We vonden precies wat we zochten — een comfortabel appartement op loopafstand van het strand voor een eerlijke prijs. Het terras, prachtig verlicht bij zonsondergang, werd onze favoriete plek. Brandschoon.',
    'testimonials.guest3Name': 'Pierre & Marie',
    'testimonials.guest3Location': 'Lyon, Frankrijk, juni 2025',
    'testimonials.guest3Text': 'Echt maar 3 minuten van het strand, omringd door de beste restaurants en bars van Jávea — lopen is het enige vervoer dat je nodig hebt. De keuken is compleet uitgerust en de gastheer verwelkomde ons zelfs met een fles cava.',

    // Reviews Translation
    'reviews.showOriginal': 'Toon origineel ({lang})',
    'reviews.hideOriginal': 'Verberg origineel ({lang})',

    // Interior Section
    'interior.title': 'Interieur',
    'interior.bedrooms': 'Twee slaapkamers met tweepersoonsbedden, hotelkwaliteit matrassen, verduisterende gordijnen en inbouwkasten.',
    'interior.bathroom': 'Badkamer in microcement met regendouche, zwevend toilet en zachte indirecte verlichting.',
    'interior.kitchen': 'Flessengroene keuken: inductiekookplaat, multifunctionele oven, vaatwasser, Nespresso-apparaat en LED-werkverlichting.',
    'interior.lounge': 'Open woonkamer met eikenhouten lattenwand, 55-inch smart TV en een bank die uitklapt tot eenpersoonsbed voor een extra gast.',
    'interior.lighting': 'Dimbare LED-verlichting voor ontspannen avonden.',
    'interior.patio': 'Eigen patio voor een rustig ontbijt — of om zanderige slippers af te spoelen.',
    'interior.laundry': 'Wasmachine op de patio, met ruimte voor een fiets of surfspullen.',
    'interior.connectivity': 'Airco per zone en snelle glasvezel-wifi in het hele appartement.',

    // Building & Amenities Section
    'building.title': 'Het Gebouw',
    'building.security': 'Beveiligde entree, lift en een eigen parkeerplek — zeldzaam zo dicht bij het strand.',
    'building.marina': 'Aanlegplaatsen, supboards en motorbootjes huur je bij Marina Nou Fontana, 150 m verderop.',
    'building.shopping': 'Supermarkten en een apotheek liggen op vijf minuten lopen.',

    // Availability Calendar
    'checkAvailability': 'Check Beschikbaarheid',
    'availabilityDescription': 'Groene data zijn vrij, rode data zijn geboekt. De kalender synchroniseert dagelijks met ons boekingssysteem.',
    'calendarNote': 'Data gevonden? Stuur hieronder een aanvraag en we bevestigen binnen 24 uur.',
    'available': 'Beschikbaar',
    'booked': 'Geboekt',
    'lastUpdated': 'Laatst bijgewerkt',
    'datesSelected': 'Data Geselecteerd',
    'specialOfferSelected': 'Aanbieding Geselecteerd',
    'datesAutoFilled': 'Data ingevuld in het boekingsformulier hieronder',
    'was': 'was',
    'specialOffer': 'Aanbieding',
    'seasonalRates': 'Seizoenstarieven',

    // Amenities List
    'amenityList.airConditioning': 'Airconditioning',
    'amenityList.wifi': 'Snelle Glasvezel-wifi',
    'amenityList.smartTv': '55-inch Smart TV',
    'amenityList.kitchen': 'Complete Keuken',
    'amenityList.waterFilter': 'Waterfilter',
    'amenityList.washer': 'Wasmachine (geen droger)',
    'amenityList.parking': 'Gratis Eigen Parkeerplek',
    'amenityList.nespresso': 'Nespresso-apparaat',
    'amenityList.dishwasher': 'Vaatwasser',
    'amenityList.showerTowels': 'Badhanddoeken',
    'amenityList.beachTowels': 'Strandhanddoeken',
    'amenityList.noPets': 'Geen Huisdieren',

    // Discover Paradise Section (replaces original location section)
    'paradise.title': 'Waarom het Arenal',
    'paradise.description1': 'Het Arenal is het zandstrand van Jávea: rustig, ondiep water, een lange boulevard vol restaurants en bars, en alles wat je nodig hebt op loopafstand. De makkelijkste uitvalsbasis van de stad — de auto kan blijven staan.',
    'paradise.description2': 'Ochtenden op het strand, lunchen op de boulevard, \'s avonds een wandeling langs het kanaal. En als je meer wilt: de baaitjes, de oude stad en natuurpark Montgó liggen op een paar minuten. De buurt leeft het hele jaar door — ook in de winter, ideaal voor overwinteraars.',
    'paradise.beach.title': 'Arenal strand',
    'paradise.beach.description': 'Het enige zandstrand van Jávea, op 250 m van de deur — ondiep, kindvriendelijk water met de restaurants van de boulevard er direct achter.',
    'paradise.watersports.title': 'Watersport',
    'paradise.watersports.description': 'Kajak-, sup-, jetski- en duikverhuur zitten allemaal rond de monding van het kanaal, op een paar stappen afstand.',
    'paradise.dining.title': 'Uit Eten',
    'paradise.dining.description': 'Van ontbijt tot late dinertjes zonder de auto te pakken — rijstgerechten aan het kanaal bij Amarre 152, zonsondergang met een drankje bij Tosca, en de hele boulevard daartussenin.',
    'paradise.oldtown.title': 'De Oude Stad',
    'paradise.oldtown.description': 'Op 4 km: gotische kerk, overdekte markt en wekelijkse kraampjes. 15 minuten fietsen, 5 minuten met de auto.',
    'paradise.walks.title': 'Kustwandelingen',
    'paradise.walks.description': 'Paden naar Cap Prim en natuurpark Montgó beginnen net ten oosten van de Arenal-boulevard.',

    // Availability Section
    'availability.title': 'Beschikbaarheid & Prijzen',
    'availability.subtitle': 'Actuele beschikbaarheid en seizoenstarieven — de kalender synchroniseert dagelijks met Airbnb',
    'availability.note': 'Data die op Airbnb geblokkeerd zijn, kunnen soms tóch direct geboekt worden — vraag het ons even.',

    // Calendar
    'calendar.jan': 'Jan', 'calendar.feb': 'Feb', 'calendar.mar': 'Mrt',
    'calendar.apr': 'Apr', 'calendar.may': 'Mei', 'calendar.jun': 'Jun',
    'calendar.jul': 'Jul', 'calendar.aug': 'Aug', 'calendar.sep': 'Sep',
    'calendar.oct': 'Okt', 'calendar.nov': 'Nov', 'calendar.dec': 'Dec',
    'calendar.sun': 'Zo', 'calendar.mon': 'Ma', 'calendar.tue': 'Di',
    'calendar.wed': 'Wo', 'calendar.thu': 'Do', 'calendar.fri': 'Vr', 'calendar.sat': 'Za',
    'calendar.error': 'Fout bij laden van kalender', 'calendar.tryAgain': 'Probeer het opnieuw',
    'calendar.available': 'Beschikbaar', 'calendar.past': 'Voorbij',

    // Booking Information Section
    'booking.information': 'Boekingsinformatie',
    'booking.rates': 'Tarieven',
    'booking.highSeason': '• Hoogseizoen (juni – september & feestdagen): vanaf €210 per nacht',
    'booking.midSeason': '• Middenseizoen (april, mei & oktober): vanaf €160 per nacht',
    'booking.lowSeason': '• Laagseizoen (november – maart buiten feestdagen): vanaf €130 per nacht',
    'booking.minimumStay': 'Minimaal Verblijf',
    'booking.minimumStayText': '5 nachten in het hoogseizoen, 3 nachten in de rest van het jaar',
    'booking.checkInOut': 'In- & Uitchecken',
    'booking.checkInTime': '• Inchecken: vanaf 16:00 uur',
    'booking.checkOutTime': '• Uitchecken: vóór 12:00 uur',
    'booking.cancellation': 'Annuleringsvoorwaarden',
    'booking.cancellationText': 'Gratis annuleren tot 30 dagen voor aankomst. Binnen 30 dagen gelden onze annuleringsvoorwaarden.',
    'booking.directContact': 'Direct Contact',
    'booking.airbnb': 'Boek via Airbnb',
    'booking.checkingAvailability': 'Beschikbaarheid controleren...',
    'booking.datesAvailable': '✅ Deze data zijn beschikbaar — ga verder met je boeking.',
    'booking.datesUnavailable': '❌ Deze data zijn bezet. Probeer andere — of vraag het ons: op Airbnb geblokkeerde data zijn soms direct wél te boeken.',
    'booking.nextAvailable': 'Eerstvolgende beschikbare data:',
    'booking.useSuggestedDates': 'Gebruik Deze Data',

    // Recommendations Page
    'recommendations.title': 'Waar Eten & Wat Doen',
    'recommendations.subtitle': 'Onze eerlijke shortlist voor het Arenal en omgeving — de adressen waar we vrienden naartoe sturen.',
    'recommendations.restaurants': 'Restaurants',
    'recommendations.drinks': 'Bars & Drankjes',
    'recommendations.breakfast': 'Ontbijt & Bakkerij',

    // Restaurant descriptions
    'rec.chabada.desc': 'Strandbar voor een drankje met je voeten bijna in het zand',
    'rec.chabada.hours': 'Vanaf 8:00 doorlopend open, happy hour 16–20 uur, live muziek op donderdagavond',
    'rec.labambula.desc': 'Levendige bar met live muziek en dansen',
    'rec.labambula.hours': '9:00–1:00 (weekend tot 3:00), flamenco op zondag, swing op dinsdag, rock op vrijdag',
    'rec.lafontana.desc': 'Paella en Italiaanse pizza direct aan het strand',
    'rec.lafontana.hours': 'Elke dag doorlopend open',
    'rec.bohemians.desc': 'Elegant dineren in een verzorgde sfeer',
    'rec.bohemians.hours': '12:00–24:00 (dagelijks)',
    'rec.lamasena.desc': 'Verfijnde keuken voor een lange lunch of diner',
    'rec.lamasena.hours': 'Ma 12:30–16:30; wo–zo 12:30–16:30 & 19:30–22:30 (za/zo tot 23:00), dinsdag gesloten',
    'rec.loasis.desc': 'Hét adres voor steaks en gegrild vlees',
    'rec.loasis.hours': '12:30–23:00 (dagelijks)',
    'rec.casalili.desc': 'Verse, authentieke Aziatische keuken',
    'rec.casalili.hours': '12:30–16:00 & 18:30–23:00 (dagelijks)',
    'rec.carnaval.desc': 'Moderne fusion — sushi, burgers en poké bowls',
    'rec.carnaval.hours': 'Elke dag doorlopend open',
    'rec.caramel.desc': 'Franse bakkerij met verse croissants en goede koffie',
    'rec.caramel.hours': '7:30–19:30 (dagelijks)',

    // Common location terms
    'rec.location.beach': 'Arenal strand',
    'rec.location.walk': 'min lopen',
    'rec.location.taxi': 'min met de taxi',
    'rec.location.street': 'Einde van de straat',
    'recommendations.beaches': 'Stranden',
    'recommendations.activities': 'Activiteiten',
    'recommendations.shopping': 'Winkelen',
    'recommendations.contact': 'Hulp nodig?',
    'recommendations.contactText': 'Stuur ons gerust een berichtje tijdens je verblijf — voor een routebeschrijving, reservering of een lokale tip.',
    'recommendations.backToHome': 'Terug naar Home',
    'contact.phone': 'Bel me',
    'contact.whatsapp': 'Stuur me een WhatsApp',

    // Promotional Calendar
    'promotional.offerEndsIn': 'Aanbieding eindigt over',
    'promotional.offerExpired': 'Aanbieding verlopen',
    'promotional.discountedRate': 'Kortingstarief',
    'promotional.limitedTimeOffer': 'Tijdelijke aanbieding',
    'calendar.unavailable': 'Niet beschikbaar',
    'calendar.regularRate': 'Normaal Tarief',
  },
  fr: {
    // Navigation
    'nav.home': 'Accueil',
    'nav.apartment': 'Appartement',
    'nav.gallery': 'Galerie',
    'nav.rates': 'Tarifs',
    'nav.location': 'Emplacement',
    'nav.booking': 'Réserver',
    'nav.recommendations': 'Recommandations',

    // Hero Section
    'hero.title': 'JÁVEA BLISS',
    'hero.eyebrow': "Jávea · Costa Blanca, Espagne",
    'glance.eyebrow': "L'essentiel",
    'apartment.eyebrow': "Votre logement",
    'amenities.eyebrow': "À l'intérieur",
    'paradise.eyebrow': "Le quartier",
    'gallery.eyebrow': "Photographies",
    'testimonials.eyebrow': "Avis",
    'rates.eyebrow': "Tarifs",
    'booking.eyebrow': "Demande",
    'hero.subtitle': 'Appartement de vacances près de la plage de l\'Arenal',
    'hero.tagline': "Appartement rénové de deux chambres pour quatre, à 250 m de la plage de l'Arenal. Réservez en direct dès 130 € la nuit.",
    'hero.description': 'Séjournez à 250 mètres de la plage de l\'Arenal, la plage de sable de Jávea, bordée d\'une promenade pleine de restaurants. L\'appartement est entièrement rénové, avec climatisation, wifi fibre et parking gratuit. Depuis la France, comptez environ 7 h de route depuis Toulouse par l\'AP-7 — ou un vol pour Alicante, puis 1 h 15 de trajet. Une place de parking privée vous attend à l\'arrivée.',
    'hero.bookButton': 'Réserver Votre Séjour',
    'hero.exploreButton': 'Découvrir l\'Appartement',

    // Apartment Section
    'apartment.title': 'L\'Appartement',
    'apartment.description': 'Appartement entièrement rénové au premier étage, au bord du paisible canal Nou Fontana, à une rue de la plage de l\'Arenal. Deux chambres doubles, une salle de bain moderne, une cuisine équipée et une terrasse privée au-dessus de l\'eau — avec ascenseur et place de parking privée.',
    'apartment.restaurantProximity': 'Les restaurants à deux pas',
    'apartment.restaurantProximityDesc': 'Chabada, La Bambula, Masena et toute la promenade de l\'Arenal sont accessibles à pied.',
    'apartment.viewAllRestaurants': 'Voir le Guide des Restaurants',

    // At Glance Section
    'glance.title': 'En un coup d\'œil',
    'glance.sleeps': 'Pour 4 personnes',
    'glance.bedrooms': '2 chambres doubles',
    'glance.bathroom': '1 salle de bain moderne',
    'glance.beach': 'À 250 m de la plage de l\'Arenal',
    'glance.parking': 'Parking privé gratuit',
    'glance.wifi': 'Wifi fibre rapide',
    'glance.ac': 'Climatisation',
    'glance.terrace': 'Terrasse privée',

    // Amenities Section
    'amenities.title': 'Équipements',
    'amenities.kitchen': 'Cuisine Équipée',
    'amenities.kitchenDesc': 'Plaque à induction, four, lave-vaisselle, micro-ondes et machine Nespresso — tout pour cuisiner comme à la maison.',
    'amenities.comfort': 'Chauffage & Climatisation',
    'amenities.comfortDesc': 'Climatisation et chauffage par zones : l\'appartement reste agréable en août comme en janvier.',
    'amenities.entertainment': 'Smart TV & Streaming',
    'amenities.entertainmentDesc': 'Smart TV 55 pouces et wifi fibre, assez rapide pour le streaming — ou une journée de télétravail.',
    'amenities.laundry': 'Lave-linge',
    'amenities.laundryDesc': 'Lave-linge sur le patio (pas de sèche-linge).',
    'amenities.outdoor': 'Terrasse Privée',
    'amenities.outdoorDesc': 'Une terrasse au bord du canal, pour le petit-déjeuner dehors ou l\'apéritif du soir.',
    'amenities.parking': 'Parking Gratuit',
    'amenities.parkingDesc': 'Votre propre place attitrée — un vrai luxe si près de la plage de l\'Arenal.',

    // Rates Section
    'rates.title': 'Tarifs & Conditions',
    'rates.description': 'Des prix saisonniers clairs, sans frais de plateforme en réservation directe. À partir de 5 semaines, profitez de notre tarif longue durée à 100 € la nuit — idéal pour hiverner au soleil de la Costa Blanca.',
    'rates.highSeason': 'Haute Saison',
    'rates.highPeriod': 'Juin – septembre & jours fériés',
    'rates.highRate': 'Dès 210 € la nuit',
    'rates.midSeason': 'Moyenne Saison',
    'rates.midPeriod': 'Avril, mai & octobre',
    'rates.midRate': 'Dès 160 € la nuit',
    'rates.lowSeason': 'Basse Saison',
    'rates.lowPeriod': 'Novembre – mars (hors vacances)',
    'rates.lowRate': 'Dès 130 € la nuit',
    'rates.policies': 'Conditions de Réservation',
    'rates.policy1': '5 nuits minimum en haute saison',
    'rates.policy2': '3 nuits minimum le reste de l\'année',
    'rates.policy3': 'Arrivée à partir de 16 h',
    'rates.policy4': 'Départ avant 12 h',

    // Location Section (original entries)
    'location.title': 'L\'Emplacement',
    'location.description': 'Marina Nou Fontana, le quartier des canaux de l\'Arenal — le quartier le plus vivant de Jávea, à une rue de la plage.',
    'location.beach': 'Plage de l\'Arenal',
    'location.beachDesc': 'À 250 m — sable fin, eau peu profonde, parfaite en famille',
    'location.restaurants': 'Restaurants',
    'location.restaurantsDesc': 'Les bars et restaurants de la promenade, à 2–5 minutes à pied',
    'location.shops': 'Commerces',
    'location.shopsDesc': 'Supermarchés et pharmacie à 5 minutes à pied',
    'location.transport': 'Accès',
    'location.transportDesc': 'Environ 1 h 15 de l\'aéroport d\'Alicante, 1 h 30 de Valence',
    'location.restaurantTitle': 'Où mangent les habitués',
    'location.restaurantDesc': 'Chabada, La Bambula, Masena, Bohemians — notre guide réunit les adresses où nous allons vraiment, toutes accessibles à pied depuis l\'appartement.',
    'location.viewRecommendations': 'Voir le Guide des Restaurants',

    // Booking Section
    'booking.title': 'Vérifier les Disponibilités & Réserver en Direct',
    'booking.description': 'Envoyez une demande avec vos dates : réponse sous 24 h. Vous réservez directement auprès du propriétaire — sans frais de plateforme ni commission.',
    'booking.name': 'Nom Complet',
    'booking.email': 'Adresse E-mail',
    'booking.phone': 'Numéro de Téléphone',
    'booking.checkIn': 'Date d\'Arrivée',
    'booking.checkOut': 'Date de Départ',
    'booking.guests': 'Nombre de Personnes',
    'booking.message': 'Message Complémentaire (Facultatif)',
    'booking.submit': 'Envoyer la Demande',
    'booking.submitting': 'Envoi...',
    'booking.success': 'Demande Envoyée !',
    'booking.successDesc': 'Nous vous répondrons dans les plus brefs délais.',
    'booking.error': 'Problème de service e-mail',
    'booking.contactInfo': 'Coordonnées',
    'booking.contactDesc': 'Vous préférez nous parler directement ? Contactez-nous pour toute question sur votre séjour.',
    'booking.emailLabel': 'E-mail',
    'booking.responseTime': 'Nous répondons généralement sous 24 h',

    // Footer
    'footer.tagline': 'Appartement de vacances rénové à 250 m de la plage de l\'Arenal, Jávea.',
    'footer.rights': 'Tous droits réservés.',
    'footer.quickLinks': 'Liens Rapides',
    'footer.guides': 'Guides Jávea (en anglais)',
    'footer.followUs': 'Suivez-nous',

    // Form validation
    'form.nameRequired': 'Le nom doit contenir au moins 2 caractères',
    'form.emailInvalid': 'Veuillez saisir une adresse e-mail valide',
    'form.checkInRequired': 'Veuillez choisir une date d\'arrivée',
    'form.checkOutRequired': 'Veuillez choisir une date de départ',
    'form.checkOutMustBeAfterCheckIn': 'La date de départ doit être postérieure à la date d\'arrivée',
    'form.guestsRequired': 'Veuillez indiquer le nombre de personnes',
    'form.phoneRequired': 'Veuillez saisir un numéro de téléphone valide',
    'form.spam': 'Protection anti-spam déclenchée',

    // Guest options
    'guests.1': '1 Personne',
    'guests.2': '2 Personnes',
    'guests.3': '3 Personnes',
    'guests.4': '4 Personnes',

    // Pricing
    'pricing.title': 'Informations Tarifaires',
    'pricing.stayDuration': 'Durée du Séjour',
    'pricing.ratePerNight': 'Tarif par nuit',
    'pricing.total': 'Total',
    'pricing.nights': 'nuits',
    'pricing.longTermRate': 'Tarif longue durée',
    'pricing.longTermDiscount': 'Remise longue durée appliquée !',
    'pricing.longTermMessage': 'Votre séjour de {nights} nuits (5 semaines ou plus) bénéficie de notre tarif de 100 € la nuit.',
    'pricing.discount': 'Remise',
    'pricing.cleaningFee': 'Frais de Ménage',
    'pricing.includedInTotal': 'inclus dans le total',
    'pricing.pricePerNight': 'Prix par nuit',

    // Gallery Section
    'gallery.title': 'L\'Appartement en Photos',
    'gallery.description': 'Faites le tour — salon, chambres, cuisine, salle de bain et terrasse.',
    'gallery.showAll': "Voir toutes les photos",
    'gallery.livingAreas': 'Pièces à Vivre',
    'gallery.bedrooms': 'Chambres',
    'gallery.kitchen': 'Cuisine & Repas',
    'gallery.outdoor': 'Extérieurs',
    'gallery.bathroom': 'Salle de Bain',
    'gallery.entrance': 'Entrée & Couloir',
    'gallery.overview': 'Vue d\'Ensemble',
    'gallery.livingRoom1': 'Salon avec canapé et mur TV',
    'gallery.livingRoom2': 'Salon baigné de lumière',
    'gallery.livingRoom3': 'Coin salon',
    'gallery.entertainment': 'Smart TV 55 pouces dans le salon',
    'gallery.masterBedroom': 'Chambre principale avec lit double',
    'gallery.bedroom1': 'Chambre avec placards intégrés',
    'gallery.bedroom2': 'Chambre lumineuse',
    'gallery.secondBedroom': 'Deuxième chambre',
    'gallery.bedroom3': 'Deuxième chambre avec lits jumeaux',
    'gallery.bedroom4': 'Rangements de la chambre',
    'gallery.bedroom5': 'Chambre à la lumière côtière',
    'gallery.modernKitchen': 'Cuisine aménagée vert forêt',
    'gallery.kitchenAppliances': 'Cuisine avec plaque à induction et four',
    'gallery.kitchenDining': 'Cuisine et coin repas',
    'gallery.terrace1': 'Terrasse privée sur le canal',
    'gallery.terrace2': 'Table à manger sur la terrasse',
    'gallery.terrace3': 'La terrasse au coucher du soleil',
    'gallery.modernBathroom': 'Salle de bain rénovée avec douche à effet pluie',
    'gallery.apartmentEntrance': 'Entrée de l\'appartement',
    'gallery.hallway': 'Couloir',
    'gallery.overview1': 'Pièce à vivre avec vue sur le canal',
    'gallery.overview2': 'Cuisine aux façades vert forêt',
    'gallery.overview3': 'Chambre avec literie de qualité et rangements',
    'gallery.overview4': 'Vue sur le canal depuis l\'appartement',

    // Testimonials Section
    'testimonials.title': 'Ce que Disent Nos Voyageurs',
    'testimonials.description': 'Avis réels de séjours récents.',
    'testimonials.guest1Name': 'Carlos',
    'testimonials.guest1Location': 'Madrid, juillet 2025',
    'testimonials.guest1Text': 'L\'un des appartements de vacances les plus complets où j\'ai séjourné — rénové, avec cuisine entièrement équipée, draps, serviettes et même des ingrédients de base. Très contents de notre week-end en famille. Emplacement idéal près de la plage et des restaurants, et un accueil irréprochable de Laurent.',
    'testimonials.guest2Name': 'Emma',
    'testimonials.guest2Location': 'Amsterdam, Pays-Bas, juin 2025',
    'testimonials.guest2Text': 'Exactement ce que nous cherchions — un appartement confortable à quelques minutes à pied de la plage, à un prix juste. La terrasse, joliment éclairée au coucher du soleil, est devenue notre endroit préféré. Propreté impeccable.',
    'testimonials.guest3Name': 'Pierre & Marie',
    'testimonials.guest3Location': 'Lyon, France, juin 2025',
    'testimonials.guest3Text': 'Vraiment à 3 minutes de la plage, entouré des meilleurs restaurants et bars de Jávea — la marche est le seul moyen de transport dont vous aurez besoin. La cuisine est parfaitement équipée, et l\'hôte nous a même accueillis avec une bouteille de cava.',

    // Reviews Translation
    'reviews.showOriginal': 'Voir l\'original ({lang})',
    'reviews.hideOriginal': 'Masquer l\'original ({lang})',

    // Interior Section
    'interior.title': 'Intérieur',
    'interior.bedrooms': 'Deux chambres doubles, chacune avec matelas de qualité hôtelière, rideaux occultants et placards intégrés.',
    'interior.bathroom': 'Salle de bain en béton ciré avec douche à effet pluie, WC suspendu et éclairage indirect doux.',
    'interior.kitchen': 'Cuisine vert forêt : plaque à induction, four multifonction, lave-vaisselle, machine Nespresso et éclairage LED.',
    'interior.lounge': 'Salon ouvert avec mur TV en lattes de chêne, smart TV 55 pouces et canapé convertible en lit simple pour un invité supplémentaire.',
    'interior.lighting': 'Éclairage LED à intensité variable pour des soirées tranquilles.',
    'interior.patio': 'Patio privé pour les petits-déjeuners au calme — ou rincer les tongs pleines de sable.',
    'interior.laundry': 'Lave-linge sur le patio, avec de la place pour ranger un vélo ou une planche.',
    'interior.connectivity': 'Climatisation par zones et wifi fibre rapide dans tout l\'appartement.',

    // Building & Amenities Section
    'building.title': 'La Résidence',
    'building.security': 'Entrée sécurisée, ascenseur et place de parking attitrée — rare si près de la plage.',
    'building.marina': 'Anneaux d\'amarrage, paddles et petits bateaux à moteur se louent à la Marina Nou Fontana, à 150 m.',
    'building.shopping': 'Supermarchés et pharmacie à cinq minutes à pied.',

    // Availability Calendar
    'checkAvailability': 'Vérifier les Disponibilités',
    'availabilityDescription': 'Les dates vertes sont libres, les rouges déjà réservées. Le calendrier se synchronise chaque jour avec notre système de réservation.',
    'calendarNote': 'Vos dates sont libres ? Envoyez une demande ci-dessous, confirmation sous 24 h.',
    'available': 'Disponible',
    'booked': 'Réservé',
    'lastUpdated': 'Dernière mise à jour',
    'datesSelected': 'Dates Sélectionnées',
    'specialOfferSelected': 'Offre Spéciale Sélectionnée',
    'datesAutoFilled': 'Dates reportées dans le formulaire de réservation ci-dessous',
    'was': 'au lieu de',
    'specialOffer': 'Offre Spéciale',
    'seasonalRates': 'Tarifs Saisonniers',

    // Amenities List
    'amenityList.airConditioning': 'Climatisation',
    'amenityList.wifi': 'Wifi Fibre Rapide',
    'amenityList.smartTv': 'Smart TV 55 pouces',
    'amenityList.kitchen': 'Cuisine Équipée',
    'amenityList.waterFilter': 'Filtre à Eau',
    'amenityList.washer': 'Lave-linge (pas de sèche-linge)',
    'amenityList.parking': 'Parking Privé Gratuit',
    'amenityList.nespresso': 'Machine Nespresso',
    'amenityList.dishwasher': 'Lave-vaisselle',
    'amenityList.showerTowels': 'Serviettes de Bain',
    'amenityList.beachTowels': 'Serviettes de Plage',
    'amenityList.noPets': 'Animaux Non Admis',

    // Discover Paradise Section (replaces original location section)
    'paradise.title': 'Pourquoi l\'Arenal',
    'paradise.description1': 'L\'Arenal, c\'est la plage de sable de Jávea : une eau calme et peu profonde, une longue promenade de restaurants et de bars, et tout le nécessaire accessible à pied. La base la plus pratique de la ville — la voiture peut rester au parking.',
    'paradise.description2': 'Le matin à la plage, le déjeuner sur la promenade, la balade du soir le long du canal. Et quand vous voulez plus : les criques, la vieille ville et le parc naturel du Montgó sont à quelques minutes. Le quartier vit toute l\'année — même en plein hiver, parfait pour un long séjour au soleil.',
    'paradise.beach.title': 'Plage de l\'Arenal',
    'paradise.beach.description': 'La seule plage de sable de Jávea, à 250 m de la porte — eau peu profonde, idéale en famille, avec les restaurants de la promenade juste derrière.',
    'paradise.watersports.title': 'Sports Nautiques',
    'paradise.watersports.description': 'Kayak, paddle, jet-ski et clubs de plongée sont regroupés à l\'embouchure du canal, à quelques pas.',
    'paradise.dining.title': 'Bien Manger',
    'paradise.dining.description': 'Du petit-déjeuner au dîner tardif sans toucher à la voiture — riz au bord du canal chez Amarre 152, apéritif au coucher du soleil chez Tosca, et toute la promenade entre les deux.',
    'paradise.oldtown.title': 'La Vieille Ville',
    'paradise.oldtown.description': 'À 4 km : église gothique, marché couvert et étals artisanaux hebdomadaires. 15 minutes à vélo, 5 en voiture.',
    'paradise.walks.title': 'Sentiers Côtiers',
    'paradise.walks.description': 'Les sentiers vers le Cap Prim et le parc naturel du Montgó partent juste à l\'est de la promenade de l\'Arenal.',

    // Availability Section
    'availability.title': 'Disponibilités & Tarifs',
    'availability.subtitle': 'Disponibilités en temps réel et tarifs saisonniers — le calendrier se synchronise chaque jour avec Airbnb',
    'availability.note': 'Des dates bloquées sur Airbnb restent parfois réservables en direct — demandez-nous avant d\'y renoncer.',

    // Calendar
    'calendar.jan': 'Jan', 'calendar.feb': 'Fév', 'calendar.mar': 'Mar',
    'calendar.apr': 'Avr', 'calendar.may': 'Mai', 'calendar.jun': 'Juin',
    'calendar.jul': 'Juil', 'calendar.aug': 'Août', 'calendar.sep': 'Sep',
    'calendar.oct': 'Oct', 'calendar.nov': 'Nov', 'calendar.dec': 'Déc',
    'calendar.sun': 'Dim', 'calendar.mon': 'Lun', 'calendar.tue': 'Mar',
    'calendar.wed': 'Mer', 'calendar.thu': 'Jeu', 'calendar.fri': 'Ven', 'calendar.sat': 'Sam',
    'calendar.error': 'Erreur de chargement du calendrier', 'calendar.tryAgain': 'Veuillez réessayer',
    'calendar.available': 'Disponible', 'calendar.past': 'Passé',

    // Booking Information Section
    'booking.information': 'Informations de Réservation',
    'booking.rates': 'Tarifs',
    'booking.highSeason': '• Haute saison (juin – septembre & jours fériés) : dès 210 € la nuit',
    'booking.midSeason': '• Moyenne saison (avril, mai & octobre) : dès 160 € la nuit',
    'booking.lowSeason': '• Basse saison (novembre – mars hors vacances) : dès 130 € la nuit',
    'booking.minimumStay': 'Séjour Minimum',
    'booking.minimumStayText': '5 nuits en haute saison, 3 nuits le reste de l\'année',
    'booking.checkInOut': 'Arrivée & Départ',
    'booking.checkInTime': '• Arrivée : à partir de 16 h',
    'booking.checkOutTime': '• Départ : avant 12 h',
    'booking.cancellation': 'Conditions d\'Annulation',
    'booking.cancellationText': 'Annulation gratuite jusqu\'à 30 jours avant l\'arrivée. En deçà, nos conditions d\'annulation s\'appliquent.',
    'booking.directContact': 'Contact Direct',
    'booking.airbnb': 'Réserver sur Airbnb',
    'booking.checkingAvailability': 'Vérification des disponibilités...',
    'booking.datesAvailable': '✅ Ces dates sont disponibles — poursuivez votre réservation.',
    'booking.datesUnavailable': '❌ Ces dates sont prises. Essayez-en d\'autres — ou demandez-nous : des dates bloquées sur Airbnb sont parfois réservables en direct.',
    'booking.nextAvailable': 'Prochaines dates disponibles :',
    'booking.useSuggestedDates': 'Utiliser Ces Dates',

    // Recommendations Page
    'recommendations.title': 'Où Manger & Que Faire',
    'recommendations.subtitle': 'Notre sélection honnête pour l\'Arenal et ses environs — les adresses où nous envoyons nos amis.',
    'recommendations.restaurants': 'Restaurants',
    'recommendations.drinks': 'Bars & Boissons',
    'recommendations.breakfast': 'Petit-déjeuner & Boulangerie',

    // Restaurant descriptions
    'rec.chabada.desc': 'Bar de plage pour un verre presque les pieds dans le sable',
    'rec.chabada.hours': 'Dès 8 h non-stop, happy hour 16 h–20 h, musique live le jeudi soir',
    'rec.labambula.desc': 'Bar animé avec musique live et piste de danse',
    'rec.labambula.hours': '9 h–1 h (jusqu\'à 3 h le week-end), flamenco le dimanche, swing le mardi, rock le vendredi',
    'rec.lafontana.desc': 'Paella et pizza italienne face à la plage',
    'rec.lafontana.hours': 'Non-stop tous les jours',
    'rec.bohemians.desc': 'Table élégante à l\'atmosphère soignée',
    'rec.bohemians.hours': '12 h–minuit (tous les jours)',
    'rec.lamasena.desc': 'Cuisine raffinée pour un long déjeuner ou dîner',
    'rec.lamasena.hours': 'Lun 12 h 30–16 h 30 ; mer–dim 12 h 30–16 h 30 & 19 h 30–22 h 30 (23 h sam/dim), fermé le mardi',
    'rec.loasis.desc': 'L\'adresse des amateurs de viande et de belles grillades',
    'rec.loasis.hours': '12 h 30–23 h (tous les jours)',
    'rec.casalili.desc': 'Cuisine asiatique fraîche et authentique',
    'rec.casalili.hours': '12 h 30–16 h & 18 h 30–23 h (tous les jours)',
    'rec.carnaval.desc': 'Fusion moderne — sushis, burgers et poke bowls',
    'rec.carnaval.hours': 'Non-stop tous les jours',
    'rec.caramel.desc': 'Boulangerie à la française, viennoiseries fraîches et bon café',
    'rec.caramel.hours': '7 h 30–19 h 30 (tous les jours)',

    // Common location terms
    'rec.location.beach': 'Plage de l\'Arenal',
    'rec.location.walk': 'min à pied',
    'rec.location.taxi': 'min en taxi',
    'rec.location.street': 'Au bout de la rue',
    'recommendations.beaches': 'Plages',
    'recommendations.activities': 'Activités',
    'recommendations.shopping': 'Shopping',
    'recommendations.contact': 'Besoin d\'un Conseil ?',
    'recommendations.contactText': 'Écrivez-nous à tout moment pendant votre séjour — pour un itinéraire, une réservation ou un bon plan local.',
    'recommendations.backToHome': 'Retour à l\'Accueil',
    'contact.phone': 'Appelez-moi',
    'contact.whatsapp': 'Envoyez-moi un WhatsApp',

    // Promotional Calendar
    'promotional.offerEndsIn': 'L\'offre se termine dans',
    'promotional.offerExpired': 'Offre expirée',
    'promotional.discountedRate': 'Tarif Réduit',
    'promotional.limitedTimeOffer': 'Offre à durée limitée',
    'calendar.unavailable': 'Indisponible',
    'calendar.regularRate': 'Tarif Normal',
  },
  it: {
    // Navigation
    'nav.home': 'Home',
    'nav.apartment': 'Appartamento',
    'nav.gallery': 'Galleria',
    'nav.rates': 'Tariffe',
    'nav.location': 'Posizione',
    'nav.booking': 'Prenota',
    'nav.recommendations': 'Consigli',

    // Hero Section
    'hero.title': 'JÁVEA BLISS',
    'hero.eyebrow': "Jávea · Costa Blanca, Spagna",
    'glance.eyebrow': "L'essenziale",
    'apartment.eyebrow': "Dove alloggi",
    'amenities.eyebrow': "Dentro",
    'paradise.eyebrow': "Il quartiere",
    'gallery.eyebrow': "Fotografie",
    'testimonials.eyebrow': "Recensioni",
    'rates.eyebrow': "Tariffe",
    'booking.eyebrow': "Richiesta",
    'hero.subtitle': 'Casa vacanze vicino alla spiaggia dell\'Arenal',
    'hero.tagline': "Appartamento ristrutturato con due camere per quattro, a 250 m dalla spiaggia dell'Arenal. Prenota diretto da 130 € a notte.",
    'hero.description': 'Soggiorna a 250 metri dalla spiaggia dell\'Arenal, la spiaggia di sabbia di Jávea sulla Costa Blanca, con il suo lungomare pieno di ristoranti. L\'appartamento è completamente ristrutturato, con aria condizionata, WiFi in fibra e parcheggio gratuito. Voli diretti da Milano, Bergamo e Roma per Alicante (circa 2 ore), poi un\'ora e mezza d\'auto.',
    'hero.bookButton': 'Prenota il Tuo Soggiorno',
    'hero.exploreButton': 'Scopri l\'Appartamento',

    // Apartment Section
    'apartment.title': 'L\'Appartamento',
    'apartment.description': 'Appartamento completamente ristrutturato al primo piano, lungo il tranquillo canale Nou Fontana, a una strada dalla spiaggia dell\'Arenal. Due camere matrimoniali, un bagno moderno, cucina attrezzata e terrazza privata sull\'acqua — con ascensore e posto auto riservato.',
    'apartment.restaurantProximity': 'Ristoranti a due passi',
    'apartment.restaurantProximityDesc': 'Chabada, La Bambula, Masena e tutto il lungomare dell\'Arenal sono raggiungibili a piedi.',
    'apartment.viewAllRestaurants': 'Vedi la Guida ai Ristoranti',

    // At Glance Section
    'glance.title': 'In breve',
    'glance.sleeps': 'Per 4 persone',
    'glance.bedrooms': '2 camere matrimoniali',
    'glance.bathroom': '1 bagno moderno',
    'glance.beach': 'A 250 m dalla spiaggia dell\'Arenal',
    'glance.parking': 'Parcheggio privato gratuito',
    'glance.wifi': 'WiFi veloce in fibra',
    'glance.ac': 'Aria condizionata',
    'glance.terrace': 'Terrazza privata',

    // Amenities Section
    'amenities.title': 'Servizi',
    'amenities.kitchen': 'Cucina Attrezzata',
    'amenities.kitchenDesc': 'Piano a induzione, forno, lavastoviglie, microonde e macchina Nespresso — tutto per cucinare come a casa.',
    'amenities.comfort': 'Riscaldamento & Aria Condizionata',
    'amenities.comfortDesc': 'Aria condizionata e riscaldamento a zone: l\'appartamento è confortevole ad agosto come a gennaio.',
    'amenities.entertainment': 'Smart TV & Streaming',
    'amenities.entertainmentDesc': 'Smart TV da 55 pollici e WiFi in fibra, veloce per lo streaming — o per una giornata di smart working.',
    'amenities.laundry': 'Lavatrice',
    'amenities.laundryDesc': 'Lavatrice nel patio (senza asciugatrice).',
    'amenities.outdoor': 'Terrazza Privata',
    'amenities.outdoorDesc': 'Una terrazza sul canale, per la colazione all\'aperto o un aperitivo la sera.',
    'amenities.parking': 'Parcheggio Gratuito',
    'amenities.parkingDesc': 'Un posto auto tutto tuo — una rarità così vicino alla spiaggia dell\'Arenal.',

    // Rates Section
    'rates.title': 'Tariffe & Condizioni',
    'rates.description': 'Prezzi stagionali chiari, senza costi di piattaforma se prenoti direttamente. Dai 35 giorni in su vale la tariffa soggiorni lunghi di 100 € a notte — perfetta per svernare al caldo della Costa Blanca.',
    'rates.highSeason': 'Alta Stagione',
    'rates.highPeriod': 'Giugno – settembre & festività',
    'rates.highRate': 'Da 210 € a notte',
    'rates.midSeason': 'Media Stagione',
    'rates.midPeriod': 'Aprile, maggio & ottobre',
    'rates.midRate': 'Da 160 € a notte',
    'rates.lowSeason': 'Bassa Stagione',
    'rates.lowPeriod': 'Novembre – marzo (escluse festività)',
    'rates.lowRate': 'Da 130 € a notte',
    'rates.policies': 'Condizioni di Prenotazione',
    'rates.policy1': 'Minimo 5 notti in alta stagione',
    'rates.policy2': 'Minimo 3 notti nel resto dell\'anno',
    'rates.policy3': 'Check-in dalle 16:00',
    'rates.policy4': 'Check-out entro le 12:00',

    // Location Section (original entries)
    'location.title': 'La Posizione',
    'location.description': 'Marina Nou Fontana, il quartiere dei canali dell\'Arenal — la zona più viva di Jávea, a una strada dalla spiaggia.',
    'location.beach': 'Spiaggia dell\'Arenal',
    'location.beachDesc': 'A 250 m — sabbia fine, acqua bassa, perfetta per le famiglie',
    'location.restaurants': 'Ristoranti',
    'location.restaurantsDesc': 'I bar e i ristoranti del lungomare, a 2–5 minuti a piedi',
    'location.shops': 'Negozi',
    'location.shopsDesc': 'Supermercati e farmacia a 5 minuti a piedi',
    'location.transport': 'Come Arrivare',
    'location.transportDesc': 'Circa 1 ora e 15 dall\'aeroporto di Alicante, 1 e 30 da Valencia',
    'location.restaurantTitle': 'Dove mangiano i locali',
    'location.restaurantDesc': 'Chabada, La Bambula, Masena, Bohemians — la nostra guida raccoglie i posti dove andiamo davvero, tutti raggiungibili a piedi dall\'appartamento.',
    'location.viewRecommendations': 'Vedi la Guida ai Ristoranti',

    // Booking Section
    'booking.title': 'Verifica Disponibilità & Prenota Direttamente',
    'booking.description': 'Invia una richiesta con le tue date: ti rispondiamo entro 24 ore. Prenoti direttamente dal proprietario — senza costi di piattaforma né commissioni.',
    'booking.name': 'Nome Completo',
    'booking.email': 'Indirizzo Email',
    'booking.phone': 'Numero di Telefono',
    'booking.checkIn': 'Data di Arrivo',
    'booking.checkOut': 'Data di Partenza',
    'booking.guests': 'Numero di Ospiti',
    'booking.message': 'Messaggio Aggiuntivo (Facoltativo)',
    'booking.submit': 'Invia Richiesta',
    'booking.submitting': 'Invio...',
    'booking.success': 'Richiesta Inviata!',
    'booking.successDesc': 'Ti risponderemo il prima possibile.',
    'booking.error': 'Problema con il servizio email',
    'booking.contactInfo': 'Contatti',
    'booking.contactDesc': 'Preferisci parlarci direttamente? Contattaci per qualsiasi domanda sul tuo soggiorno.',
    'booking.emailLabel': 'Email',
    'booking.responseTime': 'Rispondiamo di solito entro 24 ore',

    // Footer
    'footer.tagline': 'Casa vacanze ristrutturata a 250 m dalla spiaggia dell\'Arenal, Jávea.',
    'footer.rights': 'Tutti i diritti riservati.',
    'footer.quickLinks': 'Link Rapidi',
    'footer.guides': 'Guide su Jávea (in inglese)',
    'footer.followUs': 'Seguici',

    // Form validation
    'form.nameRequired': 'Il nome deve contenere almeno 2 caratteri',
    'form.emailInvalid': 'Inserisci un indirizzo email valido',
    'form.checkInRequired': 'Seleziona una data di arrivo',
    'form.checkOutRequired': 'Seleziona una data di partenza',
    'form.checkOutMustBeAfterCheckIn': 'La data di partenza deve essere successiva a quella di arrivo',
    'form.guestsRequired': 'Seleziona il numero di ospiti',
    'form.phoneRequired': 'Inserisci un numero di telefono valido',
    'form.spam': 'Protezione antispam attivata',

    // Guest options
    'guests.1': '1 Ospite',
    'guests.2': '2 Ospiti',
    'guests.3': '3 Ospiti',
    'guests.4': '4 Ospiti',

    // Pricing
    'pricing.title': 'Informazioni sui Prezzi',
    'pricing.stayDuration': 'Durata del Soggiorno',
    'pricing.ratePerNight': 'Tariffa a notte',
    'pricing.total': 'Totale',
    'pricing.nights': 'notti',
    'pricing.longTermRate': 'Tariffa soggiorni lunghi',
    'pricing.longTermDiscount': 'Sconto soggiorni lunghi applicato!',
    'pricing.longTermMessage': 'Il tuo soggiorno di {nights} notti (5+ settimane) ha diritto alla tariffa di 100 € a notte.',
    'pricing.discount': 'Sconto',
    'pricing.cleaningFee': 'Costo Pulizie',
    'pricing.includedInTotal': 'incluso nel totale',
    'pricing.pricePerNight': 'Prezzo a notte',

    // Gallery Section
    'gallery.title': 'L\'Appartamento in Foto',
    'gallery.description': 'Dai un\'occhiata — soggiorno, camere, cucina, bagno e terrazza.',
    'gallery.showAll': "Vedi tutte le foto",
    'gallery.livingAreas': 'Zona Giorno',
    'gallery.bedrooms': 'Camere',
    'gallery.kitchen': 'Cucina & Pranzo',
    'gallery.outdoor': 'Spazi Esterni',
    'gallery.bathroom': 'Bagno',
    'gallery.entrance': 'Ingresso & Corridoio',
    'gallery.overview': 'Panoramica',
    'gallery.livingRoom1': 'Soggiorno con divano e parete TV',
    'gallery.livingRoom2': 'Soggiorno luminoso',
    'gallery.livingRoom3': 'Angolo salotto',
    'gallery.entertainment': 'Smart TV da 55 pollici in soggiorno',
    'gallery.masterBedroom': 'Camera principale con letto matrimoniale',
    'gallery.bedroom1': 'Camera con armadi a muro',
    'gallery.bedroom2': 'Camera luminosa',
    'gallery.secondBedroom': 'Seconda camera',
    'gallery.bedroom3': 'Seconda camera con due letti singoli',
    'gallery.bedroom4': 'Spazio armadi in camera',
    'gallery.bedroom5': 'Camera con luce di mare',
    'gallery.modernKitchen': 'Cucina verde bosco',
    'gallery.kitchenAppliances': 'Cucina con piano a induzione e forno',
    'gallery.kitchenDining': 'Cucina con zona pranzo',
    'gallery.terrace1': 'Terrazza privata sul canale',
    'gallery.terrace2': 'Tavolo da pranzo in terrazza',
    'gallery.terrace3': 'La terrazza al tramonto',
    'gallery.modernBathroom': 'Bagno ristrutturato con doccia a pioggia',
    'gallery.apartmentEntrance': 'Ingresso dell\'appartamento',
    'gallery.hallway': 'Corridoio',
    'gallery.overview1': 'Zona giorno con vista sul canale',
    'gallery.overview2': 'Cucina con ante verde bosco',
    'gallery.overview3': 'Camera con materasso di qualità e armadi',
    'gallery.overview4': 'Vista sul canale dall\'appartamento',

    // Testimonials Section
    'testimonials.title': 'Cosa Dicono i Nostri Ospiti',
    'testimonials.description': 'Recensioni vere di soggiorni recenti.',
    'testimonials.guest1Name': 'Carlos',
    'testimonials.guest1Location': 'Madrid, luglio 2025',
    'testimonials.guest1Text': 'Una delle case vacanze più complete in cui abbia mai soggiornato — ristrutturata, con cucina attrezzatissima, lenzuola, asciugamani e persino gli ingredienti di base. Molto contenti del nostro weekend in famiglia. Posizione ideale vicino a spiaggia e ristoranti, e un\'attenzione impeccabile da parte di Laurent.',
    'testimonials.guest2Name': 'Emma',
    'testimonials.guest2Location': 'Amsterdam, Paesi Bassi, giugno 2025',
    'testimonials.guest2Text': 'Abbiamo trovato esattamente quello che cercavamo — un appartamento confortevole a pochi passi dalla spiaggia, a un prezzo onesto. La terrazza, illuminata al tramonto, è diventata il nostro posto preferito. Pulizia impeccabile.',
    'testimonials.guest3Name': 'Pierre & Marie',
    'testimonials.guest3Location': 'Lione, Francia, giugno 2025',
    'testimonials.guest3Text': 'Davvero a 3 minuti dalla spiaggia, circondati dai migliori ristoranti e bar di Jávea — camminare è l\'unico mezzo di trasporto che ti serve. La cucina è attrezzata di tutto, e il proprietario ci ha persino accolti con una bottiglia di cava.',

    // Reviews Translation
    'reviews.showOriginal': 'Mostra originale ({lang})',
    'reviews.hideOriginal': 'Nascondi originale ({lang})',

    // Interior Section
    'interior.title': 'Interni',
    'interior.bedrooms': 'Due camere matrimoniali, ognuna con materasso di qualità alberghiera, tende oscuranti e armadi a muro.',
    'interior.bathroom': 'Bagno in microcemento con doccia a pioggia, WC sospeso e luce indiretta soffusa.',
    'interior.kitchen': 'Cucina verde bosco: piano a induzione, forno multifunzione, lavastoviglie, macchina Nespresso e luci LED.',
    'interior.lounge': 'Soggiorno open space con parete TV in doghe di rovere, smart TV da 55 pollici e divano che diventa letto singolo per un ospite in più.',
    'interior.lighting': 'Illuminazione LED dimmerabile per serate rilassate.',
    'interior.patio': 'Patio privato per colazioni con calma — o per sciacquare le infradito piene di sabbia.',
    'interior.laundry': 'Lavatrice nel patio, con spazio per una bici o l\'attrezzatura da surf.',
    'interior.connectivity': 'Aria condizionata a zone e WiFi veloce in fibra in tutto l\'appartamento.',

    // Building & Amenities Section
    'building.title': 'Il Palazzo',
    'building.security': 'Ingresso sicuro, ascensore e posto auto riservato — raro così vicino alla spiaggia.',
    'building.marina': 'Ormeggi, SUP e barchette a motore si noleggiano alla Marina Nou Fontana, a 150 m.',
    'building.shopping': 'Supermercati e farmacia a cinque minuti a piedi.',

    // Availability Calendar
    'checkAvailability': 'Verifica Disponibilità',
    'availabilityDescription': 'Le date verdi sono libere, quelle rosse già prenotate. Il calendario si sincronizza ogni giorno con il nostro sistema di prenotazione.',
    'calendarNote': 'Trovate le tue date? Invia una richiesta qui sotto: confermiamo entro 24 ore.',
    'available': 'Disponibile',
    'booked': 'Prenotato',
    'lastUpdated': 'Ultimo aggiornamento',
    'datesSelected': 'Date Selezionate',
    'specialOfferSelected': 'Offerta Speciale Selezionata',
    'datesAutoFilled': 'Date inserite nel modulo di prenotazione qui sotto',
    'was': 'era',
    'specialOffer': 'Offerta Speciale',
    'seasonalRates': 'Tariffe Stagionali',

    // Amenities List
    'amenityList.airConditioning': 'Aria Condizionata',
    'amenityList.wifi': 'WiFi Veloce in Fibra',
    'amenityList.smartTv': 'Smart TV 55 pollici',
    'amenityList.kitchen': 'Cucina Attrezzata',
    'amenityList.waterFilter': 'Filtro Acqua',
    'amenityList.washer': 'Lavatrice (senza asciugatrice)',
    'amenityList.parking': 'Parcheggio Privato Gratuito',
    'amenityList.nespresso': 'Macchina Nespresso',
    'amenityList.dishwasher': 'Lavastoviglie',
    'amenityList.showerTowels': 'Asciugamani da Bagno',
    'amenityList.beachTowels': 'Teli Mare',
    'amenityList.noPets': 'Niente Animali',

    // Discover Paradise Section (replaces original location section)
    'paradise.title': 'Perché l\'Arenal',
    'paradise.description1': 'L\'Arenal è la spiaggia di sabbia di Jávea: acqua calma e bassa, un lungo lungomare di ristoranti e bar, e tutto quello che serve raggiungibile a piedi. La base più comoda della città — l\'auto può restare parcheggiata.',
    'paradise.description2': 'La mattina in spiaggia, il pranzo sul lungomare, la passeggiata serale lungo il canale. E quando vuoi di più: le calette, il centro storico e il parco naturale del Montgó sono a pochi minuti. Il quartiere vive tutto l\'anno, in alta stagione come in pieno inverno.',
    'paradise.beach.title': 'Spiaggia dell\'Arenal',
    'paradise.beach.description': 'L\'unica spiaggia di sabbia di Jávea, a 250 m dalla porta — acqua bassa, perfetta per le famiglie, con i ristoranti del lungomare subito dietro.',
    'paradise.watersports.title': 'Sport Acquatici',
    'paradise.watersports.description': 'Kayak, SUP, moto d\'acqua e diving si concentrano alla foce del canale, a pochi passi.',
    'paradise.dining.title': 'Mangiare Fuori',
    'paradise.dining.description': 'Dalla colazione alla cena tardi senza toccare l\'auto — riso sul canale da Amarre 152, aperitivo al tramonto da Tosca, e tutto il lungomare nel mezzo.',
    'paradise.oldtown.title': 'Il Centro Storico',
    'paradise.oldtown.description': 'A 4 km: chiesa gotica, mercato coperto e bancarelle artigianali settimanali. 15 minuti in bici, 5 in auto.',
    'paradise.walks.title': 'Sentieri Costieri',
    'paradise.walks.description': 'I sentieri per Cap Prim e il parco naturale del Montgó partono appena a est del lungomare dell\'Arenal.',

    // Availability Section
    'availability.title': 'Disponibilità & Prezzi',
    'availability.subtitle': 'Disponibilità in tempo reale e tariffe stagionali — il calendario si sincronizza ogni giorno con Airbnb',
    'availability.note': 'Date bloccate su Airbnb a volte restano prenotabili direttamente — chiedici prima di rinunciare.',

    // Calendar
    'calendar.jan': 'Gen', 'calendar.feb': 'Feb', 'calendar.mar': 'Mar',
    'calendar.apr': 'Apr', 'calendar.may': 'Mag', 'calendar.jun': 'Giu',
    'calendar.jul': 'Lug', 'calendar.aug': 'Ago', 'calendar.sep': 'Set',
    'calendar.oct': 'Ott', 'calendar.nov': 'Nov', 'calendar.dec': 'Dic',
    'calendar.sun': 'Dom', 'calendar.mon': 'Lun', 'calendar.tue': 'Mar',
    'calendar.wed': 'Mer', 'calendar.thu': 'Gio', 'calendar.fri': 'Ven', 'calendar.sat': 'Sab',
    'calendar.error': 'Errore nel caricamento del calendario', 'calendar.tryAgain': 'Riprova',
    'calendar.available': 'Disponibile', 'calendar.past': 'Passato',

    // Booking Information Section
    'booking.information': 'Informazioni di Prenotazione',
    'booking.rates': 'Tariffe',
    'booking.highSeason': '• Alta stagione (giugno – settembre & festività): da 210 € a notte',
    'booking.midSeason': '• Media stagione (aprile, maggio & ottobre): da 160 € a notte',
    'booking.lowSeason': '• Bassa stagione (novembre – marzo escluse festività): da 130 € a notte',
    'booking.minimumStay': 'Soggiorno Minimo',
    'booking.minimumStayText': '5 notti in alta stagione, 3 notti nel resto dell\'anno',
    'booking.checkInOut': 'Check-in & Check-out',
    'booking.checkInTime': '• Check-in: dalle 16:00',
    'booking.checkOutTime': '• Check-out: entro le 12:00',
    'booking.cancellation': 'Politica di Cancellazione',
    'booking.cancellationText': 'Cancellazione gratuita fino a 30 giorni prima dell\'arrivo. Entro i 30 giorni si applicano le nostre condizioni.',
    'booking.directContact': 'Contatto Diretto',
    'booking.airbnb': 'Prenota su Airbnb',
    'booking.checkingAvailability': 'Verifica disponibilità...',
    'booking.datesAvailable': '✅ Queste date sono disponibili — continua con la prenotazione.',
    'booking.datesUnavailable': '❌ Queste date sono occupate. Provane altre — o chiedici: le date bloccate su Airbnb a volte si possono prenotare direttamente.',
    'booking.nextAvailable': 'Prossime date disponibili:',
    'booking.useSuggestedDates': 'Usa Queste Date',

    // Recommendations Page
    'recommendations.title': 'Dove Mangiare & Cosa Fare',
    'recommendations.subtitle': 'La nostra lista onesta per l\'Arenal e dintorni — i posti dove mandiamo gli amici.',
    'recommendations.restaurants': 'Ristoranti',
    'recommendations.drinks': 'Bar & Drink',
    'recommendations.breakfast': 'Colazione & Panetteria',

    // Restaurant descriptions
    'rec.chabada.desc': 'Bar sulla spiaggia per un drink quasi con i piedi nella sabbia',
    'rec.chabada.hours': 'Dalle 8 orario continuato, happy hour 16–20, musica dal vivo il giovedì sera',
    'rec.labambula.desc': 'Locale vivace con musica dal vivo e balli',
    'rec.labambula.hours': '9–1 (weekend fino alle 3), flamenco la domenica, swing il martedì, rock il venerdì',
    'rec.lafontana.desc': 'Paella e pizza italiana proprio sulla spiaggia',
    'rec.lafontana.hours': 'Orario continuato tutti i giorni',
    'rec.bohemians.desc': 'Cena elegante in un\'atmosfera curata',
    'rec.bohemians.hours': '12–24 (tutti i giorni)',
    'rec.lamasena.desc': 'Cucina raffinata per un pranzo lungo o una cena',
    'rec.lamasena.hours': 'Lun 12:30–16:30; mer–dom 12:30–16:30 & 19:30–22:30 (fino alle 23 sab/dom), chiuso il martedì',
    'rec.loasis.desc': 'L\'indirizzo giusto per bistecche e carne alla griglia',
    'rec.loasis.hours': '12:30–23 (tutti i giorni)',
    'rec.casalili.desc': 'Cucina asiatica fresca e autentica',
    'rec.casalili.hours': '12:30–16 & 18:30–23 (tutti i giorni)',
    'rec.carnaval.desc': 'Fusion moderna — sushi, burger e poke bowl',
    'rec.carnaval.hours': 'Orario continuato tutti i giorni',
    'rec.caramel.desc': 'Panetteria in stile francese con dolci freschi e buon caffè',
    'rec.caramel.hours': '7:30–19:30 (tutti i giorni)',

    // Common location terms
    'rec.location.beach': 'Spiaggia dell\'Arenal',
    'rec.location.walk': 'min a piedi',
    'rec.location.taxi': 'min in taxi',
    'rec.location.street': 'In fondo alla strada',
    'recommendations.beaches': 'Spiagge',
    'recommendations.activities': 'Attività',
    'recommendations.shopping': 'Shopping',
    'recommendations.contact': 'Serve un Consiglio?',
    'recommendations.contactText': 'Scrivici in qualsiasi momento durante il soggiorno — per indicazioni, una prenotazione o un consiglio locale.',
    'recommendations.backToHome': 'Torna alla Home',
    'contact.phone': 'Chiamami',
    'contact.whatsapp': 'Scrivimi su WhatsApp',

    // Promotional Calendar
    'promotional.offerEndsIn': 'L\'offerta termina tra',
    'promotional.offerExpired': 'Offerta scaduta',
    'promotional.discountedRate': 'Tariffa Scontata',
    'promotional.limitedTimeOffer': 'Offerta a tempo limitato',
    'calendar.unavailable': 'Non disponibile',
    'calendar.regularRate': 'Tariffa Normale',
  },
  de: {
    // Navigation
    'nav.home': 'Start',
    'nav.apartment': 'Wohnung',
    'nav.gallery': 'Galerie',
    'nav.rates': 'Preise',
    'nav.location': 'Lage',
    'nav.booking': 'Buchen',
    'nav.recommendations': 'Empfehlungen',

    // Hero Section
    'hero.title': 'JÁVEA BLISS',
    'hero.eyebrow': "Jávea · Costa Blanca, Spanien",
    'glance.eyebrow': "Das Wichtigste",
    'apartment.eyebrow': "Ihr Zuhause auf Zeit",
    'amenities.eyebrow': "Innen",
    'paradise.eyebrow': "Die Umgebung",
    'gallery.eyebrow': "Fotografien",
    'testimonials.eyebrow': "Bewertungen",
    'rates.eyebrow': "Preise",
    'booking.eyebrow': "Anfrage",
    'hero.subtitle': 'Ferienwohnung am Arenal-Strand',
    'hero.tagline': "Renovierte Zwei-Zimmer-Wohnung für vier Gäste, 250 m vom Arenal-Strand. Direkt buchen ab 130 € pro Nacht.",
    'hero.description': 'Wohnen Sie nur 250 Meter vom Arenal-Strand, Jáveas Sandstrand mit seiner restaurantgesäumten Promenade. Die Wohnung ist frisch renoviert, mit Klimaanlage, schnellem WLAN und kostenlosem Parkplatz — ruhig am Kanal gelegen und trotzdem mitten im Geschehen. Direktflüge nach Alicante ab Frankfurt, München, Düsseldorf, Zürich und Wien (ca. 2,5 Std.), danach etwa 1 Stunde Fahrt.',
    'hero.bookButton': 'Jetzt Buchen',
    'hero.exploreButton': 'Wohnung Ansehen',

    // Apartment Section
    'apartment.title': 'Die Wohnung',
    'apartment.description': 'Komplett renovierte Wohnung im ersten Stock am ruhigen Nou-Fontana-Kanal, eine Straße vom Arenal-Strand. Zwei Schlafzimmer mit Doppelbetten, ein modernes Bad, eine voll ausgestattete Küche und eine eigene Terrasse über dem Wasser — dazu Aufzug und eigener Parkplatz.',
    'apartment.restaurantProximity': 'Restaurants vor der Tür',
    'apartment.restaurantProximityDesc': 'Chabada, La Bambula, Masena und die gesamte Arenal-Promenade sind bequem zu Fuß erreichbar.',
    'apartment.viewAllRestaurants': 'Zum Restaurantführer',

    // At Glance Section
    'glance.title': 'Auf einen Blick',
    'glance.sleeps': 'Für 4 Gäste',
    'glance.bedrooms': '2 Schlafzimmer',
    'glance.bathroom': '1 modernes Bad',
    'glance.beach': '250 m zum Arenal-Strand',
    'glance.parking': 'Kostenloser eigener Parkplatz',
    'glance.wifi': 'Schnelles Glasfaser-WLAN',
    'glance.ac': 'Klimaanlage',
    'glance.terrace': 'Eigene Terrasse',

    // Amenities Section
    'amenities.title': 'Ausstattung',
    'amenities.kitchen': 'Voll Ausgestattete Küche',
    'amenities.kitchenDesc': 'Induktionskochfeld, Backofen, Geschirrspüler, Mikrowelle und Nespresso-Maschine — alles zum Selberkochen.',
    'amenities.comfort': 'Heizung & Klimaanlage',
    'amenities.comfortDesc': 'Klimaanlage und Heizung nach Zonen — angenehm im August wie im Januar.',
    'amenities.entertainment': 'Smart-TV & Streaming',
    'amenities.entertainmentDesc': '55-Zoll-Smart-TV und Glasfaser-WLAN, schnell genug zum Streamen — oder für einen Tag Homeoffice.',
    'amenities.laundry': 'Waschmaschine',
    'amenities.laundryDesc': 'Waschmaschine auf dem Patio (kein Trockner).',
    'amenities.outdoor': 'Eigene Terrasse',
    'amenities.outdoorDesc': 'Terrasse am Kanal — für das Frühstück draußen oder ein Glas Wein am Abend.',
    'amenities.parking': 'Kostenloser Parkplatz',
    'amenities.parkingDesc': 'Ein eigener Stellplatz — echte Seltenheit so nah am Arenal-Strand.',

    // Rates Section
    'rates.title': 'Preise & Bedingungen',
    'rates.description': 'Klare Saisonpreise, ohne Plattformgebühren bei Direktbuchung. Ab 5 Wochen gilt unser Langzeittarif von 100 € pro Nacht — beliebt zum Überwintern an der Costa Blanca.',
    'rates.highSeason': 'Hochsaison',
    'rates.highPeriod': 'Juni – September & Feiertage',
    'rates.highRate': 'Ab 210 € pro Nacht',
    'rates.midSeason': 'Nebensaison',
    'rates.midPeriod': 'April, Mai & Oktober',
    'rates.midRate': 'Ab 160 € pro Nacht',
    'rates.lowSeason': 'Wintersaison',
    'rates.lowPeriod': 'November – März (außerhalb der Feiertage)',
    'rates.lowRate': 'Ab 130 € pro Nacht',
    'rates.policies': 'Buchungsbedingungen',
    'rates.policy1': 'Mindestens 5 Nächte in der Hochsaison',
    'rates.policy2': 'Mindestens 3 Nächte im Rest des Jahres',
    'rates.policy3': 'Check-in ab 16:00 Uhr',
    'rates.policy4': 'Check-out bis 12:00 Uhr',

    // Location Section (original entries)
    'location.title': 'Die Lage',
    'location.description': 'Marina Nou Fontana, das Kanalviertel am Arenal — Jáveas lebendigstes Viertel, eine Straße vom Strand.',
    'location.beach': 'Arenal-Strand',
    'location.beachDesc': '250 m entfernt — Sandstrand, flaches Wasser, ideal für Familien',
    'location.restaurants': 'Restaurants',
    'location.restaurantsDesc': 'Die Bars und Restaurants der Promenade, 2–5 Gehminuten',
    'location.shops': 'Einkaufen',
    'location.shopsDesc': 'Supermärkte und Apotheke in 5 Gehminuten',
    'location.transport': 'Anreise',
    'location.transportDesc': 'Ca. 75 Minuten vom Flughafen Alicante, 90 von Valencia',
    'location.restaurantTitle': 'Wo die Einheimischen essen',
    'location.restaurantDesc': 'Chabada, La Bambula, Masena, Bohemians — unser Führer versammelt die Adressen, zu denen wir selbst gehen, alle zu Fuß von der Wohnung erreichbar.',
    'location.viewRecommendations': 'Zum Restaurantführer',

    // Booking Section
    'booking.title': 'Verfügbarkeit Prüfen & Direkt Buchen',
    'booking.description': 'Senden Sie eine Anfrage mit Ihren Daten — wir antworten innerhalb von 24 Stunden. Sie buchen direkt beim Eigentümer, ohne Plattformgebühren und ohne Provision.',
    'booking.name': 'Vollständiger Name',
    'booking.email': 'E-Mail-Adresse',
    'booking.phone': 'Telefonnummer',
    'booking.checkIn': 'Anreisedatum',
    'booking.checkOut': 'Abreisedatum',
    'booking.guests': 'Anzahl der Gäste',
    'booking.message': 'Zusätzliche Nachricht (Optional)',
    'booking.submit': 'Anfrage Senden',
    'booking.submitting': 'Wird gesendet...',
    'booking.success': 'Anfrage Gesendet!',
    'booking.successDesc': 'Wir melden uns so schnell wie möglich bei Ihnen.',
    'booking.error': 'Problem mit dem E-Mail-Dienst',
    'booking.contactInfo': 'Kontakt',
    'booking.contactDesc': 'Lieber direkt sprechen? Kontaktieren Sie uns gern mit allen Fragen zu Ihrem Aufenthalt.',
    'booking.emailLabel': 'E-Mail',
    'booking.responseTime': 'Wir antworten in der Regel innerhalb von 24 Stunden',

    // Footer
    'footer.tagline': 'Renovierte Ferienwohnung, 250 m vom Arenal-Strand, Jávea.',
    'footer.rights': 'Alle Rechte vorbehalten.',
    'footer.quickLinks': 'Schnellzugriff',
    'footer.guides': 'Jávea-Guides (auf Englisch)',
    'footer.followUs': 'Folgen Sie Uns',

    // Form validation
    'form.nameRequired': 'Der Name muss mindestens 2 Zeichen lang sein',
    'form.emailInvalid': 'Bitte geben Sie eine gültige E-Mail-Adresse ein',
    'form.checkInRequired': 'Bitte wählen Sie ein Anreisedatum',
    'form.checkOutRequired': 'Bitte wählen Sie ein Abreisedatum',
    'form.checkOutMustBeAfterCheckIn': 'Das Abreisedatum muss nach dem Anreisedatum liegen',
    'form.guestsRequired': 'Bitte wählen Sie die Anzahl der Gäste',
    'form.phoneRequired': 'Bitte geben Sie eine gültige Telefonnummer ein',
    'form.spam': 'Spamschutz ausgelöst',

    // Guest options
    'guests.1': '1 Gast',
    'guests.2': '2 Gäste',
    'guests.3': '3 Gäste',
    'guests.4': '4 Gäste',

    // Pricing
    'pricing.title': 'Preisinformationen',
    'pricing.stayDuration': 'Aufenthaltsdauer',
    'pricing.ratePerNight': 'Preis pro Nacht',
    'pricing.total': 'Gesamt',
    'pricing.nights': 'Nächte',
    'pricing.longTermRate': 'Langzeittarif',
    'pricing.longTermDiscount': 'Langzeitrabatt angewendet!',
    'pricing.longTermMessage': 'Ihr Aufenthalt von {nights} Nächten (5+ Wochen) qualifiziert sich für unseren Tarif von 100 € pro Nacht.',
    'pricing.discount': 'Rabatt',
    'pricing.cleaningFee': 'Endreinigung',
    'pricing.includedInTotal': 'im Gesamtpreis enthalten',
    'pricing.pricePerNight': 'Preis pro Nacht',

    // Gallery Section
    'gallery.title': 'Die Wohnung in Bildern',
    'gallery.description': 'Sehen Sie sich um — Wohnzimmer, Schlafzimmer, Küche, Bad und Terrasse.',
    'gallery.showAll': "Alle Fotos ansehen",
    'gallery.livingAreas': 'Wohnbereiche',
    'gallery.bedrooms': 'Schlafzimmer',
    'gallery.kitchen': 'Küche & Essbereich',
    'gallery.outdoor': 'Außenbereiche',
    'gallery.bathroom': 'Badezimmer',
    'gallery.entrance': 'Eingang & Flur',
    'gallery.overview': 'Überblick',
    'gallery.livingRoom1': 'Wohnzimmer mit Sofa und TV-Wand',
    'gallery.livingRoom2': 'Wohnzimmer mit viel Tageslicht',
    'gallery.livingRoom3': 'Sitzbereich im Wohnzimmer',
    'gallery.entertainment': '55-Zoll-Smart-TV im Wohnzimmer',
    'gallery.masterBedroom': 'Hauptschlafzimmer mit Doppelbett',
    'gallery.bedroom1': 'Schlafzimmer mit Einbauschränken',
    'gallery.bedroom2': 'Helles Schlafzimmer',
    'gallery.secondBedroom': 'Zweites Schlafzimmer',
    'gallery.bedroom3': 'Zweites Schlafzimmer mit zwei Einzelbetten',
    'gallery.bedroom4': 'Stauraum im Schlafzimmer',
    'gallery.bedroom5': 'Schlafzimmer mit Küstenlicht',
    'gallery.modernKitchen': 'Küche in Waldgrün',
    'gallery.kitchenAppliances': 'Küche mit Induktionskochfeld und Backofen',
    'gallery.kitchenDining': 'Küche mit Essbereich',
    'gallery.terrace1': 'Eigene Terrasse am Kanal',
    'gallery.terrace2': 'Esstisch auf der Terrasse',
    'gallery.terrace3': 'Die Terrasse bei Sonnenuntergang',
    'gallery.modernBathroom': 'Renoviertes Bad mit Regendusche',
    'gallery.apartmentEntrance': 'Eingang der Wohnung',
    'gallery.hallway': 'Flur',
    'gallery.overview1': 'Wohnbereich mit Kanalblick',
    'gallery.overview2': 'Küche mit waldgrünen Fronten',
    'gallery.overview3': 'Schlafzimmer mit hochwertiger Matratze und Stauraum',
    'gallery.overview4': 'Kanalblick aus der Wohnung',

    // Testimonials Section
    'testimonials.title': 'Was Unsere Gäste Sagen',
    'testimonials.description': 'Echte Bewertungen aus jüngsten Aufenthalten.',
    'testimonials.guest1Name': 'Carlos',
    'testimonials.guest1Location': 'Madrid, Juli 2025',
    'testimonials.guest1Text': 'Eine der am besten ausgestatteten Ferienwohnungen, in denen ich je übernachtet habe — renoviert, mit komplett eingerichteter Küche, Bettwäsche, Handtüchern und sogar Grundzutaten. Sehr zufrieden mit unserem Familienwochenende. Ideale Lage nahe Strand und Restaurants, und eine tadellose Betreuung durch Laurent.',
    'testimonials.guest2Name': 'Emma',
    'testimonials.guest2Location': 'Amsterdam, Niederlande, Juni 2025',
    'testimonials.guest2Text': 'Genau das, was wir gesucht haben — eine komfortable Wohnung in Gehweite zum Strand, zu einem fairen Preis. Die Terrasse, bei Sonnenuntergang schön beleuchtet, wurde unser Lieblingsplatz. Makellos sauber.',
    'testimonials.guest3Name': 'Pierre & Marie',
    'testimonials.guest3Location': 'Lyon, Frankreich, Juni 2025',
    'testimonials.guest3Text': 'Wirklich nur 3 Minuten vom Strand, umgeben von Jáveas besten Restaurants und Bars — zu Fuß gehen ist das einzige Verkehrsmittel, das man braucht. Die Küche ist komplett ausgestattet, und der Gastgeber hat uns sogar mit einer Flasche Cava begrüßt.',

    // Reviews Translation
    'reviews.showOriginal': 'Original anzeigen ({lang})',
    'reviews.hideOriginal': 'Original ausblenden ({lang})',

    // Interior Section
    'interior.title': 'Innenausstattung',
    'interior.bedrooms': 'Zwei Schlafzimmer mit Doppelbetten, jeweils mit Matratzen in Hotelqualität, Verdunkelungsvorhängen und Einbauschränken.',
    'interior.bathroom': 'Bad in Mikrozement mit Regendusche, wandhängendem WC und sanfter indirekter Beleuchtung.',
    'interior.kitchen': 'Waldgrüne Einbauküche: Induktionskochfeld, Multifunktionsofen, Geschirrspüler, Nespresso-Maschine und LED-Arbeitslicht.',
    'interior.lounge': 'Offener Wohnbereich mit TV-Wand aus Eichenlamellen, 55-Zoll-Smart-TV und einem Sofa, das sich für einen zusätzlichen Gast in ein Einzelbett verwandeln lässt.',
    'interior.lighting': 'Dimmbare LED-Beleuchtung für entspannte Abende.',
    'interior.patio': 'Eigener Patio für ein ruhiges Frühstück — oder zum Abspülen sandiger Badelatschen.',
    'interior.laundry': 'Waschmaschine auf dem Patio, mit Platz für Fahrrad oder Surfausrüstung.',
    'interior.connectivity': 'Klimaanlage nach Zonen und schnelles Glasfaser-WLAN in der ganzen Wohnung.',

    // Building & Amenities Section
    'building.title': 'Das Gebäude',
    'building.security': 'Sicherer Eingang, Aufzug und ein zugewiesener Stellplatz — selten so nah am Strand.',
    'building.marina': 'Liegeplätze, SUP-Boards und kleine Motorboote können an der Marina Nou Fontana gemietet werden, 150 m entfernt.',
    'building.shopping': 'Supermärkte und eine Apotheke sind in fünf Gehminuten erreichbar.',

    // Availability Calendar
    'checkAvailability': 'Verfügbarkeit Prüfen',
    'availabilityDescription': 'Grüne Daten sind frei, rote bereits gebucht. Der Kalender synchronisiert sich täglich mit unserem Buchungssystem.',
    'calendarNote': 'Passende Daten gefunden? Senden Sie unten eine Anfrage — wir bestätigen innerhalb von 24 Stunden.',
    'available': 'Verfügbar',
    'booked': 'Gebucht',
    'lastUpdated': 'Zuletzt aktualisiert',
    'datesSelected': 'Daten Ausgewählt',
    'specialOfferSelected': 'Sonderangebot Ausgewählt',
    'datesAutoFilled': 'Daten ins Buchungsformular unten übernommen',
    'was': 'statt',
    'specialOffer': 'Sonderangebot',
    'seasonalRates': 'Saisonpreise',

    // Amenities List
    'amenityList.airConditioning': 'Klimaanlage',
    'amenityList.wifi': 'Schnelles Glasfaser-WLAN',
    'amenityList.smartTv': '55-Zoll-Smart-TV',
    'amenityList.kitchen': 'Voll Ausgestattete Küche',
    'amenityList.waterFilter': 'Wasserfilter',
    'amenityList.washer': 'Waschmaschine (kein Trockner)',
    'amenityList.parking': 'Kostenloser Eigener Parkplatz',
    'amenityList.nespresso': 'Nespresso-Maschine',
    'amenityList.dishwasher': 'Geschirrspüler',
    'amenityList.showerTowels': 'Badetücher',
    'amenityList.beachTowels': 'Strandtücher',
    'amenityList.noPets': 'Keine Haustiere',

    // Discover Paradise Section (replaces original location section)
    'paradise.title': 'Warum der Arenal',
    'paradise.description1': 'Der Arenal ist Jáveas Sandstrand: ruhiges, flaches Wasser, eine lange Promenade voller Restaurants und Bars, und alles Nötige zu Fuß erreichbar. Die bequemste Basis der Stadt — das Auto kann stehen bleiben.',
    'paradise.description2': 'Morgens am Strand, mittags auf der Promenade, abends ein Spaziergang am Kanal. Und wenn Sie mehr wollen: Buchten, Altstadt und der Naturpark Montgó sind nur Minuten entfernt. Das Viertel lebt das ganze Jahr — in der Hochsaison wie im tiefsten Winter, ideal zum Überwintern.',
    'paradise.beach.title': 'Arenal-Strand',
    'paradise.beach.description': 'Jáveas einziger Sandstrand, 250 m von der Tür — flaches, familienfreundliches Wasser, mit den Restaurants der Promenade direkt dahinter.',
    'paradise.watersports.title': 'Wassersport',
    'paradise.watersports.description': 'Kajak-, SUP-, Jetski- und Tauchanbieter konzentrieren sich an der Kanalmündung, wenige Schritte entfernt.',
    'paradise.dining.title': 'Essen Gehen',
    'paradise.dining.description': 'Vom Frühstück bis zum späten Abendessen, ohne das Auto zu bewegen — Reisgerichte am Kanal bei Amarre 152, Sundowner bei Tosca, und die ganze Promenade dazwischen.',
    'paradise.oldtown.title': 'Die Altstadt',
    'paradise.oldtown.description': '4 km entfernt: gotische Kirche, Markthalle und wöchentliche Handwerksstände. 15 Minuten mit dem Rad, 5 mit dem Auto.',
    'paradise.walks.title': 'Küstenwege',
    'paradise.walks.description': 'Die Wege zum Cap Prim und in den Naturpark Montgó beginnen direkt östlich der Arenal-Promenade.',

    // Availability Section
    'availability.title': 'Verfügbarkeit & Preise',
    'availability.subtitle': 'Aktuelle Verfügbarkeit und Saisonpreise — der Kalender synchronisiert sich täglich mit Airbnb',
    'availability.note': 'Auf Airbnb blockierte Daten sind manchmal trotzdem direkt buchbar — fragen Sie uns einfach.',

    // Calendar
    'calendar.jan': 'Jan', 'calendar.feb': 'Feb', 'calendar.mar': 'Mär',
    'calendar.apr': 'Apr', 'calendar.may': 'Mai', 'calendar.jun': 'Jun',
    'calendar.jul': 'Jul', 'calendar.aug': 'Aug', 'calendar.sep': 'Sep',
    'calendar.oct': 'Okt', 'calendar.nov': 'Nov', 'calendar.dec': 'Dez',
    'calendar.sun': 'So', 'calendar.mon': 'Mo', 'calendar.tue': 'Di',
    'calendar.wed': 'Mi', 'calendar.thu': 'Do', 'calendar.fri': 'Fr', 'calendar.sat': 'Sa',
    'calendar.error': 'Fehler beim Laden des Kalenders', 'calendar.tryAgain': 'Bitte erneut versuchen',
    'calendar.available': 'Verfügbar', 'calendar.past': 'Vergangen',

    // Booking Information Section
    'booking.information': 'Buchungsinformationen',
    'booking.rates': 'Preise',
    'booking.highSeason': '• Hochsaison (Juni – September & Feiertage): ab 210 € pro Nacht',
    'booking.midSeason': '• Nebensaison (April, Mai & Oktober): ab 160 € pro Nacht',
    'booking.lowSeason': '• Wintersaison (November – März außerhalb der Feiertage): ab 130 € pro Nacht',
    'booking.minimumStay': 'Mindestaufenthalt',
    'booking.minimumStayText': '5 Nächte in der Hochsaison, 3 Nächte im Rest des Jahres',
    'booking.checkInOut': 'Check-in & Check-out',
    'booking.checkInTime': '• Check-in: ab 16:00 Uhr',
    'booking.checkOutTime': '• Check-out: bis 12:00 Uhr',
    'booking.cancellation': 'Stornierungsbedingungen',
    'booking.cancellationText': 'Kostenlose Stornierung bis 30 Tage vor Anreise. Innerhalb von 30 Tagen gelten unsere Stornierungsbedingungen.',
    'booking.directContact': 'Direkter Kontakt',
    'booking.airbnb': 'Auf Airbnb Buchen',
    'booking.checkingAvailability': 'Verfügbarkeit wird geprüft...',
    'booking.datesAvailable': '✅ Diese Daten sind verfügbar — fahren Sie mit Ihrer Buchung fort.',
    'booking.datesUnavailable': '❌ Diese Daten sind belegt. Versuchen Sie andere — oder fragen Sie uns: auf Airbnb blockierte Daten sind manchmal direkt buchbar.',
    'booking.nextAvailable': 'Nächste verfügbare Daten:',
    'booking.useSuggestedDates': 'Diese Daten Übernehmen',

    // Recommendations Page
    'recommendations.title': 'Essen & Unternehmungen',
    'recommendations.subtitle': 'Unsere ehrliche Auswahl für den Arenal und Umgebung — die Adressen, zu denen wir Freunde schicken.',
    'recommendations.restaurants': 'Restaurants',
    'recommendations.drinks': 'Bars & Getränke',
    'recommendations.breakfast': 'Frühstück & Bäckerei',

    // Restaurant descriptions
    'rec.chabada.desc': 'Strandbar für einen Drink, fast mit den Füßen im Sand',
    'rec.chabada.hours': 'Ab 8 Uhr durchgehend, Happy Hour 16–20 Uhr, Livemusik am Donnerstagabend',
    'rec.labambula.desc': 'Lebhafte Bar mit Livemusik und Tanz',
    'rec.labambula.hours': '9–1 Uhr (am Wochenende bis 3), Flamenco sonntags, Swing dienstags, Rock freitags',
    'rec.lafontana.desc': 'Paella und italienische Pizza direkt am Strand',
    'rec.lafontana.hours': 'Täglich durchgehend geöffnet',
    'rec.bohemians.desc': 'Elegantes Essen in gepflegter Atmosphäre',
    'rec.bohemians.hours': '12–24 Uhr (täglich)',
    'rec.lamasena.desc': 'Feine Küche für ein langes Mittag- oder Abendessen',
    'rec.lamasena.hours': 'Mo 12:30–16:30; Mi–So 12:30–16:30 & 19:30–22:30 (Sa/So bis 23 Uhr), dienstags geschlossen',
    'rec.loasis.desc': 'Die Adresse für Steaks und Gegrilltes',
    'rec.loasis.hours': '12:30–23 Uhr (täglich)',
    'rec.casalili.desc': 'Frische, authentische asiatische Küche',
    'rec.casalili.hours': '12:30–16 & 18:30–23 Uhr (täglich)',
    'rec.carnaval.desc': 'Moderne Fusionsküche — Sushi, Burger und Poke Bowls',
    'rec.carnaval.hours': 'Täglich durchgehend geöffnet',
    'rec.caramel.desc': 'Bäckerei nach französischer Art mit frischem Gebäck und gutem Kaffee',
    'rec.caramel.hours': '7:30–19:30 Uhr (täglich)',

    // Common location terms
    'rec.location.beach': 'Arenal-Strand',
    'rec.location.walk': 'Min. zu Fuß',
    'rec.location.taxi': 'Min. mit dem Taxi',
    'rec.location.street': 'Am Ende der Straße',
    'recommendations.beaches': 'Strände',
    'recommendations.activities': 'Aktivitäten',
    'recommendations.shopping': 'Einkaufen',
    'recommendations.contact': 'Noch Fragen?',
    'recommendations.contactText': 'Schreiben Sie uns jederzeit während Ihres Aufenthalts — für Wegbeschreibungen, Reservierungen oder einen lokalen Tipp.',
    'recommendations.backToHome': 'Zurück zur Startseite',
    'contact.phone': 'Rufen Sie mich an',
    'contact.whatsapp': 'Schreiben Sie mir auf WhatsApp',

    // Promotional Calendar
    'promotional.offerEndsIn': 'Angebot endet in',
    'promotional.offerExpired': 'Angebot abgelaufen',
    'promotional.discountedRate': 'Rabattierter Preis',
    'promotional.limitedTimeOffer': 'Zeitlich begrenztes Angebot',
    'calendar.unavailable': 'Nicht verfügbar',
    'calendar.regularRate': 'Normalpreis',
  },
  es: {
    // Navigation
    'nav.home': 'Inicio',
    'nav.apartment': 'Apartamento',
    'nav.gallery': 'Galería',
    'nav.rates': 'Tarifas',
    'nav.location': 'Ubicación',
    'nav.booking': 'Reservar',
    'nav.recommendations': 'Recomendaciones',

    // Hero Section
    'hero.title': 'JÁVEA BLISS',
    'hero.eyebrow': "Jávea · Costa Blanca, España",
    'glance.eyebrow': "Lo esencial",
    'apartment.eyebrow': "Dónde te alojas",
    'amenities.eyebrow': "Dentro",
    'paradise.eyebrow': "El barrio",
    'gallery.eyebrow': "Fotografías",
    'testimonials.eyebrow': "Opiniones",
    'rates.eyebrow': "Tarifas",
    'booking.eyebrow': "Consulta",
    'hero.subtitle': 'Apartamento junto a la Playa del Arenal',
    'hero.tagline': "Apartamento reformado de dos habitaciones para cuatro, a 250 m de la Playa del Arenal. Reserva directa desde 130 € la noche.",
    'hero.description': 'Alójate a 250 metros de la Playa del Arenal, la playa de arena de Jávea (Xàbia), con su paseo lleno de restaurantes. El apartamento está totalmente reformado, con aire acondicionado, wifi rápido y parking gratis. La escapada perfecta: a 1 hora y media de Valencia por la AP-7, a 4 horas de Madrid por la A-3.',
    'hero.bookButton': 'Reserva Tu Estancia',
    'hero.exploreButton': 'Descubre el Apartamento',

    // Apartment Section
    'apartment.title': 'El Apartamento',
    'apartment.description': 'Apartamento totalmente reformado en primera planta, junto al tranquilo canal de la Fontana, a una calle de la Playa del Arenal. Dos habitaciones dobles, un baño moderno, cocina equipada y terraza privada sobre el agua — con ascensor y plaza de parking propia.',
    'apartment.restaurantProximity': 'Restaurantes a un paso',
    'apartment.restaurantProximityDesc': 'Chabada, La Bambula, Masena y todo el paseo del Arenal están a un paseo a pie.',
    'apartment.viewAllRestaurants': 'Ver la Guía de Restaurantes',

    // At Glance Section
    'glance.title': 'De un vistazo',
    'glance.sleeps': 'Para 4 personas',
    'glance.bedrooms': '2 habitaciones dobles',
    'glance.bathroom': '1 baño moderno',
    'glance.beach': 'A 250 m de la Playa del Arenal',
    'glance.parking': 'Parking privado gratis',
    'glance.wifi': 'Wifi rápido de fibra',
    'glance.ac': 'Aire acondicionado',
    'glance.terrace': 'Terraza privada',

    // Amenities Section
    'amenities.title': 'Equipamiento',
    'amenities.kitchen': 'Cocina Equipada',
    'amenities.kitchenDesc': 'Placa de inducción, horno, lavavajillas, microondas y cafetera Nespresso — todo para cocinar como en casa.',
    'amenities.comfort': 'Calefacción y Aire Acondicionado',
    'amenities.comfortDesc': 'Aire acondicionado y calefacción por zonas: el apartamento está a gusto en agosto y en enero.',
    'amenities.entertainment': 'Smart TV y Streaming',
    'amenities.entertainmentDesc': 'Smart TV de 55 pulgadas y wifi de fibra, rápido para hacer streaming — o teletrabajar frente al mar.',
    'amenities.laundry': 'Lavadora',
    'amenities.laundryDesc': 'Lavadora en el patio (sin secadora).',
    'amenities.outdoor': 'Terraza Privada',
    'amenities.outdoorDesc': 'Una terraza al canal para desayunar fuera o tomar algo por la tarde.',
    'amenities.parking': 'Parking Gratis',
    'amenities.parkingDesc': 'Tu propia plaza — un lujo tan cerca del Arenal, sobre todo en verano.',

    // Rates Section
    'rates.title': 'Tarifas y Condiciones',
    'rates.description': 'Precios por temporada, claros y sin costes de plataforma al reservar directo. A partir de 5 semanas se aplica la tarifa de larga estancia: 100 € la noche — ideal para teletrabajar o pasar el invierno junto al mar.',
    'rates.highSeason': 'Temporada Alta',
    'rates.highPeriod': 'Junio – septiembre y festivos',
    'rates.highRate': 'Desde 210 € la noche',
    'rates.midSeason': 'Temporada Media',
    'rates.midPeriod': 'Abril, mayo y octubre',
    'rates.midRate': 'Desde 160 € la noche',
    'rates.lowSeason': 'Temporada Baja',
    'rates.lowPeriod': 'Noviembre – marzo (fuera de festivos)',
    'rates.lowRate': 'Desde 130 € la noche',
    'rates.policies': 'Condiciones de Reserva',
    'rates.policy1': 'Mínimo 5 noches en temporada alta',
    'rates.policy2': 'Mínimo 3 noches el resto del año',
    'rates.policy3': 'Entrada a partir de las 16:00',
    'rates.policy4': 'Salida antes de las 12:00',

    // Location Section (original entries)
    'location.title': 'La Ubicación',
    'location.description': 'Marina Nou Fontana, el barrio del canal del Arenal — la zona con más vida de Jávea, a una calle de la playa.',
    'location.beach': 'Playa del Arenal',
    'location.beachDesc': 'A 250 m — arena fina, agua poco profunda, perfecta con niños',
    'location.restaurants': 'Restaurantes',
    'location.restaurantsDesc': 'Los bares y restaurantes del paseo, a 2–5 minutos andando',
    'location.shops': 'Comercios',
    'location.shopsDesc': 'Supermercados y farmacia a 5 minutos a pie',
    'location.transport': 'Cómo Llegar',
    'location.transportDesc': 'A 1 h 15 del aeropuerto de Alicante, 1 h 30 del de Valencia',
    'location.restaurantTitle': 'Donde comen los de aquí',
    'location.restaurantDesc': 'Chabada, La Bambula, Masena, Bohemians — nuestra guía reúne los sitios a los que vamos de verdad, todos a un paseo del apartamento.',
    'location.viewRecommendations': 'Ver la Guía de Restaurantes',

    // Booking Section
    'booking.title': 'Consulta Disponibilidad y Reserva Directo',
    'booking.description': 'Envíanos una solicitud con tus fechas y te respondemos en menos de 24 horas. Reservas directamente con el propietario — sin costes de plataforma ni comisiones.',
    'booking.name': 'Nombre Completo',
    'booking.email': 'Correo Electrónico',
    'booking.phone': 'Teléfono',
    'booking.checkIn': 'Fecha de Entrada',
    'booking.checkOut': 'Fecha de Salida',
    'booking.guests': 'Número de Personas',
    'booking.message': 'Mensaje Adicional (Opcional)',
    'booking.submit': 'Enviar Solicitud',
    'booking.submitting': 'Enviando...',
    'booking.success': '¡Solicitud Enviada!',
    'booking.successDesc': 'Te responderemos lo antes posible.',
    'booking.error': 'Problema con el servicio de correo',
    'booking.contactInfo': 'Datos de Contacto',
    'booking.contactDesc': '¿Prefieres hablar directamente? Escríbenos con cualquier duda sobre tu estancia.',
    'booking.emailLabel': 'Correo',
    'booking.responseTime': 'Solemos responder en menos de 24 horas',

    // Footer
    'footer.tagline': 'Apartamento vacacional reformado a 250 m de la Playa del Arenal, Jávea.',
    'footer.rights': 'Todos los derechos reservados.',
    'footer.quickLinks': 'Enlaces Rápidos',
    'footer.guides': 'Guías de Jávea (en inglés)',
    'footer.followUs': 'Síguenos',

    // Form validation
    'form.nameRequired': 'El nombre debe tener al menos 2 caracteres',
    'form.emailInvalid': 'Introduce un correo electrónico válido',
    'form.checkInRequired': 'Elige una fecha de entrada',
    'form.checkOutRequired': 'Elige una fecha de salida',
    'form.checkOutMustBeAfterCheckIn': 'La fecha de salida debe ser posterior a la de entrada',
    'form.guestsRequired': 'Indica el número de personas',
    'form.phoneRequired': 'Introduce un teléfono válido',
    'form.spam': 'Protección antispam activada',

    // Guest options
    'guests.1': '1 Persona',
    'guests.2': '2 Personas',
    'guests.3': '3 Personas',
    'guests.4': '4 Personas',

    // Pricing
    'pricing.title': 'Información de Precios',
    'pricing.stayDuration': 'Duración de la Estancia',
    'pricing.ratePerNight': 'Tarifa por noche',
    'pricing.total': 'Total',
    'pricing.nights': 'noches',
    'pricing.longTermRate': 'Tarifa larga estancia',
    'pricing.longTermDiscount': '¡Descuento de larga estancia aplicado!',
    'pricing.longTermMessage': 'Tu estancia de {nights} noches (5+ semanas) tiene derecho a nuestra tarifa de 100 € la noche.',
    'pricing.discount': 'Descuento',
    'pricing.cleaningFee': 'Limpieza',
    'pricing.includedInTotal': 'incluida en el total',
    'pricing.pricePerNight': 'Precio por noche',

    // Gallery Section
    'gallery.title': 'El Apartamento en Fotos',
    'gallery.description': 'Echa un vistazo — salón, habitaciones, cocina, baño y terraza.',
    'gallery.showAll': "Ver todas las fotos",
    'gallery.livingAreas': 'Zonas de Estar',
    'gallery.bedrooms': 'Habitaciones',
    'gallery.kitchen': 'Cocina y Comedor',
    'gallery.outdoor': 'Exteriores',
    'gallery.bathroom': 'Baño',
    'gallery.entrance': 'Entrada y Pasillo',
    'gallery.overview': 'Vista General',
    'gallery.livingRoom1': 'Salón con sofá y mueble de TV',
    'gallery.livingRoom2': 'Salón con mucha luz natural',
    'gallery.livingRoom3': 'Zona de estar del salón',
    'gallery.entertainment': 'Smart TV de 55 pulgadas en el salón',
    'gallery.masterBedroom': 'Habitación principal con cama doble',
    'gallery.bedroom1': 'Habitación con armarios empotrados',
    'gallery.bedroom2': 'Habitación luminosa',
    'gallery.secondBedroom': 'Segunda habitación',
    'gallery.bedroom3': 'Segunda habitación con dos camas individuales',
    'gallery.bedroom4': 'Armarios de la habitación',
    'gallery.bedroom5': 'Habitación con luz de mar',
    'gallery.modernKitchen': 'Cocina en verde bosque',
    'gallery.kitchenAppliances': 'Cocina con placa de inducción y horno',
    'gallery.kitchenDining': 'Cocina con zona de comedor',
    'gallery.terrace1': 'Terraza privada sobre el canal',
    'gallery.terrace2': 'Mesa de comedor en la terraza',
    'gallery.terrace3': 'La terraza al atardecer',
    'gallery.modernBathroom': 'Baño reformado con ducha de lluvia',
    'gallery.apartmentEntrance': 'Entrada del apartamento',
    'gallery.hallway': 'Pasillo',
    'gallery.overview1': 'Zona de estar con vistas al canal',
    'gallery.overview2': 'Cocina con frentes verde bosque',
    'gallery.overview3': 'Habitación con buen colchón y armarios',
    'gallery.overview4': 'Vistas al canal desde el apartamento',

    // Testimonials Section
    'testimonials.title': 'Lo que Dicen Nuestros Huéspedes',
    'testimonials.description': 'Opiniones reales de estancias recientes.',
    'testimonials.guest1Name': 'Carlos',
    'testimonials.guest1Location': 'Madrid, julio 2025',
    'testimonials.guest1Text': 'Uno de los alojamientos más completos en los que he estado — reformado, con la cocina totalmente equipada, sábanas, toallas e incluso ingredientes básicos. Muy contentos con nuestro fin de semana en familia. Ubicación ideal cerca de la playa y los restaurantes, y una atención inmejorable de Laurent.',
    'testimonials.guest2Name': 'Emma',
    'testimonials.guest2Location': 'Ámsterdam, Países Bajos, junio 2025',
    'testimonials.guest2Text': 'Encontramos justo lo que buscábamos — un apartamento cómodo a un paseo de la playa y a un precio justo. La terraza, preciosa iluminada al atardecer, se convirtió en nuestro rincón favorito. Limpieza impecable.',
    'testimonials.guest3Name': 'Pierre & Marie',
    'testimonials.guest3Location': 'Lyon, Francia, junio 2025',
    'testimonials.guest3Text': 'De verdad a 3 minutos de la playa, rodeado de los mejores restaurantes y bares de Jávea — andar es el único transporte que necesitas. La cocina está equipada con todo, y el anfitrión nos recibió incluso con una botella de cava.',

    // Reviews Translation
    'reviews.showOriginal': 'Ver original ({lang})',
    'reviews.hideOriginal': 'Ocultar original ({lang})',

    // Interior Section
    'interior.title': 'Interior',
    'interior.bedrooms': 'Dos habitaciones dobles, cada una con colchón de calidad hotelera, cortinas opacas y armarios empotrados.',
    'interior.bathroom': 'Baño de microcemento con ducha de lluvia, inodoro suspendido y luz indirecta suave.',
    'interior.kitchen': 'Cocina verde bosque: placa de inducción, horno multifunción, lavavajillas, cafetera Nespresso e iluminación LED.',
    'interior.lounge': 'Salón abierto con mueble de TV en lamas de roble, smart TV de 55 pulgadas y un sofá que se convierte en cama individual para un huésped extra.',
    'interior.lighting': 'Iluminación LED regulable para tardes tranquilas.',
    'interior.patio': 'Patio privado para desayunar con calma — o aclarar las chanclas llenas de arena.',
    'interior.laundry': 'Lavadora en el patio, con sitio para guardar una bici o el equipo de surf.',
    'interior.connectivity': 'Aire acondicionado por zonas y wifi rápido de fibra en todo el apartamento.',

    // Building & Amenities Section
    'building.title': 'El Edificio',
    'building.security': 'Portal seguro, ascensor y plaza de parking asignada — algo poco habitual tan cerca de la playa.',
    'building.marina': 'Amarres, tablas de paddle y barquitas de motor se alquilan en la Marina Nou Fontana, a 150 m.',
    'building.shopping': 'Supermercados y farmacia a cinco minutos a pie.',

    // Availability Calendar
    'checkAvailability': 'Consultar Disponibilidad',
    'availabilityDescription': 'Las fechas en verde están libres; las rojas, ya reservadas. El calendario se sincroniza a diario con nuestro sistema de reservas.',
    'calendarNote': '¿Tienes ya tus fechas? Envía una solicitud abajo y te confirmamos en menos de 24 horas.',
    'available': 'Disponible',
    'booked': 'Reservado',
    'lastUpdated': 'Última actualización',
    'datesSelected': 'Fechas Seleccionadas',
    'specialOfferSelected': 'Oferta Especial Seleccionada',
    'datesAutoFilled': 'Fechas añadidas al formulario de reserva de abajo',
    'was': 'antes',
    'specialOffer': 'Oferta Especial',
    'seasonalRates': 'Tarifas por Temporada',

    // Amenities List
    'amenityList.airConditioning': 'Aire Acondicionado',
    'amenityList.wifi': 'Wifi Rápido de Fibra',
    'amenityList.smartTv': 'Smart TV de 55 pulgadas',
    'amenityList.kitchen': 'Cocina Equipada',
    'amenityList.waterFilter': 'Filtro de Agua',
    'amenityList.washer': 'Lavadora (sin secadora)',
    'amenityList.parking': 'Parking Privado Gratis',
    'amenityList.nespresso': 'Cafetera Nespresso',
    'amenityList.dishwasher': 'Lavavajillas',
    'amenityList.showerTowels': 'Toallas de Baño',
    'amenityList.beachTowels': 'Toallas de Playa',
    'amenityList.noPets': 'No se Admiten Mascotas',

    // Discover Paradise Section (replaces original location section)
    'paradise.title': 'Por qué el Arenal',
    'paradise.description1': 'El Arenal es la playa de arena de Jávea: agua tranquila y poco profunda, un paseo largo lleno de restaurantes y bares, y todo lo necesario a un paso. La base más cómoda de la ciudad — el coche se queda aparcado.',
    'paradise.description2': 'Mañanas de playa, comida en el paseo, y por la tarde un paseo junto al canal. Y cuando quieras más: las calas, el casco antiguo y el parque natural del Montgó están a pocos minutos. El barrio tiene vida todo el año, en agosto y en pleno invierno.',
    'paradise.beach.title': 'Playa del Arenal',
    'paradise.beach.description': 'La única playa de arena de Jávea, a 250 m de la puerta — agua poco profunda, perfecta con niños, con los restaurantes del paseo justo detrás.',
    'paradise.watersports.title': 'Deportes Acuáticos',
    'paradise.watersports.description': 'Kayak, paddle surf, motos de agua y buceo se concentran en la bocana del canal, a unos pasos.',
    'paradise.dining.title': 'Comer Fuera',
    'paradise.dining.description': 'Del desayuno a la cena tardía sin tocar el coche — arroces junto al canal en Amarre 152, atardecer con una copa en Tosca, y todo el paseo entre medias.',
    'paradise.oldtown.title': 'El Casco Antiguo',
    'paradise.oldtown.description': 'A 4 km: iglesia gótica, mercado cubierto y puestos artesanos semanales. 15 minutos en bici, 5 en coche.',
    'paradise.walks.title': 'Senderos Costeros',
    'paradise.walks.description': 'Los senderos al Cap Prim y al parque natural del Montgó empiezan justo al este del paseo del Arenal.',

    // Availability Section
    'availability.title': 'Disponibilidad y Precios',
    'availability.subtitle': 'Disponibilidad en tiempo real y tarifas por temporada — el calendario se sincroniza a diario con Airbnb',
    'availability.note': 'Fechas bloqueadas en Airbnb a veces siguen disponibles reservando directo — pregúntanos antes de descartarlas. Para Semana Santa y puentes, reserva con antelación: el Arenal se llena.',

    // Calendar
    'calendar.jan': 'Ene', 'calendar.feb': 'Feb', 'calendar.mar': 'Mar',
    'calendar.apr': 'Abr', 'calendar.may': 'May', 'calendar.jun': 'Jun',
    'calendar.jul': 'Jul', 'calendar.aug': 'Ago', 'calendar.sep': 'Sep',
    'calendar.oct': 'Oct', 'calendar.nov': 'Nov', 'calendar.dec': 'Dic',
    'calendar.sun': 'Dom', 'calendar.mon': 'Lun', 'calendar.tue': 'Mar',
    'calendar.wed': 'Mié', 'calendar.thu': 'Jue', 'calendar.fri': 'Vie', 'calendar.sat': 'Sáb',
    'calendar.error': 'Error al cargar el calendario', 'calendar.tryAgain': 'Inténtalo de nuevo',
    'calendar.available': 'Disponible', 'calendar.past': 'Pasado',

    // Booking Information Section
    'booking.information': 'Información de Reserva',
    'booking.rates': 'Tarifas',
    'booking.highSeason': '• Temporada alta (junio – septiembre y festivos): desde 210 € la noche',
    'booking.midSeason': '• Temporada media (abril, mayo y octubre): desde 160 € la noche',
    'booking.lowSeason': '• Temporada baja (noviembre – marzo fuera de festivos): desde 130 € la noche',
    'booking.minimumStay': 'Estancia Mínima',
    'booking.minimumStayText': '5 noches en temporada alta, 3 noches el resto del año',
    'booking.checkInOut': 'Entrada y Salida',
    'booking.checkInTime': '• Entrada: a partir de las 16:00',
    'booking.checkOutTime': '• Salida: antes de las 12:00',
    'booking.cancellation': 'Política de Cancelación',
    'booking.cancellationText': 'Cancelación gratuita hasta 30 días antes de la entrada. Dentro de los 30 días se aplican nuestras condiciones.',
    'booking.directContact': 'Contacto Directo',
    'booking.airbnb': 'Reservar en Airbnb',
    'booking.checkingAvailability': 'Comprobando disponibilidad...',
    'booking.datesAvailable': '✅ Estas fechas están disponibles — continúa con tu reserva.',
    'booking.datesUnavailable': '❌ Esas fechas están ocupadas. Prueba otras — o pregúntanos: fechas bloqueadas en Airbnb a veces se pueden reservar directo.',
    'booking.nextAvailable': 'Próximas fechas disponibles:',
    'booking.useSuggestedDates': 'Usar Estas Fechas',

    // Recommendations Page
    'recommendations.title': 'Dónde Comer y Qué Hacer',
    'recommendations.subtitle': 'Nuestra lista honesta para el Arenal y alrededores — los sitios a los que mandamos a los amigos.',
    'recommendations.restaurants': 'Restaurantes',
    'recommendations.drinks': 'Bares y Copas',
    'recommendations.breakfast': 'Desayuno y Panadería',

    // Restaurant descriptions
    'rec.chabada.desc': 'Chiringuito para tomar algo casi con los pies en la arena',
    'rec.chabada.hours': 'Desde las 8:00 sin cerrar, happy hour de 16 a 20, música en directo los jueves por la noche',
    'rec.labambula.desc': 'Bar animado con música en directo y baile',
    'rec.labambula.hours': '9:00–1:00 (fines de semana hasta las 3), flamenco los domingos, swing los martes, rock los viernes',
    'rec.lafontana.desc': 'Paella y pizza italiana a pie de playa',
    'rec.lafontana.hours': 'Todos los días sin cerrar',
    'rec.bohemians.desc': 'Cena elegante en un ambiente cuidado',
    'rec.bohemians.hours': '12:00–24:00 (a diario)',
    'rec.lamasena.desc': 'Cocina refinada para una comida larga o una cena',
    'rec.lamasena.hours': 'Lun 12:30–16:30; mié–dom 12:30–16:30 y 19:30–22:30 (hasta las 23 sáb/dom), martes cerrado',
    'rec.loasis.desc': 'El sitio de los chuletones y la carne a la brasa',
    'rec.loasis.hours': '12:30–23:00 (a diario)',
    'rec.casalili.desc': 'Cocina asiática fresca y auténtica',
    'rec.casalili.hours': '12:30–16:00 y 18:30–23:00 (a diario)',
    'rec.carnaval.desc': 'Fusión moderna — sushi, hamburguesas y poke bowls',
    'rec.carnaval.hours': 'Todos los días sin cerrar',
    'rec.caramel.desc': 'Panadería de estilo francés con bollería recién hecha y buen café',
    'rec.caramel.hours': '7:30–19:30 (a diario)',

    // Common location terms
    'rec.location.beach': 'Playa del Arenal',
    'rec.location.walk': 'min andando',
    'rec.location.taxi': 'min en taxi',
    'rec.location.street': 'Al final de la calle',
    'recommendations.beaches': 'Playas',
    'recommendations.activities': 'Actividades',
    'recommendations.shopping': 'Compras',
    'recommendations.contact': '¿Necesitas Ayuda?',
    'recommendations.contactText': 'Escríbenos en cualquier momento durante tu estancia — para indicaciones, una reserva o un consejo local.',
    'recommendations.backToHome': 'Volver al Inicio',
    'contact.phone': 'Llámame',
    'contact.whatsapp': 'Mándame un WhatsApp',

    // Promotional Calendar
    'promotional.offerEndsIn': 'La oferta termina en',
    'promotional.offerExpired': 'Oferta caducada',
    'promotional.discountedRate': 'Tarifa con Descuento',
    'promotional.limitedTimeOffer': 'Oferta por tiempo limitado',
    'calendar.unavailable': 'No disponible',
    'calendar.regularRate': 'Tarifa Normal',
  },
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [location, setLocation] = useLocation();
  const [language, setLanguageState] = useState<Language>('en');

  // Sync language from URL on mount and URL changes
  useEffect(() => {
    const urlLanguage = getLanguageFromPath(location);
    
    if (urlLanguage) {
      // URL has language prefix - use it
      setLanguageState(urlLanguage);
      localStorage.setItem('preferredLanguage', urlLanguage);
    } else if (location === '/' || location === '') {
      // Root path - redirect to detected/saved language
      const detectedLanguage = detectUserLanguage();
      setLanguageState(detectedLanguage);
      // Redirect to language-prefixed URL
      setLocation(`/${detectedLanguage}/`);
    }
  }, [location, setLocation]);

  const handleSetLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('preferredLanguage', lang);
    
    // Navigate to the new language URL
    const currentPath = getPathWithoutLanguage(location);
    const newPath = `/${lang}${currentPath === '/' ? '/' : currentPath}`;
    setLocation(newPath);
  };

  // Helper to get localized path for internal links
  const getLocalizedPath = (path: string): string => {
    // Remove any existing language prefix and add current language
    const cleanPath = getPathWithoutLanguage(path);
    return `/${language}${cleanPath === '/' ? '/' : cleanPath}`;
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t, getLocalizedPath }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};