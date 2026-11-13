import { RENTALS_ENABLED, salesRedirect } from './site-access';
import { saleInitialHTML } from "./sale-html";
const BASE_URL = 'https://javeabliss.com';

const SUPPORTED_LANGUAGES = ['en', 'nl', 'fr', 'it', 'de', 'es'] as const;
type Language = typeof SUPPORTED_LANGUAGES[number];

// The apartment is for sale, so the six sale pages are the only indexable
// pages. The rental titles, guide pages and LodgingBusiness markup were
// removed on 13.11.2026; `salesRedirect` sends their URLs to the sale page.
// Re-enabling rentals means writing their metadata again (see git history).

export interface RouteSEO {
  title: string;
  description: string;
  keywords?: string[];
  canonical: string;
  locale: string;
  lang: string;
  hreflang: Array<{ lang: string; href: string }>;
  ogImage?: string;
  noindex?: boolean;
}

export const saleTitles: Record<Language, string> = {
  "en": "Apartment for sale in Jávea/Xàbia, Arenal | Jávea Bliss",
  "fr": "Appartement à vendre à Jávea/Xàbia, Arenal | Jávea Bliss",
  "es": "Apartamento en venta en Jávea/Xàbia, Arenal | Jávea Bliss",
  "de": "Wohnung kaufen in Jávea/Xàbia, Arenal | Jávea Bliss",
  "nl": "Appartement te koop in Jávea/Xàbia, Arenal | Jávea Bliss",
  "it": "Appartamento in vendita a Jávea/Xàbia, Arenal | Jávea Bliss"
};

const saleDescriptions: Record<Language, string> = {
  en: 'Renovated apartment for sale in Jávea: 80 m², 2 bedrooms and balcony, about 250 m from Arenal Beach. A furnished second home. Request the brochure.',
  fr: 'Appartement rénové à vendre à Jávea : 80 m², 2 chambres et balcon, à env. 250 m de l’Arenal. Une résidence secondaire meublée. Demandez la brochure.',
  es: 'Apartamento reformado en venta en Jávea: 80 m², 2 dormitorios y balcón, a unos 250 m del Arenal. Segunda residencia amueblada. Solicite el folleto.',
  de: 'Renovierte Wohnung in Jávea kaufen: 80 m², 2 Schlafzimmer und Balkon, ca. 250 m zum Arenal-Strand. Möblierter Zweitwohnsitz. Broschüre anfordern.',
  nl: 'Gerenoveerd appartement te koop in Jávea: 80 m², 2 slaapkamers en balkon, ca. 250 m van Arenal. Instapklare tweede woning. Vraag de brochure aan.',
  it: 'Appartamento ristrutturato in vendita a Jávea: 80 m², 2 camere e balcone, a circa 250 m dall’Arenal. Seconda casa arredata. Richieda la brochure.'
};

export const saleKeywords: Record<Language, string[]> = {
  fr: ['appartement à vendre Jávea', 'appartement à vendre Xàbia', 'appartement Arenal', 'résidence secondaire Costa Blanca', 'appartement rénové meublé', 'appartement 2 chambres Jávea', 'vente directe propriétaire Jávea'],
  en: ['apartment for sale in Jávea', 'apartment for sale in Xàbia', 'Arenal Beach apartment for sale', 'second home Costa Blanca', 'renovated furnished apartment', '2 bedroom apartment Jávea', 'property for sale by owner Jávea'],
  es: ['apartamento en venta en Jávea', 'piso en venta en Xàbia', 'apartamento en el Arenal', 'segunda residencia Costa Blanca', 'apartamento reformado y amueblado', 'apartamento 2 dormitorios Jávea', 'venta directa propietario Jávea'],
  de: ['Wohnung kaufen Jávea', 'Wohnung kaufen Xàbia', 'Wohnung kaufen Arenal-Strand', 'Zweitwohnsitz Costa Blanca', 'renovierte möblierte Wohnung', 'Wohnung mit 2 Schlafzimmern Jávea', 'Wohnung von privat Jávea'],
  nl: ['appartement te koop in Jávea', 'appartement te koop in Xàbia', 'appartement Arenal-strand', 'tweede woning Costa Blanca', 'gerenoveerd gemeubileerd appartement', 'appartement 2 slaapkamers Jávea', 'appartement te koop van eigenaar Jávea'],
  it: ['appartamento in vendita a Jávea', 'appartamento in vendita a Xàbia', 'appartamento Arenal', 'seconda casa Costa Blanca', 'appartamento ristrutturato e arredato', 'appartamento 2 camere Jávea', 'vendita diretta proprietario Jávea'],
};

