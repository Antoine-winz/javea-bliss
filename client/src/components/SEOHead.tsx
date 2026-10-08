import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { getRouteSEO, isKnownPublicRoute, getPageStructuredData } from '@shared/seo';
import { useLanguage } from '@/contexts/LanguageContext';

const BASE_URL = 'https://javeabliss.com';
const LANGS = ['en', 'nl', 'fr', 'de', 'es', 'it'] as const;

interface SEOHeadProps {
  title?: string;
  description?: string;
  image?: string;
  canonicalPath?: string;
  noindex?: boolean;
}

const SEOHead = ({
  title,
  description,
  image = '/og-hero.jpg',
  canonicalPath,
  noindex = false,
}: SEOHeadProps) => {
  const { language } = useLanguage();
  // Reconcile metadata after SPA navigation using the same source as server HTML.
  const [location] = useLocation();
  const routeSEO = getRouteSEO(location);
  const shouldNoindex = noindex || routeSEO?.noindex || !isKnownPublicRoute(location);

  const fallbackSEO = getRouteSEO(`/${language}/`)!;
  const currentSEO = routeSEO || fallbackSEO;
  const effectiveTitle = title || currentSEO.title;
  const effectiveDescription = description || currentSEO.description;

  // Language-neutral path of the current page ('' for homepage), used for canonical + hreflang
  const pagePath = canonicalPath
    ? canonicalPath.replace(/^\/(en|nl|fr|de|es|it)(?=\/|$)/, '').replace(/\/$/, '')
    : location.replace(/^\/(en|nl|fr|de|es|it)(?=\/|$)/, '').replace(/\/$/, '');

  const urlForLang = (lang: string) => `${BASE_URL}/${lang}${pagePath}${pagePath ? '' : '/'}`;
  const canonicalUrl = routeSEO?.canonical || urlForLang(language);

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
      shouldNoindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
    );
    updateMeta('description', effectiveDescription);
    updateMeta('theme-color', '#1e40af');
    document.querySelector('html')?.setAttribute('lang', currentSEO.lang);

    updateMeta('geo.region', 'ES-VC');
    updateMeta('geo.placename', 'Jávea, Alicante, Spain');
    document.querySelectorAll('meta[name="geo.position"], meta[name="ICBM"]').forEach(meta => meta.remove());

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

    document.querySelectorAll('link[hreflang]').forEach(link => link.remove());
    const alternates = routeSEO?.hreflang ?? (shouldNoindex ? [] : [
      ...LANGS.map(lang => ({ lang, href: urlForLang(lang) })),
      { lang: 'x-default', href: pagePath ? `${BASE_URL}/en${pagePath}` : `${BASE_URL}/` },
    ]);
    alternates.forEach(({ lang, href }) => {
      const link = document.createElement('link');
      link.rel = 'alternate'; link.hreflang = lang; link.href = href;
      document.head.appendChild(link);
    });

    const schema = getPageStructuredData({
      ...currentSEO, canonical: canonicalUrl,
      title: effectiveTitle, description: effectiveDescription, noindex: shouldNoindex,
    });
    if (!schema) {
      document.querySelector('script[data-schema="main"]')?.remove();
      return;
    }

    let schemaScript = document.querySelector('script[data-schema="main"]') as HTMLScriptElement;
    if (!schemaScript) {
      schemaScript = document.createElement('script');
      schemaScript.type = 'application/ld+json';
      schemaScript.setAttribute('data-schema', 'main');
      document.head.appendChild(schemaScript);
    }
    schemaScript.textContent = JSON.stringify(schema);
  }, [language, location, canonicalUrl, shouldNoindex, effectiveTitle, effectiveDescription, image]);

  return null;
};

export default SEOHead;
