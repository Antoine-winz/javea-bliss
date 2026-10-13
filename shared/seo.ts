import { saleInitialHTML } from "./sale-html";
const BASE_URL = 'https://javeabliss.com';

const SUPPORTED_LANGUAGES = ['en', 'nl', 'fr', 'it', 'de', 'es'] as const;
type Language = typeof SUPPORTED_LANGUAGES[number];

const SEO_SLUGS = [
  'holiday-apartment-javea-arenal-beach',
  '2-bedroom-apartment-javea',
  'where-to-stay-in-javea',
  'javea-arenal-beach-guide',
  'winter-rental-javea',
  'javea-without-car',
  'restaurants-near-arenal-beach-javea',
  'best-beaches-near-javea-apartment',
  'javea-3-day-itinerary',
] as const;

export interface RouteSEO {
  title: string;
  description: string;
  canonical: string;
  locale: string;
  lang: string;
  hreflang: Array<{ lang: string; href: string }>;
  ogImage?: string;
  noindex?: boolean;
}

const homepageHreflang = [
  ...SUPPORTED_LANGUAGES.map(l => ({ lang: l, href: `${BASE_URL}/${l}/` })),
  { lang: 'x-default', href: `${BASE_URL}/` },
];

const homepageTitles: Record<Language, string> = {
  en: 'Javea Holiday Apartment near Arenal Beach | Book Direct',
  nl: 'Vakantieappartement Jávea – 250 m van het Arenal strand',
  fr: 'Location appartement Jávea – Plage de l\'Arenal à 250 m',
  de: 'Ferienwohnung Jávea – 250 m zum Arenal-Strand | Javea Bliss',
  es: 'Alquiler apartamento en Jávea a 250 m de la Playa del Arenal',
  it: 'Casa Vacanze a Jávea – Appartamento a 250 m dall\'Arenal',
};

const homepageDescriptions: Record<Language, string> = {
  en: 'Self-catering 2-bed apartment 250 m from Arenal Beach, Javea. Sleeps 4, air con, fast WiFi, lift & free parking. Book direct & save from €130/night. Winter stays welcome.',
  nl: 'Gerenoveerd appartement voor 4 op 250 m van het Arenal strand, Jávea. Airco, snelle wifi, gratis parkeren. Boek direct bij de eigenaar – ook overwinteren.',
  fr: 'Appartement rénové 2 chambres à 250 m de la plage de l\'Arenal à Jávea : climatisation, wifi rapide, parking gratuit. Réservez en direct, sans commission.',
  de: 'Renovierte 2-Schlafzimmer-Ferienwohnung in Jávea, nur 250 m zum Arenal-Strand. Klimaanlage, WLAN, Parkplatz. Direkt vom Eigentümer buchen – auch Überwintern.',
  es: 'Apartamento reformado para 4 en Jávea, a 250 m del Arenal. Aire acondicionado, wifi rápido, parking gratis. Reserva directa sin comisiones desde 130 €/noche.',
  it: 'Appartamento a Jávea per 4 persone, a 250 m dalla spiaggia dell\'Arenal: 2 camere, aria condizionata, WiFi, parcheggio. Prenota direttamente, senza commissioni.',
};

export const saleTitles: Record<Language, string> = {
  "en": "Apartment for sale in Jávea/Xàbia, Arenal | Jávea Bliss",
  "fr": "Appartement à vendre à Jávea/Xàbia, Arenal | Jávea Bliss",
  "es": "Apartamento en venta en Jávea/Xàbia, Arenal | Jávea Bliss",
  "de": "Wohnung kaufen in Jávea/Xàbia, Arenal | Jávea Bliss",
  "nl": "Appartement te koop in Jávea/Xàbia, Arenal | Jávea Bliss",
  "it": "Appartamento in vendita a Jávea/Xàbia, Arenal | Jávea Bliss"
};

