import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";

import { useMutation, useQuery } from "@tanstack/react-query";
import { useLanguage } from "../contexts/LanguageContext";
import emailjs from '@emailjs/browser';
import { apiRequest } from "@/lib/queryClient";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Mail, Calendar, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import OptimizedCalendar from "@/components/OptimizedCalendar";
import { trackBookingInteraction } from "@/lib/analytics";


const BookingSection = () => {
  const { toast } = useToast();
  const { t } = useLanguage();
  const [availabilityStatus, setAvailabilityStatus] = useState<'checking' | 'available' | 'unavailable' | null>(null);
  const [suggestedDates, setSuggestedDates] = useState<{checkIn: string, checkOut: string} | null>(null);
  const [priceInfo, setPriceInfo] = useState<{
    dailyRate: number;
    totalNights: number;
    totalPrice: number;
    isLongTerm: boolean;
    originalRate?: number;
    promoDiscount?: number;
    isPromoActive?: boolean;
    cleaningFee?: number;
  } | null>(null);
  const [promoOffer, setPromoOffer] = useState<any>(null);
  
  // Get URL parameters for promotional offers with error handling
  const [urlParams, setUrlParams] = useState<{
    promoStartDate: string | null;
    promoEndDate: string | null;
    promoPrice: string | null;
    promoTitle: string | null;
  }>({
    promoStartDate: null,
    promoEndDate: null,
    promoPrice: null,
    promoTitle: null
  });

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      setUrlParams({
        promoStartDate: params.get('startDate'),
        promoEndDate: params.get('endDate'),
        promoPrice: params.get('price'),
        promoTitle: params.get('title')
      });
    } catch (error) {
      // Silent fallback for URL parameter parsing errors
    }
  }, []);



  // Fetch blocked dates from Airbnb calendar
  const { data: blockedDatesData } = useQuery({
    queryKey: ['/api/calendar/blocked-dates'],
    queryFn: () => fetch('/api/calendar/blocked-dates').then(res => res.json()),
    refetchInterval: 1000 * 60 * 60, // Refetch every hour
  });

  const formSchema = z.object({
    name: z.string().min(2, t('form.nameRequired')),
    email: z.string().email(t('form.emailInvalid')),
    checkIn: z.string().min(1, t('form.checkInRequired')),
    checkOut: z.string().min(1, t('form.checkOutRequired')),
    guests: z.string().min(1, t('form.guestsRequired')),
    phone: z.string().min(6, t('form.phoneRequired')),
    message: z.string().optional(),
    // Honeypot field for spam protection
    website: z.string().max(0, t('form.spam')),
  }).refine((data) => {
    // Ensure checkout is after checkin
    if (data.checkIn && data.checkOut) {
      const checkInDate = new Date(data.checkIn);
      const checkOutDate = new Date(data.checkOut);
      return checkOutDate > checkInDate;
    }
    return true;
  }, {
    message: t('form.checkOutMustBeAfterCheckIn'),
    path: ['checkOut'],
  });

  type FormValues = z.infer<typeof formSchema>;
  
  // Find next available booking period
  const findNextAvailablePeriod = (calendarData?: any) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    
    if (!calendarData || !calendarData.blockedDates) {
      // No calendar data, default to tomorrow + 3 days
      const checkInDate = new Date(tomorrow);
      const checkOutDate = new Date(tomorrow);
      checkOutDate.setDate(tomorrow.getDate() + 3);
      
      return {
        checkIn: checkInDate.toISOString().split('T')[0],
        checkOut: checkOutDate.toISOString().split('T')[0]
      };
    }
    
    const blockedDates = new Set(calendarData.blockedDates);
    const checkOutDates = new Set(calendarData.checkOutDates || []);
    
    // Simple and reliable strategy: Find first completely available 3-day period
    for (let i = 0; i < 90; i++) {
      const currentDate = new Date(tomorrow);
      currentDate.setDate(tomorrow.getDate() + i);
      const currentDateStr = currentDate.toISOString().split('T')[0];
      
      // Check if this date could be a check-in date
      // A date is available for check-in if it's not blocked OR it's a checkout date
      const isAvailableForCheckIn = !blockedDates.has(currentDateStr) || checkOutDates.has(currentDateStr);
      
      if (isAvailableForCheckIn) {
        // Test different stay lengths (3-7 days)
        for (const stayLength of [3, 4, 5, 6, 7]) {
          let isStayAvailable = true;
          
          // Check each day of the stay
          for (let day = 1; day < stayLength; day++) { // Skip day 0 (check-in, already verified)
            const stayDate = new Date(currentDate);
            stayDate.setDate(currentDate.getDate() + day);
            const stayDateStr = stayDate.toISOString().split('T')[0];
            
            // All days between check-in and check-out must be completely free
            if (blockedDates.has(stayDateStr)) {
              isStayAvailable = false;
              break;
            }
          }
          
          if (isStayAvailable) {
            const checkOutDate = new Date(currentDate);
            checkOutDate.setDate(currentDate.getDate() + stayLength);
            return {
              checkIn: currentDateStr,
              checkOut: checkOutDate.toISOString().split('T')[0]
            };
          }
        }
      }
    }
    
    // Fallback if no availability found in next 90 days
    const fallbackCheckIn = new Date(tomorrow);
    fallbackCheckIn.setDate(tomorrow.getDate() + 90);
    const fallbackCheckOut = new Date(fallbackCheckIn);
    fallbackCheckOut.setDate(fallbackCheckIn.getDate() + 3);
    
    return {
      checkIn: fallbackCheckIn.toISOString().split('T')[0],
      checkOut: fallbackCheckOut.toISOString().split('T')[0]
    };
  };

  const [defaultDates, setDefaultDates] = useState(() => {
    const formatDate = (date: Date) => {
      return date.toISOString().split('T')[0];
    };

    const today = new Date();
    const checkInDate = new Date(today);
    checkInDate.setDate(today.getDate() + 1);
    const checkOutDate = new Date(today);
    checkOutDate.setDate(today.getDate() + 4);

    return {
      checkIn: formatDate(checkInDate),
      checkOut: formatDate(checkOutDate)
    };
  });

  // Update default dates when URL parameters change
  useEffect(() => {
    if (urlParams.promoStartDate && urlParams.promoEndDate) {
      setDefaultDates({
        checkIn: urlParams.promoStartDate,
        checkOut: urlParams.promoEndDate
      });
    }
  }, [urlParams.promoStartDate, urlParams.promoEndDate]);
  
  // Default dates are always today+1 / today+4 unless overridden by promotional URL params

  // Initialize EmailJS once when component mounts
  useEffect(() => {
    emailjs.init('_-f5oA_eoI9biq5jw');
  }, []);

  // Check for promotional discount from URL parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const promoId = urlParams.get('promo');
    
    if (promoId) {
      // Fetch promotional offer details
      fetch(`/api/promotional-offers/${promoId}`)
        .then(response => response.json())
        .then(data => {
          if (data && data.id) {
            setPromoOffer(data);
          }
        })
        .catch(() => {
          // Silent error handling - promotional offers are optional
        });
    }
  }, []);

  // Check availability for default dates when component mounts
  useEffect(() => {
    if (defaultDates.checkIn && defaultDates.checkOut) {
      checkAvailability(defaultDates.checkIn, defaultDates.checkOut, false);
    }
  }, [defaultDates.checkIn, defaultDates.checkOut]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      checkIn: defaultDates.checkIn,
      checkOut: defaultDates.checkOut,
      guests: "",
      phone: "",
      message: "",
      website: "",
    },
  });

  // Update form values when default dates change
  useEffect(() => {
    form.setValue('checkIn', defaultDates.checkIn);
    form.setValue('checkOut', defaultDates.checkOut);
  }, [defaultDates.checkIn, defaultDates.checkOut, form]);

  // Listen for interactive calendar date selection
  useEffect(() => {
    const handleDateRangeSelection = (event: CustomEvent) => {
      const { checkIn, checkOut } = event.detail;

      
      // Update form fields with selected dates
      form.setValue('checkIn', checkIn);
      form.setValue('checkOut', checkOut);
      
      // Trigger availability check
      checkAvailability(checkIn, checkOut);
    };

    // Listen for promotional date selection from banner
    const handlePromotionalDateSelection = (event: CustomEvent) => {
      const { startDate, endDate, discountedPrice, originalPrice, discountPercentage } = event.detail;
      
      // Update form fields with promotional dates
      form.setValue('checkIn', startDate);
      form.setValue('checkOut', endDate);
      
      // Update default dates to match promotional offer
      setDefaultDates({
        checkIn: startDate,
        checkOut: endDate
      });
      
      // Trigger availability check with promotional dates
      checkAvailability(startDate, endDate);
    };


    window.addEventListener('dateRangeSelected', handleDateRangeSelection as EventListener);
    window.addEventListener('selectPromotionalDates', handlePromotionalDateSelection as EventListener);
    
    return () => {
      window.removeEventListener('dateRangeSelected', handleDateRangeSelection as EventListener);
      window.removeEventListener('selectPromotionalDates', handlePromotionalDateSelection as EventListener);
    };
  }, [form]);

  // Check availability when dates change
  const checkAvailability = async (checkIn: string, checkOut: string, navigateCalendar = true) => {
    if (!checkIn || !checkOut) {
      setAvailabilityStatus(null);
      setPriceInfo(null);
      return;
    }

    setAvailabilityStatus('checking');
    
    try {
      const response = await fetch('/api/calendar/check-availability', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ startDate: checkIn, endDate: checkOut }),
      });

      if (response.ok) {
        const data = await response.json();
        setAvailabilityStatus(data.available ? 'available' : 'unavailable');
        
        // Calculate pricing information
        if (data.available) {
          const startDate = new Date(checkIn);
          const endDate = new Date(checkOut);
          const stayLength = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
          
          let dailyRate;
          const month = startDate.getMonth();
          
          if (month >= 5 && month <= 8) dailyRate = 210; // Jun-Sep (high season)
          else if (month === 3 || month === 4 || month === 9) dailyRate = 160; // Apr, May, Oct (mid season)
          else dailyRate = 130; // Nov-Mar (low season)
          
          // Long-term rental rate: €100/day for stays 35+ days
          if (stayLength >= 35) {
            const cleaningFee = 30;
            setPriceInfo({
              dailyRate: 100,
              totalNights: stayLength,
              totalPrice: (stayLength * 100) + cleaningFee,
              isLongTerm: true,
              originalRate: dailyRate,
              cleaningFee: cleaningFee
            });
          } else {
            // Check for promotional pricing first
            let finalRate = dailyRate;
            let isPromoActive = false;
            let promoDiscountRate = 0;
            
            // Use promotional price if available from URL parameters
            if (urlParams.promoPrice) {
              finalRate = parseInt(urlParams.promoPrice);
              isPromoActive = true;
              promoDiscountRate = Math.round(((dailyRate - finalRate) / dailyRate) * 100);
            } else {
              // Fetch current promotional offers from database
              try {
                const promoResponse = await fetch('/api/promotional-offers');
                if (promoResponse.ok) {
                  const promoOffers = await promoResponse.json();
                  const checkInDate = new Date(checkIn);
                  const today = new Date();
                  
                  // Find active promotional offer that covers the check-in date
                  const activePromo = promoOffers.find((offer: any) => {
                    if (!offer.isActive) return false;
                    
                    const promoStartDate = new Date(offer.startDate);
                    const promoEndDate = new Date(offer.endDate);
                    const validUntilDate = new Date(offer.validUntil);
                    
                    // Check if:
                    // 1. Promotion is still valid (not expired)
                    // 2. Check-in date falls within promotional period
                    return validUntilDate >= today && 
                           checkInDate >= promoStartDate && 
                           checkInDate <= promoEndDate;
                  });
                  
                  if (activePromo && activePromo.discountedPrice < dailyRate) {
                    finalRate = activePromo.discountedPrice;
                    isPromoActive = true;
                    promoDiscountRate = Math.round(((dailyRate - finalRate) / dailyRate) * 100);
                  }
                }
              } catch (error) {
                // Promotional offers fetch failed, continue with last-minute booking logic
              }
              
              // Check for last-minute booking discount if no promotional offer was found
              if (!isPromoActive) {
                try {
                  const lastMinuteResponse = await fetch('/api/last-minute-offers');
                  if (lastMinuteResponse.ok) {
                    const lastMinuteOffer = await lastMinuteResponse.json();
                    
                    if (lastMinuteOffer.isActive && lastMinuteOffer.availableDates) {
                      const checkInDate = new Date(checkIn);
                      const checkInDateStr = checkInDate.toISOString().split('T')[0];
                      
                      // Check if check-in date is in the available last-minute dates
                      // Only apply if the discounted price is actually lower than the seasonal rate
                      if (lastMinuteOffer.availableDates.includes(checkInDateStr) && lastMinuteOffer.discountedPrice < dailyRate) {
                        finalRate = lastMinuteOffer.discountedPrice;
                        isPromoActive = true;
                        promoDiscountRate = Math.round(((dailyRate - finalRate) / dailyRate) * 100);
                      }
                    }
                  }
                } catch (error) {
                  // Last minute offers fetch failed, use regular pricing
                }
              }
              
              // No automatic discounts - only apply promotional pricing when there are active offers
            }
            
            const cleaningFee = 30;
            const newPriceInfo = {
              dailyRate: finalRate,
              totalNights: stayLength,
              totalPrice: (stayLength * finalRate) + cleaningFee,
              isLongTerm: false,
              originalRate: dailyRate,
              promoDiscount: promoDiscountRate,
              isPromoActive: isPromoActive,
              cleaningFee: cleaningFee
            };
            setPriceInfo(newPriceInfo);
          }
        } else {
          setPriceInfo(null);
          // When dates are unavailable, suggest next available period
          // Fetch fresh calendar data to ensure accurate suggestions
          const freshCalendarResponse = await apiRequest('/api/calendar/blocked-dates', 'GET');
          const freshCalendarData = await freshCalendarResponse.json();
          const nextAvailable = findNextAvailablePeriod(freshCalendarData);
          setSuggestedDates(nextAvailable);
          
          // Navigate calendar to show the month containing suggested dates (only on user-triggered checks)
          if (navigateCalendar && nextAvailable && nextAvailable.checkIn) {
            window.dispatchEvent(new CustomEvent('navigateToMonth', {
              detail: { date: nextAvailable.checkIn }
            }));
          }
        }
      } else {
        setAvailabilityStatus(null);
        setPriceInfo(null);
        setSuggestedDates(null);
      }
    } catch (error) {
      setAvailabilityStatus(null);
      setPriceInfo(null);
    }
  };

  const bookingMutation = useMutation({
    mutationFn: async (data: FormValues) => {
      // Check honeypot
      if (data.website && data.website.trim() !== '') {
        throw new Error("Spam detected");
      }

      // Try EmailJS first
      try {
        const emailParams = {
          from_name: data.name,
          from_email: data.email,
          phone: data.phone,
          check_in: data.checkIn,
          check_out: data.checkOut,
          guests: data.guests,
          message: data.message || 'No additional message',
          reply_to: data.email
        };

        await emailjs.send('service_i65l3ak', 'template_3ju4pvr', emailParams, '_-f5oA_eoI9biq5jw');
      } catch (emailError: any) {
        // Fallback: Create mailto link for manual sending
        const emailBody = `
New Booking Inquiry for Jávea Bliss

Guest Details:
Name: ${data.name}
Email: ${data.email}
Phone: ${data.phone}

Booking Details:
Check-in: ${data.checkIn}
Check-out: ${data.checkOut}
Number of guests: ${data.guests}

Message:
${data.message || 'No additional message'}

---
This inquiry was submitted through the Jávea Bliss website.
        `.trim();

        const mailtoLink = `mailto:admin@javeabliss.com?subject=New Booking Inquiry - Jávea Bliss&body=${encodeURIComponent(emailBody)}`;
        
        // Open mailto link (this will open the user's email client)
        window.open(mailtoLink, '_blank');
        
        throw new Error("Email service unavailable. Please check your email client for the booking details.");
      }
      
      // Return success as we sent the email
      return { success: true };
    },
    onSuccess: () => {
      // Track successful booking completion
      const formData = form.getValues();
      const nights = Math.ceil((new Date(formData.checkOut).getTime() - new Date(formData.checkIn).getTime()) / (1000 * 60 * 60 * 24));
      trackBookingInteraction('complete', formData.checkIn, nights);
      
      toast({
        title: t('booking.success'),
        description: t('booking.successDesc'),
      });
      form.reset();
    },
    onError: (error) => {
      // Track booking abandonment
      const formData = form.getValues();
      const nights = Math.ceil((new Date(formData.checkOut).getTime() - new Date(formData.checkIn).getTime()) / (1000 * 60 * 60 * 24));
      trackBookingInteraction('abandon', formData.checkIn, nights);
      
      toast({
        title: t('booking.error'),
        description: error.message.includes("Email service unavailable") 
          ? "Your email client opened with the booking details. Please send the email to complete your inquiry."
          : error.message || "Please try again later",
        variant: error.message.includes("Email service unavailable") ? "default" : "destructive",
      });
    },
  });

  const onSubmit = (data: FormValues) => {
    // Track booking form start
    const nights = Math.ceil((new Date(data.checkOut).getTime() - new Date(data.checkIn).getTime()) / (1000 * 60 * 60 * 24));
    trackBookingInteraction('start', data.checkIn, nights);
    
    bookingMutation.mutate(data);
  };

  return (
    <section id="booking" className="section bg-sand">
      <div className="shell">
        <div className="grid lg:grid-cols-12 gap-y-8 gap-x-16 mb-14 md:mb-16">
          <div className="lg:col-span-5">
            <p className="eyebrow mb-5">{t('booking.eyebrow')}</p>
            <h2 className="display-lg">{t('booking.title')}</h2>
          </div>
          <div className="lg:col-span-7 flex items-end">
            <p className="lede">{t('booking.description')}</p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          <div className="lg:w-1/2">
            <div className="bg-bone border border-ink/12 p-3 sm:p-6 mb-6">
              <h3 className="font-display text-2xl mb-5 text-ink text-center">{t('checkAvailability')}</h3>
              <div className="flex justify-center">
                <OptimizedCalendar />
              </div>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="bg-bone border border-ink/12 p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('booking.name')}</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('booking.email')}</FormLabel>
                        <FormControl>
                          <Input type="email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="checkIn"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('booking.checkIn')}</FormLabel>
                        <FormControl>
                          <Input 
                            type="date" 
                            {...field} 
                            onChange={(e) => {
                              field.onChange(e);
                              const checkInDate = new Date(e.target.value);
                              
                              // Set checkout to check-in + 3 nights (minimum stay)
                              const minCheckOut = new Date(checkInDate);
                              minCheckOut.setDate(checkInDate.getDate() + 3);
                              const minCheckOutString = minCheckOut.toISOString().split('T')[0];
                              
                              // Only update checkout if it would be before the new minimum
                              const currentCheckOut = form.getValues("checkOut");
                              if (!currentCheckOut || currentCheckOut < minCheckOutString) {
                                form.setValue("checkOut", minCheckOutString);
                              }
                              
                              const checkOutValue = form.getValues("checkOut");
                              
                              // Dispatch event to navigate calendar to selected month
                              const event = new CustomEvent('dateRangeSelected', {
                                detail: {
                                  checkIn: e.target.value,
                                  checkOut: checkOutValue,
                                }
                              });
                              window.dispatchEvent(event);
                              
                              // Check availability for the new date range
                              checkAvailability(e.target.value, checkOutValue);
                            }}
                            min={(() => {
                              const tomorrow = new Date();
                              tomorrow.setDate(tomorrow.getDate() + 1);
                              return tomorrow.toISOString().split('T')[0];
                            })()}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="checkOut"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('booking.checkOut')}</FormLabel>
                        <FormControl>
                          <Input 
                            type="date" 
                            {...field} 
                            onChange={(e) => {
                              field.onChange(e);
                              const checkIn = form.getValues("checkIn");
                              
                              // Dispatch event to navigate calendar to selected month
                              if (checkIn) {
                                const event = new CustomEvent('dateRangeSelected', {
                                  detail: {
                                    checkIn: checkIn,
                                    checkOut: e.target.value,
                                  }
                                });
                                window.dispatchEvent(event);
                              }
                              
                              checkAvailability(checkIn, e.target.value);
                            }}
                            min={(() => {
                              const checkInDate = form.getValues("checkIn");
                              if (checkInDate) {
                                const minCheckOut = new Date(checkInDate);
                                minCheckOut.setDate(minCheckOut.getDate() + 3);
                                return minCheckOut.toISOString().split('T')[0];
                              }
                              const today = new Date();
                              today.setDate(today.getDate() + 4);
                              return today.toISOString().split('T')[0];
                            })()}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Pricing Information */}
                  {priceInfo && (
                    <div className="md:col-span-2 bg-white p-4 rounded-lg border">
                      <h4 className="font-semibold text-lg mb-3">{t('pricing.title')}</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>{t('pricing.stayDuration')}:</span>
                          <span className="font-medium">{priceInfo.totalNights} {t('pricing.nights')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>{t('pricing.ratePerNight')}:</span>
                          <span className="font-medium">
                            {priceInfo.isLongTerm ? (
                              <>
                                <span className="text-green-600">€{priceInfo.dailyRate}</span>
                                {priceInfo.originalRate && (
                                  <span className="text-gray-400 line-through ml-2">€{priceInfo.originalRate}</span>
                                )}
                                <span className="text-green-600 text-sm ml-1">({t('pricing.longTermRate')})</span>
                              </>
                            ) : priceInfo.isPromoActive && priceInfo.originalRate ? (
                              <>
                                <span className="text-red-600">€{priceInfo.dailyRate}</span>
                                <span className="text-gray-400 line-through ml-2">€{priceInfo.originalRate}</span>
                              </>
                            ) : (
                              <span>€{priceInfo.dailyRate}</span>
                            )}
                          </span>
                        </div>
                        {priceInfo.isPromoActive && priceInfo.promoDiscount && (
                          <div className="flex justify-between text-red-600">
                            <span>{t('pricing.discount')}:</span>
                            <span className="font-medium">-{priceInfo.promoDiscount}%</span>
                          </div>
                        )}
                        {priceInfo.cleaningFee && (
                          <div className="flex justify-between">
                            <span>{t('pricing.cleaningFee')}:</span>
                            <span className="font-medium">€{priceInfo.cleaningFee}</span>
                          </div>
                        )}
                        <div className="flex justify-between text-lg font-semibold border-t pt-2">
                          <span>{t('pricing.total')}:</span>
                          <span className="text-green-600">€{priceInfo.totalPrice}</span>
                        </div>
                        {priceInfo.cleaningFee && (
                          <div className="flex justify-end mt-1">
                            <span className="text-gray-500 text-xs">
                              ({t('pricing.cleaningFee')} €{priceInfo.cleaningFee} {t('pricing.includedInTotal')})
                            </span>
                          </div>
                        )}
                        {priceInfo.isLongTerm && (
                          <div className="bg-green-50 p-3 rounded-lg mt-3">
                            <p className="text-green-700 text-sm">
                              🎉 <strong>{t('pricing.longTermDiscount')}</strong> 
                              {t('pricing.longTermMessage').replace('{nights}', priceInfo.totalNights.toString())}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Availability Status Display */}
                {availabilityStatus && (
                  <div className="my-6">
                    {availabilityStatus === 'checking' && (
                      <Alert>
                        <Calendar className="h-4 w-4" />
                        <AlertDescription>
                          {t('booking.checkingAvailability')}
                        </AlertDescription>
                      </Alert>
                    )}
                    {availabilityStatus === 'available' && (
                      <Alert className="border-green-200 bg-green-50">
                        <Calendar className="h-4 w-4 text-green-600" />
                        <AlertDescription className="text-green-800">
                          {t('booking.datesAvailable')}
                        </AlertDescription>
                      </Alert>
                    )}
                    {availabilityStatus === 'unavailable' && (
                      <div className="space-y-3">
                        <Alert variant="destructive">
                          <AlertTriangle className="h-4 w-4" />
                          <AlertDescription>
                            {t('booking.datesUnavailable')}
                          </AlertDescription>
                        </Alert>
                        
                        {/* Automatic Availability Suggestions */}
                        {suggestedDates && (
                          <Alert className="border-blue-200 bg-blue-50">
                            <Calendar className="h-4 w-4 text-blue-600" />
                            <AlertDescription className="text-blue-800">
                              <div className="space-y-2">
                                <div className="font-medium">
                                  💡 {t('booking.nextAvailable')}
                                </div>
                                <div className="flex flex-wrap gap-2 items-center">
                                  <span className="text-sm">
                                    {new Date(suggestedDates.checkIn).toLocaleDateString()} - {new Date(suggestedDates.checkOut).toLocaleDateString()}
                                  </span>
                                  <Button
                                    type="button"
                                    size="sm"
                                    variant="outline"
                                    className="text-xs px-2 py-1 h-auto bg-blue-100 hover:bg-blue-200 border-blue-300"
                                    onClick={() => {
                                      form.setValue('checkIn', suggestedDates.checkIn);
                                      form.setValue('checkOut', suggestedDates.checkOut);
                                      checkAvailability(suggestedDates.checkIn, suggestedDates.checkOut);
                                    }}
                                  >
                                    {t('booking.useSuggestedDates')}
                                  </Button>
                                </div>
                              </div>
                            </AlertDescription>
                          </Alert>
                        )}
                      </div>
                    )}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="guests"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('booking.guests')}</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder={t('booking.guests')} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="1">{t('guests.1')}</SelectItem>
                            <SelectItem value="2">{t('guests.2')}</SelectItem>
                            <SelectItem value="3">{t('guests.3')}</SelectItem>
                            <SelectItem value="4">{t('guests.4')}</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('booking.phone')}</FormLabel>
                        <FormControl>
                          <Input type="tel" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem className="mt-6">
                      <FormLabel>{t('booking.message')}</FormLabel>
                      <FormControl>
                        <Textarea rows={4} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Honeypot field - hidden from users but visible to bots */}
                <FormField
                  control={form.control}
                  name="website"
                  render={({ field }) => (
                    <FormItem style={{ display: 'none' }}>
                      <FormLabel>Website</FormLabel>
                      <FormControl>
                        <Input {...field} tabIndex={-1} autoComplete="off" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="mt-8 btn-primary w-full rounded-none"
                  disabled={bookingMutation.isPending}
                >
                  {bookingMutation.isPending ? t('booking.submitting') : t('booking.submit')}
                </Button>
              </form>
            </Form>
          </div>
          
          <div className="lg:w-1/2">
            <div className="bg-ink text-bone p-8 md:p-10 h-full">
              <h3 className="font-display text-2xl md:text-3xl mb-8">{t('booking.information')}</h3>
              
              <div className="space-y-6">
                <div>
                  <h4 className="eyebrow text-bone/45 mb-3">{t('booking.rates')}</h4>
                  <p className="mb-1">{t('booking.highSeason')}</p>
                  <p className="mb-1">{t('booking.midSeason')}</p>
                  <p>{t('booking.lowSeason')}</p>
                </div>
                
                <div>
                  <h4 className="eyebrow text-bone/45 mb-3">{t('booking.minimumStay')}</h4>
                  <p>{t('booking.minimumStayText')}</p>
                </div>
                
                <div>
                  <h4 className="eyebrow text-bone/45 mb-3">{t('booking.checkInOut')}</h4>
                  <p className="mb-1">{t('booking.checkInTime')}</p>
                  <p>{t('booking.checkOutTime')}</p>
                </div>
                
                <div>
                  <h4 className="eyebrow text-bone/45 mb-3">{t('booking.cancellation')}</h4>
                  <p>{t('booking.cancellationText')}</p>
                </div>
                
                <div>
                  <h4 className="eyebrow text-bone/45 mb-3">{t('booking.directContact')}</h4>
                  <p className="flex items-center mb-2">
                    <Mail className="mr-3" />
                    <a href="mailto:admin@javeabliss.com" className="hover:underline">admin@javeabliss.com</a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BookingSection;
