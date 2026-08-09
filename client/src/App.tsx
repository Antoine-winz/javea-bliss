import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { useEffect } from "react";
import { initGA } from "./lib/analytics";
import { useAnalytics } from "./hooks/use-analytics";

import { LanguageProvider, SUPPORTED_LANGUAGES } from "@/contexts/LanguageContext";
import ErrorBoundary from "@/components/ErrorBoundary";
import SEOHead from "@/components/SEOHead";
import StructuredData from "@/components/StructuredData";
import CountryTargetedSEO from "@/components/CountryTargetedSEO";
import DiscountSEO from "@/components/DiscountSEO";
import LastMinuteSEO from "@/components/LastMinuteSEO";

import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Admin from "@/pages/Admin";
import PromotionalOffer from "@/pages/PromotionalOffer";
import { SocialMedia } from "@/pages/SocialMedia";
import Recommendations from "@/pages/Recommendations";
import SEOLandingPage from "@/pages/SEOLandingPage";

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

function Router() {
  useAnalytics();
  
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
  // Initialize Google Analytics when app loads
  useEffect(() => {
    // Verify required environment variable is present
    if (import.meta.env.VITE_GA_MEASUREMENT_ID) {
      initGA();
    }
  }, []);

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <LanguageProvider>
          <SEOHead />
          <StructuredData />
          <CountryTargetedSEO />
          <DiscountSEO />
          <LastMinuteSEO />
          <Toaster />
          <Router />
        </LanguageProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
