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
    'hero.subtitle': 'Affordable Luxury Coastal Apartment',
    'hero.tagline': 'From €130/night - Your budget-friendly paradise on Costa Blanca, perfect for UK & Northern European visitors',
    'hero.description': 'Wake to the gentle sound of sailboat masts swaying in the Mediterranean breeze. Stroll just 250 metres to Arenal\'s golden sands for a refreshing swim, then return to your cool, contemporary retreat where modern design meets coastal elegance. Direct flights from London, Amsterdam, and major European cities.',
    'hero.bookButton': 'Book Your Stay',
    'hero.exploreButton': 'Explore the Apartment',
    
    // Apartment Section
    'apartment.title': 'Your Coastal Sanctuary',
    'apartment.description': 'Discover your personal slice of paradise in this fully renovated first-floor apartment at unbeatable rates. Nestled beside the tranquil Nou Fontana canal, where affordable Mediterranean elegance meets modern comfort in perfect harmony.',
    'apartment.restaurantProximity': 'Walk to the Best Restaurants',
    'apartment.restaurantProximityDesc': 'Your apartment is perfectly located within walking distance of Jávea\'s most popular restaurants and bars.',
    'apartment.viewAllRestaurants': 'View Complete Restaurant Guide',
    
    // At Glance Section
    'glance.title': 'At a Glance',
    'glance.sleeps': 'Sleeps up to 4 guests',
    'glance.bedrooms': '2 spacious bedrooms',
    'glance.bathroom': '1 full bathroom',
    'glance.beach': '3-minute walk to Arenal Beach',
    'glance.parking': 'Private parking space',
    'glance.wifi': 'High-speed WiFi',
    'glance.ac': 'Air conditioning',
    'glance.terrace': 'Private terrace',
    
    // Amenities Section
    'amenities.title': 'Amenities & Features',
    'amenities.kitchen': 'Fully Equipped Kitchen',
    'amenities.kitchenDesc': 'Modern kitchen with dishwasher, microwave, coffee machine, and all essentials for home cooking.',
    'amenities.comfort': 'Climate Comfort',
    'amenities.comfortDesc': 'Air conditioning and heating throughout for year-round comfort.',
    'amenities.entertainment': 'Entertainment',
    'amenities.entertainmentDesc': 'Smart TV, high-speed WiFi, and streaming services for relaxing evenings.',
    'amenities.laundry': 'Laundry Facilities',
    'amenities.laundryDesc': 'Washing machine available (no dryer provided).',
    'amenities.outdoor': 'Outdoor Space',
    'amenities.outdoorDesc': 'Private terrace perfect for morning coffee or evening drinks.',
    'amenities.parking': 'Secure Parking',
    'amenities.parkingDesc': 'Private parking space included for your convenience.',
    
    // Rates Section
    'rates.title': 'Affordable Rates & Policies',
    'rates.description': 'Competitive seasonal rates and booking policies for your budget-friendly stay at Jávea Bliss. Enjoy luxury accommodation without the premium price.',
    'rates.highSeason': 'High Season',
    'rates.highPeriod': 'June – September & Holidays',
    'rates.highRate': 'From €210 per night',
    'rates.midSeason': 'Mid Season',
    'rates.midPeriod': 'April, May, October',
    'rates.midRate': 'From €160 per night',
    'rates.lowSeason': 'Low Season',
    'rates.lowPeriod': 'November – March (outside holidays)',
    'rates.lowRate': 'From €130 per night',
    'rates.policies': 'Booking Policies',
    'rates.policy1': '5 nights minimum in high season',
    'rates.policy2': '3 nights minimum in other periods',
    'rates.policy3': 'Check-in: From 4:00 PM',
    'rates.policy4': 'Check-out: By 12:00 AM',
    
    // Location Section (original entries)
    'location.title': 'Prime Location',
    'location.description': 'Perfectly positioned in the exclusive Marina Nou Fontana area, where tranquil canals meet Mediterranean charm.',
    'location.beach': 'Arenal Beach',
    'location.beachDesc': '3-minute walk to golden sandy beach',
    'location.restaurants': 'Dining',
    'location.restaurantsDesc': 'Waterfront restaurants within walking distance',
    'location.shops': 'Shopping',
    'location.shopsDesc': 'Local markets and boutiques nearby',
    'location.transport': 'Transport',
    'location.transportDesc': 'Easy access to public transport and main roads',
    'location.restaurantTitle': 'Local Restaurant Recommendations',
    'location.restaurantDesc': 'Discover the best restaurants and bars within walking distance, including Chabada, La Bambula, Masena, and Bohemians. Our curated list features authentic local dining experiences.',
    'location.viewRecommendations': 'View Restaurant Guide',
    
    // Booking Section
    'booking.title': 'Reserve Your Affordable Paradise',
    'booking.description': 'Ready to experience your slice of tropical paradise at unbeatable rates? From just €130 per night, contact us to check availability and secure your budget-friendly escape to Jávea.',
    'booking.name': 'Full Name',
    'booking.email': 'Email Address',
    'booking.phone': 'Phone Number',
    'booking.checkIn': 'Check-in Date',
    'booking.checkOut': 'Check-out Date',
    'booking.guests': 'Number of Guests',
    'booking.message': 'Additional Message (Optional)',
    'booking.submit': 'Send Inquiry',
    'booking.submitting': 'Sending...',
    'booking.success': 'Inquiry Sent!',
    'booking.successDesc': 'We\'ll get back to you as soon as possible.',
    'booking.error': 'Email Service Issue',
    'booking.contactInfo': 'Contact Information',
    'booking.contactDesc': 'Reach out to us directly for immediate assistance or questions about your stay.',
    'booking.emailLabel': 'Email',
    'booking.responseTime': 'We typically respond within 24 hours',
    
    // Footer
    'footer.tagline': 'Your gateway to Mediterranean bliss',
    'footer.rights': 'All rights reserved.',
    
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
    'pricing.longTermRate': 'Long-term rate',
    'pricing.longTermDiscount': 'Long-term rental discount applied!',
    'pricing.longTermMessage': 'Your stay of {nights} nights (5+ weeks) qualifies for our special €100/day rate.',
    'pricing.discount': 'Discount',
    'pricing.cleaningFee': 'Cleaning Fee',
    'pricing.includedInTotal': 'included in total',
    'pricing.pricePerNight': 'Price per night',
    
    // Gallery Section
    'gallery.title': 'Paradise Gallery',
    'gallery.description': 'Take a visual tour of our contemporary apartment and its surroundings.',
    'gallery.livingAreas': 'Living Areas',
    'gallery.bedrooms': 'Bedrooms',
    'gallery.kitchen': 'Kitchen & Dining',
    'gallery.outdoor': 'Outdoor Spaces',
    'gallery.bathroom': 'Bathroom',
    'gallery.entrance': 'Entrance & Hallway',
    'gallery.overview': 'Apartment Overview',
    'gallery.livingRoom1': 'Spacious living room',
    'gallery.livingRoom2': 'Living room with natural light',
    'gallery.livingRoom3': 'Living room seating area',
    'gallery.entertainment': 'Entertainment area with smart TV',
    'gallery.masterBedroom': 'Master bedroom with comfortable bed',
    'gallery.bedroom1': 'Bedroom with ample storage',
    'gallery.bedroom2': 'Bright bedroom with natural light',
    'gallery.secondBedroom': 'Second bedroom',
    'gallery.bedroom3': 'Second bedroom with twin beds',
    'gallery.bedroom4': 'Bedroom storage solutions',
    'gallery.bedroom5': 'Bedroom with coastal views',
    'gallery.modernKitchen': 'Modern fully equipped kitchen',
    'gallery.kitchenAppliances': 'Kitchen with quality appliances',
    'gallery.kitchenDining': 'Kitchen dining area',
    'gallery.terrace1': 'Private terrace with canal views',
    'gallery.terrace2': 'Outdoor dining area',
    'gallery.terrace3': 'Terrace perfect for relaxation',
    'gallery.modernBathroom': 'Modern bathroom with quality fixtures',
    'gallery.apartmentEntrance': 'Elegant apartment entrance',
    'gallery.hallway': 'Modern hallway',
    'gallery.overview1': 'Apartment living area with view',
    'gallery.overview2': 'Kitchen with forest-green cabinetry',
    'gallery.overview3': 'Bedroom with quality mattress and storage',
    'gallery.overview4': 'Outdoor canal view from apartment',
    
    // Testimonials Section
    'testimonials.title': 'What Our Guests Say',
    'testimonials.description': 'Discover why travelers choose Jávea Bliss for their affordable Mediterranean getaway.',
    'testimonials.guest1Name': 'Carlos',
    'testimonials.guest1Location': 'Madrid, July 2025',
    'testimonials.guest1Text': 'One of the most complete Airbnbs I have stayed in, renovated, with complete kitchen utensils, sheets, towels, cooking ingredients. Very happy with our stay on the floor, we went as a family to spend the weekend. Ideal location near the beach and restaurants. Unbeatable attention from Laurent.',
    'testimonials.guest2Name': 'Emma',
    'testimonials.guest2Location': 'Amsterdam, Netherlands, June 2025',
    'testimonials.guest2Text': 'We found exactly what we were looking for — affordable luxury within walking distance to the beach. The terrace, beautifully lit at sunset, became our favorite spot to relax. Great value for money and impeccably clean.',
    'testimonials.guest3Name': 'Pierre & Marie',
    'testimonials.guest3Location': 'Lyon, France, June 2025',
    'testimonials.guest3Text': 'An exceptional place, truly just 3 minutes from the beach and surrounded by Javea\'s best restaurants and bars. The nightlife is so close that walking is the only option you\'ll need. The apartment strikes the perfect balance between comfort and affordability. The kitchen is fully equipped for home cooking, and the host even welcomed us with a bottle of sparkling wine (cava).',
    
    // Reviews Translation
    'reviews.showOriginal': 'Show original ({lang})',
    'reviews.hideOriginal': 'Hide original ({lang})',

    // Interior Section
    'interior.title': 'Interior',
    'interior.bedrooms': 'Two generous double bedrooms, each with hotel-quality mattresses, blackout curtains and built-in wardrobes.',
    'interior.bathroom': 'Calm, micro-cement bathroom with rainfall shower, wall-hung WC and soft indirect lighting.',
    'interior.kitchen': 'Sleek forest-green fully equipped kitchen: induction hob, multifunction oven, dishwasher, Nespresso machine and concealed LED task lights reflected in a mirrored splash-back.',
    'interior.lounge': 'Open-plan lounge featuring an oak-slat media wall, 55-inch smart TV and a two-seater sofa that converts to a single bed for an extra guest.',
    'interior.lighting': 'LED ceiling lighting dimable for cosy evening and chilling before night out.',
    'interior.patio': 'Private patio for leisurely breakfasts or rinsing off sandy flip-flops.',
    'interior.laundry': 'Washing machine in private patio for storing wind surf or bicycle.',
    'interior.connectivity': 'Zoned air-conditioning and high-speed fibre Wi-Fi throughout.',

    // Building & Amenities Section
    'building.title': 'Building & Amenities',
    'building.security': 'Secure entrance, lift and one allocated parking space (rare this close to the beach).',
    'building.marina': 'Guests may book moorings, SUP boards or small motorboats directly at Marina Nou Fontana, 150m away.',
    'building.shopping': 'Several grocery stores and a pharmacy are within a five-minute stroll.',

    // Availability Calendar
    'checkAvailability': 'Check Availability',
    'availabilityDescription': 'See real-time availability and book your affordable Mediterranean escape. Green dates are available, red dates are already booked.',
    'calendarNote': 'Calendar syncs automatically with our booking system. Contact us to secure your dates.',
    'available': 'Available',
    'booked': 'Booked',
    'lastUpdated': 'Last updated',
    'datesSelected': 'Dates Selected',
    'specialOfferSelected': 'Special Offer Selected',
    'datesAutoFilled': 'Dates automatically filled in booking form below',
    'was': 'was',
    'specialOffer': 'Special Offer',
    'seasonalRates': 'Seasonal Rates',

    // Amenities List
    'amenityList.airConditioning': 'Air Conditioning',
    'amenityList.wifi': 'High-Speed WiFi',
    'amenityList.smartTv': '55-inch Smart TV',
    'amenityList.kitchen': 'Fully Equipped Kitchen',
    'amenityList.waterFilter': 'Water Filter',
    'amenityList.washer': 'Washer (no dryer)',
    'amenityList.parking': 'Private Parking',
    'amenityList.nespresso': 'Nespresso Machine',
    'amenityList.dishwasher': 'Dishwasher',
    'amenityList.showerTowels': 'Shower Towels',
    'amenityList.beachTowels': 'Beach Towels',
    'amenityList.noPets': 'Not Pet-Friendly',

    // Discover Paradise Section (replaces original location section)
    'paradise.title': 'Discover Paradise',
    'paradise.description1': 'Staying within walking distance of Arenal Beach means having the very best of Jávea right at your doorstep. As the town\'s only sandy beach, Arenal offers everything from refreshing morning swims in calm, shallow waters to scenic sunset dinners by the sea. The vibrant promenade is lined with beach bars, restaurants, local markets, live music, and even a few late-night spots for those who enjoy the nightlife.',
    'paradise.description2': 'Here, you can fully embrace the Mediterranean lifestyle without ever needing a car. Spend your days lounging on the beach, browsing charming boutiques, or exploring nearby coves and the historic old town—all just minutes away. For those looking for comfort, convenience, and the true Jávea experience, this apartment near Arenal is the perfect place to stay.',
    'paradise.beach.title': 'Arenal Beach',
    'paradise.beach.description': '3 minutes to Arenal, Jávea\'s most popular place to live with dining, promenade, and clubs. As the town\'s only sandy beach, offering calm shallow waters and vibrant nightlife.',
    'paradise.watersports.title': 'Water Sports',
    'paradise.watersports.description': 'Doorstep access to water-sports: kayak, paddle-surf, jet-ski and diving operators cluster around the canal mouth.',
    'paradise.dining.title': 'Dining Paradise',
    'paradise.dining.description': 'Immediate proximity of breakfast and lunch places. Canal-side dining options such as Amarre 152 (creative rice dishes) or Restaurante Tosca with sunset views over the boats.',
    'paradise.oldtown.title': 'Old Town',
    'paradise.oldtown.description': '10–15 minutes by bike (4 km) to Jávea\'s atmospheric Old Town with its Gothic church, covered market and weekly craft stalls.',
    'paradise.walks.title': 'Scenic Walks',
    'paradise.walks.description': 'Scenic coastal paths to Cap Prim and Montgó Natural Park start just east of the Arenal promenade.',

    // Availability Section
    'availability.title': 'Check Availability & Pricing',
    'availability.subtitle': 'View real-time availability and seasonal rates for your perfect Costa Blanca getaway',
    'availability.note': 'Calendar updates automatically with Airbnb bookings. Prices may vary based on length of stay and booking policies.',
    
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
    'booking.highSeason': '• High Season (June - September & Holidays): From €210 per night',
    'booking.midSeason': '• Mid Season (April, May, October): From €160 per night',
    'booking.lowSeason': '• Low Season (November - March outside holidays): From €130 per night',
    'booking.minimumStay': 'Minimum Stay',
    'booking.minimumStayText': '5 nights minimum in high season, 3 nights in other periods',
    'booking.checkInOut': 'Check-in & Check-out',
    'booking.checkInTime': '• Check-in: From 4:00 PM',
    'booking.checkOutTime': '• Check-out: By 12:00 AM',
    'booking.cancellation': 'Cancellation Policy',
    'booking.cancellationText': 'Free cancellation up to 30 days before check-in. Cancellations within 30 days are subject to our cancellation policy.',
    'booking.directContact': 'Direct Contact',
    'booking.airbnb': 'Book on Airbnb',
    'booking.checkingAvailability': 'Checking availability...',
    'booking.datesAvailable': '✅ These dates are available! Continue with your booking.',
    'booking.datesUnavailable': '❌ Sorry, these dates are not available. Please select different dates.',
    'booking.nextAvailable': 'Next available dates:',
    'booking.useSuggestedDates': 'Use These Dates',
    
    // Recommendations Page
    'recommendations.title': 'Where to go in the area?',
    'recommendations.subtitle': 'Discover the best of Javea - handpicked recommendations for our guests',
    'recommendations.restaurants': 'Restaurants',
    'recommendations.drinks': 'Bars & Drinks',
    'recommendations.breakfast': 'Breakfast & Bakery',
    
    // Restaurant descriptions
    'rec.chabada.desc': 'Perfect beachside bar for drinks and atmosphere',
    'rec.chabada.hours': 'From 8am, non-stop, Happy Hour 4-8pm, live music Thursday evenings',
    'rec.labambula.desc': 'Vibrant bar with live music and dancing',
    'rec.labambula.hours': '9am-1am (until 3am weekends), flamenco Sundays, swing Tuesdays, rock Fridays',
    'rec.lafontana.desc': 'Authentic paella and Italian pizza right by the beach',
    'rec.lafontana.hours': 'Non-stop every day',
    'rec.bohemians.desc': 'Elegant dining with sophisticated atmosphere',
    'rec.bohemians.hours': '12pm-midnight (daily)',
    'rec.lamasena.desc': 'Upscale restaurant with refined cuisine',
    'rec.lamasena.hours': 'Mon 12:30-4:30pm; Wed-Sun 12:30-4:30pm & 7:30-10:30pm (until 11pm Sat/Sun), closed Tuesdays',
    'rec.loasis.desc': 'Renowned for excellent steaks and meat dishes',
    'rec.loasis.hours': '12:30pm-11pm (daily)',
    'rec.casalili.desc': 'Authentic Asian cuisine with fresh ingredients',
    'rec.casalili.hours': '12:30-4pm & 6:30-11pm (daily)',
    'rec.carnaval.desc': 'Modern fusion with sushi, burgers, and poke bowls',
    'rec.carnaval.hours': 'Non-stop every day',
    'rec.caramel.desc': 'French-style bakery with fresh pastries and coffee',
    'rec.caramel.hours': '7:30am-7:30pm (daily)',
    
    // Common location terms
    'rec.location.beach': 'Arenal Beach',
    'rec.location.walk': 'min walk',
    'rec.location.taxi': 'min taxi',
    'rec.location.street': 'End of the street',
    'recommendations.beaches': 'Beaches',
    'recommendations.activities': 'Activities',
    'recommendations.shopping': 'Shopping',
    'recommendations.contact': 'Need More Information?',
    'recommendations.contactText': 'Feel free to contact us for more personalized recommendations or assistance during your stay.',
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
    'hero.subtitle': 'Betaalbaar Luxe Kustappartement',
    'hero.tagline': 'Vanaf €130/nacht - Jouw budgetvriendelijke paradijs aan de Costa Blanca, perfect voor Nederlandse gasten',
    'hero.description': 'Ontwaak bij het zachte kabbelen van de zee en het getinkel van zeilbootmasten in de warme mediterrane bries. Een korte wandeling van 250 meter brengt je naar het goudkleurige zand van het Arenal strand. Na een verfrissende duik keer je terug naar je stijlvolle appartement waar modern comfort en mediterrane charme perfect samenvloeien. Directe vluchten vanuit Amsterdam en andere Nederlandse steden.',
    'hero.bookButton': 'Boek Je Verblijf',
    'hero.exploreButton': 'Ontdek het Appartement',
    
    // Apartment Section
    'apartment.title': 'Jouw Kust Toevluchtsoord',
    'apartment.description': 'Ontdek je eigen stukje paradijs in dit prachtig gerenoveerde appartement op de eerste verdieping tegen fantastische prijzen. Gelegen aan het serene Nou Fontana kanaal, waar betaalbare mediterrane elegantie en modern comfort elkaar in perfecte harmonie ontmoeten.',
    'apartment.restaurantProximity': 'Loop naar de Beste Restaurants',
    'apartment.restaurantProximityDesc': 'Jouw appartement is perfect gelegen op loopafstand van Jávea\'s meest populaire restaurants en bars.',
    'apartment.viewAllRestaurants': 'Bekijk Complete Restaurant Gids',
    
    // At Glance Section
    'glance.title': 'In Één Oogopslag',
    'glance.sleeps': 'Slaapplaats voor 4 gasten',
    'glance.bedrooms': '2 ruime slaapkamers',
    'glance.bathroom': '1 complete badkamer',
    'glance.beach': '3 minuten lopen naar Arenal Beach',
    'glance.parking': 'Privé parkeerplaats',
    'glance.wifi': 'Snelle WiFi',
    'glance.ac': 'Airconditioning',
    'glance.terrace': 'Privé terras',
    
    // Amenities Section
    'amenities.title': 'Voorzieningen & Faciliteiten',
    'amenities.kitchen': 'Volledig Uitgeruste Keuken',
    'amenities.kitchenDesc': 'Moderne keuken met vaatwasser, magnetron, koffiezetapparaat en alle benodigdheden voor thuiskoken.',
    'amenities.comfort': 'Klimaatcomfort',
    'amenities.comfortDesc': 'Airconditioning en verwarming door het hele appartement voor het hele jaar comfort.',
    'amenities.entertainment': 'Entertainment',
    'amenities.entertainmentDesc': 'Smart TV, snelle WiFi en streamingdiensten voor ontspannen avonden.',
    'amenities.laundry': 'Wasfaciliteiten',
    'amenities.laundryDesc': 'Wasmachine beschikbaar (geen droger aanwezig).',
    'amenities.outdoor': 'Buitenruimte',
    'amenities.outdoorDesc': 'Privé terras perfect voor ochtendkoffie of avonddrankjes.',
    'amenities.parking': 'Beveiligde Parkeerplaats',
    'amenities.parkingDesc': 'Privé parkeerplaats inbegrepen voor jouw gemak.',
    
    // Rates Section
    'rates.title': 'Betaalbare Tarieven & Voorwaarden',
    'rates.description': 'Concurrerende seizoenstarieven en boekingsvoorwaarden voor jouw budgetvriendelijke verblijf bij Jávea Bliss. Geniet van luxe accommodatie zonder de premium prijs.',
    'rates.highSeason': 'Hoogseizoen',
    'rates.highPeriod': 'Juni – September & Feestdagen',
    'rates.highRate': 'Vanaf €210 per nacht',
    'rates.midSeason': 'Middenseizoen',
    'rates.midPeriod': 'April, Mei, Oktober',
    'rates.midRate': 'Vanaf €160 per nacht',
    'rates.lowSeason': 'Laagseizoen',
    'rates.lowPeriod': 'November – Maart (buiten feestdagen)',
    'rates.lowRate': 'Vanaf €130 per nacht',
    'rates.policies': 'Boekingsvoorwaarden',
    'rates.policy1': 'Minimum 5 nachten in het hoogseizoen',
    'rates.policy2': 'Minimum 3 nachten in andere periodes',
    'rates.policy3': 'Inchecken: Vanaf 16:00',
    'rates.policy4': 'Uitchecken: Voor 12:00',
    
    // Location Section
    'location.title': 'Toplocatie',
    'location.description': 'Perfect gelegen in het exclusieve Marina Nou Fontana gebied, waar rustige kanalen mediterrane charme ontmoeten.',
    'location.beach': 'Arenal Beach',
    'location.beachDesc': '3 minuten lopen naar gouden zandstrand',
    'location.restaurants': 'Restaurants',
    'location.restaurantsDesc': 'Restaurants aan het water op loopafstand',
    'location.shops': 'Winkelen',
    'location.shopsDesc': 'Lokale markten en boetieks vlakbij',
    'location.transport': 'Vervoer',
    'location.transportDesc': 'Gemakkelijke toegang tot openbaar vervoer en hoofdwegen',
    'location.restaurantTitle': 'Lokale Restaurant Aanbevelingen',
    'location.restaurantDesc': 'Ontdek de beste restaurants en bars op loopafstand, inclusief Chabada, La Bambula, Masena, en Bohemians. Onze selectie biedt authentieke lokale eetervaring.',
    'location.viewRecommendations': 'Bekijk Restaurant Gids',
    
    // Booking Section
    'booking.title': 'Reserveer Jouw Betaalbare Paradijs',
    'booking.description': 'Klaar voor je eigen stukje mediterraan paradijs tegen fantastische prijzen? Vanaf slechts €130 per nacht kun je genieten van luxe zonder de hoge kosten. Neem contact op om beschikbaarheid te checken en je droomvakantie in Jávea te boeken.',
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
    'booking.error': 'E-mail Service Probleem',
    'booking.contactInfo': 'Contactinformatie',
    'booking.contactDesc': 'Neem direct contact met ons op voor onmiddellijke hulp of vragen over jouw verblijf.',
    'booking.emailLabel': 'E-mail',
    'booking.responseTime': 'We reageren meestal binnen 24 uur',
    'booking.checkingAvailability': 'Beschikbaarheid controleren...',
    'booking.datesAvailable': '✅ Deze datums zijn beschikbaar! Ga door met je boeking.',
    'booking.datesUnavailable': '❌ Sorry, deze datums zijn niet beschikbaar. Selecteer andere datums.',
    'booking.nextAvailable': 'Volgende beschikbare datums:',
    'booking.useSuggestedDates': 'Gebruik Deze Datums',
    
    // Footer
    'footer.tagline': 'Jouw toegang tot mediterrane gelukzaligheid',
    'footer.rights': 'Alle rechten voorbehouden.',
    
    // Form validation
    'form.nameRequired': 'Naam moet minimaal 2 karakters bevatten',
    'form.emailInvalid': 'Voer een geldig e-mailadres in',
    'form.checkInRequired': 'Selecteer een incheckdatum',
    'form.checkOutRequired': 'Selecteer een uitcheckdatum',
    'form.checkOutMustBeAfterCheckIn': 'Uitcheckdatum moet na incheckdatum zijn',
    'form.guestsRequired': 'Selecteer aantal gasten',
    'form.phoneRequired': 'Voer een geldig telefoonnummer in',
    'form.spam': 'Spam bescherming geactiveerd',
    
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
    'pricing.longTermRate': 'Lange termijn tarief',
    'pricing.longTermDiscount': 'Lange termijn verhuurkorting toegepast!',
    'pricing.longTermMessage': 'Je verblijf van {nights} nachten (5+ weken) komt in aanmerking voor ons speciale €100/dag tarief.',
    
    // Gallery Section
    'gallery.title': 'Paradijs Galerij',
    'gallery.description': 'Maak een visuele rondleiding door ons moderne appartement en de omgeving.',
    'gallery.livingAreas': 'Woonruimtes',
    'gallery.bedrooms': 'Slaapkamers',
    'gallery.kitchen': 'Keuken & Eetruimte',
    'gallery.outdoor': 'Buitenruimtes',
    'gallery.bathroom': 'Badkamer',
    'gallery.entrance': 'Entree & Gang',
    'gallery.overview': 'Appartement Overzicht',
    'gallery.livingRoom1': 'Ruime woonkamer',
    'gallery.livingRoom2': 'Woonkamer met natuurlijk licht',
    'gallery.livingRoom3': 'Woonkamer zithoek',
    'gallery.entertainment': 'Entertainment ruimte met smart TV',
    'gallery.masterBedroom': 'Hoofdslaapkamer met comfortabel bed',
    'gallery.bedroom1': 'Slaapkamer met voldoende opbergruimte',
    'gallery.bedroom2': 'Lichte slaapkamer met natuurlijk licht',
    'gallery.secondBedroom': 'Tweede slaapkamer',
    'gallery.bedroom3': 'Tweede slaapkamer met twee eenpersoonsbedden',
    'gallery.bedroom4': 'Slaapkamer opbergoplossingen',
    'gallery.bedroom5': 'Slaapkamer met uitzicht op de kust',
    'gallery.modernKitchen': 'Moderne volledig uitgeruste keuken',
    'gallery.kitchenAppliances': 'Keuken met kwaliteitsapparatuur',
    'gallery.kitchenDining': 'Keuken eetruimte',
    'gallery.terrace1': 'Privé terras met kanaluitzicht',
    'gallery.terrace2': 'Buiteneetruimte',
    'gallery.terrace3': 'Terras perfect voor ontspanning',
    'gallery.modernBathroom': 'Moderne badkamer met kwaliteitsarmaturen',
    'gallery.apartmentEntrance': 'Elegante appartementingang',
    'gallery.hallway': 'Moderne gang',
    'gallery.overview1': 'Appartement woonruimte met uitzicht',
    'gallery.overview2': 'Keuken met bosgroene kasten',
    'gallery.overview3': 'Slaapkamer met kwaliteitsmatras en opbergruimte',
    'gallery.overview4': 'Buitenkanaluitzicht vanuit appartement',
    
    // Testimonials Section
    'testimonials.title': 'Wat Onze Gasten Zeggen',
    'testimonials.description': 'Ontdek waarom reizigers kiezen voor Jávea Bliss voor hun betaalbare mediterrane vakantie.',
    'testimonials.guest1Name': 'Carlos',
    'testimonials.guest1Location': 'Madrid, Juli 2025',
    'testimonials.guest1Text': 'Een van de meest complete Airbnbs waarin ik heb verbleven, gerenoveerd, met complete keukenbenodigdheden, lakens, handdoeken, kookingrediënten. Heel blij met ons verblijf op de verdieping, we gingen als gezin om het weekend door te brengen. Ideale locatie vlakbij het strand en restaurants. Onverslaanbare aandacht van Laurent.',
    'testimonials.guest2Name': 'Emma',
    'testimonials.guest2Location': 'Amsterdam, Nederland, Juni 2025',
    'testimonials.guest2Text': 'We vonden precies waar we naar zochten — betaalbare luxe op loopafstand van het strand. Het terras, prachtig verlicht bij zonsondergang, werd onze favoriete plek om te ontspannen. Geweldige prijs-kwaliteitverhouding en onberispelijk schoon.',
    'testimonials.guest3Name': 'Pierre & Marie',
    'testimonials.guest3Location': 'Lyon, Frankrijk, Juni 2025',
    'testimonials.guest3Text': 'Een uitzonderlijke plek, werkelijk slechts 3 minuten van het strand en omgeven door Jávea\'s beste restaurants en bars. Het nachtleven is zo dichtbij dat wandelen de enige optie is die je nodig hebt. Het appartement vindt de perfecte balans tussen comfort en betaalbaarheid. De keuken is volledig uitgerust voor thuiskoken, en de gastheer verwelkomde ons zelfs met een fles mousserende wijn (cava).',
    
    // Reviews Translation
    'reviews.showOriginal': 'Toon origineel ({lang})',
    'reviews.hideOriginal': 'Verberg origineel ({lang})',

    // Interior Section
    'interior.title': 'Interieur',
    'interior.bedrooms': 'Twee ruime tweepersoonsslaapkamers, elk met hotelkwaliteit matrassen, verduisterende gordijnen en ingebouwde kledingkasten.',
    'interior.bathroom': 'Rustige, microcement badkamer met regendouche, wandtoilet en zachte indirecte verlichting.',
    'interior.kitchen': 'Strakke bosgroene volledig uitgeruste keuken: inductiekookplaat, multifunctionele oven, vaatwasser, Nespresso machine en verborgen LED taakverlichting gereflecteerd in een gespiegelde achterwand.',
    'interior.lounge': 'Open woonkamer met eikenhouten lamellen mediawand, 55-inch smart TV en een tweezitsbank die kan worden omgezet tot een eenpersoonsbed voor een extra gast.',
    'interior.lighting': 'LED plafondverlichting dimbaar voor gezellige avonden en ontspanning voor een avondje uit.',
    'interior.patio': 'Privé patio voor ontspannen ontbijt of het afspoelen van zandige teenslippers.',
    'interior.laundry': 'Wasmachine op privé patio voor het opbergen van windsurfspullen of fiets.',
    'interior.connectivity': 'Gezoneerde airconditioning en hogesnelheids glasvezel Wi-Fi overal.',

    // Availability Section
    'availability.title': 'Bekijk Beschikbaarheid & Prijzen',
    'availability.subtitle': 'Bekijk real-time beschikbaarheid en seizoensprijzen voor uw perfecte Costa Blanca vakantie',
    'availability.note': 'Kalender werkt automatisch bij met Airbnb boekingen. Prijzen kunnen variëren op basis van verblijfsduur en boekingsvoorwaarden.',

    // Building & Amenities Section
    'building.title': 'Gebouw & Voorzieningen',
    'building.security': 'Beveiligde ingang, lift en één toegewezen parkeerplaats (zeldzaam zo dicht bij het strand).',
    'building.marina': 'Gasten kunnen direct ligplaatsen, SUP boards of kleine motorboten boeken bij Marina Nou Fontana, 150m verderop.',
    'building.shopping': 'Verschillende supermarkten en een apotheek liggen binnen vijf minuten lopen.',

    // Availability Calendar
    'checkAvailability': 'Beschikbaarheid Controleren',
    'availabilityDescription': 'Bekijk real-time beschikbaarheid en boek uw betaalbare mediterrane ontsnapping. Groene datums zijn beschikbaar, rode datums zijn al geboekt.',
    'calendarNote': 'Kalender synchroniseert automatisch met ons boekingssysteem. Neem contact met ons op om uw datums veilig te stellen.',
    'available': 'Beschikbaar',
    'booked': 'Geboekt',
    'lastUpdated': 'Laatst bijgewerkt',
    'datesSelected': 'Data Geselecteerd',
    'specialOfferSelected': 'Speciale Aanbieding Geselecteerd',
    'datesAutoFilled': 'Data automatisch ingevuld in reserveringsformulier',
    'was': 'was',
    'specialOffer': 'Speciale Aanbieding',
    'seasonalRates': 'Seizoensprijzen',

    // Amenities List
    'amenityList.airConditioning': 'Airconditioning',
    'amenityList.wifi': 'Hogesnelheids WiFi',
    'amenityList.smartTv': '55-inch Smart TV',
    'amenityList.kitchen': 'Volledig Uitgeruste Keuken',
    'amenityList.waterFilter': 'Waterfilter',
    'amenityList.washer': 'Wasmachine (geen droger)',
    'amenityList.parking': 'Privé Parkeren',
    'amenityList.nespresso': 'Nespresso Machine',
    'amenityList.dishwasher': 'Vaatwasser',
    'amenityList.showerTowels': 'Douchhanddoeken',
    'amenityList.beachTowels': 'Strandhanddoeken',
    'amenityList.noPets': 'Niet Huisdiervriendelijk',

    // Paradise Section
    'paradise.title': 'Ontdek het Paradijs',
    'paradise.description1': 'Verblijven op loopafstand van Arenal Beach betekent dat je het allerbeste van Jávea direct voor de deur hebt. Als het enige zandstrand van de stad biedt Arenal alles van verfrissende ochtendduiken in kalm, ondiep water tot schilderachtige zonsondergangdiners aan zee. De levendige promenade is omzoomd met strandtenten, restaurants, lokale markten, livemuziek en zelfs enkele late-night plekken voor wie van het nachtleven houdt.',
    'paradise.description2': 'Hier kun je volledig de mediterrane levensstijl omarmen zonder ooit een auto nodig te hebben. Breng je dagen door luierend op het strand, struinend door charmante boetieks, of verken nabijgelegen baaien en de historische oude stad—allemaal op slechts enkele minuten afstand. Voor degenen die op zoek zijn naar comfort, gemak en de ware Jávea-ervaring, is dit appartement bij Arenal de perfecte plek om te verblijven.',
    'paradise.beach.title': 'Arenal Strand',
    'paradise.beach.description': '3 minuten naar Arenal, Jávea\'s meest populaire plek om te wonen met restaurants, promenade en clubs. Als het enige zandstrand van de stad, biedt het kalm ondiep water en bruisend nachtleven.',
    'paradise.watersports.title': 'Watersport',
    'paradise.watersports.description': 'Toegang tot watersport voor de deur: kajak, paddle-surf, jetski en duikoperators clusteren rond de kanaalmond.',
    'paradise.dining.title': 'Culinair Paradijs',
    'paradise.dining.description': 'Directe nabijheid van ontbijt- en lunchplekken. Kanaalkant eetgelegenheden zoals Amarre 152 (creatieve rijstgerechten) of Restaurante Tosca met zonsondergangzicht over de boten.',
    'paradise.oldtown.title': 'Oude Stad',
    'paradise.oldtown.description': '10-15 minuten fietsen (4 km) naar Jávea\'s sfeervolle Oude Stad met zijn gotische kerk, overdekte markt en wekelijkse ambachtskramen.',
    'paradise.walks.title': 'Schilderachtige Wandelingen',
    'paradise.walks.description': 'Schilderachtige kustpaden naar Cap Prim en Montgó Natuurpark beginnen net ten oosten van de Arenal promenade.',
    
    // Booking Information Section
    'booking.information': 'Boekingsinformatie',
    'booking.rates': 'Tarieven',
    'booking.highSeason': '• Hoogseizoen (Juni - September & Feestdagen): Vanaf €210 per nacht',
    'booking.midSeason': '• Middenseizoen (April, Mei, Oktober): Vanaf €160 per nacht',
    'booking.lowSeason': '• Laagseizoen (November - Maart buiten feestdagen): Vanaf €130 per nacht',
    'booking.minimumStay': 'Minimum Verblijf',
    'booking.minimumStayText': '5 nachten minimum in hoogseizoen, 3 nachten in andere periodes',
    'booking.checkInOut': 'Inchecken & Uitchecken',
    'booking.checkInTime': '• Inchecken: Vanaf 16:00',
    'booking.checkOutTime': '• Uitchecken: Voor 12:00',
    'booking.cancellation': 'Annuleringsbeleid',
    'booking.cancellationText': 'Gratis annulering tot 30 dagen voor inchecken. Annuleringen binnen 30 dagen zijn onderhevig aan ons annuleringsbeleid.',
    'booking.directContact': 'Direct Contact',
    'booking.airbnb': 'Boek op Airbnb',
    
    // Pricing
    'pricing.discount': 'Korting',
    'pricing.cleaningFee': 'Schoonmaakkosten',
    'pricing.includedInTotal': 'inbegrepen in totaal',
    'pricing.pricePerNight': 'Prijs per nacht',
    
    // Recommendations Page
    'recommendations.title': 'Waar naartoe in de omgeving?',
    'recommendations.subtitle': 'Ontdek het beste van Javea - handgeplukte aanbevelingen voor onze gasten',
    'recommendations.restaurants': 'Restaurants',
    'recommendations.drinks': 'Bars & Drankjes',
    'recommendations.breakfast': 'Ontbijt & Bakkerij',
    
    // Restaurant descriptions
    'rec.chabada.desc': 'Perfecte strandbar voor drankjes en sfeer',
    'rec.chabada.hours': 'Vanaf 8u, non-stop, Happy Hour 16-20u, live muziek donderdagavond',
    'rec.labambula.desc': 'Levendige bar met live muziek en dansen',
    'rec.labambula.hours': '9u-1u (tot 3u weekends), flamenco zondag, swing dinsdag, rock vrijdag',
    'rec.lafontana.desc': 'Authentieke paella en Italiaanse pizza direct aan het strand',
    'rec.lafontana.hours': 'Non-stop elke dag',
    'rec.bohemians.desc': 'Elegant dineren met verfijnde sfeer',
    'rec.bohemians.hours': '12u-middernacht (dagelijks)',
    'rec.lamasena.desc': 'Luxe restaurant met verfijnde keuken',
    'rec.lamasena.hours': 'Ma 12:30-16:30u; Wo-Zo 12:30-16:30u & 19:30-22:30u (tot 23u Za/Zo), gesloten dinsdag',
    'rec.loasis.desc': 'Bekend om uitstekende steaks en vleesgerechten',
    'rec.loasis.hours': '12:30u-23u (dagelijks)',
    'rec.casalili.desc': 'Authentieke Aziatische keuken met verse ingrediënten',
    'rec.casalili.hours': '12:30-16u & 18:30-23u (dagelijks)',
    'rec.carnaval.desc': 'Moderne fusie met sushi, burgers en poke bowls',
    'rec.carnaval.hours': 'Non-stop elke dag',
    'rec.caramel.desc': 'Franse bakkerij met verse gebakjes en koffie',
    'rec.caramel.hours': '7:30u-19:30u (dagelijks)',
    
    // Common location terms
    'rec.location.beach': 'Arenal Beach',
    'rec.location.walk': 'min lopen',
    'rec.location.taxi': 'min taxi',
    'rec.location.street': 'Einde van de straat',
    'recommendations.beaches': 'Stranden',
    'recommendations.activities': 'Activiteiten',
    'recommendations.shopping': 'Winkelen',
    'recommendations.contact': 'Meer informatie nodig?',
    'recommendations.contactText': 'Neem gerust contact met ons op voor meer gepersonaliseerde aanbevelingen of assistentie tijdens uw verblijf.',
    'recommendations.backToHome': 'Terug naar Home',
    'contact.phone': 'Bel me',
    'contact.whatsapp': 'Stuur me een WhatsApp',
    
    // Promotional Calendar
    'promotional.offerEndsIn': 'Aanbieding eindigt over',
    'promotional.offerExpired': 'Aanbieding verlopen',
    'promotional.discountedRate': 'Kortingstarief',
    'promotional.limitedTimeOffer': 'Beperkte tijd aanbieding',
    'calendar.unavailable': 'Niet beschikbaar',
    'calendar.regularRate': 'Regulier tarief',
  },
  fr: {
    // Navigation
    'nav.home': 'Accueil',
    'nav.apartment': 'Appartement',
    'nav.gallery': 'Galerie',
    'nav.rates': 'Tarifs',
    'nav.location': 'Localisation',
    'nav.booking': 'Réserver',
    'nav.recommendations': 'Recommandations',

    
    // Hero Section
    'hero.title': 'JÁVEA BLISS',
    'hero.subtitle': 'Appartement Côtier de Luxe Abordable',
    'hero.tagline': 'À partir de 130€/nuit - Votre paradis économique sur la Costa Blanca, idéal pour les visiteurs français et suisses',
    'hero.description': 'Réveillez-vous au doux clapotis des vagues et au tintement des mâts dans la brise méditerranéenne. Une agréable promenade de 250 mètres vous mène au sable doré de la plage d\'Arenal. Après une baignade rafraîchissante, regagnez votre appartement élégant où le confort moderne épouse parfaitement le charme méditerranéen. Vols directs depuis Paris, Lyon, Genève et Zurich.',
    'hero.bookButton': 'Réservez Votre Séjour',
    'hero.exploreButton': 'Découvrir l\'Appartement',
    
    // Apartment Section
    'apartment.title': 'Votre Sanctuaire Côtier',
    'apartment.description': 'Découvrez votre propre coin de paradis dans ce magnifique appartement au premier étage entièrement rénové, proposé à des prix exceptionnels. Situé au bord du paisible canal Nou Fontana, cet espace marie harmonieusement l\'élégance méditerranéenne abordable et le confort contemporain.',
    'apartment.restaurantProximity': 'Marchez vers les Meilleurs Restaurants',
    'apartment.restaurantProximityDesc': 'Votre appartement est parfaitement situé à distance de marche des restaurants et bars les plus populaires de Jávea.',
    'apartment.viewAllRestaurants': 'Voir le Guide Complet des Restaurants',
    
    // At Glance Section
    'glance.title': 'En Un Coup d\'Œil',
    'glance.sleeps': 'Hébergement pour 4 personnes',
    'glance.bedrooms': '2 chambres spacieuses',
    'glance.bathroom': '1 salle de bain complète',
    'glance.beach': '3 minutes à pied d\'Arenal Beach',
    'glance.parking': 'Place de parking privée',
    'glance.wifi': 'WiFi haut débit',
    'glance.ac': 'Climatisation',
    'glance.terrace': 'Terrasse privée',
    
    // Amenities Section
    'amenities.title': 'Équipements & Services',
    'amenities.kitchen': 'Cuisine Entièrement Équipée',
    'amenities.kitchenDesc': 'Cuisine moderne avec lave-vaisselle, micro-ondes, machine à café et tous les essentiels pour cuisiner à la maison.',
    'amenities.comfort': 'Confort Climatique',
    'amenities.comfortDesc': 'Climatisation et chauffage dans tout l\'appartement pour un confort toute l\'année.',
    'amenities.entertainment': 'Divertissement',
    'amenities.entertainmentDesc': 'Smart TV, WiFi haut débit et services de streaming pour des soirées relaxantes.',
    'amenities.laundry': 'Installations de Blanchisserie',
    'amenities.laundryDesc': 'Machine à laver disponible (pas de sèche-linge fourni).',
    'amenities.outdoor': 'Espace Extérieur',
    'amenities.outdoorDesc': 'Terrasse privée parfaite pour le café du matin ou les apéritifs du soir.',
    'amenities.parking': 'Parking Sécurisé',
    'amenities.parkingDesc': 'Place de parking privée incluse pour votre commodité.',
    
    // Rates Section
    'rates.title': 'Tarifs Abordables & Conditions',
    'rates.description': 'Tarifs saisonniers compétitifs et conditions de réservation pour votre séjour économique à Jávea Bliss. Profitez d\'un hébergement de luxe sans le prix premium.',
    'rates.highSeason': 'Haute Saison',
    'rates.highPeriod': 'Juin – Septembre & Vacances',
    'rates.highRate': 'À partir de 210€ par nuit',
    'rates.midSeason': 'Moyenne Saison',
    'rates.midPeriod': 'Avril, Mai, Octobre',
    'rates.midRate': 'À partir de 160€ par nuit',
    'rates.lowSeason': 'Basse Saison',
    'rates.lowPeriod': 'Novembre – Mars (hors vacances)',
    'rates.lowRate': 'À partir de 130€ par nuit',
    'rates.policies': 'Conditions de Réservation',
    'rates.policy1': 'Minimum 5 nuits en haute saison',
    'rates.policy2': 'Minimum 3 nuits dans les autres périodes',
    'rates.policy3': 'Arrivée : À partir de 16h00',
    'rates.policy4': 'Départ : Avant 12h00',
    
    // Location Section
    'location.title': 'Emplacement de Choix',
    'location.description': 'Parfaitement situé dans le quartier exclusif de Marina Nou Fontana, où les canaux tranquilles rencontrent le charme méditerranéen.',
    'location.beach': 'Plage d\'Arenal',
    'location.beachDesc': '3 minutes à pied de la plage de sable doré',
    'location.restaurants': 'Restaurants',
    'location.restaurantsDesc': 'Restaurants en bord de mer à distance de marche',
    'location.shops': 'Shopping',
    'location.shopsDesc': 'Marchés locaux et boutiques à proximité',
    'location.transport': 'Transport',
    'location.transportDesc': 'Accès facile aux transports publics et routes principales',
    'location.restaurantTitle': 'Recommandations de Restaurants Locaux',
    'location.restaurantDesc': 'Découvrez les meilleurs restaurants et bars à distance de marche, incluant Chabada, La Bambula, Masena, et Bohemians. Notre sélection propose des expériences culinaires locales authentiques.',
    'location.viewRecommendations': 'Voir le Guide des Restaurants',
    
    // Booking Section
    'booking.title': 'Réservez Votre Paradis Abordable',
    'booking.description': 'Prêt à découvrir votre coin de paradis méditerranéen à prix exceptionnel ? Dès 130€ par nuit, profitez d\'un luxe abordable face à la mer. Contactez-nous pour vérifier les disponibilités et réserver votre séjour de rêve à Jávea.',
    'booking.name': 'Nom Complet',
    'booking.email': 'Adresse Email',
    'booking.phone': 'Numéro de Téléphone',
    'booking.checkIn': 'Date d\'Arrivée',
    'booking.checkOut': 'Date de Départ',
    'booking.guests': 'Nombre d\'Invités',
    'booking.message': 'Message Supplémentaire (Optionnel)',
    'booking.submit': 'Envoyer la Demande',
    'booking.submitting': 'Envoi en cours...',
    'booking.success': 'Demande Envoyée !',
    'booking.successDesc': 'Nous vous recontacterons dans les plus brefs délais.',
    'booking.error': 'Problème de Service Email',
    'booking.contactInfo': 'Informations de Contact',
    'booking.contactDesc': 'Contactez-nous directement pour une assistance immédiate ou des questions sur votre séjour.',
    'booking.emailLabel': 'Email',
    'booking.responseTime': 'Nous répondons généralement dans les 24 heures',
    'booking.checkingAvailability': 'Vérification de disponibilité...',
    'booking.datesAvailable': '✅ Ces dates sont disponibles ! Continuez avec votre réservation.',
    'booking.datesUnavailable': '❌ Désolé, ces dates ne sont pas disponibles. Veuillez sélectionner d\'autres dates.',
    'booking.nextAvailable': 'Prochaines dates disponibles :',
    'booking.useSuggestedDates': 'Utiliser Ces Dates',
    
    // Footer
    'footer.tagline': 'Votre porte d\'entrée vers la félicité méditerranéenne',
    'footer.rights': 'Tous droits réservés.',
    
    // Form validation
    'form.nameRequired': 'Le nom doit contenir au moins 2 caractères',
    'form.emailInvalid': 'Veuillez entrer une adresse email valide',
    'form.checkInRequired': 'Veuillez sélectionner une date d\'arrivée',
    'form.checkOutRequired': 'Veuillez sélectionner une date de départ',
    'form.checkOutMustBeAfterCheckIn': 'La date de départ doit être après la date d\'arrivée',
    'form.guestsRequired': 'Veuillez sélectionner le nombre d\'invités',
    'form.phoneRequired': 'Veuillez entrer un numéro de téléphone valide',
    'form.spam': 'Protection anti-spam activée',
    
    // Guest options
    'guests.1': '1 Invité',
    'guests.2': '2 Invités',
    'guests.3': '3 Invités',
    'guests.4': '4 Invités',
    
    // Pricing
    'pricing.title': 'Informations de Prix',
    'pricing.stayDuration': 'Durée du Séjour',
    'pricing.ratePerNight': 'Tarif par nuit',
    'pricing.total': 'Total',
    'pricing.nights': 'nuits',
    'pricing.longTermRate': 'Tarif long séjour',
    'pricing.longTermDiscount': 'Remise location long terme appliquée !',
    'pricing.longTermMessage': 'Votre séjour de {nights} nuits (5+ semaines) bénéficie de notre tarif spécial €100/jour.',
    'pricing.discount': 'Remise',
    'pricing.cleaningFee': 'Frais de ménage',
    'pricing.includedInTotal': 'inclus dans le total',
    'pricing.pricePerNight': 'Prix par nuit',
    
    // Gallery Section
    'gallery.title': 'Galerie Paradisiaque',
    'gallery.description': 'Découvrez notre appartement contemporain et ses environs à travers cette visite virtuelle.',
    'gallery.livingAreas': 'Espaces de Vie',
    'gallery.bedrooms': 'Chambres',
    'gallery.kitchen': 'Cuisine & Salle à Manger',
    'gallery.outdoor': 'Espaces Extérieurs',
    'gallery.bathroom': 'Salle de Bain',
    'gallery.entrance': 'Entrée & Couloir',
    'gallery.overview': 'Vue d\'Ensemble',
    'gallery.livingRoom1': 'Salon spacieux',
    'gallery.livingRoom2': 'Salon avec lumière naturelle',
    'gallery.livingRoom3': 'Coin salon',
    'gallery.entertainment': 'Espace détente avec smart TV',
    'gallery.masterBedroom': 'Chambre principale avec lit confortable',
    'gallery.bedroom1': 'Chambre avec nombreux rangements',
    'gallery.bedroom2': 'Chambre lumineuse avec lumière naturelle',
    'gallery.secondBedroom': 'Deuxième chambre',
    'gallery.bedroom3': 'Deuxième chambre avec lits jumeaux',
    'gallery.bedroom4': 'Solutions de rangement chambre',
    'gallery.bedroom5': 'Chambre avec vue côtière',
    'gallery.modernKitchen': 'Cuisine moderne entièrement équipée',
    'gallery.kitchenAppliances': 'Cuisine avec électroménager de qualité',
    'gallery.kitchenDining': 'Espace repas de la cuisine',
    'gallery.terrace1': 'Terrasse privée avec vue sur le canal',
    'gallery.terrace2': 'Espace repas extérieur',
    'gallery.terrace3': 'Terrasse parfaite pour se détendre',
    'gallery.modernBathroom': 'Salle de bain moderne avec équipements de qualité',
    'gallery.apartmentEntrance': 'Entrée élégante de l\'appartement',
    'gallery.hallway': 'Couloir moderne',
    'gallery.overview1': 'Salon de l\'appartement avec vue',
    'gallery.overview2': 'Cuisine avec placards vert forêt',
    'gallery.overview3': 'Chambre avec matelas de qualité et rangements',
    'gallery.overview4': 'Vue sur le canal depuis l\'appartement',
    
    // Testimonials Section
    'testimonials.title': 'Ce Que Disent Nos Hôtes',
    'testimonials.description': 'Découvrez pourquoi les voyageurs choisissent Jávea Bliss pour leur escapade méditerranéenne abordable.',
    'testimonials.guest1Name': 'Carlos',
    'testimonials.guest1Location': 'Madrid, Juillet 2025',
    'testimonials.guest1Text': 'L\'un des Airbnbs les plus complets dans lesquels j\'ai séjourné, rénové, avec des ustensiles de cuisine complets, des draps, des serviettes, des ingrédients de cuisine. Très heureux de notre séjour à l\'étage, nous sommes allés en famille passer le week-end. Emplacement idéal près de la plage et des restaurants. Attention imbattable de Laurent.',
    'testimonials.guest2Name': 'Emma',
    'testimonials.guest2Location': 'Amsterdam, Pays-Bas, Juin 2025',
    'testimonials.guest2Text': 'Nous avons trouvé exactement ce que nous cherchions — du luxe abordable à distance de marche de la plage. La terrasse, magnifiquement éclairée au coucher du soleil, est devenue notre endroit favori pour nous détendre. Excellent rapport qualité-prix et impeccablement propre.',
    'testimonials.guest3Name': 'Pierre & Marie',
    'testimonials.guest3Location': 'Lyon, France, Juin 2025',
    'testimonials.guest3Text': 'Un endroit exceptionnel, vraiment à seulement 3 minutes de la plage et entouré par les meilleurs restaurants et bars de Jávea. La vie nocturne est si proche que la marche est la seule option dont vous aurez besoin. L\'appartement trouve l\'équilibre parfait entre confort et prix abordable. La cuisine est entièrement équipée pour cuisiner à la maison, et l\'hôte nous a même accueillis avec une bouteille de vin mousseux (cava).',
    
    // Reviews Translation
    'reviews.showOriginal': 'Afficher l\'original ({lang})',
    'reviews.hideOriginal': 'Masquer l\'original ({lang})',

    // Interior Section
    'interior.title': 'Intérieur',
    'interior.bedrooms': 'Deux chambres doubles spacieuses, chacune avec des matelas de qualité hôtelière, des rideaux occultants et des armoires intégrées.',
    'interior.bathroom': 'Salle de bain calme en micro-ciment avec douche à effet pluie, WC suspendu et éclairage indirect doux.',
    'interior.kitchen': 'Cuisine élégante vert forêt entièrement équipée : plaque à induction, four multifonction, lave-vaisselle, machine Nespresso et éclairage LED de tâche dissimulé reflété dans une crédence miroir.',
    'interior.lounge': 'Salon ouvert avec mur média en lattes de chêne, smart TV 55 pouces et canapé deux places convertible en lit simple pour un invité supplémentaire.',
    'interior.lighting': 'Éclairage LED au plafond dimmable pour des soirées cosy et détente avant sortie nocturne.',
    'interior.patio': 'Patio privé pour petits déjeuners tranquilles ou rinçage de tongs sablonneuses.',
    'interior.laundry': 'Machine à laver dans le patio privé pour ranger planche à voile ou vélo.',
    'interior.connectivity': 'Climatisation zonée et Wi-Fi fibre haute vitesse partout.',

    // Building & Amenities Section
    'building.title': 'Bâtiment & Équipements',
    'building.security': 'Entrée sécurisée, ascenseur et une place de parking attribuée (rare si près de la plage).',
    'building.marina': 'Les clients peuvent réserver amarrages, planches SUP ou petits bateaux à moteur directement à Marina Nou Fontana, à 150m.',
    'building.shopping': 'Plusieurs épiceries et une pharmacie sont à cinq minutes à pied.',

    // Availability Calendar
    'checkAvailability': 'Vérifier la Disponibilité',
    'availabilityDescription': 'Consultez la disponibilité en temps réel et réservez votre escapade méditerranéenne abordable. Les dates vertes sont disponibles, les dates rouges sont déjà réservées.',
    'calendarNote': 'Le calendrier se synchronise automatiquement avec notre système de réservation. Contactez-nous pour sécuriser vos dates.',
    'available': 'Disponible',
    'booked': 'Réservé',
    'lastUpdated': 'Dernière mise à jour',
    'datesSelected': 'Dates Sélectionnées',
    'specialOfferSelected': 'Offre Spéciale Sélectionnée',
    'datesAutoFilled': 'Dates automatiquement remplies dans le formulaire de réservation',
    'was': 'était',
    'specialOffer': 'Offre Spéciale',
    'seasonalRates': 'Tarifs Saisonniers',

    // Amenities List
    'amenityList.airConditioning': 'Climatisation',
    'amenityList.wifi': 'WiFi Haute Vitesse',
    'amenityList.smartTv': 'Smart TV 55 pouces',
    'amenityList.kitchen': 'Cuisine Entièrement Équipée',
    'amenityList.waterFilter': 'Filtre à Eau',
    'amenityList.washer': 'Lave-linge (pas de sèche-linge)',
    'amenityList.parking': 'Parking Privé',
    'amenityList.nespresso': 'Machine Nespresso',
    'amenityList.dishwasher': 'Lave-vaisselle',
    'amenityList.showerTowels': 'Serviettes de Douche',
    'amenityList.beachTowels': 'Serviettes de Plage',
    'amenityList.noPets': 'Pas d\'Animaux',

    // Paradise Section
    'paradise.title': 'Découvrir le Paradis',
    'paradise.description1': 'Séjourner à distance de marche de la plage d\'Arenal signifie avoir le meilleur de Jávea à votre porte. En tant que seule plage de sable de la ville, Arenal offre tout, des baignades matinales rafraîchissantes dans des eaux calmes et peu profondes aux dîners romantiques au coucher du soleil en bord de mer. La promenade animée est bordée de bars de plage, restaurants, marchés locaux, musique live et même quelques lieux nocturnes pour ceux qui aiment la vie nocturne.',
    'paradise.description2': 'Ici, vous pouvez pleinement embrasser le style de vie méditerranéen sans jamais avoir besoin d\'une voiture. Passez vos journées à vous prélasser sur la plage, flâner dans de charmantes boutiques, ou explorer les criques voisines et la vieille ville historique—tout à quelques minutes seulement. Pour ceux qui recherchent confort, commodité et la vraie expérience de Jávea, cet appartement près d\'Arenal est l\'endroit parfait où séjourner.',
    'paradise.beach.title': 'Plage d\'Arenal',
    'paradise.beach.description': '3 minutes vers Arenal, l\'endroit le plus populaire de Jávea pour vivre avec restaurants, promenade et clubs. En tant que seule plage de sable de la ville, offrant des eaux calmes et peu profondes et une vie nocturne animée.',
    'paradise.watersports.title': 'Sports Nautiques',
    'paradise.watersports.description': 'Accès direct aux sports nautiques : kayak, paddle-surf, jet-ski et opérateurs de plongée regroupés autour de l\'embouchure du canal.',
    'paradise.dining.title': 'Paradis Culinaire',
    'paradise.dining.description': 'Proximité immédiate des lieux de petit-déjeuner et déjeuner. Options de restauration au bord du canal comme Amarre 152 (plats de riz créatifs) ou Restaurante Tosca avec vues coucher de soleil sur les bateaux.',
    'paradise.oldtown.title': 'Vieille Ville',
    'paradise.oldtown.description': '10-15 minutes à vélo (4 km) vers la vieille ville atmosphérique de Jávea avec son église gothique, marché couvert et étals d\'artisanat hebdomadaires.',
    'paradise.walks.title': 'Promenades Panoramiques',
    'paradise.walks.description': 'Les sentiers côtiers panoramiques vers Cap Prim et le Parc Naturel Montgó commencent juste à l\'est de la promenade d\'Arenal.',
    
    // Booking Information Section
    'booking.information': 'Informations de Réservation',
    'booking.rates': 'Tarifs',
    'booking.highSeason': '• Haute Saison (Juin - Septembre & Vacances): À partir de 210€ par nuit',
    'booking.midSeason': '• Moyenne Saison (Avril, Mai, Octobre): À partir de 160€ par nuit',
    'booking.lowSeason': '• Basse Saison (Novembre - Mars hors vacances): À partir de 130€ par nuit',
    'booking.minimumStay': 'Séjour Minimum',
    'booking.minimumStayText': '5 nuits minimum en haute saison, 3 nuits dans les autres périodes',
    'booking.checkInOut': 'Arrivée & Départ',
    'booking.checkInTime': '• Arrivée: À partir de 16h00',
    'booking.checkOutTime': '• Départ: Avant 12h00',
    'booking.cancellation': 'Politique d\'Annulation',
    'booking.cancellationText': 'Annulation gratuite jusqu\'à 30 jours avant l\'arrivée. Les annulations dans les 30 jours sont soumises à notre politique d\'annulation.',
    'booking.directContact': 'Contact Direct',
    'booking.airbnb': 'Réserver sur Airbnb',
    
    // Recommendations Page
    'recommendations.title': 'Où aller à proximité ?',
    'recommendations.subtitle': 'Découvrez le meilleur de Javea - recommandations sélectionnées pour nos hôtes',
    'recommendations.restaurants': 'Restaurants',
    'recommendations.drinks': 'Bars & Boissons',
    'recommendations.breakfast': 'Petit-déjeuner & Boulangerie',
    
    // Restaurant descriptions
    'rec.chabada.desc': 'Bar de plage parfait pour des boissons et de l\'ambiance',
    'rec.chabada.hours': 'Dès 8h, non-stop, Happy Hour 16h-20h, musique live jeudi soir',
    'rec.labambula.desc': 'Bar animé avec musique live et danse',
    'rec.labambula.hours': '9h-1h (jusqu\'à 3h weekends), flamenco dimanche, swing mardi, rock vendredi',
    'rec.lafontana.desc': 'Paella authentique et pizza italienne directement sur la plage',
    'rec.lafontana.hours': 'Non-stop tous les jours',
    'rec.bohemians.desc': 'Dîner élégant avec atmosphère sophistiquée',
    'rec.bohemians.hours': '12h-minuit (tous les jours)',
    'rec.lamasena.desc': 'Restaurant haut de gamme avec cuisine raffinée',
    'rec.lamasena.hours': 'Lun 12h30-16h30; Mer-Dim 12h30-16h30 & 19h30-22h30 (jusqu\'à 23h Sam/Dim), fermé mardi',
    'rec.loasis.desc': 'Réputé pour ses excellents steaks et plats de viande',
    'rec.loasis.hours': '12h30-23h (tous les jours)',
    'rec.casalili.desc': 'Cuisine asiatique authentique avec ingrédients frais',
    'rec.casalili.hours': '12h30-16h & 18h30-23h (tous les jours)',
    'rec.carnaval.desc': 'Fusion moderne avec sushi, burgers et poke bowls',
    'rec.carnaval.hours': 'Non-stop tous les jours',
    'rec.caramel.desc': 'Boulangerie française avec pâtisseries fraîches et café',
    'rec.caramel.hours': '7h30-19h30 (tous les jours)',
    
    // Common location terms
    'rec.location.beach': 'Plage d\'Arenal',
    'rec.location.walk': 'min à pied',
    'rec.location.taxi': 'min en taxi',
    'rec.location.street': 'Fin de la rue',
    'recommendations.beaches': 'Plages',
    'recommendations.activities': 'Activités',
    'recommendations.shopping': 'Shopping',
    'recommendations.contact': 'Besoin de plus d\'informations?',
    'recommendations.contactText': 'N\'hésitez pas à nous contacter pour des recommandations plus personnalisées ou une assistance pendant votre séjour.',
    'recommendations.backToHome': 'Retour à l\'accueil',
    'contact.phone': 'Appelez-moi',
    'contact.whatsapp': 'Envoyez-moi un WhatsApp',
    
    // Promotional Calendar
    'promotional.offerEndsIn': 'L\'offre se termine dans',
    'promotional.offerExpired': 'Offre expirée',
    'promotional.discountedRate': 'Tarif réduit',
    'promotional.limitedTimeOffer': 'Offre limitée dans le temps',
    'calendar.unavailable': 'Non disponible',
    'calendar.regularRate': 'Tarif régulier',
  },
  it: {
    // Navigation
    'nav.home': 'Home',
    'nav.apartment': 'Appartamento',
    'nav.gallery': 'Galleria',
    'nav.rates': 'Tariffe',
    'nav.location': 'Posizione',
    'nav.booking': 'Prenota',
    'nav.recommendations': 'Raccomandazioni',

    
    // Hero Section
    'hero.title': 'JÁVEA BLISS',
    'hero.subtitle': 'Appartamento Costiero di Lusso Accessibile',
    'hero.tagline': 'Da €130/notte - Il tuo paradiso economico sulla Costa Blanca, perfetto per visitatori italiani',
    'hero.description': 'Svegliati al dolce suono degli alberi delle barche a vela che ondeggiano nella brezza mediterranea. Passeggia per soli 250 metri fino alle sabbie dorate di Arenal per un bagno rinfrescante, poi torna al tuo rifugio fresco e contemporaneo dove il design moderno incontra l\'eleganza costiera. Voli diretti da Milano, Roma e altre città italiane.',
    'hero.bookButton': 'Prenota il Tuo Soggiorno',
    'hero.exploreButton': 'Esplora l\'Appartamento',
    
    // Apartment Section
    'apartment.title': 'Il Tuo Rifugio Costiero',
    'apartment.description': 'Scopri il tuo angolo di paradiso in questo splendido appartamento al primo piano completamente ristrutturato, a prezzi imbattibili. Situato accanto al tranquillo canale Nou Fontana, dove l\'eleganza mediterranea accessibile si fonde armoniosamente con il comfort contemporaneo.',
    'apartment.restaurantProximity': 'A Piedi verso i Migliori Ristoranti',
    'apartment.restaurantProximityDesc': 'Il tuo appartamento è perfettamente posizionato a pochi passi dai ristoranti e bar più popolari di Jávea.',
    'apartment.viewAllRestaurants': 'Vedi Guida Completa Ristoranti',
    
    // At Glance Section
    'glance.title': 'A Colpo d\'Occhio',
    'glance.sleeps': 'Ospita fino a 4 persone',
    'glance.bedrooms': '2 camere da letto spaziose',
    'glance.bathroom': '1 bagno completo',
    'glance.beach': '3 minuti a piedi dalla spiaggia Arenal',
    'glance.parking': 'Parcheggio privato',
    'glance.wifi': 'WiFi ad alta velocità',
    'glance.ac': 'Aria condizionata',
    'glance.terrace': 'Terrazza privata',
    
    // Amenities Section
    'amenities.title': 'Servizi e Caratteristiche',
    'amenities.kitchen': 'Cucina Completamente Attrezzata',
    'amenities.kitchenDesc': 'Cucina moderna con lavastoviglie, microonde, macchina del caffè e tutto il necessario per cucinare a casa.',
    'amenities.comfort': 'Comfort Climatico',
    'amenities.comfortDesc': 'Aria condizionata e riscaldamento in tutto l\'appartamento per comfort tutto l\'anno.',
    'amenities.entertainment': 'Intrattenimento',
    'amenities.entertainmentDesc': 'Smart TV, WiFi ad alta velocità e servizi streaming per serate rilassanti.',
    'amenities.laundry': 'Lavanderia',
    'amenities.laundryDesc': 'Lavatrice disponibile (asciugatrice non fornita).',
    'amenities.outdoor': 'Spazio Esterno',
    'amenities.outdoorDesc': 'Terrazza privata perfetta per il caffè mattutino o aperitivi serali.',
    'amenities.parking': 'Parcheggio Sicuro',
    'amenities.parkingDesc': 'Posto auto privato incluso per la tua comodità.',
    
    // Rates Section
    'rates.title': 'Tariffe Accessibili e Politiche',
    'rates.description': 'Tariffe stagionali competitive e politiche di prenotazione per il tuo soggiorno economico a Jávea Bliss. Goditi alloggio di lusso senza il prezzo premium.',
    'rates.highSeason': 'Alta Stagione',
    'rates.highPeriod': 'Giugno – Settembre e Festivi',
    'rates.highRate': 'Da €210 per notte',
    'rates.midSeason': 'Media Stagione',
    'rates.midPeriod': 'Aprile, Maggio, Ottobre',
    'rates.midRate': 'Da €160 per notte',
    'rates.lowSeason': 'Bassa Stagione',
    'rates.lowPeriod': 'Novembre – Marzo (esclusi festivi)',
    'rates.lowRate': 'Da €130 per notte',
    'rates.policies': 'Politiche di Prenotazione',
    'rates.policy1': 'Minimo 5 notti in alta stagione',
    'rates.policy2': 'Minimo 3 notti negli altri periodi',
    'rates.policy3': 'Check-in: Dalle 16:00',
    'rates.policy4': 'Check-out: Entro le 12:00',
    
    // Location Section
    'location.title': 'Posizione Privilegiata',
    'location.description': 'Perfettamente posizionato nel quartiere esclusivo di Marina Nou Fontana, dove tranquilli canali incontrano il fascino mediterraneo.',
    'location.beach': 'Spiaggia Arenal',
    'location.beachDesc': '3 minuti a piedi dalla spiaggia di sabbia dorata',
    'location.restaurants': 'Ristorazione',
    'location.restaurantsDesc': 'Ristoranti sul lungomare a pochi passi',
    'location.shops': 'Shopping',
    'location.shopsDesc': 'Mercati locali e boutique nelle vicinanze',
    'location.transport': 'Trasporti',
    'location.transportDesc': 'Facile accesso ai trasporti pubblici e strade principali',
    'location.restaurantTitle': 'Raccomandazioni Ristoranti Locali',
    'location.restaurantDesc': 'Scopri i migliori ristoranti e bar a pochi passi, tra cui Chabada, La Bambula, Masena e Bohemians. La nostra selezione presenta autentiche esperienze gastronomiche locali.',
    'location.viewRecommendations': 'Vedi Guida Ristoranti',
    
    // Booking Section
    'booking.title': 'Prenota il Tuo Paradiso Accessibile',
    'booking.description': 'Pronto a vivere il tuo paradiso mediterraneo a prezzi incredibili? Da soli €130 a notte, goditi il lusso accessibile sul mare. Contattaci per verificare disponibilità e prenotare la tua vacanza da sogno a Jávea.',
    'booking.name': 'Nome Completo',
    'booking.email': 'Indirizzo Email',
    'booking.phone': 'Numero di Telefono',
    'booking.checkIn': 'Data di Arrivo',
    'booking.checkOut': 'Data di Partenza',
    'booking.guests': 'Numero di Ospiti',
    'booking.message': 'Messaggio Aggiuntivo (Opzionale)',
    'booking.submit': 'Invia Richiesta',
    'booking.submitting': 'Invio in corso...',
    'booking.success': 'Richiesta Inviata!',
    'booking.successDesc': 'Ti contatteremo al più presto.',
    'booking.error': 'Problema del Servizio Email',
    'booking.contactInfo': 'Informazioni di Contatto',
    'booking.contactDesc': 'Contattaci direttamente per assistenza immediata o domande sul tuo soggiorno.',
    'booking.emailLabel': 'Email',
    'booking.responseTime': 'Generalmente rispondiamo entro 24 ore',
    
    // Footer
    'footer.tagline': 'La tua porta verso la felicità mediterranea',
    'footer.rights': 'Tutti i diritti riservati.',
    
    // Form validation
    'form.nameRequired': 'Il nome deve avere almeno 2 caratteri',
    'form.emailInvalid': 'Inserisci un indirizzo email valido',
    'form.checkInRequired': 'Seleziona la data di arrivo',
    'form.checkOutRequired': 'Seleziona la data di partenza',
    'form.checkOutMustBeAfterCheckIn': 'La data di partenza deve essere successiva alla data di arrivo',
    'form.guestsRequired': 'Seleziona il numero di ospiti',
    'form.phoneRequired': 'Inserisci un numero di telefono valido',
    'form.spam': 'Protezione anti-spam attivata',
    
    // Guest options
    'guests.1': '1 Ospite',
    'guests.2': '2 Ospiti',
    'guests.3': '3 Ospiti',
    'guests.4': '4 Ospiti',
    
    // Pricing
    'pricing.title': 'Informazioni sui Prezzi',
    'pricing.stayDuration': 'Durata del Soggiorno',
    'pricing.ratePerNight': 'Tariffa per notte',
    'pricing.total': 'Totale',
    'pricing.nights': 'notti',
    'pricing.longTermRate': 'Tariffa lungo soggiorno',
    'pricing.longTermDiscount': 'Sconto affitto lungo termine applicato!',
    'pricing.longTermMessage': 'Il tuo soggiorno di {nights} notti (5+ settimane) ti qualifica per la nostra tariffa speciale €100/giorno.',
    'pricing.discount': 'Sconto',
    'pricing.cleaningFee': 'Spese di pulizia',
    'pricing.includedInTotal': 'incluso nel totale',
    'pricing.pricePerNight': 'Prezzo per notte',
    
    // Gallery Section
    'gallery.title': 'Galleria del Paradiso',
    'gallery.description': 'Fai un tour visivo del nostro appartamento contemporaneo e dei suoi dintorni.',
    'gallery.livingAreas': 'Zone Giorno',
    'gallery.bedrooms': 'Camere da Letto',
    'gallery.kitchen': 'Cucina e Sala da Pranzo',
    'gallery.outdoor': 'Spazi Esterni',
    'gallery.bathroom': 'Bagno',
    'gallery.entrance': 'Ingresso e Corridoio',
    'gallery.overview': 'Panoramica',
    'gallery.livingRoom1': 'Soggiorno spazioso',
    'gallery.livingRoom2': 'Soggiorno con luce naturale',
    'gallery.livingRoom3': 'Zona relax',
    'gallery.entertainment': 'Area intrattenimento con smart TV',
    'gallery.masterBedroom': 'Camera da letto principale con letto comodo',
    'gallery.bedroom1': 'Camera con ampio spazio di archiviazione',
    'gallery.bedroom2': 'Camera luminosa con luce naturale',
    'gallery.secondBedroom': 'Seconda camera da letto',
    'gallery.bedroom3': 'Seconda camera con letti singoli',
    'gallery.bedroom4': 'Soluzioni di archiviazione camera',
    'gallery.bedroom5': 'Camera con vista costiera',
    'gallery.modernKitchen': 'Cucina moderna completamente attrezzata',
    'gallery.kitchenAppliances': 'Cucina con elettrodomestici di qualità',
    'gallery.kitchenDining': 'Zona pranzo della cucina',
    'gallery.terrace1': 'Terrazza privata con vista sul canale',
    'gallery.terrace2': 'Area pranzo esterna',
    'gallery.terrace3': 'Terrazza perfetta per rilassarsi',
    'gallery.modernBathroom': 'Bagno moderno con accessori di qualità',
    'gallery.apartmentEntrance': 'Elegante ingresso dell\'appartamento',
    'gallery.hallway': 'Corridoio moderno',
    'gallery.overview1': 'Soggiorno dell\'appartamento con vista',
    'gallery.overview2': 'Cucina con armadi verde bosco',
    'gallery.overview3': 'Camera con materasso di qualità e archiviazione',
    'gallery.overview4': 'Vista sul canale esterno dall\'appartamento',
    
    // Testimonials Section
    'testimonials.title': 'Cosa Dicono i Nostri Ospiti',
    'testimonials.description': 'Scopri perché i viaggiatori scelgono Jávea Bliss per la loro fuga mediterranea accessibile.',
    'testimonials.guest1Name': 'Carlos',
    'testimonials.guest1Location': 'Madrid, Luglio 2025',
    'testimonials.guest1Text': 'Uno degli Airbnb più completi in cui sia mai stato, ristrutturato, con utensili da cucina completi, lenzuola, asciugamani, ingredienti da cucina. Molto contenti del nostro soggiorno nell\'appartamento, siamo andati in famiglia a trascorrere il fine settimana. Posizione ideale vicino alla spiaggia e ai ristoranti. Attenzione impeccabile di Laurent.',
    'testimonials.guest2Name': 'Emma',
    'testimonials.guest2Location': 'Amsterdam, Paesi Bassi, Giugno 2025',
    'testimonials.guest2Text': 'Abbiamo trovato esattamente quello che cercavamo — lusso accessibile a pochi passi dalla spiaggia. La terrazza, splendidamente illuminata al tramonto, è diventata il nostro posto preferito per rilassarci. Ottimo rapporto qualità-prezzo e impeccabilmente pulito.',
    'testimonials.guest3Name': 'Pierre & Marie',
    'testimonials.guest3Location': 'Lione, Francia, Giugno 2025',
    'testimonials.guest3Text': 'Un posto eccezionale, davvero a soli 3 minuti dalla spiaggia e circondato dai migliori ristoranti e bar di Jávea. La vita notturna è così vicina che camminare è l\'unica opzione di cui avrai bisogno. L\'appartamento trova il perfetto equilibrio tra comfort e accessibilità. La cucina è completamente attrezzata per cucinare a casa, e l\'host ci ha persino accolto con una bottiglia di spumante (cava).',
    
    // Reviews Translation
    'reviews.showOriginal': 'Mostra originale ({lang})',
    'reviews.hideOriginal': 'Nascondi originale ({lang})',

    // Interior Section
    'interior.title': 'Interni',
    'interior.bedrooms': 'Due generose camere matrimoniali, ciascuna con materassi di qualità alberghiera, tende oscuranti e armadi a muro.',
    'interior.bathroom': 'Bagno tranquillo in microcemento con doccia a pioggia, WC sospeso e illuminazione indiretta morbida.',
    'interior.kitchen': 'Elegante cucina verde bosco completamente attrezzata: piano cottura a induzione, forno multifunzione, lavastoviglie, macchina Nespresso e illuminazione LED nascosta riflessa in uno schienale a specchio.',
    'interior.lounge': 'Soggiorno open space con parete multimediale in listelli di quercia, smart TV da 55 pollici e divano a due posti convertibile in letto singolo per ospite extra.',
    'interior.lighting': 'Illuminazione LED a soffitto dimmerabile per serate accoglienti e relax prima di uscire la sera.',
    'interior.patio': 'Patio privato per colazioni tranquille o per sciacquare le ciabatte sabbiose.',
    'interior.laundry': 'Lavatrice nel patio privato per riporre windsurf o biciclette.',
    'interior.connectivity': 'Aria condizionata zonata e Wi-Fi fibra ad alta velocità ovunque.',

    // Building & Amenities Section
    'building.title': 'Edificio e Servizi',
    'building.security': 'Ingresso sicuro, ascensore e un posto auto assegnato (raro così vicino alla spiaggia).',
    'building.marina': 'Gli ospiti possono prenotare ormeggi, tavole SUP o piccole barche a motore direttamente presso Marina Nou Fontana, a 150m.',
    'building.shopping': 'Diversi negozi di alimentari e una farmacia sono a cinque minuti a piedi.',

    // Availability Calendar
    'checkAvailability': 'Verifica Disponibilità',
    'availabilityDescription': 'Verifica la disponibilità in tempo reale e prenota la tua fuga mediterranea accessibile. Le date verdi sono disponibili, le date rosse sono già prenotate.',
    'calendarNote': 'Il calendario si sincronizza automaticamente con il nostro sistema di prenotazione. Contattaci per assicurarti le tue date.',
    'available': 'Disponibile',
    'booked': 'Prenotato',
    'lastUpdated': 'Ultimo aggiornamento',
    'datesSelected': 'Date Selezionate',
    'specialOfferSelected': 'Offerta Speciale Selezionata',
    'datesAutoFilled': 'Date compilate automaticamente nel modulo di prenotazione qui sotto',
    'was': 'era',
    'specialOffer': 'Offerta Speciale',
    'seasonalRates': 'Tariffe Stagionali',

    // Amenities List
    'amenityList.airConditioning': 'Aria Condizionata',
    'amenityList.wifi': 'WiFi Alta Velocità',
    'amenityList.smartTv': 'Smart TV 55 pollici',
    'amenityList.kitchen': 'Cucina Completamente Attrezzata',
    'amenityList.waterFilter': 'Filtro Acqua',
    'amenityList.washer': 'Lavatrice (senza asciugatrice)',
    'amenityList.parking': 'Parcheggio Privato',
    'amenityList.nespresso': 'Macchina Nespresso',
    'amenityList.dishwasher': 'Lavastoviglie',
    'amenityList.showerTowels': 'Asciugamani Doccia',
    'amenityList.beachTowels': 'Asciugamani da Spiaggia',
    'amenityList.noPets': 'Non Ammessi Animali',

    // Paradise Section
    'paradise.title': 'Scopri il Paradiso',
    'paradise.description1': 'Alloggiare a pochi passi dalla spiaggia di Arenal significa avere il meglio di Jávea proprio alla tua porta. Come unica spiaggia sabbiosa della città, Arenal offre di tutto, dai bagni mattutini rinfrescanti in acque calme e poco profonde alle cene romantiche al tramonto sul mare. Il vivace lungomare è pieno di bar sulla spiaggia, ristoranti, mercati locali, musica dal vivo e persino qualche locale notturno per chi ama la movida.',
    'paradise.description2': 'Qui puoi abbracciare completamente lo stile di vita mediterraneo senza bisogno di un\'auto. Trascorri le tue giornate rilassandoti in spiaggia, esplorando boutique affascinanti, o scoprendo calette vicine e il centro storico—tutto a pochi minuti di distanza. Per chi cerca comfort, convenienza e la vera esperienza di Jávea, questo appartamento vicino ad Arenal è il posto perfetto dove soggiornare.',
    'paradise.beach.title': 'Spiaggia Arenal',
    'paradise.beach.description': '3 minuti ad Arenal, il posto più popolare di Jávea dove vivere con ristoranti, lungomare e locali. Come unica spiaggia sabbiosa della città, offre acque tranquille poco profonde e vivace vita notturna.',
    'paradise.watersports.title': 'Sport Acquatici',
    'paradise.watersports.description': 'Accesso diretto agli sport acquatici: kayak, paddle-surf, moto d\'acqua e operatori subacquei si raggruppano intorno all\'imboccatura del canale.',
    'paradise.dining.title': 'Paradiso Gastronomico',
    'paradise.dining.description': 'Vicinanza immediata a luoghi per colazione e pranzo. Opzioni gastronomiche lungo il canale come Amarre 152 (piatti creativi di riso) o Ristorante Tosca con vista tramonto sulle barche.',
    'paradise.oldtown.title': 'Centro Storico',
    'paradise.oldtown.description': '10-15 minuti in bicicletta (4 km) al suggestivo Centro Storico di Jávea con la sua chiesa gotica, mercato coperto e bancarelle di artigianato settimanali.',
    'paradise.walks.title': 'Passeggiate Panoramiche',
    'paradise.walks.description': 'Sentieri costieri panoramici verso Cap Prim e il Parco Naturale Montgó iniziano proprio a est del lungomare di Arenal.',
    
    // Booking Information Section
    'booking.information': 'Informazioni Prenotazione',
    'booking.rates': 'Tariffe',
    'booking.highSeason': '• Alta Stagione (Giugno - Settembre e Festivi): Da €210 per notte',
    'booking.midSeason': '• Media Stagione (Aprile, Maggio, Ottobre): Da €160 per notte',
    'booking.lowSeason': '• Bassa Stagione (Novembre - Marzo esclusi festivi): Da €130 per notte',
    'booking.minimumStay': 'Soggiorno Minimo',
    'booking.minimumStayText': '5 notti minimo in alta stagione, 3 notti negli altri periodi',
    'booking.checkInOut': 'Check-in e Check-out',
    'booking.checkInTime': '• Check-in: Dalle 16:00',
    'booking.checkOutTime': '• Check-out: Entro le 12:00',
    'booking.cancellation': 'Politica di Cancellazione',
    'booking.cancellationText': 'Cancellazione gratuita fino a 30 giorni prima del check-in. Le cancellazioni entro 30 giorni sono soggette alla nostra politica di cancellazione.',
    'booking.directContact': 'Contatto Diretto',
    'booking.airbnb': 'Prenota su Airbnb',
    'booking.checkingAvailability': 'Verifica disponibilità...',
    'booking.datesAvailable': '✅ Queste date sono disponibili! Continua con la tua prenotazione.',
    'booking.datesUnavailable': '❌ Spiacenti, queste date non sono disponibili. Seleziona date diverse.',
    
    // Recommendations Page
    'recommendations.title': 'Dove andare nella zona?',
    'recommendations.subtitle': 'Scopri il meglio di Javea - raccomandazioni selezionate per i nostri ospiti',
    'recommendations.restaurants': 'Ristoranti',
    'recommendations.drinks': 'Bar e Drink',
    'recommendations.breakfast': 'Colazione e Pasticceria',
    
    // Restaurant descriptions
    'rec.chabada.desc': 'Bar sulla spiaggia perfetto per drink e atmosfera',
    'rec.chabada.hours': 'Dalle 8, non-stop, Happy Hour 16-20, musica dal vivo giovedì sera',
    'rec.labambula.desc': 'Bar vivace con musica dal vivo e balli',
    'rec.labambula.hours': '9-1 (fino alle 3 nel weekend), flamenco domenica, swing martedì, rock venerdì',
    'rec.lafontana.desc': 'Paella autentica e pizza italiana proprio sulla spiaggia',
    'rec.lafontana.hours': 'Non-stop tutti i giorni',
    'rec.bohemians.desc': 'Cena elegante con atmosfera sofisticata',
    'rec.bohemians.hours': '12-mezzanotte (tutti i giorni)',
    'rec.lamasena.desc': 'Ristorante di alta gamma con cucina raffinata',
    'rec.lamasena.hours': 'Lun 12:30-16:30; Mer-Dom 12:30-16:30 & 19:30-22:30 (fino alle 23 Sab/Dom), chiuso martedì',
    'rec.loasis.desc': 'Rinomato per eccellenti bistecche e piatti di carne',
    'rec.loasis.hours': '12:30-23 (tutti i giorni)',
    'rec.casalili.desc': 'Cucina asiatica autentica con ingredienti freschi',
    'rec.casalili.hours': '12:30-16 & 18:30-23 (tutti i giorni)',
    'rec.carnaval.desc': 'Fusion moderna con sushi, hamburger e poke bowl',
    'rec.carnaval.hours': 'Non-stop tutti i giorni',
    'rec.caramel.desc': 'Pasticceria francese con dolci freschi e caffè',
    'rec.caramel.hours': '7:30-19:30 (tutti i giorni)',
    
    // Common location terms
    'rec.location.beach': 'Spiaggia Arenal',
    'rec.location.walk': 'min a piedi',
    'rec.location.taxi': 'min in taxi',
    'rec.location.street': 'Fine della strada',
    'recommendations.beaches': 'Spiagge',
    'recommendations.activities': 'Attività',
    'recommendations.shopping': 'Shopping',
    'recommendations.contact': 'Hai bisogno di più informazioni?',
    'recommendations.contactText': 'Non esitare a contattarci per raccomandazioni più personalizzate o assistenza durante il tuo soggiorno.',
    'recommendations.backToHome': 'Torna alla Home',
    'contact.phone': 'Chiamami',
    'contact.whatsapp': 'Mandami un WhatsApp',
    
    // Promotional Calendar
    'promotional.offerEndsIn': 'L\'offerta termina tra',
    'promotional.offerExpired': 'Offerta scaduta',
    'promotional.discountedRate': 'Tariffa Scontata',
    'promotional.limitedTimeOffer': 'Offerta a tempo limitato',
    'calendar.unavailable': 'Non disponibile',
    'calendar.regularRate': 'Tariffa Regolare',
  },
  de: {
    // Navigation
    'nav.home': 'Startseite',
    'nav.apartment': 'Wohnung',
    'nav.gallery': 'Galerie',
    'nav.rates': 'Preise',
    'nav.location': 'Lage',
    'nav.booking': 'Buchen',
    'nav.recommendations': 'Empfehlungen',

    
    // Hero Section
    'hero.title': 'JÁVEA BLISS',
    'hero.subtitle': 'Erschwingliche Luxus-Küstenwohnung',
    'hero.tagline': 'Ab €130/Nacht - Ihr budgetfreundliches Paradies an der Costa Blanca, perfekt für deutsche und schweizer Besucher',
    'hero.description': 'Erwachen Sie zum sanften Klang der Segelmasten, die in der Mittelmeerbrise schwanken. Spazieren Sie nur 250 Meter zu Arenals goldenem Sand für ein erfrischendes Bad, dann kehren Sie zu Ihrem kühlen, zeitgenössischen Rückzugsort zurück, wo modernes Design auf Küsteneleganz trifft. Direktflüge von München, Frankfurt, Berlin und Zürich.',
    'hero.bookButton': 'Buchen Sie Ihren Aufenthalt',
    'hero.exploreButton': 'Entdecken Sie die Wohnung',
    
    // Apartment Section
    'apartment.title': 'Ihr Küsten-Heiligtum',
    'apartment.description': 'Entdecken Sie Ihr persönliches Stück Paradies in dieser vollständig renovierten Wohnung im ersten Stock zu unschlagbaren Preisen. Eingebettet neben dem ruhigen Nou Fontana-Kanal, wo erschwingliche mediterrane Eleganz auf modernen Komfort in perfekter Harmonie trifft.',
    'apartment.restaurantProximity': 'Zu den besten Restaurants laufen',
    'apartment.restaurantProximityDesc': 'Ihre Wohnung ist perfekt gelegen, nur wenige Gehminuten von Jáveas beliebtesten Restaurants und Bars entfernt.',
    'apartment.viewAllRestaurants': 'Vollständigen Restaurant-Guide ansehen',
    
    // At Glance Section
    'glance.title': 'Auf einen Blick',
    'glance.sleeps': 'Schlafplätze für bis zu 4 Gäste',
    'glance.bedrooms': '2 geräumige Schlafzimmer',
    'glance.bathroom': '1 komplettes Badezimmer',
    'glance.beach': '3 Minuten Fußweg zum Arenal Strand',
    'glance.parking': 'Privater Parkplatz',
    'glance.wifi': 'Hochgeschwindigkeits-WiFi',
    'glance.ac': 'Klimaanlage',
    'glance.terrace': 'Private Terrasse',
    
    // Amenities Section
    'amenities.title': 'Ausstattung & Merkmale',
    'amenities.kitchen': 'Voll Ausgestattete Küche',
    'amenities.kitchenDesc': 'Moderne Küche mit Geschirrspüler, Mikrowelle, Kaffeemaschine und allen Essentials zum Kochen zuhause.',
    'amenities.comfort': 'Klimakomfort',
    'amenities.comfortDesc': 'Klimaanlage und Heizung im gesamten Gebäude für ganzjährigen Komfort.',
    'amenities.entertainment': 'Unterhaltung',
    'amenities.entertainmentDesc': 'Smart TV, Hochgeschwindigkeits-WiFi und Streaming-Dienste für entspannende Abende.',
    'amenities.laundry': 'Wäscheservice',
    'amenities.laundryDesc': 'Waschmaschine verfügbar (kein Trockner vorhanden).',
    'amenities.outdoor': 'Außenbereich',
    'amenities.outdoorDesc': 'Private Terrasse perfekt für Morgenkaffee oder Abendgetränke.',
    'amenities.parking': 'Sicherer Parkplatz',
    'amenities.parkingDesc': 'Privater Parkplatz für Ihre Bequemlichkeit inkludiert.',
    
    // Rates Section
    'rates.title': 'Erschwingliche Preise & Richtlinien',
    'rates.description': 'Konkurrierende Saisonpreise und Buchungsrichtlinien für Ihren budgetfreundlichen Aufenthalt in Jávea Bliss. Genießen Sie Luxusunterkunft ohne Aufpreis.',
    'rates.highSeason': 'Hochsaison',
    'rates.highPeriod': 'Juni – September & Feiertage',
    'rates.highRate': 'Ab €210 pro Nacht',
    'rates.midSeason': 'Nebensaison',
    'rates.midPeriod': 'April, Mai, Oktober',
    'rates.midRate': 'Ab €160 pro Nacht',
    'rates.lowSeason': 'Niedrigsaison',
    'rates.lowPeriod': 'November – März (außer Feiertage)',
    'rates.lowRate': 'Ab €130 pro Nacht',
    'rates.policies': 'Buchungsrichtlinien',
    'rates.policy1': 'Mindestens 5 Nächte in der Hochsaison',
    'rates.policy2': 'Mindestens 3 Nächte in anderen Zeiträumen',
    'rates.policy3': 'Check-in: Ab 16:00 Uhr',
    'rates.policy4': 'Check-out: Bis 12:00 Uhr',
    
    // Location Section
    'location.title': 'Erstklassige Lage',
    'location.description': 'Perfekt positioniert im exklusiven Marina Nou Fontana-Gebiet, wo ruhige Kanäle auf mediterranen Charme treffen.',
    'location.beach': 'Arenal Strand',
    'location.beachDesc': '3 Minuten Fußweg zum goldenen Sandstrand',
    'location.restaurants': 'Restaurants',
    'location.restaurantsDesc': 'Restaurants am Wasser in Gehweite',
    'location.shops': 'Einkaufen',
    'location.shopsDesc': 'Lokale Märkte und Boutiquen in der Nähe',
    'location.transport': 'Transport',
    'location.transportDesc': 'Einfacher Zugang zu öffentlichen Verkehrsmitteln und Hauptstraßen',
    'location.restaurantTitle': 'Lokale Restaurant-Empfehlungen',
    'location.restaurantDesc': 'Entdecken Sie die besten Restaurants und Bars in Gehweite, einschließlich Chabada, La Bambula, Masena und Bohemians. Unsere Auswahl bietet authentische lokale Gastronomie-Erlebnisse.',
    'location.viewRecommendations': 'Restaurant-Guide ansehen',
    
    // Booking Section
    'booking.title': 'Reservieren Sie Ihr Erschwingliches Paradies',
    'booking.description': 'Bereit, Ihr Stück mediterranes Paradies zu unschlagbaren Preisen zu erleben? Ab nur €130 pro Nacht kontaktieren Sie uns, um Verfügbarkeit zu prüfen und Ihren budgetfreundlichen Urlaub in Jávea zu sichern.',
    'booking.name': 'Vollständiger Name',
    'booking.email': 'E-Mail-Adresse',
    'booking.phone': 'Telefonnummer',
    'booking.checkIn': 'Check-in Datum',
    'booking.checkOut': 'Check-out Datum',
    'booking.guests': 'Anzahl der Gäste',
    'booking.message': 'Zusätzliche Nachricht (Optional)',
    'booking.submit': 'Anfrage Senden',
    'booking.submitting': 'Wird gesendet...',
    'booking.success': 'Anfrage Gesendet!',
    'booking.successDesc': 'Wir melden uns schnellstmöglich bei Ihnen.',
    'booking.error': 'E-Mail-Service Problem',
    'booking.contactInfo': 'Kontaktinformationen',
    'booking.contactDesc': 'Kontaktieren Sie uns direkt für sofortige Hilfe oder Fragen zu Ihrem Aufenthalt.',
    'booking.emailLabel': 'E-Mail',
    'booking.responseTime': 'Wir antworten normalerweise innerhalb von 24 Stunden',
    
    // Footer
    'footer.tagline': 'Ihr Tor zur mediterranen Glückseligkeit',
    'footer.rights': 'Alle Rechte vorbehalten.',
    
    // Form validation
    'form.nameRequired': 'Name muss mindestens 2 Zeichen haben',
    'form.emailInvalid': 'Bitte geben Sie eine gültige E-Mail-Adresse ein',
    'form.checkInRequired': 'Bitte wählen Sie ein Check-in Datum',
    'form.checkOutRequired': 'Bitte wählen Sie ein Check-out Datum',
    'form.checkOutMustBeAfterCheckIn': 'Check-out Datum muss nach Check-in Datum liegen',
    'form.guestsRequired': 'Bitte wählen Sie die Anzahl der Gäste',
    'form.phoneRequired': 'Bitte geben Sie eine gültige Telefonnummer ein',
    'form.spam': 'Spam-Schutz aktiviert',
    
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
    'pricing.longTermRate': 'Langzeit-Tarif',
    'pricing.longTermDiscount': 'Langzeit-Mietrabatt angewendet!',
    'pricing.longTermMessage': 'Ihr Aufenthalt von {nights} Nächten (5+ Wochen) qualifiziert sich für unseren speziellen €100/Tag Tarif.',
    'pricing.discount': 'Rabatt',
    'pricing.cleaningFee': 'Reinigungsgebühr',
    'pricing.includedInTotal': 'im Gesamtpreis enthalten',
    'pricing.pricePerNight': 'Preis pro Nacht',
    
    // Gallery Section
    'gallery.title': 'Paradies-Galerie',
    'gallery.description': 'Machen Sie eine visuelle Tour durch unsere zeitgenössische Wohnung und ihre Umgebung.',
    'gallery.livingAreas': 'Wohnbereiche',
    'gallery.bedrooms': 'Schlafzimmer',
    'gallery.kitchen': 'Küche & Esszimmer',
    'gallery.outdoor': 'Außenbereiche',
    'gallery.bathroom': 'Badezimmer',
    'gallery.entrance': 'Eingang & Flur',
    'gallery.overview': 'Wohnungsübersicht',
    'gallery.livingRoom1': 'Geräumiges Wohnzimmer',
    'gallery.livingRoom2': 'Wohnzimmer mit natürlichem Licht',
    'gallery.livingRoom3': 'Wohnzimmer-Sitzbereich',
    'gallery.entertainment': 'Unterhaltungsbereich mit Smart TV',
    'gallery.masterBedroom': 'Hauptschlafzimmer mit komfortablem Bett',
    'gallery.bedroom1': 'Schlafzimmer mit viel Stauraum',
    'gallery.bedroom2': 'Helles Schlafzimmer mit natürlichem Licht',
    'gallery.secondBedroom': 'Zweites Schlafzimmer',
    'gallery.bedroom3': 'Zweites Schlafzimmer mit Einzelbetten',
    'gallery.bedroom4': 'Schlafzimmer-Aufbewahrungslösungen',
    'gallery.bedroom5': 'Schlafzimmer mit Küstenblick',
    'gallery.modernKitchen': 'Moderne voll ausgestattete Küche',
    'gallery.kitchenAppliances': 'Küche mit Qualitätsgeräten',
    'gallery.kitchenDining': 'Küchen-Essbereich',
    'gallery.terrace1': 'Private Terrasse mit Kanalblick',
    'gallery.terrace2': 'Außenessbereich',
    'gallery.terrace3': 'Terrasse perfekt zum Entspannen',
    'gallery.modernBathroom': 'Modernes Badezimmer mit Qualitätsarmaturen',
    'gallery.apartmentEntrance': 'Eleganter Wohnungseingang',
    'gallery.hallway': 'Moderner Flur',
    'gallery.overview1': 'Wohnzimmer mit Aussicht',
    'gallery.overview2': 'Küche mit waldgrünen Schränken',
    'gallery.overview3': 'Schlafzimmer mit Qualitätsmatratze und Stauraum',
    'gallery.overview4': 'Außenkanalblick von der Wohnung',
    
    // Testimonials Section
    'testimonials.title': 'Was Unsere Gäste Sagen',
    'testimonials.description': 'Erfahren Sie, warum Reisende Jávea Bliss für ihren erschwinglichen mediterranen Urlaub wählen.',
    'testimonials.guest1Name': 'Carlos',
    'testimonials.guest1Location': 'Madrid, Juli 2025',
    'testimonials.guest1Text': 'Eines der vollständigsten Airbnbs, in denen ich übernachtet habe, renoviert, mit kompletten Küchenutensilien, Bettwäsche, Handtüchern, Kochzutaten. Sehr glücklich mit unserem Aufenthalt im Stockwerk, wir gingen als Familie um das Wochenende zu verbringen. Ideale Lage in der Nähe von Strand und Restaurants. Unschlagbare Betreuung von Laurent.',
    'testimonials.guest2Name': 'Emma',
    'testimonials.guest2Location': 'Amsterdam, Niederlande, Juni 2025',
    'testimonials.guest2Text': 'Wir fanden genau das, wonach wir suchten — erschwinglichen Luxus in Gehweite zum Strand. Die Terrasse, wunderschön beleuchtet bei Sonnenuntergang, wurde unser Lieblingsplatz zum Entspannen. Großartiges Preis-Leistungs-Verhältnis und tadellos sauber.',
    'testimonials.guest3Name': 'Pierre & Marie',
    'testimonials.guest3Location': 'Lyon, Frankreich, Juni 2025',
    'testimonials.guest3Text': 'Ein außergewöhnlicher Ort, wirklich nur 3 Minuten vom Strand entfernt und umgeben von Jáveas besten Restaurants und Bars. Das Nachtleben ist so nah, dass Gehen die einzige Option ist, die Sie brauchen werden. Die Wohnung findet die perfekte Balance zwischen Komfort und Erschwinglichkeit. Die Küche ist vollständig ausgestattet zum Kochen zu Hause, und der Gastgeber begrüßte uns sogar mit einer Flasche Sekt (Cava).',
    
    // Reviews Translation
    'reviews.showOriginal': 'Original anzeigen ({lang})',
    'reviews.hideOriginal': 'Original verbergen ({lang})',

    // Interior Section
    'interior.title': 'Innenbereich',
    'interior.bedrooms': 'Zwei großzügige Doppelzimmer, jedes mit Hotelqualität-Matratzen, Verdunklungsvorhängen und Einbauschränken.',
    'interior.bathroom': 'Ruhiges Mikrozement-Badezimmer mit Regendusche, Wandtoilette und sanfter indirekter Beleuchtung.',
    'interior.kitchen': 'Elegante waldgrüne voll ausgestattete Küche: Induktionskochfeld, Multifunktionsofen, Geschirrspüler, Nespresso-Maschine und versteckte LED-Arbeitsbeleuchtung, die in einer Spiegel-Rückwand reflektiert wird.',
    'interior.lounge': 'Offenes Wohnzimmer mit Eichen-Lamellen-Medienwand, 55-Zoll Smart TV und Zweisitzer-Sofa, das in ein Einzelbett für einen zusätzlichen Gast umgewandelt werden kann.',
    'interior.lighting': 'Dimmbare LED-Deckenbeleuchtung für gemütliche Abende und Entspannung vor dem Ausgehen.',
    'interior.patio': 'Private Terrasse für entspannte Frühstücke oder das Abspülen sandiger Flip-Flops.',
    'interior.laundry': 'Waschmaschine auf privater Terrasse zur Aufbewahrung von Windsurf-Ausrüstung oder Fahrrad.',
    'interior.connectivity': 'Zonierte Klimaanlage und Hochgeschwindigkeits-Glasfaser-Wi-Fi überall.',

    // Building & Amenities Section
    'building.title': 'Gebäude & Annehmlichkeiten',
    'building.security': 'Sicherer Eingang, Aufzug und ein zugewiesener Parkplatz (selten so nah am Strand).',
    'building.marina': 'Gäste können Liegeplätze, SUP-Boards oder kleine Motorboote direkt bei Marina Nou Fontana, 150m entfernt, buchen.',
    'building.shopping': 'Mehrere Lebensmittelgeschäfte und eine Apotheke sind fünf Gehminuten entfernt.',

    // Availability Calendar
    'checkAvailability': 'Verfügbarkeit Prüfen',
    'availabilityDescription': 'Überprüfen Sie die Echtzeit-Verfügbarkeit und buchen Sie Ihren erschwinglichen mediterranen Urlaub. Grüne Daten sind verfügbar, rote Daten sind bereits gebucht.',
    'calendarNote': 'Kalender synchronisiert automatisch mit unserem Buchungssystem. Kontaktieren Sie uns, um Ihre Daten zu sichern.',
    'available': 'Verfügbar',
    'booked': 'Gebucht',
    'lastUpdated': 'Zuletzt aktualisiert',
    'datesSelected': 'Termine Ausgewählt',
    'specialOfferSelected': 'Spezialangebot Ausgewählt',
    'datesAutoFilled': 'Termine automatisch im Buchungsformular ausgefüllt',
    'was': 'war',
    'specialOffer': 'Spezialangebot',
    'seasonalRates': 'Saisonpreise',

    // Amenities List
    'amenityList.airConditioning': 'Klimaanlage',
    'amenityList.wifi': 'Hochgeschwindigkeits-WiFi',
    'amenityList.smartTv': '55-Zoll Smart TV',
    'amenityList.kitchen': 'Voll Ausgestattete Küche',
    'amenityList.waterFilter': 'Wasserfilter',
    'amenityList.washer': 'Waschmaschine (kein Trockner)',
    'amenityList.parking': 'Privater Parkplatz',
    'amenityList.nespresso': 'Nespresso-Maschine',
    'amenityList.dishwasher': 'Geschirrspüler',
    'amenityList.showerTowels': 'Duschandtücher',
    'amenityList.beachTowels': 'Strandhandtücher',
    'amenityList.noPets': 'Nicht Haustierfreundlich',

    // Paradise Section
    'paradise.title': 'Entdecken Sie das Paradies',
    'paradise.description1': 'In Gehweite zum Arenal-Strand zu wohnen bedeutet, das Beste von Jávea direkt vor der Tür zu haben. Als einziger Sandstrand der Stadt bietet Arenal alles von erfrischenden Morgenbädern in ruhigem, seichtem Wasser bis hin zu malerischen Sonnenuntergangsdinnern am Meer. Die lebendige Promenade ist gesäumt mit Strandbars, Restaurants, lokalen Märkten, Live-Musik und sogar einigen Spätabend-Locations für Nachtschwärmer.',
    'paradise.description2': 'Hier können Sie den mediterranen Lebensstil vollständig umarmen, ohne jemals ein Auto zu benötigen. Verbringen Sie Ihre Tage am Strand, bummeln Sie durch charmante Boutiquen oder erkunden Sie nahegelegene Buchten und die historische Altstadt—alles nur wenige Minuten entfernt. Für diejenigen, die Komfort, Bequemlichkeit und die wahre Jávea-Erfahrung suchen, ist diese Wohnung am Arenal der perfekte Ort zum Verweilen.',
    'paradise.beach.title': 'Arenal Strand',
    'paradise.beach.description': '3 Minuten zum Arenal, Jáveas beliebtester Wohnort mit Restaurants, Promenade und Clubs. Als einziger Sandstrand der Stadt bietet er ruhiges, seichtes Wasser und lebendiges Nachtleben.',
    'paradise.watersports.title': 'Wassersport',
    'paradise.watersports.description': 'Direkter Zugang zu Wassersport vor der Tür: Kajak, Paddle-Surf, Jetski und Tauchunternehmen gruppieren sich um die Kanalmündung.',
    'paradise.dining.title': 'Kulinarisches Paradies',
    'paradise.dining.description': 'Unmittelbare Nähe zu Frühstücks- und Mittagsplätzen. Kanalseitige Restaurants wie Amarre 152 (kreative Reisgerichte) oder Restaurante Tosca mit Sonnenuntergangsblick über die Boote.',
    'paradise.oldtown.title': 'Altstadt',
    'paradise.oldtown.description': '10-15 Minuten mit dem Fahrrad (4 km) zu Jáveas atmosphärischer Altstadt mit ihrer gotischen Kirche, überdachtem Markt und wöchentlichen Handwerkständen.',
    'paradise.walks.title': 'Malerische Spaziergänge',
    'paradise.walks.description': 'Malerische Küstenwege zu Cap Prim und Montgó Naturpark beginnen gleich östlich der Arenal-Promenade.',
    
    // Booking Information Section
    'booking.information': 'Buchungsinformationen',
    'booking.rates': 'Preise',
    'booking.highSeason': '• Hochsaison (Juni - September & Feiertage): Ab €210 pro Nacht',
    'booking.midSeason': '• Nebensaison (April, Mai, Oktober): Ab €160 pro Nacht',
    'booking.lowSeason': '• Niedrigsaison (November - März außer Feiertage): Ab €130 pro Nacht',
    'booking.minimumStay': 'Mindestaufenthalt',
    'booking.minimumStayText': '5 Nächte mindestens in der Hochsaison, 3 Nächte in anderen Zeiträumen',
    'booking.checkInOut': 'Check-in & Check-out',
    'booking.checkInTime': '• Check-in: Ab 16:00 Uhr',
    'booking.checkOutTime': '• Check-out: Bis 12:00 Uhr',
    'booking.cancellation': 'Stornierungsrichtlinien',
    'booking.cancellationText': 'Kostenlose Stornierung bis 30 Tage vor Check-in. Stornierungen innerhalb von 30 Tagen unterliegen unseren Stornierungsrichtlinien.',
    'booking.directContact': 'Direkter Kontakt',
    'booking.airbnb': 'Auf Airbnb buchen',
    'booking.checkingAvailability': 'Verfügbarkeit prüfen...',
    'booking.datesAvailable': '✅ Diese Termine sind verfügbar! Setzen Sie Ihre Buchung fort.',
    'booking.datesUnavailable': '❌ Entschuldigung, diese Termine sind nicht verfügbar. Bitte wählen Sie andere Termine.',
    
    // Recommendations Page
    'recommendations.title': 'Wo kann man in der Gegend hingehen?',
    'recommendations.subtitle': 'Entdecken Sie das Beste von Javea - handverlesene Empfehlungen für unsere Gäste',
    'recommendations.restaurants': 'Restaurants',
    'recommendations.drinks': 'Bars & Getränke',
    'recommendations.breakfast': 'Frühstück & Bäckerei',
    
    // Restaurant descriptions
    'rec.chabada.desc': 'Perfekte Strandbar für Getränke und Atmosphäre',
    'rec.chabada.hours': 'Ab 8 Uhr, non-stop, Happy Hour 16-20 Uhr, Live-Musik Donnerstagabend',
    'rec.labambula.desc': 'Lebendige Bar mit Live-Musik und Tanz',
    'rec.labambula.hours': '9-1 Uhr (bis 3 Uhr Wochenenden), Flamenco sonntags, Swing dienstags, Rock freitags',
    'rec.lafontana.desc': 'Authentische Paella und italienische Pizza direkt am Strand',
    'rec.lafontana.hours': 'Non-stop jeden Tag',
    'rec.bohemians.desc': 'Elegantes Speisen mit anspruchsvoller Atmosphäre',
    'rec.bohemians.hours': '12-24 Uhr (täglich)',
    'rec.lamasena.desc': 'Gehobenes Restaurant mit raffinierter Küche',
    'rec.lamasena.hours': 'Mo 12:30-16:30 Uhr; Mi-So 12:30-16:30 Uhr & 19:30-22:30 Uhr (bis 23 Uhr Sa/So), dienstags geschlossen',
    'rec.loasis.desc': 'Bekannt für ausgezeichnete Steaks und Fleischgerichte',
    'rec.loasis.hours': '12:30-23 Uhr (täglich)',
    'rec.casalili.desc': 'Authentische asiatische Küche mit frischen Zutaten',
    'rec.casalili.hours': '12:30-16 Uhr & 18:30-23 Uhr (täglich)',
    'rec.carnaval.desc': 'Moderne Fusion mit Sushi, Burgern und Poke Bowls',
    'rec.carnaval.hours': 'Non-stop jeden Tag',
    'rec.caramel.desc': 'Französische Bäckerei mit frischen Backwaren und Kaffee',
    'rec.caramel.hours': '7:30-19:30 Uhr (täglich)',
    
    // Common location terms
    'rec.location.beach': 'Arenal Strand',
    'rec.location.walk': 'min zu Fuß',
    'rec.location.taxi': 'min mit Taxi',
    'rec.location.street': 'Ende der Straße',
    'recommendations.beaches': 'Strände',
    'recommendations.activities': 'Aktivitäten',
    'recommendations.shopping': 'Einkaufen',
    'recommendations.contact': 'Benötigen Sie weitere Informationen?',
    'recommendations.contactText': 'Kontaktieren Sie uns gerne für personalisiertere Empfehlungen oder Unterstützung während Ihres Aufenthalts.',
    'recommendations.backToHome': 'Zurück zur Startseite',
    'contact.phone': 'Rufen Sie mich an',
    'contact.whatsapp': 'Senden Sie mir eine WhatsApp',
    
    // Promotional Calendar
    'promotional.offerEndsIn': 'Angebot endet in',
    'promotional.offerExpired': 'Angebot abgelaufen',
    'promotional.discountedRate': 'Ermäßigter Preis',
    'promotional.limitedTimeOffer': 'Zeitlich begrenztes Angebot',
    'calendar.unavailable': 'Nicht verfügbar',
    'calendar.regularRate': 'Regulärer Preis',
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
    'hero.subtitle': 'Apartamento Costero de Lujo Asequible',
    'hero.tagline': 'Desde €130/noche - Tu paraíso económico en la Costa Blanca, perfecto para visitantes del Reino Unido y del norte de Europa',
    'hero.description': 'Despierta con el suave sonido de los mástiles de veleros meciéndose en la brisa mediterránea. Pasea solo 250 metros hasta las arenas doradas del Arenal para un refrescante baño, luego regresa a tu fresco y contemporáneo refugio donde el diseño moderno se encuentra con la elegancia costera. Vuelos directos desde Londres, Ámsterdam y las principales ciudades europeas.',
    'hero.bookButton': 'Reserva Tu Estancia',
    'hero.exploreButton': 'Explora el Apartamento',

    // Apartment Section
    'apartment.title': 'Tu Santuario Costero',
    'apartment.description': 'Descubre tu porción personal de paraíso en este apartamento de primera planta totalmente renovado a precios inmejorables. Ubicado junto al tranquilo canal de Nou Fontana, donde la elegancia mediterránea asequible se encuentra con el confort moderno en perfecta armonía.',
    'apartment.restaurantProximity': 'Camina a los Mejores Restaurantes',
    'apartment.restaurantProximityDesc': 'Tu apartamento está perfectamente ubicado a poca distancia a pie de los restaurantes y bares más populares de Jávea.',
    'apartment.viewAllRestaurants': 'Ver Guía Completa de Restaurantes',

    // At Glance Section
    'glance.title': 'De un Vistazo',
    'glance.sleeps': 'Capacidad hasta 4 huéspedes',
    'glance.bedrooms': '2 amplios dormitorios',
    'glance.bathroom': '1 baño completo',
    'glance.beach': '3 minutos a pie a la Playa del Arenal',
    'glance.parking': 'Plaza de parking privada',
    'glance.wifi': 'WiFi de alta velocidad',
    'glance.ac': 'Aire acondicionado',
    'glance.terrace': 'Terraza privada',

    // Amenities Section
    'amenities.title': 'Comodidades y Características',
    'amenities.kitchen': 'Cocina Totalmente Equipada',
    'amenities.kitchenDesc': 'Cocina moderna con lavavajillas, microondas, cafetera y todos los esenciales para cocinar en casa.',
    'amenities.comfort': 'Confort Climático',
    'amenities.comfortDesc': 'Aire acondicionado y calefacción en todo el apartamento para confort todo el año.',
    'amenities.entertainment': 'Entretenimiento',
    'amenities.entertainmentDesc': 'Smart TV, WiFi de alta velocidad y servicios de streaming para noches relajantes.',
    'amenities.laundry': 'Lavandería',
    'amenities.laundryDesc': 'Lavadora disponible (sin secadora).',
    'amenities.outdoor': 'Espacio Exterior',
    'amenities.outdoorDesc': 'Terraza privada perfecta para el café de la mañana o bebidas al atardecer.',
    'amenities.parking': 'Parking Seguro',
    'amenities.parkingDesc': 'Plaza de parking privada incluida para tu comodidad.',

    // Rates Section
    'rates.title': 'Tarifas Asequibles y Políticas',
    'rates.description': 'Tarifas estacionales competitivas y políticas de reserva para tu estancia económica en Jávea Bliss. Disfruta de alojamiento de lujo sin el precio premium.',
    'rates.highSeason': 'Temporada Alta',
    'rates.highPeriod': 'Junio – Septiembre y Festivos',
    'rates.highRate': 'Desde €210 por noche',
    'rates.midSeason': 'Temporada Media',
    'rates.midPeriod': 'Abril, Mayo, Octubre',
    'rates.midRate': 'Desde €160 por noche',
    'rates.lowSeason': 'Temporada Baja',
    'rates.lowPeriod': 'Noviembre – Marzo (fuera de festivos)',
    'rates.lowRate': 'Desde €130 por noche',
    'rates.policies': 'Políticas de Reserva',
    'rates.policy1': 'Mínimo 5 noches en temporada alta',
    'rates.policy2': 'Mínimo 3 noches en otros períodos',
    'rates.policy3': 'Check-in: Desde las 16:00',
    'rates.policy4': 'Check-out: Antes de las 12:00',

    // Location Section
    'location.title': 'Ubicación Privilegiada',
    'location.description': 'Perfectamente situado en la exclusiva zona de Marina Nou Fontana, donde los tranquilos canales se encuentran con el encanto mediterráneo.',
    'location.beach': 'Playa del Arenal',
    'location.beachDesc': '3 minutos a pie a la playa de arena dorada',
    'location.restaurants': 'Gastronomía',
    'location.restaurantsDesc': 'Restaurantes frente al mar a poca distancia a pie',
    'location.shops': 'Compras',
    'location.shopsDesc': 'Mercados locales y boutiques cercanos',
    'location.transport': 'Transporte',
    'location.transportDesc': 'Fácil acceso a transporte público y carreteras principales',
    'location.restaurantTitle': 'Recomendaciones de Restaurantes Locales',
    'location.restaurantDesc': 'Descubre los mejores restaurantes y bares a poca distancia, incluyendo Chabada, La Bambula, Masena y Bohemians. Nuestra lista curada presenta experiencias gastronómicas locales auténticas.',
    'location.viewRecommendations': 'Ver Guía de Restaurantes',

    // Booking Section
    'booking.title': 'Reserva Tu Paraíso Asequible',
    'booking.description': '¿Listo para experimentar tu porción de paraíso tropical a precios inmejorables? Desde solo €130 por noche, contáctanos para consultar disponibilidad y asegurar tu escapada económica a Jávea.',
    'booking.name': 'Nombre Completo',
    'booking.email': 'Correo Electrónico',
    'booking.phone': 'Número de Teléfono',
    'booking.checkIn': 'Fecha de Entrada',
    'booking.checkOut': 'Fecha de Salida',
    'booking.guests': 'Número de Huéspedes',
    'booking.message': 'Mensaje Adicional (Opcional)',
    'booking.submit': 'Enviar Consulta',
    'booking.submitting': 'Enviando...',
    'booking.success': '¡Consulta Enviada!',
    'booking.successDesc': 'Te responderemos lo antes posible.',
    'booking.error': 'Problema con el Servicio de Email',
    'booking.contactInfo': 'Información de Contacto',
    'booking.contactDesc': 'Contáctanos directamente para asistencia inmediata o preguntas sobre tu estancia.',
    'booking.emailLabel': 'Email',
    'booking.responseTime': 'Normalmente respondemos en 24 horas',

    // Footer
    'footer.tagline': 'Tu puerta de entrada al bienestar mediterráneo',
    'footer.rights': 'Todos los derechos reservados.',

    // Form validation
    'form.nameRequired': 'El nombre debe tener al menos 2 caracteres',
    'form.emailInvalid': 'Por favor, introduce un correo electrónico válido',
    'form.checkInRequired': 'Por favor, selecciona una fecha de entrada',
    'form.checkOutRequired': 'Por favor, selecciona una fecha de salida',
    'form.checkOutMustBeAfterCheckIn': 'La fecha de salida debe ser posterior a la de entrada',
    'form.guestsRequired': 'Por favor, selecciona el número de huéspedes',
    'form.phoneRequired': 'Por favor, introduce un número de teléfono válido',
    'form.spam': 'Protección anti-spam activada',

    // Guest options
    'guests.1': '1 Huésped',
    'guests.2': '2 Huéspedes',
    'guests.3': '3 Huéspedes',
    'guests.4': '4 Huéspedes',

    // Pricing
    'pricing.title': 'Información de Precios',
    'pricing.stayDuration': 'Duración de la Estancia',
    'pricing.ratePerNight': 'Tarifa por noche',
    'pricing.total': 'Total',
    'pricing.nights': 'noches',
    'pricing.longTermRate': 'Tarifa larga estancia',
    'pricing.longTermDiscount': '¡Descuento por estancia larga aplicado!',
    'pricing.longTermMessage': 'Tu estancia de {nights} noches (5+ semanas) califica para nuestra tarifa especial de €100/día.',
    'pricing.discount': 'Descuento',
    'pricing.cleaningFee': 'Tarifa de Limpieza',
    'pricing.includedInTotal': 'incluido en el total',
    'pricing.pricePerNight': 'Precio por noche',

    // Gallery Section
    'gallery.title': 'Galería del Paraíso',
    'gallery.description': 'Realiza un recorrido visual por nuestro apartamento contemporáneo y sus alrededores.',
    'gallery.livingAreas': 'Zonas de Estar',
    'gallery.bedrooms': 'Dormitorios',
    'gallery.kitchen': 'Cocina y Comedor',
    'gallery.outdoor': 'Espacios Exteriores',
    'gallery.bathroom': 'Baño',
    'gallery.entrance': 'Entrada y Pasillo',
    'gallery.overview': 'Vista General del Apartamento',
    'gallery.livingRoom1': 'Amplio salón',
    'gallery.livingRoom2': 'Salón con luz natural',
    'gallery.livingRoom3': 'Zona de estar del salón',
    'gallery.entertainment': 'Zona de entretenimiento con Smart TV',
    'gallery.masterBedroom': 'Dormitorio principal con cama cómoda',
    'gallery.bedroom1': 'Dormitorio con amplio almacenamiento',
    'gallery.bedroom2': 'Dormitorio luminoso con luz natural',
    'gallery.secondBedroom': 'Segundo dormitorio',
    'gallery.bedroom3': 'Segundo dormitorio con camas gemelas',
    'gallery.bedroom4': 'Soluciones de almacenamiento del dormitorio',
    'gallery.bedroom5': 'Dormitorio con vistas costeras',
    'gallery.modernKitchen': 'Cocina moderna totalmente equipada',
    'gallery.kitchenAppliances': 'Cocina con electrodomésticos de calidad',
    'gallery.kitchenDining': 'Zona de comedor de la cocina',
    'gallery.terrace1': 'Terraza privada con vistas al canal',
    'gallery.terrace2': 'Zona de comedor exterior',
    'gallery.terrace3': 'Terraza perfecta para relajarse',
    'gallery.modernBathroom': 'Baño moderno con accesorios de calidad',
    'gallery.apartmentEntrance': 'Elegante entrada del apartamento',
    'gallery.hallway': 'Pasillo moderno',
    'gallery.overview1': 'Zona de estar del apartamento con vistas',
    'gallery.overview2': 'Cocina con muebles verde bosque',
    'gallery.overview3': 'Dormitorio con colchón de calidad y almacenamiento',
    'gallery.overview4': 'Vista del canal exterior desde el apartamento',

    // Testimonials Section
    'testimonials.title': 'Lo Que Dicen Nuestros Huéspedes',
    'testimonials.description': 'Descubre por qué los viajeros eligen Jávea Bliss para su escapada mediterránea asequible.',
    'testimonials.guest1Name': 'Carlos',
    'testimonials.guest1Location': 'Madrid, Julio 2025',
    'testimonials.guest1Text': 'Uno de los Airbnb más completos en los que me he alojado, renovado, con utensilios de cocina completos, sábanas, toallas, ingredientes de cocina. Muy contentos con nuestra estancia en el piso, fuimos como familia a pasar el fin de semana. Ubicación ideal cerca de la playa y restaurantes. Atención inmejorable de Laurent.',
    'testimonials.guest2Name': 'Emma',
    'testimonials.guest2Location': 'Ámsterdam, Países Bajos, Junio 2025',
    'testimonials.guest2Text': 'Encontramos exactamente lo que buscábamos: lujo asequible a poca distancia de la playa. La terraza, bellamente iluminada al atardecer, se convirtió en nuestro lugar favorito para relajarnos. Gran relación calidad-precio e impecablemente limpio.',
    'testimonials.guest3Name': 'Pierre & Marie',
    'testimonials.guest3Location': 'Lyon, Francia, Junio 2025',
    'testimonials.guest3Text': 'Un lugar excepcional, realmente a solo 3 minutos de la playa y rodeado de los mejores restaurantes y bares de Jávea. La vida nocturna está tan cerca que caminar es la única opción que necesitarás. El apartamento logra el equilibrio perfecto entre confort y asequibilidad. La cocina está totalmente equipada para cocinar en casa, y el anfitrión incluso nos dio la bienvenida con una botella de vino espumoso (cava).',

    // Reviews Translation
    'reviews.showOriginal': 'Mostrar original ({lang})',
    'reviews.hideOriginal': 'Ocultar original ({lang})',

    // Interior Section
    'interior.title': 'Interior',
    'interior.bedrooms': 'Dos amplios dormitorios dobles, cada uno con colchones de calidad hotelera, cortinas opacas y armarios empotrados.',
    'interior.bathroom': 'Baño tranquilo de microcemento con ducha de lluvia, WC suspendido e iluminación indirecta suave.',
    'interior.kitchen': 'Elegante cocina verde bosque totalmente equipada: placa de inducción, horno multifunción, lavavajillas, máquina Nespresso y luces LED ocultas reflejadas en un salpicadero con espejo.',
    'interior.lounge': 'Salón abierto con pared de listones de roble para multimedia, Smart TV de 55 pulgadas y sofá de dos plazas que se convierte en cama individual para un huésped extra.',
    'interior.lighting': 'Iluminación LED de techo regulable para noches acogedoras y relax antes de salir.',
    'interior.patio': 'Patio privado para desayunos tranquilos o enjuagar las chanclas con arena.',
    'interior.laundry': 'Lavadora en el patio privado para guardar tabla de windsurf o bicicleta.',
    'interior.connectivity': 'Aire acondicionado por zonas y WiFi de fibra de alta velocidad en todo el apartamento.',

    // Building & Amenities Section
    'building.title': 'Edificio y Comodidades',
    'building.security': 'Entrada segura, ascensor y una plaza de parking asignada (raro tan cerca de la playa).',
    'building.marina': 'Los huéspedes pueden reservar amarres, tablas de SUP o pequeñas motoras directamente en Marina Nou Fontana, a 150m.',
    'building.shopping': 'Varios supermercados y una farmacia están a cinco minutos a pie.',

    // Availability Calendar
    'checkAvailability': 'Consultar Disponibilidad',
    'availabilityDescription': 'Consulta la disponibilidad en tiempo real y reserva tu escapada mediterránea asequible. Las fechas verdes están disponibles, las rojas ya están reservadas.',
    'calendarNote': 'El calendario se sincroniza automáticamente con nuestro sistema de reservas. Contáctanos para asegurar tus fechas.',
    'available': 'Disponible',
    'booked': 'Reservado',
    'lastUpdated': 'Última actualización',
    'datesSelected': 'Fechas Seleccionadas',
    'specialOfferSelected': 'Oferta Especial Seleccionada',
    'datesAutoFilled': 'Fechas rellenadas automáticamente en el formulario de reserva',
    'was': 'era',
    'specialOffer': 'Oferta Especial',
    'seasonalRates': 'Tarifas de Temporada',

    // Amenities List
    'amenityList.airConditioning': 'Aire Acondicionado',
    'amenityList.wifi': 'WiFi de Alta Velocidad',
    'amenityList.smartTv': 'Smart TV de 55 pulgadas',
    'amenityList.kitchen': 'Cocina Totalmente Equipada',
    'amenityList.waterFilter': 'Filtro de Agua',
    'amenityList.washer': 'Lavadora (sin secadora)',
    'amenityList.parking': 'Parking Privado',
    'amenityList.nespresso': 'Máquina Nespresso',
    'amenityList.dishwasher': 'Lavavajillas',
    'amenityList.showerTowels': 'Toallas de Ducha',
    'amenityList.beachTowels': 'Toallas de Playa',
    'amenityList.noPets': 'No Admite Mascotas',

    // Discover Paradise Section
    'paradise.title': 'Descubre el Paraíso',
    'paradise.description1': 'Alojarse a poca distancia a pie de la Playa del Arenal significa tener lo mejor de Jávea justo en tu puerta. Como la única playa de arena de la ciudad, el Arenal ofrece desde refrescantes baños matutinos en aguas tranquilas y poco profundas hasta cenas panorámicas al atardecer junto al mar. El vibrante paseo marítimo está lleno de chiringuitos, restaurantes, mercados locales, música en vivo e incluso algunos lugares nocturnos para quienes disfrutan de la vida nocturna.',
    'paradise.description2': 'Aquí puedes abrazar plenamente el estilo de vida mediterráneo sin necesitar nunca un coche. Pasa tus días tomando el sol en la playa, explorando encantadoras boutiques o descubriendo calas cercanas y el casco histórico, todo a pocos minutos. Para quienes buscan comodidad, conveniencia y la auténtica experiencia de Jávea, este apartamento cerca del Arenal es el lugar perfecto para alojarse.',
    'paradise.beach.title': 'Playa del Arenal',
    'paradise.beach.description': '3 minutos al Arenal, el lugar más popular de Jávea para vivir con gastronomía, paseo marítimo y clubes. Como la única playa de arena de la ciudad, ofrece aguas tranquilas y poco profundas y vibrante vida nocturna.',
    'paradise.watersports.title': 'Deportes Acuáticos',
    'paradise.watersports.description': 'Acceso a deportes acuáticos desde la puerta: operadores de kayak, paddle surf, moto acuática y buceo se agrupan alrededor de la desembocadura del canal.',
    'paradise.dining.title': 'Paraíso Gastronómico',
    'paradise.dining.description': 'Proximidad inmediata a lugares de desayuno y almuerzo. Opciones de comedor junto al canal como Amarre 152 (platos de arroz creativos) o Restaurante Tosca con vistas al atardecer sobre los barcos.',
    'paradise.oldtown.title': 'Casco Antiguo',
    'paradise.oldtown.description': '10-15 minutos en bicicleta (4 km) al atmosférico Casco Antiguo de Jávea con su iglesia gótica, mercado cubierto y puestos de artesanía semanales.',
    'paradise.walks.title': 'Paseos Escénicos',
    'paradise.walks.description': 'Senderos costeros escénicos hacia Cap Prim y el Parque Natural del Montgó comienzan justo al este del paseo del Arenal.',

    // Availability Section
    'availability.title': 'Consulta Disponibilidad y Precios',
    'availability.subtitle': 'Consulta disponibilidad en tiempo real y tarifas estacionales para tu perfecta escapada a la Costa Blanca',
    'availability.note': 'El calendario se actualiza automáticamente con las reservas de Airbnb. Los precios pueden variar según la duración de la estancia y las políticas de reserva.',

    // Calendar
    'calendar.jan': 'Ene', 'calendar.feb': 'Feb', 'calendar.mar': 'Mar',
    'calendar.apr': 'Abr', 'calendar.may': 'May', 'calendar.jun': 'Jun',
    'calendar.jul': 'Jul', 'calendar.aug': 'Ago', 'calendar.sep': 'Sep',
    'calendar.oct': 'Oct', 'calendar.nov': 'Nov', 'calendar.dec': 'Dic',
    'calendar.sun': 'Dom', 'calendar.mon': 'Lun', 'calendar.tue': 'Mar',
    'calendar.wed': 'Mié', 'calendar.thu': 'Jue', 'calendar.fri': 'Vie', 'calendar.sat': 'Sáb',
    'calendar.error': 'Error al cargar el calendario', 'calendar.tryAgain': 'Por favor, inténtalo de nuevo',
    'calendar.available': 'Disponible', 'calendar.past': 'Pasado',

    // Booking Information Section
    'booking.information': 'Información de Reserva',
    'booking.rates': 'Tarifas',
    'booking.highSeason': '• Temporada Alta (Junio - Septiembre y Festivos): Desde €210 por noche',
    'booking.midSeason': '• Temporada Media (Abril, Mayo, Octubre): Desde €160 por noche',
    'booking.lowSeason': '• Temporada Baja (Noviembre - Marzo fuera de festivos): Desde €130 por noche',
    'booking.minimumStay': 'Estancia Mínima',
    'booking.minimumStayText': 'Mínimo 5 noches en temporada alta, 3 noches en otros períodos',
    'booking.checkInOut': 'Check-in y Check-out',
    'booking.checkInTime': '• Check-in: Desde las 16:00',
    'booking.checkOutTime': '• Check-out: Antes de las 12:00',
    'booking.cancellation': 'Política de Cancelación',
    'booking.cancellationText': 'Cancelación gratuita hasta 30 días antes del check-in. Las cancelaciones dentro de los 30 días están sujetas a nuestra política de cancelación.',
    'booking.directContact': 'Contacto Directo',
    'booking.airbnb': 'Reservar en Airbnb',
    'booking.checkingAvailability': 'Comprobando disponibilidad...',
    'booking.datesAvailable': '✅ ¡Estas fechas están disponibles! Continúa con tu reserva.',
    'booking.datesUnavailable': '❌ Lo sentimos, estas fechas no están disponibles. Por favor, selecciona fechas diferentes.',
    'booking.nextAvailable': 'Próximas fechas disponibles:',
    'booking.useSuggestedDates': 'Usar Estas Fechas',

    // Recommendations Page
    'recommendations.title': '¿Dónde ir en la zona?',
    'recommendations.subtitle': 'Descubre lo mejor de Jávea - recomendaciones seleccionadas para nuestros huéspedes',
    'recommendations.restaurants': 'Restaurantes',
    'recommendations.drinks': 'Bares y Bebidas',
    'recommendations.breakfast': 'Desayuno y Panadería',

    // Restaurant descriptions
    'rec.chabada.desc': 'Bar de playa perfecto para bebidas y ambiente',
    'rec.chabada.hours': 'Desde las 8h, sin parar, Happy Hour 16-20h, música en vivo los jueves',
    'rec.labambula.desc': 'Bar vibrante con música en vivo y baile',
    'rec.labambula.hours': '9h-1h (hasta las 3h fines de semana), flamenco domingos, swing martes, rock viernes',
    'rec.lafontana.desc': 'Auténtica paella y pizza italiana junto a la playa',
    'rec.lafontana.hours': 'Sin parar todos los días',
    'rec.bohemians.desc': 'Comida elegante con ambiente sofisticado',
    'rec.bohemians.hours': '12h-24h (diario)',
    'rec.lamasena.desc': 'Restaurante de alta gama con cocina refinada',
    'rec.lamasena.hours': 'Lun 12:30-16:30h; Mié-Dom 12:30-16:30h y 19:30-22:30h (hasta 23h Sáb/Dom), cerrado martes',
    'rec.loasis.desc': 'Reconocido por excelentes carnes y filetes',
    'rec.loasis.hours': '12:30h-23h (diario)',
    'rec.casalili.desc': 'Auténtica cocina asiática con ingredientes frescos',
    'rec.casalili.hours': '12:30-16h y 18:30-23h (diario)',
    'rec.carnaval.desc': 'Fusión moderna con sushi, hamburguesas y poke bowls',
    'rec.carnaval.hours': 'Sin parar todos los días',
    'rec.caramel.desc': 'Panadería estilo francés con bollería fresca y café',
    'rec.caramel.hours': '7:30h-19:30h (diario)',

    // Common location terms
    'rec.location.beach': 'Playa del Arenal',
    'rec.location.walk': 'min a pie',
    'rec.location.taxi': 'min en taxi',
    'rec.location.street': 'Al final de la calle',
    'recommendations.beaches': 'Playas',
    'recommendations.activities': 'Actividades',
    'recommendations.shopping': 'Compras',
    'recommendations.contact': '¿Necesitas Más Información?',
    'recommendations.contactText': 'No dudes en contactarnos para recomendaciones más personalizadas o asistencia durante tu estancia.',
    'recommendations.backToHome': 'Volver al Inicio',
    'contact.phone': 'Llámame',
    'contact.whatsapp': 'Envíame un WhatsApp',

    // Promotional Calendar
    'promotional.offerEndsIn': 'La oferta termina en',
    'promotional.offerExpired': 'Oferta expirada',
    'promotional.discountedRate': 'Tarifa con Descuento',
    'promotional.limitedTimeOffer': 'Oferta por tiempo limitado',
    'calendar.unavailable': 'No disponible',
    'calendar.regularRate': 'Tarifa Regular',
  }
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