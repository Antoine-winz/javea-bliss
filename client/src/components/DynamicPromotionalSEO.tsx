import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/contexts/LanguageContext";
import { useEffect } from "react";

interface PromotionalOffer {
  id: number;
  title: string;
  description: string;
  discountPercentage: number;
  originalPrice: number;
  discountedPrice: number;
  startDate: string;
  endDate: string;
  validUntil: string;
  isActive: boolean;
}

const DynamicPromotionalSEO = () => {
  const { language } = useLanguage();
  
  const { data: promotionalOffers } = useQuery({
    queryKey: ["/api/promotional-offers"],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Find active promotional offers
  const activeOffers = (promotionalOffers as PromotionalOffer[] || []).filter((offer: PromotionalOffer) => {
    if (!offer.isActive) return false;
    
    const now = new Date();
    const validUntil = new Date(offer.validUntil);
    return now <= validUntil;
  }) || [];

  // Get the best offer (highest discount percentage)
  const bestOffer = activeOffers.length > 0 ? activeOffers.reduce((best: PromotionalOffer, current: PromotionalOffer) => 
    current.discountPercentage > best.discountPercentage ? current : best
  ) : null;

  // Calculate days remaining
  const daysRemaining = bestOffer ? Math.ceil((new Date(bestOffer.validUntil).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : 0;

  // Multilingual SEO content
  const seoContent = {
    en: {
      title: `🔥 ${bestOffer?.discountPercentage}% OFF Jávea Apartment - ${daysRemaining} Days Left!`,
      description: `Limited time offer! Save ${bestOffer?.discountPercentage}% on luxury coastal apartment in Jávea. From €${bestOffer?.discountedPrice}/night. Book now - offer expires in ${daysRemaining} days!`,
      keywords: `jávea discount ${bestOffer?.discountPercentage}%, costa blanca offer, spain apartment deal, arenal beach discount, last minute booking jávea, €${bestOffer?.discountedPrice} jávea, vacation rental promotion`,
    },
    it: {
      title: `🔥 ${bestOffer?.discountPercentage}% SCONTO Appartamento Jávea - ${daysRemaining} Giorni Rimasti!`,
      description: `Offerta a tempo limitato! Risparmia ${bestOffer?.discountPercentage}% su appartamento costiero di lusso a Jávea. Da €${bestOffer?.discountedPrice}/notte. Prenota ora - l'offerta scade tra ${daysRemaining} giorni!`,
      keywords: `jávea sconto ${bestOffer?.discountPercentage}%, offerta costa blanca, appartamento spagna offerta, spiaggia arenal sconto, prenotazione last minute jávea, €${bestOffer?.discountedPrice} jávea, promozione affitto vacanze`,
    },
    fr: {
      title: `🔥 ${bestOffer?.discountPercentage}% RÉDUCTION Appartement Jávea - ${daysRemaining} Jours Restants!`,
      description: `Offre à durée limitée ! Économisez ${bestOffer?.discountPercentage}% sur appartement côtier de luxe à Jávea. À partir de €${bestOffer?.discountedPrice}/nuit. Réservez maintenant - l'offre expire dans ${daysRemaining} jours !`,
      keywords: `jávea réduction ${bestOffer?.discountPercentage}%, offre costa blanca, appartement espagne promotion, plage arenal réduction, réservation dernière minute jávea, €${bestOffer?.discountedPrice} jávea, promotion location vacances`,
    },
    nl: {
      title: `🔥 ${bestOffer?.discountPercentage}% KORTING Jávea Appartement - ${daysRemaining} Dagen Over!`,
      description: `Beperkte tijd aanbieding! Bespaar ${bestOffer?.discountPercentage}% op luxe kustappartement in Jávea. Vanaf €${bestOffer?.discountedPrice}/nacht. Boek nu - aanbieding verloopt over ${daysRemaining} dagen!`,
      keywords: `jávea korting ${bestOffer?.discountPercentage}%, costa blanca aanbieding, spanje appartement deal, arenal strand korting, last minute booking jávea, €${bestOffer?.discountedPrice} jávea, vakantieverhuur promotie`,
    },
    de: {
      title: `🔥 ${bestOffer?.discountPercentage}% RABATT Jávea Apartment - ${daysRemaining} Tage Übrig!`,
      description: `Zeitlich begrenzte Angebot! Sparen Sie ${bestOffer?.discountPercentage}% auf Luxus-Küstenapartment in Jávea. Ab €${bestOffer?.discountedPrice}/Nacht. Jetzt buchen - Angebot läuft in ${daysRemaining} Tagen ab!`,
      keywords: `jávea rabatt ${bestOffer?.discountPercentage}%, costa blanca angebot, spanien apartment deal, arenal strand rabatt, last minute buchung jávea, €${bestOffer?.discountedPrice} jávea, ferienvermietung promotion`,
    },
  };

  const content = bestOffer ? (seoContent[language as keyof typeof seoContent] || seoContent.en) : null;

  useEffect(() => {
    if (!bestOffer || !content) return;
    // Update document title
    document.title = content.title;
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', content.description);
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = content.description;
      document.head.appendChild(meta);
    }
    
    // Update keywords
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      metaKeywords.setAttribute('content', content.keywords);
    } else {
      const meta = document.createElement('meta');
      meta.name = 'keywords';
      meta.content = content.keywords;
      document.head.appendChild(meta);
    }
    
    // Update Open Graph tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', content.title);
    } else {
      const meta = document.createElement('meta');
      meta.setAttribute('property', 'og:title');
      meta.content = content.title;
      document.head.appendChild(meta);
    }
    
    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) {
      ogDescription.setAttribute('content', content.description);
    } else {
      const meta = document.createElement('meta');
      meta.setAttribute('property', 'og:description');
      meta.content = content.description;
      document.head.appendChild(meta);
    }
    
    // Add structured data
    const existingScript = document.querySelector('script[type="application/ld+json"]');
    if (existingScript) {
      existingScript.remove();
    }
    
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Offer",
      "name": `Jávea Apartment - ${bestOffer?.discountPercentage}% Discount`,
      "description": content.description,
      "price": bestOffer?.discountedPrice,
      "priceCurrency": "EUR",
      "priceValidUntil": bestOffer?.validUntil,
      "availability": "https://schema.org/InStock",
      "validFrom": new Date().toISOString(),
      "validThrough": bestOffer?.validUntil,
      "seller": {
        "@type": "Organization",
        "name": "Jávea Bliss"
      },
      "itemOffered": {
        "@type": "Accommodation",
        "name": "Luxury Coastal Apartment Jávea",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Jávea",
          "addressCountry": "ES"
        }
      }
    });
    document.head.appendChild(script);
  }, [content, bestOffer]);

  // Don't render if no active offers
  if (!bestOffer) return null;

  return null;
};

export default DynamicPromotionalSEO;