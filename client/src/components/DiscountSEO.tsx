import { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useQuery } from '@tanstack/react-query';

interface DiscountInfo {
  isActive: boolean;
  startDate: string;
  endDate: string;
  discountPercent: number;
  originalPrice: number;
  discountedPrice: number;
}

const DiscountSEO = () => {
  const { language } = useLanguage();
  const [discountInfo, setDiscountInfo] = useState<DiscountInfo | null>(null);

  // Fetch calendar data to get real check-in dates
  const { data: calendarData } = useQuery({
    queryKey: ['/api/calendar/blocked-dates'],
    refetchInterval: 300000, // Refetch every 5 minutes
  });

  // Check if discount is currently active
  useEffect(() => {
    if (!calendarData) return;

    const checkDiscountStatus = () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      // Calculate discount period (up to 7 days or until next booking)
      const sevenDaysFromToday = new Date(today);
      sevenDaysFromToday.setDate(today.getDate() + 6);
      
      // Get next check-in date from real calendar data
      const nextCheckInDate = calendarData.checkInDates
        .map(d => new Date(d.split('T')[0]))
        .filter(d => d >= today)
        .sort((a, b) => a.getTime() - b.getTime())[0];
      
      const discountEndDate = nextCheckInDate && nextCheckInDate < sevenDaysFromToday ? nextCheckInDate : sevenDaysFromToday;
      
      if (today <= discountEndDate) {
        const formatDate = (date: Date) => {
          const day = date.getDate();
          const month = date.getMonth() + 1;
          const year = date.getFullYear();
          return `${day}/${month}/${year}`;
        };
        
        setDiscountInfo({
          isActive: true,
          startDate: formatDate(today),
          endDate: formatDate(discountEndDate),
          discountPercent: 20,
          originalPrice: 210,
          discountedPrice: 168
        });
      } else {
        setDiscountInfo(null);
      }
    };

    checkDiscountStatus();
    // Check every hour in case the discount period changes
    const interval = setInterval(checkDiscountStatus, 3600000);
    return () => clearInterval(interval);
  }, [calendarData]);

  useEffect(() => {
    if (!discountInfo?.isActive) return;

    const { startDate, endDate, discountPercent, originalPrice, discountedPrice } = discountInfo;

    // SEO content with discount promotion by language
    const discountSEO = {
      en: {
        title: `🔥 20% OFF Jávea Bliss - Holiday Rental Special Offer | €${discountedPrice}/night | Costa Blanca`,
        description: `LIMITED TIME: Save 20% on luxury holiday rental Jávea! Book now ${startDate} - ${endDate} from €${discountedPrice}/night (was €${originalPrice}). Vacation apartment Costa Blanca, walking distance to Arenal Beach. Direct flights from UK. Don't miss this special offer!`,
        keywords: `20% off Jávea holiday rental, discount vacation apartment Costa Blanca, special offer Jávea rental UK, cheap luxury apartment Arenal Beach, discounted holiday rental Spain, promotional rates Jávea accommodation, limited time offer vacation rental, €${discountedPrice} night Jávea apartment, discount Costa Blanca booking, flash sale holiday rental`,
        ogTitle: `🔥 20% OFF Jávea Bliss - Special Offer €${discountedPrice}/night`,
        ogDescription: `LIMITED TIME: Save 20% on luxury Jávea rental! Book ${startDate}-${endDate} from €${discountedPrice}/night (was €${originalPrice}). Arenal Beach location.`,
        twitterTitle: `🔥 20% OFF Jávea Holiday Rental - €${discountedPrice}/night`,
        twitterDescription: `Save 20% on luxury Jávea apartment! Limited time ${startDate}-${endDate}. Book now €${discountedPrice}/night (was €${originalPrice})`
      },
      nl: {
        title: `🔥 20% KORTING Jávea Bliss - Vakantieverhuur Aanbieding | €${discountedPrice}/nacht | Costa Blanca`,
        description: `BEPERKTE TIJD: Bespaar 20% op luxe vakantieverhuur Jávea! Boek nu ${startDate} - ${endDate} vanaf €${discountedPrice}/nacht (was €${originalPrice}). Vakantieappartement Costa Blanca, op loopafstand van Arenal Beach. Directe vluchten vanuit Nederland. Mis deze speciale aanbieding niet!`,
        keywords: `20% korting Jávea vakantieverhuur, korting vakantieappartement Costa Blanca, speciale aanbieding Jávea verhuur Nederland, goedkoop luxe appartement Arenal Beach, korting vakantieverhuur Spanje, promotie tarieven Jávea accommodatie, beperkte tijd aanbieding, €${discountedPrice} nacht Jávea appartement, korting Costa Blanca boeken, flash sale vakantieverhuur`,
        ogTitle: `🔥 20% KORTING Jávea Bliss - Speciale Aanbieding €${discountedPrice}/nacht`,
        ogDescription: `BEPERKTE TIJD: Bespaar 20% op luxe Jávea verhuur! Boek ${startDate}-${endDate} vanaf €${discountedPrice}/nacht (was €${originalPrice}). Arenal Beach locatie.`,
        twitterTitle: `🔥 20% KORTING Jávea Vakantieverhuur - €${discountedPrice}/nacht`,
        twitterDescription: `Bespaar 20% op luxe Jávea appartement! Beperkte tijd ${startDate}-${endDate}. Boek nu €${discountedPrice}/nacht (was €${originalPrice})`
      },
      fr: {
        title: `🔥 20% REMISE Jávea Bliss - Offre Spéciale Location Vacances | €${discountedPrice}/nuit | Costa Blanca`,
        description: `DURÉE LIMITÉE : Économisez 20% sur location vacances luxe Jávea ! Réservez maintenant ${startDate} - ${endDate} à partir de €${discountedPrice}/nuit (était €${originalPrice}). Appartement vacances Costa Blanca, à pied de la plage Arenal. Vols directs depuis France. Ne manquez pas cette offre spéciale !`,
        keywords: `20% remise location vacances Jávea, réduction appartement vacances Costa Blanca, offre spéciale location Jávea France, appartement luxe pas cher Arenal Beach, réduction location vacances Espagne, tarifs promotionnels hébergement Jávea, offre limitée location vacances, €${discountedPrice} nuit appartement Jávea, remise Costa Blanca réservation, vente flash location vacances`,
        ogTitle: `🔥 20% REMISE Jávea Bliss - Offre Spéciale €${discountedPrice}/nuit`,
        ogDescription: `DURÉE LIMITÉE : Économisez 20% sur location Jávea luxe ! Réservez ${startDate}-${endDate} à partir de €${discountedPrice}/nuit (était €${originalPrice}). Plage Arenal.`,
        twitterTitle: `🔥 20% REMISE Location Vacances Jávea - €${discountedPrice}/nuit`,
        twitterDescription: `Économisez 20% sur appartement luxe Jávea ! Durée limitée ${startDate}-${endDate}. Réservez €${discountedPrice}/nuit (était €${originalPrice})`
      },
      es: {
        title: `🔥 20% DESCUENTO Jávea Bliss - Oferta Especial Alquiler Vacacional | €${discountedPrice}/noche | Costa Blanca`,
        description: `TIEMPO LIMITADO: ¡Ahorra 20% en alquiler vacacional lujo Jávea! Reserva ahora ${startDate} - ${endDate} desde €${discountedPrice}/noche (era €${originalPrice}). Apartamento vacacional Costa Blanca, a pie de Playa Arenal. Fácil acceso desde España. ¡No te pierdas esta oferta especial!`,
        keywords: `20% descuento alquiler vacacional Jávea, descuento apartamento vacacional Costa Blanca, oferta especial alquiler Jávea España, apartamento lujo barato Playa Arenal, descuento alquiler vacacional España, tarifas promocionales alojamiento Jávea, oferta limitada alquiler vacacional, €${discountedPrice} noche apartamento Jávea, descuento Costa Blanca reserva, oferta flash alquiler vacacional`,
        ogTitle: `🔥 20% DESCUENTO Jávea Bliss - Oferta Especial €${discountedPrice}/noche`,
        ogDescription: `TIEMPO LIMITADO: ¡Ahorra 20% en alquiler Jávea lujo! Reserva ${startDate}-${endDate} desde €${discountedPrice}/noche (era €${originalPrice}). Playa Arenal.`,
        twitterTitle: `🔥 20% DESCUENTO Alquiler Vacacional Jávea - €${discountedPrice}/noche`,
        twitterDescription: `¡Ahorra 20% en apartamento lujo Jávea! Tiempo limitado ${startDate}-${endDate}. Reserva €${discountedPrice}/noche (era €${originalPrice})`
      },
      de: {
        title: `🔥 20% RABATT Jávea Bliss - Sonderangebot Ferienvermietung | €${discountedPrice}/Nacht | Costa Blanca`,
        description: `BEGRENZTE ZEIT: Sparen Sie 20% bei Luxus-Ferienvermietung Jávea! Jetzt buchen ${startDate} - ${endDate} ab €${discountedPrice}/Nacht (war €${originalPrice}). Ferienwohnung Costa Blanca, fußläufig zu Arenal Beach. Direktflüge aus Deutschland. Verpassen Sie nicht dieses Sonderangebot!`,
        keywords: `20% Rabatt Jávea Ferienvermietung, Rabatt Ferienwohnung Costa Blanca, Sonderangebot Jávea Vermietung Deutschland, günstiges Luxus-Apartment Arenal Beach, Rabatt Ferienvermietung Spanien, Aktionspreise Jávea Unterkunft, begrenzte Zeit Angebot, €${discountedPrice} Nacht Jávea Apartment, Rabatt Costa Blanca Buchung, Flash Sale Ferienvermietung`,
        ogTitle: `🔥 20% RABATT Jávea Bliss - Sonderangebot €${discountedPrice}/Nacht`,
        ogDescription: `BEGRENZTE ZEIT: Sparen Sie 20% bei Luxus Jávea Vermietung! Buchen ${startDate}-${endDate} ab €${discountedPrice}/Nacht (war €${originalPrice}). Arenal Beach Lage.`,
        twitterTitle: `🔥 20% RABATT Jávea Ferienvermietung - €${discountedPrice}/Nacht`,
        twitterDescription: `Sparen Sie 20% bei Luxus Jávea Apartment! Begrenzte Zeit ${startDate}-${endDate}. Jetzt buchen €${discountedPrice}/Nacht (war €${originalPrice})`
      }
    };

    const currentDiscountSEO = discountSEO[language] || discountSEO.en;

    // Update meta tags with discount promotion
    const updateMetaTag = (name: string, content: string, isProperty = false) => {
      const attribute = isProperty ? 'property' : 'name';
      let meta = document.querySelector(`meta[${attribute}="${name}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attribute, name);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    // Update document title and meta tags
    document.title = currentDiscountSEO.title;
    updateMetaTag('description', currentDiscountSEO.description);
    updateMetaTag('keywords', currentDiscountSEO.keywords);
    
    // Open Graph tags
    updateMetaTag('og:title', currentDiscountSEO.ogTitle, true);
    updateMetaTag('og:description', currentDiscountSEO.ogDescription, true);
    
    // Twitter Card tags
    updateMetaTag('twitter:title', currentDiscountSEO.twitterTitle);
    updateMetaTag('twitter:description', currentDiscountSEO.twitterDescription);

    // Add schema markup for promotional offers
    const schemaScript = document.querySelector('#discount-schema');
    if (schemaScript) {
      schemaScript.remove();
    }
    
    const newSchema = document.createElement('script');
    newSchema.id = 'discount-schema';
    newSchema.type = 'application/ld+json';
    newSchema.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "LodgingBusiness",
      "name": "Jávea Bliss",
      "description": currentDiscountSEO.description,
      "priceRange": `€${discountedPrice}-€${originalPrice}`,
      "offers": {
        "@type": "Offer",
        "description": `20% discount on luxury vacation rental in Jávea`,
        "priceSpecification": {
          "@type": "PriceSpecification",
          "price": discountedPrice,
          "priceCurrency": "EUR",
          "eligibleQuantity": {
            "@type": "QuantitativeValue",
            "minValue": 1,
            "unitText": "night"
          }
        },
        "validFrom": startDate,
        "validThrough": endDate,
        "availability": "https://schema.org/InStock"
      }
    });
    document.head.appendChild(newSchema);

  }, [discountInfo, language]);

  return null; // This component only manages SEO, no visual output
};

export default DiscountSEO;