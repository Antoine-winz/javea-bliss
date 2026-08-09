import { useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

const CountryTargetedSEO = () => {
  const { language } = useLanguage();

  useEffect(() => {
    // Country-specific targeting based on language with detailed travel keywords
    const countryTargeting = {
      en: {
        countries: ['GB', 'IE', 'US', 'CA', 'AU'],
        currency: 'EUR',
        geo: 'EU',
        cities: 'London, Dublin, Manchester, Edinburgh, Birmingham',
        airlines: 'British Airways, easyJet, Ryanair, Jet2',
        airports: 'Heathrow, Gatwick, Manchester, Edinburgh, Dublin, GVA, ALC Alicante, VLC Valencia',
        keywords: 'UK direct flights Costa Blanca, British vacation rental Spain, English-speaking apartment Jávea, UK holiday rental Mediterranean'
      },
      nl: {
        countries: ['NL', 'BE'],
        currency: 'EUR', 
        geo: 'EU',
        cities: 'Amsterdam, Rotterdam, Brussels, Antwerp, Eindhoven',
        airlines: 'KLM, TUI fly, Transavia, Brussels Airlines, easyJet',
        airports: 'Schiphol, Brussels, Eindhoven, Rotterdam, GVA, ALC Alicante, VLC Valencia',
        keywords: 'Nederland directe vluchten Costa Blanca, Nederlandse vakantieverhuur Spanje, Nederlands appartement Jávea, Holland vakantie Mediterraan'
      },
      fr: {
        countries: ['FR', 'CH', 'BE'],
        currency: 'EUR',
        geo: 'EU', 
        cities: 'Paris, Lyon, Geneva, Zurich, Brussels, Marseille, Nice',
        airlines: 'Air France, easyJet, Swiss, Volotea',
        airports: 'Charles de Gaulle, Lyon, Geneva, Zurich, Marseille, GVA, ALC Alicante, VLC Valencia',
        keywords: 'France vols directs Costa Blanca, location vacances français Espagne, appartement français Jávea, Suisse vacances Méditerranée'
      },
      es: {
        countries: ['ES'],
        currency: 'EUR',
        geo: 'EU',
        cities: 'Madrid, Barcelona, Valencia, Sevilla, Bilbao, Alicante',
        airlines: 'Iberia, Vueling, Air Europa, Renfe AVE, easyJet',
        airports: 'Madrid Barajas, Barcelona El Prat, Valencia, Alicante, GVA, ALC Alicante, VLC Valencia',
        keywords: 'España alquiler vacacional nacional, apartamento español Jávea, turismo nacional Costa Blanca, vacaciones españoles Mediterráneo'
      },
      de: {
        countries: ['DE', 'AT', 'CH'],
        currency: 'EUR',
        geo: 'EU',
        cities: 'Berlin, Munich, Frankfurt, Hamburg, Vienna, Zurich',
        airlines: 'Lufthansa, easyJet, Eurowings, Austrian Airlines, Swiss',
        airports: 'Frankfurt, Munich, Berlin, Hamburg, Vienna, Zurich, GVA, ALC Alicante, VLC Valencia',
        keywords: 'Deutschland Direktflüge Costa Blanca, deutsche Ferienvermietung Spanien, deutsches Apartment Jávea, Deutschland Urlaub Mittelmeer'
      }
    };

    const targeting = countryTargeting[language] || countryTargeting.en;

    // Set geo-targeting meta tags
    const updateMetaTag = (name: string, content: string) => {
      let meta = document.querySelector(`meta[name="${name}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('name', name);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    // Geographic targeting
    updateMetaTag('geo.region', 'ES-V'); // Valencia, Spain
    updateMetaTag('geo.placename', 'Jávea, Costa Blanca, Spain');
    updateMetaTag('geo.position', '38.7851;0.1746');
    updateMetaTag('ICBM', '38.7851, 0.1746');

    // Target countries and cities
    updateMetaTag('target-countries', targeting.countries.join(', '));
    updateMetaTag('target-cities', targeting.cities);
    updateMetaTag('currency', targeting.currency);

    // Travel and flight information
    updateMetaTag('travel.destination', 'Jávea, Costa Blanca, Spain');
    updateMetaTag('travel.accommodation-type', 'Vacation Rental Apartment');
    updateMetaTag('travel.price-range', '€130-€210 per night');
    updateMetaTag('travel.amenities', 'Beach Access, WiFi, Parking, Kitchen, AC');
    updateMetaTag('travel.location-benefits', 'Walking Distance to Beach, Restaurants, Shops');
    updateMetaTag('travel.airlines', targeting.airlines);
    updateMetaTag('travel.airports', targeting.airports);
    updateMetaTag('travel.keywords', targeting.keywords);

    // Additional region-specific SEO tags
    updateMetaTag('region-specific-keywords', targeting.keywords);
    updateMetaTag('flight-accessibility', targeting.airports);
    updateMetaTag('airline-partners', targeting.airlines);

    // Local business targeting
    updateMetaTag('business.type', 'Vacation Rental');
    updateMetaTag('business.category', 'Hospitality, Tourism, Accommodation');
    updateMetaTag('business.service-area', 'International Tourism, European Visitors');

    // SEO-friendly additional tags
    updateMetaTag('content-language', language);
    updateMetaTag('distribution', 'Global');
    updateMetaTag('rating', 'General');
    updateMetaTag('revisit-after', '7 days');

  }, [language]);

  return null;
};

export default CountryTargetedSEO;