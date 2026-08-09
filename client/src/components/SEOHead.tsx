import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLanguage } from '@/contexts/LanguageContext';

const BASE_URL = 'https://javeabliss.com';
const LANGS = ['en', 'nl', 'fr', 'de', 'es', 'it'] as const;

interface PromotionalOffer {
  id: number;
  title: string;
  discountPercentage: number;
  originalPrice: number;
  discountedPrice: number;
  validUntil: string;
  isActive: boolean;
}

interface SEOHeadProps {
  title?: string;
  description?: string;
  image?: string;
  canonicalPath?: string;
  noindex?: boolean;
}

interface LangSEO {
  title: string;
  description: string;
  promoTitle: (pct: number) => string;
  promoDescription: (pct: number, price: number) => string;
  locale: string;
}

const SEOHead = ({
  title,
  description,
  image = '/og-hero.jpg',
  canonicalPath,
  noindex = false,
}: SEOHeadProps) => {
  const { language } = useLanguage();

  // Active promotional offer feeds a clean, factual title variant — no urgency spam
  const { data: promotionalOffers } = useQuery<PromotionalOffer[]>({
    queryKey: ['/api/promotional-offers'],
    staleTime: 5 * 60 * 1000,
  });

  const activeOffers = (promotionalOffers || []).filter(
    (o) => o.isActive && new Date(o.validUntil) >= new Date()
  );
  const bestOffer = activeOffers.length
    ? activeOffers.reduce((a, b) => (b.discountPercentage > a.discountPercentage ? b : a))
    : null;

  const seoContent: Record<string, LangSEO> = {
    en: {
      title: 'Javea Holiday Apartment near Arenal Beach | Book Direct',
      description:
        'Self-catering 2-bed apartment 250 m from Arenal Beach, Javea. Sleeps 4, air con, fast WiFi, lift & free parking. Book direct & save from €130/night. Winter stays welcome.',
      promoTitle: (pct) => `${pct}% Off – Holiday Apartment in Jávea near Arenal Beach`,
      promoDescription: (pct, price) =>
        `Save ${pct}% on our renovated 2-bedroom apartment 250 m from Arenal Beach, Jávea. Now from €${price}/night when you book direct.`,
      locale: 'en_GB',
    },
    nl: {
      title: 'Vakantieappartement Jávea – 250 m van het Arenal strand',
      description:
        'Gerenoveerd appartement voor 4 op 250 m van het Arenal strand, Jávea. Airco, snelle wifi, gratis parkeren. Boek direct bij de eigenaar – ook overwinteren.',
      promoTitle: (pct) => `${pct}% korting – Vakantieappartement Jávea bij het Arenal-strand`,
      promoDescription: (pct, price) =>
        `Nu ${pct}% korting op ons gerenoveerde appartement met 2 slaapkamers, 250 m van het Arenal-strand in Jávea. Vanaf €${price} per nacht bij directe boeking.`,
      locale: 'nl_NL',
    },
    fr: {
      title: 'Location appartement Jávea – Plage de l\'Arenal à 250 m',
      description:
        'Appartement rénové 2 chambres à 250 m de la plage de l\'Arenal à Jávea : climatisation, wifi rapide, parking gratuit. Réservez en direct, sans commission.',
      promoTitle: (pct) => `-${pct} % – Appartement de vacances à Jávea, plage de l'Arenal`,
      promoDescription: (pct, price) =>
        `Profitez de ${pct} % de réduction sur notre appartement rénové de 2 chambres, à 250 m de la plage de l'Arenal à Jávea. Dès ${price} €/nuit en réservation directe.`,
      locale: 'fr_FR',
    },
    de: {
      title: 'Ferienwohnung Jávea – 250 m zum Arenal-Strand | Javea Bliss',
      description:
        'Renovierte 2-Schlafzimmer-Ferienwohnung in Jávea, nur 250 m zum Arenal-Strand. Klimaanlage, WLAN, Parkplatz. Direkt vom Eigentümer buchen – auch Überwintern.',
      promoTitle: (pct) => `${pct} % Rabatt – Ferienwohnung in Jávea am Arenal-Strand`,
      promoDescription: (pct, price) =>
        `Sparen Sie ${pct} % auf unsere renovierte Ferienwohnung mit 2 Schlafzimmern, 250 m vom Arenal-Strand in Jávea. Ab ${price} €/Nacht bei Direktbuchung.`,
      locale: 'de_DE',
    },
    es: {
      title: 'Alquiler apartamento en Jávea a 250 m de la Playa del Arenal',
      description:
        'Apartamento reformado para 4 en Jávea, a 250 m del Arenal. Aire acondicionado, wifi rápido, parking gratis. Reserva directa sin comisiones desde 130 €/noche.',
      promoTitle: (pct) => `${pct}% de descuento – Apartamento en Jávea, Playa del Arenal`,
      promoDescription: (pct, price) =>
        `Ahorra un ${pct}% en nuestro apartamento reformado de 2 habitaciones a 250 m de la Playa del Arenal, Jávea. Desde ${price} €/noche reservando directo.`,
      locale: 'es_ES',
    },
    it: {
      title: 'Casa Vacanze a Jávea – Appartamento a 250 m dall\'Arenal',
      description:
        'Appartamento a Jávea per 4 persone, a 250 m dalla spiaggia dell\'Arenal: 2 camere, aria condizionata, WiFi, parcheggio. Prenota direttamente, senza commissioni.',
      promoTitle: (pct) => `${pct}% di sconto – Appartamento vacanze a Jávea, spiaggia Arenal`,
      promoDescription: (pct, price) =>
        `Risparmia il ${pct}% sul nostro appartamento ristrutturato con 2 camere, a 250 m dalla spiaggia dell'Arenal a Jávea. Da ${price} €/notte prenotando direttamente.`,
      locale: 'it_IT',
    },
  };

  const currentSEO = seoContent[language] || seoContent.en;

  // Explicit props win; otherwise an active offer produces a clean promo variant
  const effectiveTitle =
    title || (bestOffer ? currentSEO.promoTitle(bestOffer.discountPercentage) : currentSEO.title);
  const effectiveDescription =
    description ||
    (bestOffer
      ? currentSEO.promoDescription(bestOffer.discountPercentage, bestOffer.discountedPrice)
      : currentSEO.description);

  // Language-neutral path of the current page ('' for homepage), used for canonical + hreflang
  const pagePath = canonicalPath
    ? canonicalPath.replace(/^\/(en|nl|fr|de|es|it)(?=\/|$)/, '').replace(/\/$/, '')
    : '';

  const urlForLang = (lang: string) => `${BASE_URL}/${lang}${pagePath}${pagePath ? '' : '/'}`;
  const canonicalUrl = urlForLang(language);

  useEffect(() => {
    document.title = effectiveTitle;

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

    updateMeta(
      'robots',
      noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
    );
    updateMeta('description', effectiveDescription);
    updateMeta('theme-color', '#1e40af');
    document.querySelector('html')?.setAttribute('lang', language);

    updateMeta('geo.region', 'ES-VC');
    updateMeta('geo.placename', 'Jávea, Alicante, Spain');
    updateMeta('geo.position', '38.7892;0.1615');
    updateMeta('ICBM', '38.7892, 0.1615');

    updateMeta('og:title', effectiveTitle, true);
    updateMeta('og:description', effectiveDescription, true);
    updateMeta('og:image', `${BASE_URL}${image}`, true);
    updateMeta('og:url', canonicalUrl, true);
    updateMeta('og:type', 'website', true);
    updateMeta('og:locale', currentSEO.locale, true);
    updateMeta('og:site_name', 'Jávea Bliss', true);

    updateMeta('twitter:card', 'summary_large_image');
    updateMeta('twitter:title', effectiveTitle);
    updateMeta('twitter:description', effectiveDescription);
    updateMeta('twitter:image', `${BASE_URL}${image}`);

    // Self-referencing canonical
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = canonicalUrl;

    // hreflang alternates for the current page in every language
    LANGS.forEach((lang) => {
      let link = document.querySelector(`link[hreflang="${lang}"]`) as HTMLLinkElement;
      if (!link) {
        link = document.createElement('link');
        link.rel = 'alternate';
        link.setAttribute('hreflang', lang);
        document.head.appendChild(link);
      }
      link.href = urlForLang(lang);
    });

    let xDefault = document.querySelector('link[hreflang="x-default"]') as HTMLLinkElement;
    if (!xDefault) {
      xDefault = document.createElement('link');
      xDefault.rel = 'alternate';
      xDefault.setAttribute('hreflang', 'x-default');
      document.head.appendChild(xDefault);
    }
    xDefault.href = pagePath ? `${BASE_URL}/en${pagePath}` : `${BASE_URL}/`;

    // VacationRental structured data — factual amenities only, no self-awarded ratings
    const schema: Record<string, unknown> = {
      '@context': 'https://schema.org',
      '@type': ['LodgingBusiness', 'VacationRental'],
      name: 'Jávea Bliss',
      alternateName: 'Javea Bliss Arenal Beach Apartment',
      description:
        'Renovated 2-bedroom holiday apartment 250 m from Arenal Beach in Jávea (Xàbia), Costa Blanca, Spain. Sleeps up to 4 guests.',
      url: `${BASE_URL}/`,
      image: `${BASE_URL}/og-hero.jpg`,
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Jávea',
        addressRegion: 'Alicante',
        postalCode: '03730',
        addressCountry: 'ES',
        streetAddress: 'Marina Nou Fontana, Arenal Beach area',
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
        { '@type': 'LocationFeatureSpecification', name: 'High-speed Wi-Fi', value: true },
        { '@type': 'LocationFeatureSpecification', name: 'Fully Equipped Kitchen', value: true },
        { '@type': 'LocationFeatureSpecification', name: 'Terrace', value: true },
        { '@type': 'LocationFeatureSpecification', name: 'Lift / Elevator', value: true },
        { '@type': 'LocationFeatureSpecification', name: 'Free Parking', value: true },
        { '@type': 'LocationFeatureSpecification', name: 'Washing Machine', value: true },
      ],
      priceRange: '€100-€210',
    };

    if (bestOffer) {
      schema.makesOffer = {
        '@type': 'Offer',
        name: `${bestOffer.discountPercentage}% discount on direct bookings`,
        price: bestOffer.discountedPrice,
        priceCurrency: 'EUR',
        priceValidUntil: bestOffer.validUntil,
        availability: 'https://schema.org/InStock',
        url: `${BASE_URL}/`,
      };
    }

    let schemaScript = document.querySelector('script[data-schema="main"]') as HTMLScriptElement;
    if (!schemaScript) {
      schemaScript = document.createElement('script');
      schemaScript.type = 'application/ld+json';
      schemaScript.setAttribute('data-schema', 'main');
      document.head.appendChild(schemaScript);
    }
    schemaScript.textContent = JSON.stringify(schema);
  }, [language, canonicalUrl, noindex, effectiveTitle, effectiveDescription, image, bestOffer]);

  return null;
};

export default SEOHead;