const saleDescriptions: Record<Language, string> = {
  "en": "Renovated 2-bedroom apartment for sale in Jávea, Costa Blanca. 80 m², balcony and lift, approx. 250 m from Arenal Beach. Arrange a viewing.",
  "fr": "Appartement rénové à vendre à Jávea, Costa Blanca : 80 m², 2 chambres, balcon et ascenseur, à env. 250 m de l’Arenal. Organisez une visite.",
  "es": "Apartamento reformado en venta en Jávea, Costa Blanca. 80 m², 2 dormitorios, balcón y ascensor, a unos 250 m del Arenal. Concierte una visita.",
  "de": "Renovierte Wohnung zum Kauf in Jávea, Costa Blanca: 80 m², 2 Schlafzimmer, Balkon und Aufzug, ca. 250 m zum Arenal-Strand. Besichtigung anfragen.",
  "nl": "Gerenoveerd appartement te koop in Jávea, Costa Blanca: 80 m², 2 slaapkamers, balkon en lift, ca. 250 m van het Arenal-strand. Plan een bezichtiging.",
  "it": "Appartamento ristrutturato in vendita a Jávea, Costa Blanca: 80 m², 2 camere, balcone e ascensore, a circa 250 m dall’Arenal. Prenota una visita."
};

export const saleHreflang = [
  ...SUPPORTED_LANGUAGES.map(lang => ({ lang, href: `${BASE_URL}/${lang}/for-sale` })),
  ...Object.entries({ "en-GB": "en", "de-DE": "de", "nl-NL": "nl", "fr-FR": "fr", "it-IT": "it", "de-CH": "de", "fr-CH": "fr", "it-CH": "it" }).map(([lang, page]) => ({ lang, href: `${BASE_URL}/${page}/for-sale` })),
  { lang: "x-default", href: `${BASE_URL}/en/for-sale` },
];

const locales: Record<Language, string> = {
  en: 'en_GB', nl: 'nl_NL', fr: 'fr_FR', de: 'de_DE', es: 'es_ES', it: 'it_IT',
};

const recommendationsTitles: Record<Language, string> = {
  en: 'Restaurants near Arenal Beach, Jávea | Jávea Bliss Guide',
  nl: 'Restaurants bij het Arenal-strand, Jávea | Jávea Bliss',
  fr: 'Restaurants près de la plage de l’Arenal, Jávea | Jávea Bliss',
  de: 'Restaurants am Arenal-Strand, Jávea | Jávea Bliss',
  es: 'Restaurantes cerca de la playa del Arenal, Jávea | Jávea Bliss',
  it: 'Ristoranti vicino alla spiaggia dell’Arenal, Jávea | Jávea Bliss',
};

const recommendationsDescriptions: Record<Language, string> = {
  en: 'Explore restaurants near Arenal Beach in Jávea: La Fontana, Posidonia, Ammos, Chabada, La Bambula and Bohemians, plus La Siesta farther along the coast.',
  nl: 'Ontdek restaurants bij het Arenal-strand in Jávea: La Fontana, Posidonia, Ammos, Chabada, La Bambula en Bohemians, plus La Siesta verder langs de kust.',
  fr: 'Découvrez les restaurants près de l’Arenal à Jávea : La Fontana, Posidonia, Ammos, Chabada, La Bambula et Bohemians, puis La Siesta plus loin sur la côte.',
  de: 'Restaurants am Arenal-Strand in Jávea: La Fontana, Posidonia, Ammos, Chabada, La Bambula und Bohemians sowie La Siesta weiter entlang der Küste.',
  es: 'Descubre restaurantes cerca del Arenal en Jávea: La Fontana, Posidonia, Ammos, Chabada, La Bambula y Bohemians, y La Siesta más lejos por la costa.',
  it: 'Scopri i ristoranti vicino all’Arenal a Jávea: La Fontana, Posidonia, Ammos, Chabada, La Bambula e Bohemians, e La Siesta più avanti lungo la costa.',
};

