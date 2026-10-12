import { useEffect, useRef } from 'react';
import { useLocation } from 'wouter';
import { initGA, trackPageView } from '../lib/analytics';

export const useAnalytics = () => {
  const [location] = useLocation();
  const prevLocationRef = useRef<string | null>(null);
  
  useEffect(() => {
    initGA();
    if (location !== prevLocationRef.current) {
      trackPageView(location);
      // The first document load is already counted by the server middleware.
      if (prevLocationRef.current !== null && /^\/(es|en|fr|de|nl|it)(?:\/|$)/.test(location)) {
        void fetch('/api/visitor-navigation', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ path: location.split('?')[0] }), keepalive: true }).catch(() => {});
      }
      prevLocationRef.current = location;
    }
  }, [location]);
};