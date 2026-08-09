import { useLanguage } from '@/contexts/LanguageContext';

const StructuredData = () => {
  const { language, t } = useLanguage();

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "LodgingBusiness",
        "@id": "https://javeabliss.com#business",
        "name": "Jávea Bliss",
        "alternateName": "Javea Bliss Apartment Rental",
        "url": "https://javeabliss.com",
        "logo": "https://javeabliss.com/logo.png",
        "image": "https://javeabliss.com/og-hero.jpg",
        "description": language === 'en' ? "Luxury coastal apartment rental in Jávea, Spain with direct flights from UK. Walking distance to Arenal Beach with modern amenities and sea views. Perfect for British and European holidays." :
                      language === 'nl' ? "Luxe kustappartement verhuur in Jávea, Spanje met directe vluchten vanuit Nederland. Op loopafstand van Arenal Beach met moderne voorzieningen en zeezicht. Perfect voor Nederlandse vakanties." :
                      language === 'fr' ? "Location d'appartement côtier de luxe à Jávea, Espagne avec vols directs depuis la France. À distance de marche de la plage Arenal avec équipements modernes et vue mer. Parfait pour les vacances françaises." :
                      "Alquiler de apartamento costero de lujo en Jávea, España con fácil acceso desde toda España. A poca distancia de la Playa del Arenal con comodidades modernas y vistas al mar. Perfecto para turismo nacional.",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Jávea",
          "addressRegion": "Alicante",
          "addressCountry": "ES",
          "postalCode": "03730"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": 38.7851,
          "longitude": 0.1746
        },
        "telephone": "+34-XXX-XXX-XXX",
        "priceRange": "€130-€210",
        "currenciesAccepted": "EUR",
        "paymentAccepted": "Cash, Credit Card, Bank Transfer",
        "amenityFeature": [
          {
            "@type": "LocationFeatureSpecification",
            "name": "Free WiFi",
            "value": true
          },
          {
            "@type": "LocationFeatureSpecification", 
            "name": "Air Conditioning",
            "value": true
          },
          {
            "@type": "LocationFeatureSpecification",
            "name": "Full Kitchen",
            "value": true
          },
          {
            "@type": "LocationFeatureSpecification",
            "name": "Private Terrace",
            "value": true
          },
          {
            "@type": "LocationFeatureSpecification",
            "name": "Sea View",
            "value": true
          },
          {
            "@type": "LocationFeatureSpecification",
            "name": "Smart TV",
            "value": true
          },
          {
            "@type": "LocationFeatureSpecification",
            "name": "Washing Machine",
            "value": true
          }
        ],
        "starRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5"
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.9",
          "reviewCount": "47",
          "bestRating": "5"
        },
        "containsPlace": {
          "@type": "Accommodation",
          "name": "Marina Nou Fontana Apartment",
          "accommodationType": "Apartment",
          "floorSize": {
            "@type": "QuantitativeValue",
            "value": "85",
            "unitCode": "MTK"
          },
          "numberOfRooms": "3",
          "occupancy": {
            "@type": "QuantitativeValue",
            "maxValue": "4"
          }
        }
      },
      {
        "@type": "TouristDestination",
        "@id": "https://javeabliss.com#destination",
        "name": "Jávea (Xàbia)",
        "description": "Beautiful coastal town on Costa Blanca, Spain",
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": 38.7851,
          "longitude": 0.1746
        },
        "containedInPlace": {
          "@type": "AdministrativeArea",
          "name": "Costa Blanca",
          "containedInPlace": {
            "@type": "Country",
            "name": "Spain"
          }
        },
        "touristType": [
          "Beach lovers",
          "Families",
          "Couples",
          "Nature enthusiasts"
        ]
      },
      {
        "@type": "WebSite",
        "@id": "https://javeabliss.com#website",
        "url": "https://javeabliss.com",
        "name": "Jávea Bliss",
        "description": "Premium apartment rental in Jávea, Spain",
        "publisher": {
          "@id": "https://javeabliss.com#business"
        },
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://javeabliss.com/search?q={search_term_string}",
          "query-input": "required name=search_term_string"
        },
        "inLanguage": [
          {
            "@type": "Language",
            "name": "English",
            "alternateName": "en"
          },
          {
            "@type": "Language", 
            "name": "Dutch",
            "alternateName": "nl"
          },
          {
            "@type": "Language",
            "name": "French", 
            "alternateName": "fr"
          },
          {
            "@type": "Language",
            "name": "Spanish",
            "alternateName": "es"
          }
        ]
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://javeabliss.com#breadcrumbs",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://javeabliss.com"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Jávea Apartment Rental",
            "item": "https://javeabliss.com"
          }
        ]
      }
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
};

export default StructuredData;