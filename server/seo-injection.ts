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

const locales: Record<Language, string> = {
  en: 'en_GB', nl: 'nl_NL', fr: 'fr_FR', de: 'de_DE', es: 'es_ES', it: 'it_IT',
};

const recommendationsTitles: Record<Language, string> = {
  en: 'Best Restaurants Javea | Guide to La Bambula, Chabada & More',
  nl: 'Beste Restaurants Javea | Gids La Bambula, Chabada & Meer',
  fr: 'Meilleurs Restaurants Javea | Guide La Bambula, Chabada & Plus',
  de: 'Beste Restaurants Javea | Guide La Bambula, Chabada & Mehr',
  es: 'Mejores Restaurantes Javea | Guía La Bambula, Chabada y Más',
  it: 'Migliori Ristoranti Javea | Guida La Bambula, Chabada e Altro',
};

const recommendationsDescriptions: Record<Language, string> = {
  en: "Insider guide to Javea's best restaurants: La Bambula, La Siesta, Chabada. Stay at Javea Bliss, the luxury apartment within walking distance of them all.",
  nl: "Insider gids voor Javea's beste restaurants: La Bambula, La Siesta, Chabada. Verblijf in Javea Bliss, luxe appartement op loopafstand van alles.",
  fr: "Guide insider des meilleurs restaurants de Javea: La Bambula, La Siesta, Chabada. Séjournez à Javea Bliss, appartement de luxe à distance de marche.",
  de: "Insider-Guide zu Javeas besten Restaurants: La Bambula, La Siesta, Chabada. Übernachten Sie in Javea Bliss, Luxus-Apartment in Gehweite.",
  es: "Guía insider de los mejores restaurantes de Javea: La Bambula, La Siesta, Chabada. Alójate en Javea Bliss, apartamento de lujo a poca distancia de todos.",
  it: "Guida insider ai migliori ristoranti di Javea: La Bambula, La Siesta, Chabada. Soggiorna a Javea Bliss, appartamento di lusso a pochi passi da tutto.",
};

const seoLandingPages: Record<string, { title: string; description: string }> = {
  'holiday-apartment-javea-arenal-beach': {
    title: 'Holiday Apartment in Javea near Arenal Beach | Jávea Bliss',
    description: 'Book a renovated 2-bedroom holiday apartment 250 m from Arenal Beach in Jávea. Sleeps 4, air conditioning, Wi-Fi, balcony, lift, free parking. Direct booking from €130/night.',
  },
  '2-bedroom-apartment-javea': {
    title: '2-Bedroom Apartment in Javea | Jávea Bliss — Sleeps 4 Guests',
    description: 'Spacious 2-bedroom holiday apartment in Jávea (Xàbia) with air conditioning, Wi-Fi, kitchen, balcony and lift. 250 m from Arenal Beach. Direct booking from €130/night.',
  },
  'where-to-stay-in-javea': {
    title: 'Where to Stay in Javea — The Arenal Neighbourhood Guide | Jávea Bliss',
    description: "Planning where to stay in Javea? Discover why the Arenal Beach neighbourhood is the best base for your holiday — walkable, vibrant, and 250 m from the sea.",
  },
  'javea-arenal-beach-guide': {
    title: 'Javea Arenal Beach — Complete Visitor Guide | Jávea Bliss',
    description: 'Everything you need to know about Arenal Beach in Javea: facilities, beach bars, parking, best time to visit, and nearby restaurants. Stay 250 m away at Jávea Bliss.',
  },
  'winter-rental-javea': {
    title: 'Winter Rental in Javea — Long-Stay Apartments from €100/Night | Jávea Bliss',
    description: 'Escape winter with a long-stay rental in Javea. Jávea Bliss offers monthly rates for 35+ night stays from €100/night. Mild climate, 300+ sunny days, 250 m from Arenal Beach.',
  },
  'javea-without-car': {
    title: 'Javea Without a Car — What You Can Do on Foot | Jávea Bliss',
    description: "Wondering if you need a car in Javea? Discover everything within walking distance of Arenal Beach — restaurants, supermarkets, beaches, and more. Stay car-free at Jávea Bliss.",
  },
  'restaurants-near-arenal-beach-javea': {
    title: 'Best Restaurants Near Arenal Beach Javea | Jávea Bliss Guide',
    description: 'Discover the best restaurants near Arenal Beach in Javea — La Bambula, Chabada, Masena, and more. All within walking distance of our holiday apartment.',
  },
  'best-beaches-near-javea-apartment': {
    title: 'Best Beaches Near Javea — Day Trips from Our Apartment | Jávea Bliss',
    description: 'Explore the best beaches near Javea: Arenal, Cala Granadella, La Barraca, and more. Base yourself at Jávea Bliss, 250 m from Arenal Beach.',
  },
  'javea-3-day-itinerary': {
    title: 'Javea 3-Day Itinerary — How to Spend a Long Weekend | Jávea Bliss',
    description: 'Plan the perfect 3-day trip to Javea with our itinerary: Arenal Beach, the Old Town, Cala Granadella, and top restaurants. Stay at Jávea Bliss from €130/night.',
  },
};

export function getRouteSEO(urlPath: string): RouteSEO | null {
  const cleanPath = urlPath.split('?')[0].split('#')[0];

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

export function injectSEOIntoHTML(html: string, seo: RouteSEO): string {
  const hreflangTags = seo.hreflang
    .map(h => `<link rel="alternate" hreflang="${h.lang}" href="${h.href}" />`)
    .join('\n    ');

  const ogImage = seo.ogImage || `${BASE_URL}/og-hero.jpg`;

  const headInjection = `
    <title>${escapeHtml(seo.title)}</title>
    <meta name="description" content="${escapeHtml(seo.description)}" />
    <link rel="canonical" href="${seo.canonical}" />
    <meta property="og:title" content="${escapeHtml(seo.title)}" />
    <meta property="og:description" content="${escapeHtml(seo.description)}" />
    <meta property="og:url" content="${seo.canonical}" />
    <meta property="og:locale" content="${seo.locale}" />
    <meta property="og:image" content="${ogImage}" />
    <meta name="twitter:title" content="${escapeHtml(seo.title)}" />
    <meta name="twitter:description" content="${escapeHtml(seo.description)}" />
    ${hreflangTags}`;

  return html
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
      /(<link rel="alternate" hreflang="en"[^>]*>\s*\n?\s*<link rel="alternate" hreflang="fr"[^>]*>\s*\n?\s*<link rel="alternate" hreflang="es"[^>]*>\s*\n?\s*<link rel="alternate" hreflang="de"[^>]*>\s*\n?\s*<link rel="alternate" hreflang="nl"[^>]*>\s*\n?\s*<link rel="alternate" hreflang="it"[^>]*>\s*\n?\s*<link rel="alternate" hreflang="x-default"[^>]*>)/s,
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
