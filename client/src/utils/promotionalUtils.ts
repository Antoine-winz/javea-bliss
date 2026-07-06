// Shared utilities for promotional offers
export interface PromotionalOffer {
  id: number;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  originalPrice: number;
  discountedPrice: number;
  discountPercentage: number;
  language: string;
  isActive: boolean;
  validUntil?: string;
}

// Optimized countdown timer calculation
export const calculateTimeLeft = (validUntil: string, language: string): string => {
  try {
    const now = new Date();
    const expiryDate = new Date(validUntil);
    
    // Check if date is valid
    if (isNaN(expiryDate.getTime())) {
      return 'Invalid Date';
    }
    
    const difference = expiryDate.getTime() - now.getTime();

    if (difference <= 0) {
      const expiredTexts = {
        fr: 'Offre expirée',
        es: 'Oferta expirada',
        de: 'Angebot abgelaufen',
        nl: 'Aanbieding verlopen',
        default: 'Offer expired'
      };
      return expiredTexts[language as keyof typeof expiredTexts] || expiredTexts.default;
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));

    // Language-specific time format abbreviations
    const timeFormats = {
      fr: `${days}j ${hours}h ${minutes}m`,
      es: `${days}d ${hours}h ${minutes}m`,
      de: `${days}T ${hours}h ${minutes}m`,
      nl: `${days}d ${hours}u ${minutes}m`,
      default: `${days}d ${hours}h ${minutes}m`
    };

    return timeFormats[language as keyof typeof timeFormats] || timeFormats.default;
  } catch (error) {
    console.error('Error calculating time left:', error);
    return 'Error';
  }
};