export const saleHreflang = [
  ...SUPPORTED_LANGUAGES.map(lang => ({ lang, href: `${BASE_URL}/${lang}/for-sale` })),
  ...Object.entries({ "en-GB": "en", "de-DE": "de", "nl-NL": "nl", "fr-FR": "fr", "it-IT": "it", "de-CH": "de", "fr-CH": "fr", "it-CH": "it" }).map(([lang, page]) => ({ lang, href: `${BASE_URL}/${page}/for-sale` })),
  { lang: "x-default", href: `${BASE_URL}/en/for-sale` },
];

const locales: Record<Language, string> = {
  en: 'en_GB', nl: 'nl_NL', fr: 'fr_FR', de: 'de_DE', es: 'es_ES', it: 'it_IT',
};

export function getRouteSEO(urlPath: string): RouteSEO | null {
  const originalPath = urlPath.split('?')[0].split('#')[0];
  const cleanPath = !RENTALS_ENABLED ? salesRedirect(originalPath) || originalPath : originalPath;

  const saleMatch = cleanPath.match(/^\/(?:(en|nl|fr|it|de|es)\/)?for-sale\/?$/);
  if (saleMatch) {
    const lang = (saleMatch[1] || 'en') as Language;
    return { title: saleTitles[lang], description: saleDescriptions[lang], keywords: saleKeywords[lang],
      canonical: `${BASE_URL}/${lang}/for-sale`, locale: locales[lang], lang,
      hreflang: saleHreflang, noindex: false };
  }

  if (/^\/(?:en\/|nl\/|fr\/|it\/|de\/|es\/)?privacy-policy\/?$/.test(cleanPath) || /^\/admin\/?$/.test(cleanPath)) {
    const lang = (cleanPath.match(/^\/(en|nl|fr|it|de|es)\//)?.[1] || 'en') as Language;
    return {
      title: cleanPath.includes('privacy-policy') ? ({ en: 'Privacy Policy', fr: 'Politique de confidentialité', es: 'Política de privacidad', de: 'Datenschutzerklärung', nl: 'Privacybeleid', it: 'Informativa sulla privacy' }[lang] + ' | Jávea Bliss') : cleanPath.includes('admin') ? 'Administration | Jávea Bliss' : 'Private Property Presentation | Jávea Bliss',
      description: 'Jávea Bliss private enquiries.',
      canonical: `${BASE_URL}${cleanPath.replace(/\/$/, '')}`,
      locale: locales[lang], lang, hreflang: [], noindex: true,
    };
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
  // Nothing else is indexable while the apartment is for sale, so no other
  // page carries structured data. LodgingBusiness markup in particular must
  // not come back: it told Google the apartment is a holiday rental.
  return null;
}

export function injectSEOIntoHTML(html: string, seo: RouteSEO): string {
  const hreflangTags = seo.hreflang
    .map(h => `<link rel="alternate" hreflang="${h.lang}" href="${h.href}" />`)
    .join('\n    ');



  const schema = getPageStructuredData(seo);
  const schemaTag = schema ? `<script type="application/ld+json" data-schema="main">${JSON.stringify(schema).replace(/</g, '\\u003c')}</script>` : '';
  const keywordTag = !seo.noindex && seo.keywords?.length ? `<meta name="keywords" content="${escapeHtml(seo.keywords.join(', '))}" />\n  ` : '';
  return html
    .replace('<div id="root"></div>', seo.canonical.endsWith("/for-sale") ? `<div id="root">${saleInitialHTML(seo.lang as Language)}</div>` : '<div id="root"></div>')
    .replace(/<script[^>]*data-schema="main"[^>]*>[\s\S]*?<\/script>/g, '')
    .replace(/<meta\b[^>]*name=["']keywords["'][^>]*>\s*/gi, '')
    .replace('</head>', `${keywordTag}${schemaTag}\n  </head>`)
    .replace(/<meta name="robots"[^>]*>/, `<meta name="robots" content="${seo.noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'}" />`)
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

  if (!RENTALS_ENABLED && salesRedirect(path)) return false;
  if (path === '/') return true;
  if (/^\/(?:en\/|nl\/|fr\/|it\/|de\/|es\/)?(?:for-sale|privacy-policy)\/?$/.test(path)) return true;
  if (/^\/admin\/?$/.test(path)) return true;

  return false;
}