const seoLandingPages: Record<string, { title: string; description: string }> = {
  'holiday-apartment-javea-arenal-beach': {
    title: 'Holiday Apartment in Javea near Arenal Beach | Jávea Bliss',
    description: 'Book a renovated 2-bedroom holiday apartment 250 m from Arenal Beach in Jávea. Sleeps 4, air conditioning, Wi-Fi, balcony, lift, free parking. Direct booking from €130/night.',
  },
  '2-bedroom-apartment-javea': {
    title: '2-Bedroom Apartment in Javea | Jávea Bliss, Sleeps 4 Guests',
    description: 'Spacious 2-bedroom holiday apartment in Jávea (Xàbia) with air conditioning, Wi-Fi, kitchen, balcony and lift. 250 m from Arenal Beach. Direct booking from €130/night.',
  },
  'where-to-stay-in-javea': {
    title: 'Where to Stay in Javea, The Arenal Neighbourhood Guide | Jávea Bliss',
    description: "Planning where to stay in Javea? Discover why the Arenal Beach neighbourhood is the best base for your holiday, walkable, vibrant, and 250 m from the sea.",
  },
  'javea-arenal-beach-guide': {
    title: 'Javea Arenal Beach, Complete Visitor Guide | Jávea Bliss',
    description: 'Everything you need to know about Arenal Beach in Javea: facilities, beach bars, parking, best time to visit, and nearby restaurants. Stay 250 m away at Jávea Bliss.',
  },
  'winter-rental-javea': {
    title: 'Winter Rental in Javea, Long-Stay Apartments from €100/Night | Jávea Bliss',
    description: 'Escape winter with a long-stay rental in Javea. Jávea Bliss offers monthly rates for 35+ night stays from €100/night. A furnished apartment with heating and Wi-Fi, 250 m from Arenal Beach.',
  },
  'javea-without-car': {
    title: 'Javea Without a Car, What You Can Do on Foot | Jávea Bliss',
    description: "Wondering if you need a car in Javea? Discover everything within walking distance of Arenal Beach, restaurants, supermarkets, beaches, and more. Stay car-free at Jávea Bliss.",
  },
  'restaurants-near-arenal-beach-javea': {
    title: 'Best Restaurants Near Arenal Beach Javea | Jávea Bliss Guide',
    description: 'Discover the best restaurants near Arenal Beach in Javea, La Fontana, Posidonia, Chabada and more, with Mediterranean food near our Arenal apartment.',
  },
  'best-beaches-near-javea-apartment': {
    title: 'Best Beaches Near Javea, Day Trips from Our Apartment | Jávea Bliss',
    description: 'Explore the best beaches near Javea: Arenal, Cala Granadella, La Barraca, and more. Base yourself at Jávea Bliss, 250 m from Arenal Beach.',
  },
  'javea-3-day-itinerary': {
    title: 'Javea 3-Day Itinerary, How to Spend a Long Weekend | Jávea Bliss',
    description: 'Plan the perfect 3-day trip to Javea with our itinerary: Arenal Beach, the Old Town, Cala Granadella, and top restaurants. Stay at Jávea Bliss from €130/night.',
  },
};

