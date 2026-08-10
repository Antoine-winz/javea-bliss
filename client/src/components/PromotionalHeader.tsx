import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/contexts/LanguageContext";
import { X } from "lucide-react";

interface PromotionalOffer {
  id: number;
  title: string;
  description: string;
  discountPercentage: number;
  originalPrice: number;
  discountedPrice: number;
  startDate: string;
  endDate: string;
  validUntil: string;
  isActive: boolean;
}

const BAR_HEIGHT = '44px';

const PromotionalHeader = () => {
  const { language } = useLanguage();
  const [isVisible, setIsVisible] = useState(true);
  const [timeLeft, setTimeLeft] = useState<string>("");

  const { data: promotionalOffers = [] } = useQuery({
    queryKey: ["/api/promotional-offers"],
    staleTime: 5 * 60 * 1000,
  });

  const activeOffers = (promotionalOffers as PromotionalOffer[]).filter((offer) => {
    if (!offer.isActive) return false;
    return new Date() <= new Date(offer.validUntil);
  });

  const bestOffer = activeOffers.length > 0
    ? activeOffers.reduce((best, current) =>
        current.discountPercentage > best.discountPercentage ? current : best)
    : null;

  const showing = Boolean(bestOffer) && isVisible;

  // The nav is fixed; tell it how far down to sit so the two never overlap.
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--promo-h', showing ? BAR_HEIGHT : '0px');
    return () => root.style.setProperty('--promo-h', '0px');
  }, [showing]);

  useEffect(() => {
    if (!bestOffer) return;
    const calculateTimeLeft = () => {
      const difference = new Date(bestOffer.validUntil).getTime() - Date.now();
      if (difference <= 0) return setTimeLeft("");
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      setTimeLeft(days > 0 ? `${days}d ${hours}h` : hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`);
    };
    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 60000);
    return () => clearInterval(timer);
  }, [bestOffer?.validUntil]);

  if (!showing || !bestOffer) return null;

  const content = {
    en: { save: 'Save', perNight: 'a night', endsIn: 'ends in', book: 'Book', close: 'Close' },
    nl: { save: 'Bespaar', perNight: 'per nacht', endsIn: 'eindigt over', book: 'Boeken', close: 'Sluiten' },
    fr: { save: 'Économisez', perNight: 'la nuit', endsIn: 'se termine dans', book: 'Réserver', close: 'Fermer' },
    de: { save: 'Sparen Sie', perNight: 'pro Nacht', endsIn: 'endet in', book: 'Buchen', close: 'Schließen' },
    es: { save: 'Ahorra', perNight: 'la noche', endsIn: 'termina en', book: 'Reservar', close: 'Cerrar' },
    it: { save: 'Risparmia', perNight: 'a notte', endsIn: 'termina tra', book: 'Prenota', close: 'Chiudi' },
  };
  const texts = content[language as keyof typeof content] || content.en;

  const handleBookNow = () => {
    const el = document.getElementById('booking') || document.getElementById('booking-section');
    if (el) window.scrollTo({ top: el.offsetTop - 80, behavior: 'smooth' });
  };

  return (
    <div
      className="fixed top-0 left-0 right-0 z-50 bg-ink text-bone bar-drop"
      style={{ height: BAR_HEIGHT }}
      data-testid="promotional-header"
    >
      <div className="shell px-6 md:px-10 h-full flex items-center justify-center gap-x-4 gap-y-1 flex-wrap">
        <p className="font-sans text-[0.75rem] tracking-[0.1em] uppercase text-bone/90">
          <span className="text-brass">{texts.save} {bestOffer.discountPercentage}%</span>
          <span className="mx-2 text-bone/30">·</span>
          €{bestOffer.discountedPrice} {texts.perNight}
          {timeLeft && (
            <>
              <span className="mx-2 text-bone/30">·</span>
              <span className="text-bone/60">{texts.endsIn} {timeLeft}</span>
            </>
          )}
        </p>

        <button
          onClick={handleBookNow}
          className="font-sans text-[0.75rem] tracking-[0.1em] uppercase text-bone underline underline-offset-4 decoration-bone/40 hover:decoration-bone transition"
        >
          {texts.book}
        </button>
      </div>

      <button
        onClick={() => setIsVisible(false)}
        aria-label={texts.close}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-bone/50 hover:text-bone transition p-1"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

export default PromotionalHeader;
