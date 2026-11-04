import { RENTALS_ENABLED, salesRedirect } from "@shared/site-access";
import { Switch, Route, Redirect, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { lazy, Suspense, useEffect } from "react";
import { ANALYTICS_CONSENT_KEY, syncAnalyticsConsent } from "./lib/analytics";
import { useAnalytics } from "./hooks/use-analytics";

import { LanguageProvider, SUPPORTED_LANGUAGES } from "@/contexts/LanguageContext";
import ErrorBoundary from "@/components/ErrorBoundary";
import SEOHead from "@/components/SEOHead";
import MotionProvider from "@/components/MotionProvider";

import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";

const Admin = lazy(() => import("@/pages/Admin"));
const PromotionalOffer = lazy(() => import("@/pages/PromotionalOffer"));
const SocialMedia = lazy(() => import("@/pages/SocialMedia").then(({ SocialMedia }) => ({ default: SocialMedia })));
const Recommendations = lazy(() => import("@/pages/Recommendations"));
const SEOLandingPage = lazy(() => import("@/pages/SEOLandingPage"));
const SalesAccess = lazy(() => import("@/pages/SalesAccess"));
const SalesPrivacy = lazy(() => import("@/pages/SalesPrivacy"));

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
];

function SalesOnlyFallback() {
  const [location] = useLocation();
  const destination = salesRedirect(location);
  return destination ? <Redirect to={destination} replace /> : <NotFound />;
}

function Router() {
  useAnalytics();
  if (!RENTALS_ENABLED) return (
    <Switch>
      <Route path="/:language/for-sale">
        {({ language }) => SUPPORTED_LANGUAGES.some(item => item === language) ? <SalesAccess /> : <NotFound />}
      </Route>
      {SUPPORTED_LANGUAGES.map(lang => <Route key={`${lang}-privacy`} path={`/${lang}/privacy-policy`} component={SalesPrivacy} />)}
      <Route path="/for-sale" component={SalesAccess} />
      <Route path="/privacy-policy" component={SalesPrivacy} />
      <Route path="/admin" component={Admin} />
      <Route component={SalesOnlyFallback} />
    </Switch>
  );
  
  return (
    <Switch>
      {/* Root redirects to language-prefixed URL via LanguageProvider */}
      <Route path="/" component={Home} />
      
      {/* Language-prefixed routes */}
      {SUPPORTED_LANGUAGES.map(lang => (
        <Route key={lang} path={`/${lang}/`} component={Home} />
      ))}
      {SUPPORTED_LANGUAGES.map(lang => (
        <Route key={`${lang}-recommendations`} path={`/${lang}/recommendations`} component={Recommendations} />
      ))}
      {SUPPORTED_LANGUAGES.map(lang => (
        <Route key={`${lang}-promo`} path={`/${lang}/promo/:id`} component={PromotionalOffer} />
      ))}
      {SUPPORTED_LANGUAGES.map(lang => (
        <Route key={`${lang}-promotional`} path={`/${lang}/promotional-offer/:id`} component={PromotionalOffer} />
      ))}
      {SUPPORTED_LANGUAGES.map(lang => (
        <Route key={`${lang}-social`} path={`/${lang}/social-media/:id`} component={SocialMedia} />
      ))}
      {SUPPORTED_LANGUAGES.map(lang => (
        <Route key={`${lang}-sale`} path={`/${lang}/for-sale`} component={SalesAccess} />
      ))}
      {SUPPORTED_LANGUAGES.map(lang => (
        <Route key={`${lang}-sale-privacy`} path={`/${lang}/privacy-policy`} component={SalesPrivacy} />
      ))}
      <Route path="/for-sale" component={SalesAccess} />
      <Route path="/privacy-policy" component={SalesPrivacy} />
      
      {/* SEO landing pages (English only) */}
      {SEO_SLUGS.map(slug => (
        <Route key={slug} path={`/en/${slug}/`}>
          {() => <SEOLandingPage slug={slug} />}
        </Route>
      ))}

      {/* Admin (no language prefix needed) */}
      <Route path="/admin" component={Admin} />
      
      {/* Legacy routes without language prefix */}
      <Route path="/promotional-offer/:id" component={PromotionalOffer} />
      <Route path="/promo/:id" component={PromotionalOffer} />
      <Route path="/social-media/:id" component={SocialMedia} />
      <Route path="/recommendations" component={Recommendations} />
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  useEffect(() => {
    syncAnalyticsConsent();
    const sync = (event: StorageEvent) => { if (event.key === ANALYTICS_CONSENT_KEY || event.key === null) syncAnalyticsConsent(); };
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <LanguageProvider>
          <SEOHead />
          <MotionProvider />
          <Toaster />
          <Suspense fallback={<div className="min-h-screen bg-bone" aria-busy="true" />}>
            <Router />
          </Suspense>
        </LanguageProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