// Consolidated translation function for promotional offers
export const getPromotionalTranslations = (language: string, savings: number) => {
  const translations = {
    en: {
      limitedTime: "LIMITED TIME OFFER",
      savingsText: "You Save",
      bookNow: "Book Now & Save",
      contactUs: "Contact Us to Book Now",
      whatsIncluded: "What's Included in This Special Offer",
      dontMissOut: "Don't Miss Out!",
      bookYourSpecial: "Book Your Special Offer Now",
      reserveParadise: "Reserve Your Affordable Paradise",
      promotionalRate: "Promotional Rate:",
      regularRate: "Regular Rate:",
      youSave: "You Save:",
      validUntil: "Valid until:",
      dinnerSavings: "That's enough for amazing dinners at the best restaurants in Jávea",
      offerEndsIn: "Offer ends in:",
      luxuryApartmentAwaits: "Your Luxury Apartment Awaits",
      experienceComfort: "Experience the comfort and elegance of our premium vacation rental in the heart of Jávea",
      livingRoom: "Living Room",
      modernComfort: "Modern comfort with sea views",
      masterBedroom: "Master Bedroom",
      peacefulRetreat: "Peaceful retreat with premium bedding",
      bathroom: "Bathroom",
      luxuryAmenities: "Luxury amenities and modern fixtures",
      perNight: "per night",
      was: "WAS",
      now: "NOW",
      save: "SAVE",
      affordableLuxury: "Affordable Luxury Coastal Apartment",
      luxuryCoastalParadise: "Your Luxury Coastal Paradise",
      perfectBlend: "Experience the perfect blend of comfort and elegance in our fully renovated apartment, just steps from Arenal Beach on the stunning Costa Blanca.",
      minToBeach: "3-min to Beach",
      walkToArenal: "Walk to Arenal's golden sands",
      sleeps4: "Sleeps 4",
      perfectForCouples: "Perfect for couples or families",
      freeParking: "Free Parking",
      privateParkingSpace: "Private parking space included",
      highSpeedWifi: "High-Speed WiFi",
      stayConnected: "Stay connected during your stay",
      reserveNow: `Reserve now & save €${savings}/night`,
      distanceFromBeach: "250m from Arenal Beach",
      bedroomsBathrooms: "2 bedrooms • 1 bathroom • Up to 4 people",
      immediateBooking: "Available for immediate booking",
      secureBookingFooter: "Secure booking • No hidden fees • Instant confirmation",
      // Form field labels
      fullName: "Full Name",
      emailAddress: "Email Address",
      checkInDate: "Check-in Date",
      checkOutDate: "Check-out Date",
      numberOfGuests: "Number of Guests",
      phoneNumber: "Phone Number",
      additionalMessage: "Additional Message (Optional)",
      sendInquiry: "Send Inquiry"
    },
    es: {
      limitedTime: "OFERTA POR TIEMPO LIMITADO",
      savingsText: "Ahorras",
      bookNow: "Reserva ahora y ahorra",
      contactUs: "Contáctanos para reservar ahora",
      whatsIncluded: "Lo que está incluido en esta oferta especial",
      dontMissOut: "¡No te lo pierdas!",
      bookYourSpecial: "Reserva tu oferta especial ahora",
      reserveParadise: "Reserva tu paraíso asequible",
      promotionalRate: "Tarifa promocional:",
      regularRate: "Tarifa regular:",
      youSave: "Ahorras:",
      validUntil: "Válido hasta:",
      dinnerSavings: "Suficiente para cenas increíbles en los mejores restaurantes de Jávea",
      offerEndsIn: "La oferta termina en:",
      luxuryApartmentAwaits: "Tu apartamento de lujo te espera",
      experienceComfort: "Experimenta la comodidad y elegancia de nuestro alquiler vacacional premium en el corazón de Jávea",
      livingRoom: "Salón",
      modernComfort: "Comodidad moderna con vistas al mar",
      masterBedroom: "Dormitorio Principal",
      peacefulRetreat: "Refugio tranquilo con ropa de cama premium",
      bathroom: "Baño",
      luxuryAmenities: "Amenidades de lujo y accesorios modernos",
      perNight: "por noche",
      was: "ERA",
      now: "AHORA",
      save: "AHORRAS",
      affordableLuxury: "Apartamento Costero de Lujo Asequible",
      luxuryCoastalParadise: "Tu Paraíso Costero de Lujo",
      perfectBlend: "Experimenta la perfecta combinación de comodidad y elegancia en nuestro apartamento completamente renovado, a solo pasos de la playa Arenal en la impresionante Costa Blanca.",
      minToBeach: "3 min a la playa",
      walkToArenal: "Camina hasta las arenas doradas de Arenal",
      sleeps4: "Capacidad para 4",
      perfectForCouples: "Perfecto para parejas o familias",
      freeParking: "Aparcamiento gratuito",
      privateParkingSpace: "Aparcamiento privado incluido",
      highSpeedWifi: "WiFi de alta velocidad",
      stayConnected: "Mantente conectado durante tu estadía",
      reserveNow: `Reserva ahora y ahorra €${savings}/noche`,
      distanceFromBeach: "250m de la playa Arenal",
      bedroomsBathrooms: "2 dormitorios • 1 baño • Hasta 4 personas",
      immediateBooking: "Disponible para reserva inmediata",
      secureBookingFooter: "Reserva segura • Sin tarifas ocultas • Confirmación instantánea",
      // Form field labels
      fullName: "Nombre Completo",
      emailAddress: "Dirección de Email",
      checkInDate: "Fecha de Entrada",
      checkOutDate: "Fecha de Salida",
      numberOfGuests: "Número de Huéspedes",
      phoneNumber: "Número de Teléfono",
      additionalMessage: "Mensaje Adicional (Opcional)",
      sendInquiry: "Enviar Consulta"
    },
    fr: {
      limitedTime: "OFFRE À DURÉE LIMITÉE",
      savingsText: "Vous économisez",
      bookNow: "Réservez maintenant et économisez",
      contactUs: "Contactez-nous pour réserver maintenant",
      whatsIncluded: "Ce qui est inclus dans cette offre spéciale",
      dontMissOut: "Ne manquez pas cette opportunité !",
      bookYourSpecial: "Réservez votre offre spéciale maintenant",
      reserveParadise: "Réservez votre paradis abordable",
      promotionalRate: "Tarif promotionnel :",
      regularRate: "Tarif régulier :",
      youSave: "Vous économisez :",
      validUntil: "Valable jusqu'au :",
      dinnerSavings: "Suffisant pour des dîners incroyables dans les meilleurs restaurants de Jávea",
      offerEndsIn: "L'offre se termine dans :",
      luxuryApartmentAwaits: "Votre appartement de luxe vous attend",
      experienceComfort: "Découvrez le confort et l'élégance de notre location de vacances premium au cœur de Jávea",
      livingRoom: "Salon",
      modernComfort: "Confort moderne avec vue sur mer",
      masterBedroom: "Chambre principale",
      peacefulRetreat: "Retraite paisible avec literie premium",
      bathroom: "Salle de bain",
      luxuryAmenities: "Équipements de luxe et accessoires modernes",
      perNight: "par nuit",
      was: "ÉTAIT",
      now: "MAINTENANT",
      save: "ÉCONOMISER",
      affordableLuxury: "Appartement Côtier de Luxe Abordable",
      luxuryCoastalParadise: "Votre Paradis Côtier de Luxe",
      perfectBlend: "Découvrez le mélange parfait de confort et d'élégance dans notre appartement entièrement rénové, à quelques pas de la plage d'Arenal sur la magnifique Costa Blanca.",
      minToBeach: "3 min de la plage",
      walkToArenal: "Marchez jusqu'aux sables dorés d'Arenal",
      sleeps4: "4 couchages",
      perfectForCouples: "Parfait pour les couples ou les familles",
      freeParking: "Parking gratuit",
      privateParkingSpace: "Place de parking privée incluse",
      highSpeedWifi: "WiFi haut débit",
      stayConnected: "Restez connecté pendant votre séjour",
      reserveNow: `Réservez maintenant et économisez €${savings}/nuit`,
      distanceFromBeach: "250m de la plage d'Arenal",
      bedroomsBathrooms: "2 chambres • 1 salle de bain • Jusqu'à 4 personnes",
      immediateBooking: "Disponible pour réservation immédiate",
      secureBookingFooter: "Réservation sécurisée • Pas de frais cachés • Confirmation instantanée",
      // Form field labels
      fullName: "Nom complet",
      emailAddress: "Adresse e-mail",
      checkInDate: "Date d'arrivée",
      checkOutDate: "Date de départ",
      numberOfGuests: "Nombre d'invités",
      phoneNumber: "Numéro de téléphone",
      additionalMessage: "Message supplémentaire (optionnel)",
      sendInquiry: "Envoyer la demande"
    },
    nl: {
      limitedTime: "BEPERKTE TIJD AANBIEDING",
      savingsText: "Je bespaart",
      bookNow: "Reserveer nu en bespaar",
      contactUs: "Neem contact met ons op om nu te reserveren",
      whatsIncluded: "Wat is inbegrepen in deze speciale aanbieding",
      dontMissOut: "Mis het niet!",
      bookYourSpecial: "Reserveer nu je speciale aanbieding",
      reserveParadise: "Reserveer je betaalbare paradijs",
      promotionalRate: "Promotietarief:",
      regularRate: "Regulier tarief:",
      youSave: "Je bespaart:",
      validUntil: "Geldig tot:",
      dinnerSavings: "Genoeg voor geweldige diners in de beste restaurants van Jávea",
      offerEndsIn: "Aanbieding eindigt over:",
      luxuryApartmentAwaits: "Uw luxe appartement wacht op u",
      experienceComfort: "Ervaar het comfort en de elegantie van onze premium vakantieverhuur in het hart van Jávea",
      livingRoom: "Woonkamer",
      modernComfort: "Modern comfort met zeezicht",
      masterBedroom: "Hoofdslaapkamer",
      peacefulRetreat: "Rustig toevluchtsoord met premium beddengoed",
      bathroom: "Badkamer",
      luxuryAmenities: "Luxe voorzieningen en moderne armaturen",
      perNight: "per nacht",
      was: "WAS",
      now: "NU",
      save: "BESPAREN",
      affordableLuxury: "Betaalbaar Luxe Kustappartement",
      luxuryCoastalParadise: "Uw Luxe Kustparadijs",
      perfectBlend: "Ervaar de perfecte mix van comfort en elegantie in ons volledig gerenoveerde appartement, op slechts een steenworp afstand van het Arenal strand aan de prachtige Costa Blanca.",
      minToBeach: "3 min naar strand",
      walkToArenal: "Loop naar het gouden zand van Arenal",
      sleeps4: "4 slaapplaatsen",
      perfectForCouples: "Perfect voor koppels of gezinnen",
      freeParking: "Gratis parkeren",
      privateParkingSpace: "Privé parkeerplaats inbegrepen",
      highSpeedWifi: "Snelle WiFi",
      stayConnected: "Blijf verbonden tijdens uw verblijf",
      reserveNow: `Reserveer nu en bespaar €${savings}/nacht`,
      distanceFromBeach: "250m van het strand van Arenal",
      bedroomsBathrooms: "2 slaapkamers • 1 badkamer • Tot 4 personen",
      immediateBooking: "Beschikbaar voor directe reservering",
      secureBookingFooter: "Veilige reservering • Geen verborgen kosten • Onmiddellijke bevestiging",
      // Form field labels
      fullName: "Volledige naam",
      emailAddress: "E-mailadres",
      checkInDate: "Inchecken datum",
      checkOutDate: "Uitchecken datum",
      numberOfGuests: "Aantal gasten",
      phoneNumber: "Telefoonnummer",
      additionalMessage: "Aanvullend bericht (optioneel)",
      sendInquiry: "Verstuur aanvraag"
    },
    de: {
      limitedTime: "ZEITLICH BEGRENZTES ANGEBOT",
      savingsText: "Sie sparen",
      bookNow: "Jetzt buchen und sparen",
      contactUs: "Kontaktieren Sie uns, um jetzt zu buchen",
      whatsIncluded: "Was ist in diesem Sonderangebot enthalten",
      dontMissOut: "Verpassen Sie es nicht!",
      bookYourSpecial: "Buchen Sie jetzt Ihr Sonderangebot",
      reserveParadise: "Reservieren Sie Ihr erschwingliches Paradies",
      promotionalRate: "Aktionspreis:",
      regularRate: "Regulärer Preis:",
      youSave: "Sie sparen:",
      validUntil: "Gültig bis:",
      dinnerSavings: "Genug für fantastische Abendessen in den besten Restaurants von Jávea",
      offerEndsIn: "Angebot endet in:",
      luxuryApartmentAwaits: "Ihr Luxusapartment wartet auf Sie",
      experienceComfort: "Erleben Sie den Komfort und die Eleganz unserer Premium-Ferienvermietung im Herzen von Jávea",
      livingRoom: "Wohnzimmer",
      modernComfort: "Moderner Komfort mit Meerblick",
      masterBedroom: "Hauptschlafzimmer",
      peacefulRetreat: "Ruhiger Rückzugsort mit Premium-Bettwäsche",
      bathroom: "Badezimmer",
      luxuryAmenities: "Luxus-Annehmlichkeiten und moderne Armaturen",
      perNight: "pro Nacht",
      was: "WAR",
      now: "JETZT",
      save: "SPAREN",
      affordableLuxury: "Erschwingliches Luxus-Küstenapartment",
      luxuryCoastalParadise: "Ihr Luxus-Küstenparadies",
      perfectBlend: "Erleben Sie die perfekte Mischung aus Komfort und Eleganz in unserem vollständig renovierten Apartment, nur wenige Schritte vom Arenal-Strand an der atemberaubenden Costa Blanca entfernt.",
      minToBeach: "3 Min zum Strand",
      walkToArenal: "Zu Fuß zum goldenen Sand von Arenal",
      sleeps4: "4 Schlafplätze",
      perfectForCouples: "Perfekt für Paare oder Familien",
      freeParking: "Kostenlose Parkplätze",
      privateParkingSpace: "Privater Parkplatz inklusive",
      highSpeedWifi: "Schnelles WLAN",
      stayConnected: "Bleiben Sie während Ihres Aufenthalts verbunden",
      reserveNow: `Reserviere jetzt und spare €${savings}/Nacht`,
      distanceFromBeach: "250m vom Strand von Arenal",
      bedroomsBathrooms: "2 Schlafzimmer • 1 Badezimmer • Bis zu 4 Personen",
      immediateBooking: "Verfügbar für sofortige Buchung",
      secureBookingFooter: "Sichere Buchung • Keine versteckten Gebühren • Sofortige Bestätigung",
      // Form field labels
      fullName: "Vollständiger Name",
      emailAddress: "E-Mail-Adresse",
      checkInDate: "Check-in Datum",
      checkOutDate: "Check-out Datum",
      numberOfGuests: "Anzahl der Gäste",
      phoneNumber: "Telefonnummer",
      additionalMessage: "Zusätzliche Nachricht (optional)",
      sendInquiry: "Anfrage senden"
    }
  };

  return translations[language as keyof typeof translations] || translations.en;
};

// Format date consistently
export const formatDate = (date: Date): string => {
  const day = date.getDate().toString().padStart(2, '0');
  const month = date.toLocaleDateString('en-US', { month: 'short' });
  const year = date.getFullYear().toString().slice(-2);
  return `${day}/${month}/${year}`;
};

// Get percentage text based on language
export const getPercentageText = (percentage: number, language: string): string => {
  const percentageTexts = {
    es: `${percentage}% de descuento`,
    fr: `${percentage}% de réduction`,
    nl: `${percentage}% korting`,
    de: `${percentage}% Rabatt`,
    default: `${percentage}% off`
  };
  
  return percentageTexts[language as keyof typeof percentageTexts] || percentageTexts.default;
};