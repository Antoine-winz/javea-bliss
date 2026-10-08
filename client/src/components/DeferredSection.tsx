import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

const Booking = lazy(() => import('./BookingSection'));
const Reviews = lazy(() => import('./TestimonialsSection'));

export default function DeferredSection({ kind }: { kind: 'booking' | 'reviews' }) {
  const { t } = useLanguage();
  const ref = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (!('IntersectionObserver' in window)) { setReady(true); return; }
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) { setReady(true); observer.disconnect(); }
    }, { rootMargin: '1200px' });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  const placeholder = (
    <div className={`section ${kind === 'booking' ? 'min-h-[60rem]' : 'min-h-[36rem]'}`} aria-busy="true">
      <div className="shell"><h2 className="display-lg">{t(kind === 'booking' ? 'booking.title' : 'testimonials.title')}</h2></div>
    </div>
  );
  return <div ref={ref} id={kind}><Suspense fallback={placeholder}>{ready ? kind === 'booking' ? <Booking /> : <Reviews /> : placeholder}</Suspense></div>;
}
