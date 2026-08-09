import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { X, Clock, Tag } from "lucide-react";

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

const PromotionalHeader = () => {
  const { language, t } = useLanguage();
  const [isVisible, setIsVisible] = useState(true);
  const [timeLeft, setTimeLeft] = useState<string>("");

  const { data: promotionalOffers = [] } = useQuery({
    queryKey: ["/api/promotional-offers"],
    staleTime: 5 * 60 * 1000,
  });

  // Find active promotional offers
  const activeOffers = (promotionalOffers as PromotionalOffer[]).filter((offer: PromotionalOffer) => {
    if (!offer.isActive) return false;
    
    const now = new Date();
    const validUntil = new Date(offer.validUntil);
    return now <= validUntil;
  });

  // Get the best offer (highest discount percentage)
  const bestOffer = activeOffers.length > 0 ? activeOffers.reduce((best: PromotionalOffer, current: PromotionalOffer) => 
    current.discountPercentage > best.discountPercentage ? current : best
  ) : null;

  // Calculate countdown timer
  useEffect(() => {
    if (!bestOffer) return;
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const endTime = new Date(bestOffer.validUntil).getTime();
      const difference = endTime - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));

        if (days > 0) {
          setTimeLeft(`${days}d ${hours}h ${minutes}m`);
        } else if (hours > 0) {
          setTimeLeft(`${hours}h ${minutes}m`);
        } else {
          setTimeLeft(`${minutes}m`);
        }
      } else {
        setTimeLeft("Expired");
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 60000); // Update every minute

    return () => clearInterval(timer);
  }, [bestOffer?.validUntil]);

  // Don't render if no active offers or user closed banner
  if (activeOffers.length === 0 || !isVisible || !bestOffer) {
    return null;
  }
  


  // Multilingual content
  const content = {
    en: {
      limitedTime: "LIMITED TIME OFFER",
      save: "SAVE",
      was: "Was",
      now: "Now",
      perNight: "per night",
      endsIn: "Ends in",
      bookNow: "Book Now & Save",
      close: "Close"
    },
    es: {
      limitedTime: "OFERTA POR TIEMPO LIMITADO",
      save: "AHORRA",
      was: "Antes",
      now: "Ahora",
      perNight: "por noche",
      endsIn: "Termina en",
      bookNow: "Reservar y Ahorrar",
      close: "Cerrar"
    },
    fr: {
      limitedTime: "OFFRE À DURÉE LIMITÉE",
      save: "ÉCONOMISEZ",
      was: "Était",
      now: "Maintenant",
      perNight: "par nuit",
      endsIn: "Se termine dans",
      bookNow: "Réserver et Économiser",
      close: "Fermer"
    },
    nl: {
      limitedTime: "BEPERKTE TIJD AANBIEDING",
      save: "BESPAAR",
      was: "Was",
      now: "Nu",
      perNight: "per nacht",
      endsIn: "Eindigt over",
      bookNow: "Boek Nu & Bespaar",
      close: "Sluiten"
    },
    de: {
      limitedTime: "ZEITLICH BEGRENZTES ANGEBOT",
      save: "SPAREN",
      was: "War",
      now: "Jetzt",
      perNight: "pro Nacht",
      endsIn: "Endet in",
      bookNow: "Jetzt Buchen & Sparen",
      close: "Schließen"
    },
  };

  const texts = content[language as keyof typeof content] || content.en;

  const handleBookNow = () => {

    
    // Scroll to booking section and pre-select promotional dates
    const bookingSection = document.getElementById('booking-section') || document.getElementById('booking');

    
    if (bookingSection && bestOffer) {
      // Pre-select the promotional dates in the calendar
      const startDate = new Date(bestOffer.startDate);
      const endDate = new Date(bestOffer.endDate);
      

      
      // Create a custom event to notify the calendar component
      const event = new CustomEvent('selectPromotionalDates', {
        detail: {
          startDate: startDate.toISOString().split('T')[0],
          endDate: endDate.toISOString().split('T')[0],
          discountedPrice: bestOffer.discountedPrice,
          originalPrice: bestOffer.originalPrice,
          discountPercentage: bestOffer.discountPercentage
        }
      });
      window.dispatchEvent(event);
      
      // Scroll to the booking section
      const navHeight = 136; // Height of navigation + promotional header
      const elementPosition = bookingSection.offsetTop - navHeight;
      window.scrollTo({
        top: elementPosition,
        behavior: "smooth"
      });
    } else {

    }
  };

  return (
    <div className="bg-gradient-to-r from-red-600 to-red-700 text-white py-3 px-4 relative overflow-hidden z-50 w-full">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-red-800 opacity-10">
        <div className="absolute inset-0 opacity-20 bg-gradient-to-r from-red-700 to-red-800"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Desktop layout */}
        <div className="hidden md:flex items-center justify-between">
          {/* Left side - Promotion details */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Tag className="w-5 h-5 text-yellow-300" />
              <span className="text-sm font-medium text-yellow-300">
                {texts.limitedTime}
              </span>
            </div>
            
            <div className="flex items-center space-x-3">
              <span className="text-lg font-bold text-yellow-300">
                {texts.save} {bestOffer.discountPercentage}%
              </span>
              
              <div className="flex items-center space-x-2">
                <span className="text-sm text-red-200 line-through">
                  {texts.was} €{bestOffer.originalPrice}
                </span>
                <span className="text-lg font-bold text-white">
                  {texts.now} €{bestOffer.discountedPrice}
                </span>
                <span className="text-sm text-red-200">
                  {texts.perNight}
                </span>
              </div>
            </div>
          </div>

          {/* Center - Countdown timer */}
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-yellow-300" />
            <span className="text-sm font-medium">
              {texts.endsIn}: <span className="text-yellow-300 font-bold">{timeLeft}</span>
            </span>
          </div>

          {/* Right side - Action buttons */}
          <div className="flex items-center space-x-2">
            <Button
              onClick={handleBookNow}
              className="bg-yellow-400 hover:bg-yellow-500 text-red-800 font-bold px-6 py-2 rounded-full transition-all duration-200 transform hover:scale-105"
            >
              {texts.bookNow}
            </Button>
            
            <button
              onClick={() => setIsVisible(false)}
              className="p-2 hover:bg-red-600 rounded-full transition-colors"
              aria-label={texts.close}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile layout - entire banner clickable */}
        <div className="md:hidden relative">
          {/* Close button positioned absolutely */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsVisible(false);
            }}
            className="absolute top-0 right-0 p-2 hover:bg-red-600 rounded-full transition-colors z-20"
            aria-label={texts.close}
          >
            <X className="w-4 h-4" />
          </button>

          {/* Clickable banner content */}
          <div 
            onClick={handleBookNow}
            className="cursor-pointer hover:bg-red-600 transition-colors duration-200 p-2 rounded-lg pr-10"
          >
            <div className="flex flex-col space-y-2">
              {/* Top row - LIMITED TIME OFFER + SAVE */}
              <div className="flex items-center space-x-2">
                <Tag className="w-4 h-4 text-yellow-300" />
                <span className="text-xs font-medium text-yellow-300">
                  {texts.limitedTime}
                </span>
                <span className="text-lg font-bold text-yellow-300">
                  {texts.save} {bestOffer.discountPercentage}%
                </span>
              </div>
              
              {/* Middle row - Pricing */}
              <div className="flex items-center space-x-2">
                <span className="text-sm text-red-200 line-through">
                  {texts.was} €{bestOffer.originalPrice}
                </span>
                <span className="text-xl font-bold text-white">
                  {texts.now} €{bestOffer.discountedPrice}
                </span>
                <span className="text-sm text-red-200">
                  {texts.perNight}
                </span>
              </div>
              
              {/* Bottom row - Timer */}
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-yellow-300" />
                <span className="text-sm font-medium">
                  {texts.endsIn}: <span className="text-yellow-300 font-bold">{timeLeft}</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromotionalHeader;