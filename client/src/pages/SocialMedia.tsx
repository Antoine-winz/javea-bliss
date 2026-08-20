import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { useState, useEffect } from "react";
import { Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "../assets/images/logo.png";
import { PromotionalOffer, calculateTimeLeft, getPromotionalTranslations } from "@/utils/promotionalUtils";
import { trackPromoInteraction } from "@/lib/analytics";

export function SocialMedia() {
  const params = useParams();
  const offerId = params.id;
  const [timeLeft, setTimeLeft] = useState<string>('');

  const { data: offer, isLoading, error } = useQuery<PromotionalOffer>({
    queryKey: [`/api/promotional-offers/${offerId}`],
    queryFn: async () => {
      const response = await fetch(`/api/promotional-offers/${offerId}`);
      if (!response.ok) throw new Error('Promotional offer not found');
      return response.json();
    },
    enabled: !!offerId,
  });

  useEffect(() => {
    if (!offer?.validUntil) return;

    const updateTimeLeft = () => {
      const timeLeftStr = calculateTimeLeft(offer.validUntil, offer.language);
      setTimeLeft(timeLeftStr);
    };

    updateTimeLeft();
    const timer = setInterval(updateTimeLeft, 1000); // Update every second

    return () => clearInterval(timer);
  }, [offer]);

  // Track social media promotional view
  useEffect(() => {
    if (offer) {
      const savings = offer.originalPrice - offer.discountedPrice;
      const percentage = Math.round((savings / offer.originalPrice) * 100);
      trackPromoInteraction('view', offer.title, `${percentage}% OFF`);
    }
  }, [offer]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading promotional offer...</p>
        </div>
      </div>
    );
  }

  if (error || !offer) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Offer Not Found</h2>
          <p className="text-gray-600">The promotional offer you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

  const getTranslations = () => {
    const savings = offer.originalPrice - offer.discountedPrice;
    return getPromotionalTranslations(offer.language, savings);

  };

  const translations = getTranslations();

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-md md:max-w-2xl lg:max-w-4xl xl:max-w-5xl mx-auto px-4 py-8">
          <div className="bg-white/95 backdrop-blur-sm shadow-2xl rounded-lg p-8 lg:p-12 xl:p-16">
          {/* Logo and Title */}
          <div className="text-center mb-6 lg:mb-8">
            <div className="flex items-center justify-center mb-4">
              <span className="font-montserrat font-bold text-3xl lg:text-4xl text-gray-800 mr-2">JÁVEA BLISS</span>
              <img 
                src={logo} 
                alt="Jávea Bliss Logo" 
                className="h-8 lg:h-10 w-auto"
              />
            </div>
            <p className="text-blue-600 text-lg lg:text-xl font-medium mb-2">{translations.affordableLuxury}</p>
            <p className="text-black font-bold text-lg lg:text-xl">
              🔥 {translations.limitedTime} 🔥
            </p>
            <div className="text-lg lg:text-xl text-gray-800 font-bold mt-1">
              {(() => {
                const startDate = new Date(offer.startDate);
                const endDate = new Date(offer.endDate);
                const formatDate = (date: Date) => {
                  const day = date.getDate().toString().padStart(2, '0');
                  const month = date.toLocaleDateString('en-US', { month: 'short' });
                  const year = date.getFullYear().toString().slice(-2);
                  return `${day}/${month}/${year}`;
                };
                
                const getPercentageText = () => {
                  const percentage = offer.discountPercentage;
                  switch (offer.language) {
                    case 'es': return `${percentage}% de descuento`;
                    case 'fr': return `${percentage}% de réduction`;
                    case 'nl': return `${percentage}% korting`;
                    case 'de': return `${percentage}% Rabatt`;
                    default: return `${percentage}% off`;
                  }
                };
                
                return `${formatDate(startDate)} → ${formatDate(endDate)} - ${getPercentageText()}`;
              })()}
            </div>
          </div>

          {/* Title and Description */}
          <div className="text-center mb-6 lg:mb-8">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-2">
              {offer.title}
            </h1>
            <p className="text-gray-600 text-sm lg:text-base mb-4">
              {offer.description}
            </p>
          </div>
          
          {/* Pricing Section */}
          <div className="flex justify-between items-center mb-6 lg:mb-8">
            <div className="text-center">
              <div className="text-sm lg:text-base text-gray-500 uppercase tracking-wide">{translations.was}</div>
              <div className="text-2xl lg:text-3xl font-bold text-gray-800 line-through">€{offer.originalPrice}</div>
              <div className="text-sm lg:text-base text-gray-500">{translations.perNight}</div>
            </div>
            <div className="text-center">
              <div className="text-sm lg:text-base text-green-600 uppercase tracking-wide font-bold">{translations.now}</div>
              <div className="text-3xl lg:text-4xl font-bold text-green-600">€{offer.discountedPrice}</div>
              <div className="text-sm lg:text-base text-gray-500">{translations.perNight}</div>
            </div>
            <div className="text-center">
              <div className="text-sm lg:text-base text-blue-600 uppercase tracking-wide font-bold">{translations.save}</div>
              <div className="text-2xl lg:text-3xl font-bold text-blue-600">€{offer.originalPrice - offer.discountedPrice}</div>
              <div className="text-sm lg:text-base text-gray-500">{translations.perNight}</div>
            </div>
          </div>

          {/* Countdown timer */}
          <div className="bg-gray-800 text-white rounded-xl p-4 lg:p-6 mb-6 lg:mb-8 text-center">
            <div className="flex items-center justify-center mb-2">
              <Clock className="w-4 h-4 lg:w-5 lg:h-5 mr-2" />
              <span className="text-sm lg:text-base font-medium">{translations.offerEndsIn}</span>
            </div>
            <div className="text-2xl lg:text-3xl font-bold">{timeLeft}</div>
          </div>

          {/* CTA Button */}
          <div className="text-center mb-6">
            <Button 
              size="lg" 
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-4 rounded-lg text-lg w-full min-h-[60px] flex items-center justify-center whitespace-normal text-center leading-tight"
              onClick={() => {
                // Track social media promotional click
                if (offer) {
                  const savings = offer.originalPrice - offer.discountedPrice;
                  const percentage = Math.round((savings / offer.originalPrice) * 100);
                  trackPromoInteraction('click', offer.title, `${percentage}% OFF`);
                }
                
                window.location.href = `/promo/${offer.id}#booking-section`;
              }}
            >
              <span className="flex items-center justify-center flex-wrap">
                {translations.reserveNow}
                <ArrowRight className="ml-2 w-5 h-5 flex-shrink-0" />
              </span>
            </Button>
          </div>

          {/* Additional Info */}
          <div className="space-y-2 text-sm text-gray-600 mb-6">
            <div className="flex items-center">
              <span>{translations.distanceFromBeach}</span>
            </div>
            <div className="flex items-center">
              <span>{translations.bedroomsBathrooms}</span>
            </div>
            <div className="flex items-center">
              <span>{translations.immediateBooking}</span>
            </div>
          </div>
          
          <div className="text-center">
            <p className="text-sm text-gray-500">
              {translations.secureBookingFooter}
            </p>
          </div>
          </div>
        </div>
      </div>

    </>
  );
}