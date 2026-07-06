import { useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

const BASE_URL = 'https://javeabliss.com';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  canonicalPath?: string;
  noindex?: boolean;
}

const SEOHead = ({
  title,
  description,
  keywords,
  image = '/og-hero.jpg',
  canonicalPath,
  noindex = false,
}: SEOHeadProps) => {
  const { language } = useLanguage();

  const seoContent: Record<string, { title: string; description: string; keywords: string; locale: string }> = {
    en: {
      title: title || '2-Bedroom Holiday Apartment in Javea near Arenal Beach | Jávea Bliss',
      description: description || 'Stay 250 m from Arenal Beach in Jávea. Renovated 2-bedroom holiday apartment for up to 4 guests with air conditioning, Wi-Fi, kitchen, balcony, lift and free parking.',
      keywords: keywords || 'holiday apartment Javea, Arenal Beach apartment, 2 bedroom apartment Javea, vacation rental Javea, Javea Bliss, Costa Blanca accommodation, Xabia apartment, where to stay Javea',
      locale: 'en_GB',
    },
    nl: {
      title: title || '2-Slaapkamer Vakantieappartement in Javea bij Arenal Beach | Jávea Bliss',
      description: description || 'Verblijf op 250 m van Arenal Beach in Jávea. Gerenoveerd 2-slaapkamer vakantieappartement voor maximaal 4 gasten met airco, wifi, keuken, balkon, lift en gratis parkeren.',
      keywords: keywords || 'vakantieappartement Javea, appartement Arenal Beach, Javea Bliss, Costa Blanca verblijf, overwinteren Javea, 2 slaapkamers Javea',
      locale: 'nl_NL',
    },
    fr: {
      title: title || 'Appartement de Vacances 2 Chambres à Javea près de la Plage Arenal | Jávea Bliss',
      description: description || 'Séjournez à 250 m de la plage Arenal à Jávea. Appartement rénové 2 chambres pour 4 personnes avec climatisation, Wi-Fi, cuisine, balcon, ascenseur et parking gratuit.',
      keywords: keywords || 'appartement vacances Javea, plage Arenal Javea, location Javea, Costa Blanca hébergement, Jávea Bliss, appartement 2 chambres Javea',
      locale: 'fr_FR',
    },
    de: {
      title: title || '2-Schlafzimmer Ferienwohnung in Javea nahe Arenal Beach | Jávea Bliss',
      description: description || 'Nur 250 m vom Arenal Strand in Jávea. Renovierte 2-Zimmer Ferienwohnung für bis zu 4 Gäste mit Klimaanlage, WLAN, Küche, Balkon, Aufzug und kostenlosem Parkplatz.',
      keywords: keywords || 'Ferienwohnung Javea, Arenal Strand Javea, Winterurlaub Javea, Überwintern Javea, Costa Blanca Unterkunft, 2 Zimmer Javea',
      locale: 'de_DE',
    },
    es: {
      title: title || 'Apartamento Vacacional 2 Habitaciones en Jávea cerca de Playa Arenal | Jávea Bliss',
      description: description || 'Alójate a 250 m de la Playa Arenal en Jávea. Apartamento renovado de 2 habitaciones para 4 personas con aire acondicionado, Wi-Fi, cocina, balcón, ascensor y parking gratuito.',
      keywords: keywords || 'apartamento vacacional Jávea, playa Arenal Jávea, alquiler Jávea, Costa Blanca alojamiento, Jávea Bliss, escapada Madrid Barcelona Valencia, 2 habitaciones Jávea',
      locale: 'es_ES',
    },
    it: {
      title: title || 'Appartamento Vacanze 2 Camere a Jávea vicino alla Spiaggia Arenal | Jávea Bliss',
      description: description || 'Soggiorna a 250 m dalla spiaggia Arenal a Jávea. Appartamento ristrutturato con 2 camere per 4 ospiti con aria condizionata, Wi-Fi, cucina, balcone, ascensore e parcheggio gratuito.',
      keywords: keywords || 'appartamento vacanze Jávea, spiaggia Arenal Jávea, affitto Jávea, Costa Blanca alloggio, Jávea Bliss, 2 camere Jávea',
      locale: 'it_IT',
    },
  };

  const currentSEO = seoContent[language] || seoContent.en;

  const langPaths: Record<string, string> = {
    en: `${BASE_URL}/en/`,
    nl: `${BASE_URL}/nl/`,
    fr: `${BASE_URL}/fr/`,
    de: `${BASE_URL}/de/`,
    es: `${BASE_URL}/es/`,
    it: `${BASE_URL}/it/`,
  };

  const canonicalUrl = canonicalPath
    ? `${BASE_URL}${canonicalPath}`
    : langPaths[language] || `${BASE_URL}/en/`;

  useEffect(() => {
    document.title = currentSEO.title;

    const updateMeta = (name: string, content: string, property = false) => {
      const attr = property ? 'property' : 'name';
      let meta = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement;
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attr, name);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    updateMeta('robots', noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
    updateMeta('description', currentSEO.description);
    updateMeta('keywords', currentSEO.keywords);
    updateMeta('author', 'Jávea Bliss');
    updateMeta('viewport', 'width=device-width, initial-scale=1.0');
    updateMeta('theme-color', '#1e40af');
    updateMeta('language', language.toUpperCase());
    document.querySelector('html')?.setAttribute('lang', language);

    updateMeta('geo.region', 'ES-VC');
    updateMeta('geo.placename', 'Jávea, Alicante, Spain');
    updateMeta('geo.position', '38.7892;0.1615');
    updateMeta('ICBM', '38.7892, 0.1615');

    updateMeta('og:title', currentSEO.title, true);
    updateMeta('og:description', currentSEO.description, true);
    updateMeta('og:image', `${BASE_URL}${image}`, true);
    updateMeta('og:url', canonicalUrl, true);
    updateMeta('og:type', 'website', true);
    updateMeta('og:locale', currentSEO.locale, true);
    updateMeta('og:site_name', 'Jávea Bliss', true);

    updateMeta('twitter:card', 'summary_large_image');
    updateMeta('twitter:title', currentSEO.title);
    updateMeta('twitter:description', currentSEO.description);
    updateMeta('twitter:image', `${BASE_URL}${image}`);

    // Self-referencing canonical
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = canonicalUrl;

    // hreflang alternates using subdirectory URLs
    const langs = ['en', 'nl', 'fr', 'de', 'es', 'it'];
    langs.forEach(lang => {
      let link = document.querySelector(`link[hreflang="${lang}"]`) as HTMLLinkElement;
      if (!link) {
        link = document.createElement('link');
        link.rel = 'alternate';
        link.setAttribute('hreflang', lang);
        document.head.appendChild(link);
      }
      link.href = langPaths[lang];
    });

    let xDefault = document.querySelector('link[hreflang="x-default"]') as HTMLLinkElement;
    if (!xDefault) {
      xDefault = document.createElement('link');
      xDefault.rel = 'alternate';
      xDefault.setAttribute('hreflang', 'x-default');
      document.head.appendChild(xDefault);
    }
    xDefault.href = `${BASE_URL}/`;

    // VacationRental / LodgingBusiness structured data
    const schema = {
      '@context': 'https://schema.org',
      '@type': ['LodgingBusiness', 'VacationRental'],
      name: 'Jávea Bliss',
      alternateName: 'Javea Bliss Arenal Beach Apartment',
      description: 'Renovated 2-bedroom holiday apartment 250 m from Arenal Beach in Jávea (Xàbia), Costa Blanca, Spain. Sleeps up to 4 guests.',
      url: `${BASE_URL}/`,
      image: `${BASE_URL}/og-hero.jpg`,
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Jávea',
        addressRegion: 'Alicante',
        addressCountry: 'ES',
        streetAddress: 'Arenal Beach area',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: 38.7892,
        longitude: 0.1615,
      },
      numberOfRooms: 2,
      occupancy: {
        '@type': 'QuantitativeValue',
        minValue: 1,
        maxValue: 4,
      },
      checkinTime: '16:00',
      checkoutTime: '12:00',
      petsAllowed: false,
      amenityFeature: [
        { '@type': 'LocationFeatureSpecification', name: 'Air Conditioning', value: true },
        { '@type': 'LocationFeatureSpecification', name: 'Wi-Fi', value: true },
        { '@type': 'LocationFeatureSpecification', name: 'Kitchen', value: true },
        { '@type': 'LocationFeatureSpecification', name: 'Balcony', value: true },
        { '@type': 'LocationFeatureSpecification', name: 'Lift / Elevator', value: true },
        { '@type': 'LocationFeatureSpecification', name: 'Free Parking', value: true },
        { '@type': 'LocationFeatureSpecification', name: '600 Mbps Fiber WiFi', value: true },
        { '@type': 'LocationFeatureSpecification', name: 'Sea View', value: true },
      ],
      tourismType: 'Beach holiday, Remote work, Winter rental',
      nearbyAttractions: [
        { '@type': 'TouristAttraction', name: 'Arenal Beach', distance: '250 m' },
        { '@type': 'Restaurant', name: 'La Bambula', distance: '250 m' },
        { '@type': 'Restaurant', name: 'Chabada', distance: '300 m' },
      ],
      priceRange: '€€',
      starRating: { '@type': 'Rating', ratingValue: '5' },
    };

    let schemaScript = document.querySelector('script[data-schema="main"]') as HTMLScriptElement;
    if (!schemaScript) {
      schemaScript = document.createElement('script');
      schemaScript.type = 'application/ld+json';
      schemaScript.setAttribute('data-schema', 'main');
      document.head.appendChild(schemaScript);
    }
    schemaScript.textContent = JSON.stringify(schema);

  }, [language, canonicalUrl, noindex, currentSEO, image]);

  return null;
};

export default SEOHead;
