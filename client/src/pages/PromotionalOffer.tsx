import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Clock, MapPin, Star, ArrowRight, Users, Waves, Heart, Wifi, Car, CheckCircle, Mail, Phone } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import SEOHead from "@/components/SEOHead";
import PromotionalCalendar from "@/components/PromotionalCalendar";
import DynamicPromotionalSEO from "@/components/DynamicPromotionalSEO";
import { useEffect, useState, useMemo } from "react";
import logo from "../assets/images/logo.png";
import javeaBeachImg from "@assets/Xabia_playa_la_Grava_7H9A3912_20171206.jpg";
import livingRoomImg from "@assets/Livingroom1_optimized.jpeg";
import bedroomImg from "@assets/Bedroom1_optimized.jpeg";
import bathroomImg from "@assets/Bathroom1_optimized.jpeg";
import { PromotionalOffer as PromotionalOfferType, calculateTimeLeft, getPromotionalTranslations, formatDate, getPercentageText } from "@/utils/promotionalUtils";
import { trackPromoInteraction } from "@/lib/analytics";

const PromotionalOffer = () => {
  const params = useParams();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [timeLeft, setTimeLeft] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    checkInDate: '',
    checkOutDate: '',
    numberOfGuests: '2',
    phoneNumber: '',
    additionalMessage: ''
  });
  
  const { data: offer, isLoading, error } = useQuery<PromotionalOfferType>({
    queryKey: [`/api/promotional-offers/${params.id}`],
    queryFn: async () => {
      const response = await fetch(`/api/promotional-offers/${params.id}`);
      if (!response.ok) throw new Error('Promotional offer not found');
      return response.json();
    },
    enabled: !!params.id,
  });

  // Optimized translations using shared utilities
  const translations = useMemo(() => {
    if (!offer) return {};
    const savings = offer.originalPrice - offer.discountedPrice;
    return getPromotionalTranslations(offer.language, savings);
  }, [offer]);

  // Optimized countdown timer
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

  // Track promotional offer view
  useEffect(() => {
    if (offer) {
      trackPromoInteraction('view', offer.title, `${getPercentageText(offer.originalPrice, offer.discountedPrice)} OFF`);
    }
  }, [offer]);

  useEffect(() => {
    if (offer) {
      const startDate = new Date(offer.startDate).toISOString().split('T')[0];
      const endDate = new Date(offer.endDate).toISOString().split('T')[0];
      
      setFormData(prev => ({
        ...prev,
        checkInDate: startDate,
        checkOutDate: endDate
      }));
    }
  }, [offer]);

  // Handle URL fragment scrolling to booking form and booking section
  useEffect(() => {
    const hash = window.location.hash;
    if (hash === '#booking-form') {
      setTimeout(() => {
        const element = document.getElementById('booking-form');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } else if (hash === '#booking-section') {
      setTimeout(() => {
        const element = document.getElementById('booking-section');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/promotional-bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          offerId: offer.id,
          offerTitle: offer.title,
          promotionalPrice: offer.discountedPrice
        }),
      });

      if (!response.ok) throw new Error('Failed to submit booking');

      toast({
        title: translations.bookingSubmitted || "Booking submitted successfully!",
        description: translations.bookingConfirmation || "We'll get back to you soon with confirmation details.",
      });

      // Reset form
      setFormData({
        fullName: '',
        email: '',
        checkInDate: formData.checkInDate,
        checkOutDate: formData.checkOutDate,
        numberOfGuests: '2',
        phoneNumber: '',
        additionalMessage: ''
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit booking. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading promotional offer...</p>
        </div>
      </div>
    );
  }

  if (error || !offer) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Promotional Offer Not Found</h1>
          <p className="text-gray-600 mb-8">The promotional offer you're looking for doesn't exist or has expired.</p>
          <Button onClick={() => window.location.href = '/'}>
            Return to Home Page
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEOHead 
        title="Holiday Apartment in Javea near Arenal Beach | Jávea Bliss"
        description="Stay 250 m from Arenal Beach in Jávea. Renovated 2-bedroom holiday apartment for up to 4 guests with air conditioning, Wi-Fi, kitchen, balcony, lift and free parking."
        noindex={true}
      />
      
      <div 
        className="min-h-screen bg-cover bg-center bg-fixed relative"
        style={{
          backgroundImage: `url(${javeaBeachImg})`
        }}
      >
        <div className="absolute inset-0 bg-black/20"></div>
        
        <div className="relative z-10 min-h-screen flex items-center justify-center p-0 sm:py-4 sm:px-4">
          <div className="w-screen sm:w-full sm:max-w-md md:max-w-2xl lg:max-w-4xl xl:max-w-5xl">
            <Card className="bg-white/95 backdrop-blur-sm shadow-2xl m-0 sm:mx-0 rounded-none sm:rounded-lg border-0 sm:border min-h-screen sm:min-h-0 w-screen sm:w-full">
              <CardContent className="p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12">
                {/* Logo and Title */}
                <div className="text-center mb-4 sm:mb-6">
                  <div className="flex items-center justify-center mb-3 sm:mb-4">
                    <span className="font-montserrat font-bold text-2xl sm:text-3xl lg:text-4xl text-gray-800 mr-2">JÁVEA BLISS</span>
                    <img 
                      src={logo} 
                      alt="Jávea Bliss Logo" 
                      className="h-6 sm:h-8 lg:h-10 w-auto"
                    />
                  </div>
                  <p className="text-blue-600 text-sm sm:text-lg lg:text-xl font-medium mb-2">{translations.affordableLuxury}</p>
                  <p className="text-black font-bold text-sm sm:text-lg lg:text-xl">
                    🔥 {translations.limitedTime} 🔥
                  </p>
                  <div className="text-sm sm:text-lg lg:text-xl text-gray-800 font-bold mt-1">
                    {formatDate(new Date(offer.startDate))} → {formatDate(new Date(offer.endDate))} - {getPercentageText(offer.discountPercentage, offer.language)}
                  </div>
                </div>

                {/* Title and Description */}
                <div className="text-center mb-4 sm:mb-6">
                  <h1 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-2">
                    {offer.title}
                  </h1>
                  <p className="text-gray-600 text-xs sm:text-sm lg:text-base mb-4">
                    {offer.description}
                  </p>
                </div>
                
                {/* Pricing Section */}
                <div className="flex justify-between items-center mb-4 sm:mb-6 lg:mb-8">
                  <div className="text-center">
                    <div className="text-xs sm:text-sm lg:text-base text-gray-500 uppercase tracking-wide">{translations.was}</div>
                    <div className="text-lg sm:text-2xl lg:text-3xl font-bold text-gray-800 line-through">€{offer.originalPrice}</div>
                    <div className="text-xs sm:text-sm lg:text-base text-gray-500">{translations.perNight}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs sm:text-sm lg:text-base text-green-600 uppercase tracking-wide font-bold">{translations.now}</div>
                    <div className="text-xl sm:text-3xl lg:text-4xl font-bold text-green-600">€{offer.discountedPrice}</div>
                    <div className="text-xs sm:text-sm lg:text-base text-gray-500">{translations.perNight}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs sm:text-sm lg:text-base text-blue-600 uppercase tracking-wide font-bold">{translations.save}</div>
                    <div className="text-lg sm:text-2xl lg:text-3xl font-bold text-blue-600">€{offer.originalPrice - offer.discountedPrice}</div>
                    <div className="text-xs sm:text-sm lg:text-base text-gray-500">{translations.perNight}</div>
                  </div>
                </div>

                {/* Countdown timer */}
                <div className="bg-gray-800 text-white rounded-xl p-3 sm:p-4 lg:p-6 mb-4 sm:mb-6 lg:mb-8 text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Clock className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 mr-2" />
                    <span className="text-xs sm:text-sm lg:text-base font-medium">{translations.offerEndsIn}</span>
                  </div>
                  <div className="text-lg sm:text-2xl lg:text-3xl font-bold">{timeLeft}</div>
                </div>

                {/* Promotional Information */}
                <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                  <div className="flex items-center text-gray-700">
                    <MapPin className="w-4 h-4 mr-2 text-blue-600" />
                    <span className="text-xs sm:text-sm">{translations.distanceFromBeach}</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <Users className="w-4 h-4 mr-2 text-blue-600" />
                    <span className="text-xs sm:text-sm">{translations.bedroomsBathrooms}</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                    <span className="text-xs sm:text-sm">{translations.immediateBooking}</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <Heart className="w-4 h-4 mr-2 text-red-600" />
                    <span className="text-xs sm:text-sm">{translations.secureBookingFooter}</span>
                  </div>
                </div>

                {/* Reserve Button */}
                <div className="text-center mb-4 sm:mb-6">
                  <Button 
                    onClick={() => {
                      // Track promotional offer interaction
                      if (offer) {
                        trackPromoInteraction('click', offer.title, `${getPercentageText(offer.originalPrice, offer.discountedPrice)} OFF`);
                      }
                      
                      const element = document.getElementById('booking-section');
                      if (element) {
                        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }
                    }}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-xl text-sm sm:text-base w-full sm:w-auto min-h-[48px] sm:min-h-[56px] flex items-center justify-center whitespace-normal leading-tight"
                  >
                    {translations.reserveNow}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>

                {/* Perfect Blend Description */}
                <div className="text-center text-gray-600 text-xs sm:text-sm lg:text-base mb-4 sm:mb-6 lg:mb-8">
                  <p>{translations.perfectBlend}</p>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
                  <div className="flex items-center">
                    <Waves className="w-4 h-4 lg:w-5 lg:h-5 mr-2 text-blue-600" />
                    <div>
                      <p className="font-medium text-xs sm:text-sm lg:text-base">{translations.minToBeach}</p>
                      <p className="text-xs lg:text-sm text-gray-500">{translations.walkToArenal}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Users className="w-4 h-4 lg:w-5 lg:h-5 mr-2 text-blue-600" />
                    <div>
                      <p className="font-medium text-xs sm:text-sm lg:text-base">{translations.sleeps4}</p>
                      <p className="text-xs lg:text-sm text-gray-500">{translations.perfectForCouples}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Car className="w-4 h-4 lg:w-5 lg:h-5 mr-2 text-blue-600" />
                    <div>
                      <p className="font-medium text-xs sm:text-sm lg:text-base">{translations.freeParking}</p>
                      <p className="text-xs lg:text-sm text-gray-500">{translations.privateParkingSpace}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Wifi className="w-4 h-4 lg:w-5 lg:h-5 mr-2 text-blue-600" />
                    <div>
                      <p className="font-medium text-xs sm:text-sm lg:text-base">{translations.highSpeedWifi}</p>
                      <p className="text-xs lg:text-sm text-gray-500">{translations.stayConnected}</p>
                    </div>
                  </div>
                </div>

                {/* Apartment Gallery Section */}
                <div className="mb-6 sm:mb-8 lg:mb-10">
                  <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 text-center">
                    {translations.luxuryApartmentAwaits}
                  </h2>
                  <p className="text-gray-600 text-sm sm:text-base text-center mb-4 sm:mb-6">
                    {translations.experienceComfort}
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {/* Living Room */}
                    <div className="relative group">
                      <div className="aspect-w-16 aspect-h-12 overflow-hidden rounded-lg">
                        <img
                          src={livingRoomImg}
                          alt="Living Room"
                          className="w-full h-48 sm:h-56 object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                      <div className="mt-2 text-center">
                        <h3 className="font-semibold text-gray-800 text-sm sm:text-base">{translations.livingRoom}</h3>
                        <p className="text-gray-600 text-xs sm:text-sm">{translations.modernComfort}</p>
                      </div>
                    </div>
                    
                    {/* Master Bedroom */}
                    <div className="relative group">
                      <div className="aspect-w-16 aspect-h-12 overflow-hidden rounded-lg">
                        <img
                          src={bedroomImg}
                          alt="Master Bedroom"
                          className="w-full h-48 sm:h-56 object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                      <div className="mt-2 text-center">
                        <h3 className="font-semibold text-gray-800 text-sm sm:text-base">{translations.masterBedroom}</h3>
                        <p className="text-gray-600 text-xs sm:text-sm">{translations.peacefulRetreat}</p>
                      </div>
                    </div>
                    
                    {/* Bathroom */}
                    <div className="relative group">
                      <div className="aspect-w-16 aspect-h-12 overflow-hidden rounded-lg">
                        <img
                          src={bathroomImg}
                          alt="Bathroom"
                          className="w-full h-48 sm:h-56 object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                      <div className="mt-2 text-center">
                        <h3 className="font-semibold text-gray-800 text-sm sm:text-base">{translations.bathroom}</h3>
                        <p className="text-gray-600 text-xs sm:text-sm">{translations.luxuryAmenities}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Calendar Section */}
                <div id="booking-section" className="mt-6 sm:mt-8 lg:mt-10">
                  <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 mb-3 sm:mb-4 lg:mb-6">{translations.bookYourSpecial}</h2>
                  
                  <div className="lg:flex lg:gap-8 xl:gap-10 lg:items-start space-y-6 lg:space-y-0">
                    {/* Calendar Component */}
                    <div className="lg:flex-1 lg:min-w-0">
                      <PromotionalCalendar 
                        startDate={offer.startDate}
                        endDate={offer.endDate}
                        discountedPrice={offer.discountedPrice}
                        originalPrice={offer.originalPrice}
                        validUntil={offer.validUntil}
                        language={offer.language}
                      />
                    </div>
                    
                    {/* Booking Form */}
                    <div className="lg:w-80 xl:w-96">
                      <Card id="booking-form" className="p-4 sm:p-6 lg:p-6">
                        <form onSubmit={handleSubmit} className="space-y-4">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="fullName" className="text-xs sm:text-sm lg:text-base">{translations.fullName}</Label>
                              <Input
                                id="fullName"
                                type="text"
                                value={formData.fullName}
                                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                                required
                                className="mt-1 text-xs sm:text-sm lg:text-base"
                              />
                            </div>
                            <div>
                              <Label htmlFor="email" className="text-xs sm:text-sm lg:text-base">{translations.emailAddress}</Label>
                              <Input
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                required
                                className="mt-1 text-xs sm:text-sm lg:text-base"
                              />
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="checkInDate" className="text-xs sm:text-sm">{translations.checkInDate}</Label>
                              <Input
                                id="checkInDate"
                                type="date"
                                value={formData.checkInDate}
                                onChange={(e) => setFormData({...formData, checkInDate: e.target.value})}
                                required
                                className="mt-1 text-xs sm:text-sm"
                              />
                            </div>
                            <div>
                              <Label htmlFor="checkOutDate" className="text-xs sm:text-sm">{translations.checkOutDate}</Label>
                              <Input
                                id="checkOutDate"
                                type="date"
                                value={formData.checkOutDate}
                                onChange={(e) => setFormData({...formData, checkOutDate: e.target.value})}
                                required
                                className="mt-1 text-xs sm:text-sm"
                              />
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="numberOfGuests" className="text-xs sm:text-sm">{translations.numberOfGuests}</Label>
                              <Select value={formData.numberOfGuests} onValueChange={(value) => setFormData({...formData, numberOfGuests: value})}>
                                <SelectTrigger className="mt-1 text-xs sm:text-sm">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="1">1</SelectItem>
                                  <SelectItem value="2">2</SelectItem>
                                  <SelectItem value="3">3</SelectItem>
                                  <SelectItem value="4">4</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label htmlFor="phoneNumber" className="text-xs sm:text-sm">{translations.phoneNumber}</Label>
                              <Input
                                id="phoneNumber"
                                type="tel"
                                value={formData.phoneNumber}
                                onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                                className="mt-1 text-xs sm:text-sm"
                              />
                            </div>
                          </div>
                          
                          <div>
                            <Label htmlFor="additionalMessage" className="text-xs sm:text-sm">{translations.additionalMessage}</Label>
                            <Textarea
                              id="additionalMessage"
                              value={formData.additionalMessage}
                              onChange={(e) => setFormData({...formData, additionalMessage: e.target.value})}
                              rows={3}
                              className="mt-1 text-xs sm:text-sm"
                            />
                          </div>
                          
                          <Button 
                            type="submit" 
                            disabled={isSubmitting}
                            className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold py-3 lg:py-4 rounded-xl text-sm sm:text-base lg:text-lg"
                          >
                            {isSubmitting ? "..." : translations.sendInquiry}
                          </Button>
                        </form>
                      </Card>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <DynamicPromotionalSEO />
    </>
  );
};

export default PromotionalOffer;