export function getRouteSEO(urlPath: string): RouteSEO | null {
  const cleanPath = urlPath.split('?')[0].split('#')[0];

  const saleMatch = cleanPath.match(/^\/(?:(en|nl|fr|it|de|es)\/)?for-sale\/?$/);
  if (saleMatch) {
    const lang = (saleMatch[1] || 'en') as Language;
    return { title: saleTitles[lang], description: saleDescriptions[lang],
      canonical: `${BASE_URL}/${lang}/for-sale`, locale: locales[lang], lang,
      hreflang: saleHreflang, noindex: false };
  }

  if (/^\/(?:en\/|nl\/|fr\/|it\/|de\/|es\/)?privacy-policy\/?$/.test(cleanPath) || /^\/admin\/?$/.test(cleanPath)) {
    const lang = (cleanPath.match(/^\/(en|nl|fr|it|de|es)\//)?.[1] || 'en') as Language;
    return {
      title: cleanPath.includes('privacy-policy') ? 'Privacy Policy | Jávea Bliss' : cleanPath.includes('admin') ? 'Administration | Jávea Bliss' : 'Private Property Presentation | Jávea Bliss',
      description: 'Jávea Bliss private enquiries.',
      canonical: `${BASE_URL}${cleanPath.replace(/\/$/, '')}`,
      locale: locales[lang], lang, hreflang: [], noindex: true,
    };
  }
  if (cleanPath === '/') {
    return null;
  }

  const langHomeMatch = cleanPath.match(/^\/(en|nl|fr|it|de|es)\/?$/);
  if (langHomeMatch) {
    const lang = langHomeMatch[1] as Language;
    return {
      title: homepageTitles[lang],
      description: homepageDescriptions[lang],
      canonical: `${BASE_URL}/${lang}/`,
      locale: locales[lang],
      lang,
      hreflang: homepageHreflang,
      ogImage: `${BASE_URL}/og-hero.jpg`,
    };
  }

  const recommendationsMatch = cleanPath.match(/^\/(en|nl|fr|it|de|es)\/recommendations\/?$/);
  if (recommendationsMatch) {
    const lang = recommendationsMatch[1] as Language;
    const hreflang = [
      ...SUPPORTED_LANGUAGES.map(l => ({ lang: l, href: `${BASE_URL}/${l}/recommendations` })),
      { lang: 'x-default', href: `${BASE_URL}/en/recommendations` },
    ];
    return {
      title: recommendationsTitles[lang],
      description: recommendationsDescriptions[lang],
      canonical: `${BASE_URL}/${lang}/recommendations`,
      locale: locales[lang],
      lang,
      hreflang,
      ogImage: `${BASE_URL}/og-hero.jpg`,
    };
  }

  const seoLandingMatch = cleanPath.match(/^\/en\/([a-z0-9-]+)\/?$/);
  if (seoLandingMatch) {
    const slug = seoLandingMatch[1];
    const page = seoLandingPages[slug];
    if (page) {
      return {
        title: page.title,
        description: page.description,
        canonical: `${BASE_URL}/en/${slug}/`,
        locale: 'en_GB',
        lang: 'en',
        hreflang: [
          { lang: 'en', href: `${BASE_URL}/en/${slug}/` },
          { lang: 'x-default', href: `${BASE_URL}/en/${slug}/` },
        ],
        ogImage: `${BASE_URL}/og-hero.jpg`,
      };
    }
  }

  return null;
}

export function getPageStructuredData(seo: RouteSEO): Record<string, unknown> | null {
  if (seo.noindex) return null;
  if (seo.canonical.endsWith('/for-sale')) {
    return { '@context': 'https://schema.org', '@graph': [
      { '@type': 'Apartment', '@id': `${BASE_URL}/#sale-apartment`, name: 'Jávea Bliss',
        description: seo.description, numberOfBedrooms: 2, numberOfBathroomsTotal: 1,
        floorSize: { '@type': 'QuantitativeValue', value: 80, unitCode: 'MTK' }, floorLevel: '1',
        address: { '@type': 'PostalAddress', addressLocality: 'Jávea / Xàbia', addressRegion: 'Alicante', addressCountry: 'ES' },
        amenityFeature: ['Balcony', 'Lift', 'Air conditioning'].map(name => ({ '@type': 'LocationFeatureSpecification', name, value: true })) },
      { '@type': 'RealEstateListing', '@id': seo.canonical, url: seo.canonical,
        name: seo.title, description: seo.description, inLanguage: seo.lang,
        mainEntity: { '@id': `${BASE_URL}/#sale-apartment` },
        offers: { '@type': 'Offer',
          businessFunction: 'http://purl.org/goodrelations/v1#Sell', url: seo.canonical,
          itemOffered: { '@id': `${BASE_URL}/#sale-apartment` } } }
    ] };
  }
  const property = {
    '@type': 'LodgingBusiness',
    '@id': `${BASE_URL}/#property`,
    name: 'Jávea Bliss',
    url: `${BASE_URL}/`,
    image: `${BASE_URL}/og-hero.jpg`,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Jávea', addressRegion: 'Alicante', addressCountry: 'ES',
    },
    checkinTime: '16:00', checkoutTime: '13:00', petsAllowed: false,
    amenityFeature: [
      { '@type': 'LocationFeatureSpecification', name: 'Air conditioning', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Wi-Fi', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Kitchen', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Terrace', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Lift', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Free street parking', value: true },
    ],
  };
  const page = {
    '@type': 'WebPage', '@id': seo.canonical,
    url: seo.canonical, name: seo.title, description: seo.description,
    inLanguage: seo.lang, about: { '@id': `${BASE_URL}/#property` },
  };
  const graph: Record<string, unknown>[] = [property, page];
  if (seo.canonical.includes('/recommendations')) {
    const venues = [
      ['La Fontana', 'https://www.restaurantelafontana.es/'],
      ['Posidonia', 'https://www.restauranteposidonia.com/'],
      ['Ammos', 'https://ammos.es/'],
      ['La Bambula', 'https://labambula.es'],
      ['Chabada', 'https://chabadajavea.com'],
      ['La Siesta', 'https://siestajavea.com'],
      ['Bohemians', 'https://bohemiansjavea.com'],
    ];
    graph.push({
      '@type': 'ItemList', name: seo.title, description: seo.description,
      itemListElement: venues.map(([name, url], i) => ({ '@type': 'ListItem', position: i + 1, name, url })),
    });
  }
  return { '@context': 'https://schema.org', '@graph': graph };
}

export function injectSEOIntoHTML(html: string, seo: RouteSEO): string {
  const hreflangTags = seo.hreflang
    .map(h => `<link rel="alternate" hreflang="${h.lang}" href="${h.href}" />`)
    .join('\n    ');



  const schema = getPageStructuredData(seo);
  const schemaTag = schema ? `<script type="application/ld+json" data-schema="main">${JSON.stringify(schema).replace(/</g, '\\u003c')}</script>` : '';
  return html
    .replace('<div id="root"></div>', seo.canonical.endsWith("/for-sale") ? `<div id="root">${saleInitialHTML(seo.lang as Language)}</div>` : '<div id="root"></div>')
    .replace(/<script[^>]*data-schema="main"[^>]*>[\s\S]*?<\/script>/g, '')
    .replace('</head>', `${schemaTag}\n  </head>`)
    .replace(/<meta name="robots"[^>]*>/, `<meta name="robots" content="${seo.noindex ? 'noindex, nofollow' : 'index, follow'}" />`)
    .replace(/<html lang="[^"]*"/, `<html lang="${seo.lang}"`)
    .replace(
      /<title>[^<]*<\/title>/,
      `<title>${escapeHtml(seo.title)}</title>`,
    )
    .replace(
      /<meta name="description"[^>]*>/,
      `<meta name="description" content="${escapeHtml(seo.description)}" />`,
    )
    .replace(
      /<link rel="canonical"[^>]*>/,
      `<link rel="canonical" href="${seo.canonical}" />`,
    )
    .replace(
      /<meta property="og:title"[^>]*>/,
      `<meta property="og:title" content="${escapeHtml(seo.title)}" />`,
    )
    .replace(
      /<meta property="og:description"[^>]*>/,
      `<meta property="og:description" content="${escapeHtml(seo.description)}" />`,
    )
    .replace(
      /<meta property="og:url"[^>]*>/,
      `<meta property="og:url" content="${seo.canonical}" />`,
    )
    .replace(
      /<meta property="og:locale"[^>]*>/,
      `<meta property="og:locale" content="${seo.locale}" />`,
    )
    .replace(
      /<meta name="twitter:title"[^>]*>/,
      `<meta name="twitter:title" content="${escapeHtml(seo.title)}" />`,
    )
    .replace(
      /<meta name="twitter:description"[^>]*>/,
      `<meta name="twitter:description" content="${escapeHtml(seo.description)}" />`,
    )
    .replace(
      /(?:<link rel="alternate" hreflang="[^"]+"[^>]*>\s*)+/g,
      hreflangTags,
    );
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export function isKnownPublicRoute(urlPath: string): boolean {
  const path = urlPath.split('?')[0].split('#')[0];

  if (path === '/') return true;
  if (/^\/(?:en\/|nl\/|fr\/|it\/|de\/|es\/)?(?:for-sale|privacy-policy)\/?$/.test(path)) return true;

  if (/^\/(en|nl|fr|it|de|es)\/?$/.test(path)) return true;

  if (/^\/(en|nl|fr|it|de|es)\/recommendations\/?$/.test(path)) return true;

  if (/^\/(en|nl|fr|it|de|es)\/(promo|promotional-offer)\/[^/]+\/?$/.test(path)) return true;

  if (/^\/(en|nl|fr|it|de|es)\/social-media\/[^/]+\/?$/.test(path)) return true;

  const seoLandingMatch = path.match(/^\/en\/([a-z0-9-]+)\/?$/);
  if (seoLandingMatch && SEO_SLUGS.includes(seoLandingMatch[1] as any)) return true;

  if (/^\/admin\/?$/.test(path)) return true;

  if (/^\/(promotional-offer|promo)\/[^/]+\/?$/.test(path)) return true;
  if (/^\/social-media\/[^/]+\/?$/.test(path)) return true;
  if (/^\/recommendations\/?$/.test(path)) return true;

  return false;
}
