import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';

interface LastMinuteOffer {
  id: string;
  title: string;
  description: string;
  availableDates: string[];
  discountPercentage: number;
  originalPrice: number;
  discountedPrice: number;
  validUntil: string;
  isLastMinute: boolean;
  isActive: boolean;
}

export default function LastMinuteSEO() {
  const [lastMinuteOffer, setLastMinuteOffer] = useState<LastMinuteOffer | null>(null);

  useEffect(() => {
    const fetchLastMinuteOffer = async () => {
      try {
        const response = await fetch('/api/last-minute-offers');
        if (response.ok) {
          const offer = await response.json();
          if (offer.isActive) {
            setLastMinuteOffer(offer);
          }
        }
      } catch (error) {

      }
    };

    fetchLastMinuteOffer();
    
    // Refresh every hour to keep offers current
    const interval = setInterval(fetchLastMinuteOffer, 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (!lastMinuteOffer || !lastMinuteOffer.isActive) {
    return null;
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const structuredData = {
    "@context": "https://schema.org/",
    "@type": "Offer",
    "name": lastMinuteOffer.title,
    "description": lastMinuteOffer.description,
    "price": lastMinuteOffer.discountedPrice.toString(),
    "priceCurrency": "EUR",
    "priceSpecification": {
      "@type": "PriceSpecification",
      "price": lastMinuteOffer.discountedPrice,
      "priceCurrency": "EUR",
      "valueAddedTaxIncluded": true
    },
    "availabilityStarts": new Date().toISOString(),
    "availabilityEnds": lastMinuteOffer.validUntil,
    "itemOffered": {
      "@type": "LodgingBusiness",
      "name": "Jávea Bliss - Luxury Coastal Apartment",
      "description": "Luxury 2-bedroom apartment 300m from Javea Beach",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Jávea",
        "addressCountry": "Spain"
      }
    },
    "category": "Last Minute Booking",
    "discount": `${lastMinuteOffer.discountPercentage}%`,
    "seller": {
      "@type": "Organization",
      "name": "Jávea Bliss"
    }
  };

  const availableDatesList = lastMinuteOffer.availableDates
    .map(formatDate)
    .join(', ');

  return (
    <Helmet>
      {/* Primary SEO Tags */}
      <title>{`Last Minute Deal! 20% OFF Jávea Beach Apartment - ${lastMinuteOffer.availableDates.length} Days Available`}</title>
      <meta name="description" content={`URGENT: Last minute booking discount! Save 20% on luxury beachfront apartment in Jávea. Available dates: ${availableDatesList}. Book now €${lastMinuteOffer.discountedPrice}/night (was €${lastMinuteOffer.originalPrice}).`} />
      
      {/* Open Graph Tags */}
      <meta property="og:title" content={`🚨 LAST MINUTE: ${lastMinuteOffer.discountPercentage}% OFF Jávea Beach Apartment!`} />
      <meta property="og:description" content={`Save €${lastMinuteOffer.originalPrice - lastMinuteOffer.discountedPrice}/night! ${lastMinuteOffer.availableDates.length} available dates in next 7 days. Premium location 300m from beach.`} />
      <meta property="og:type" content="product" />
      <meta property="product:price:amount" content={lastMinuteOffer.discountedPrice.toString()} />
      <meta property="product:price:currency" content="EUR" />
      
      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={`⏰ LAST MINUTE: Save ${lastMinuteOffer.discountPercentage}% in Jávea!`} />
      <meta name="twitter:description" content={`${lastMinuteOffer.availableDates.length} available dates! €${lastMinuteOffer.discountedPrice}/night. Beach apartment in Spain.`} />
      
      {/* Urgency and Scarcity Keywords */}
      <meta name="keywords" content={`last minute booking Jávea, urgent vacation rental Spain, immediate availability beach apartment, ${formatDate(lastMinuteOffer.availableDates[0])}, discount accommodation Costa Blanca, same week booking Javea, emergency accommodation Spain, last minute deal beach rental`} />
      
      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
      
      {/* Additional Meta Tags */}
      <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large" />
      <meta name="availability" content="InStock" />
      <meta name="price" content={`${lastMinuteOffer.discountedPrice} EUR`} />
      <meta name="discount" content={`${lastMinuteOffer.discountPercentage}%`} />
      <link rel="canonical" href={`${window.location.origin}/?lastMinute=true`} />
    </Helmet>
  );
}