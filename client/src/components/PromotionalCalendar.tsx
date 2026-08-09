import { useState, useEffect, useMemo, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { useCalendarData, formatDateString, createDateSet, isPastDate, isCurrentMonth, getSeasonalRate } from "@/utils/calendarUtils";

interface PromotionalCalendarProps {
  startDate: string;
  endDate: string;
  discountedPrice: number;
  originalPrice: number;
  validUntil: string;
  language: string;
}

const PromotionalCalendar = ({ startDate, endDate, discountedPrice, originalPrice, validUntil, language }: PromotionalCalendarProps) => {
  const [currentDate, setCurrentDate] = useState(new Date(startDate));
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0 });
  
  // Interactive calendar selection state
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionStart, setSelectionStart] = useState<string | null>(null);
  const [tempSelection, setTempSelection] = useState<{
    startDate: string | null;
    endDate: string | null;
  }>({
    startDate: null,
    endDate: null,
  });
  const [selectedRange, setSelectedRange] = useState<{
    startDate: string | null;
    endDate: string | null;
  }>({
    startDate: null,
    endDate: null,
  });
  
  // Click-to-select state
  const [clickSelectionStart, setClickSelectionStart] = useState<string | null>(null);
  const [isDragSelection, setIsDragSelection] = useState(false);
  const [mouseDownTime, setMouseDownTime] = useState<number | null>(null);
  
  // Calculate time left until offer ends (using the same logic as main pages)
  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const endDate = new Date(validUntil);
      const diff = endDate.getTime() - now.getTime();
      
      if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        
        setTimeLeft({ days, hours, minutes });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0 });
      }
    };
    
    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000); // Update every second
    
    return () => clearInterval(timer);
  }, [validUntil]);
  
  // Fetch blocked dates for reference
  const { data: blockedDatesData } = useQuery({
    queryKey: ['/api/calendar/blocked-dates'],
    queryFn: () => fetch('/api/calendar/blocked-dates').then(res => res.json()),
    refetchInterval: 5 * 60 * 1000, // 5 minutes
  });
  
  const blockedDates = blockedDatesData?.blockedDates || [];
  
  // Create Set for O(1) blocked date lookups
  const blockedDateSet = useMemo(() => createDateSet(blockedDates), [blockedDates]);
  
  // Calculate promotional period dates
  const promotionalDates = useMemo(() => {
    const dates = [];
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      dates.push(new Date(d));
    }
    
    return dates;
  }, [startDate, endDate]);
  
  // Use shared calendar data utility
  const calendarData = useCalendarData(currentDate);
  
  const isPromotionalDate = (date: Date) => {
    const dateStr = formatDateString(date);
    return dateStr >= startDate && dateStr <= endDate;
  };
  
  const isBlocked = useCallback((date: Date) => {
    return blockedDateSet.has(formatDateString(date));
  }, [blockedDateSet]);

  // Check if date is in selection range
  const isInSelectionRange = useCallback((date: Date) => {
    const dateStr = formatDateString(date);
    const activeSelection = isSelecting ? tempSelection : selectedRange;
    
    if (!activeSelection.startDate || !activeSelection.endDate) return false;
    
    return dateStr >= activeSelection.startDate && dateStr <= activeSelection.endDate;
  }, [isSelecting, tempSelection, selectedRange]);

  // Check if date is selection start or end
  const isSelectionBoundary = useCallback((date: Date) => {
    const dateStr = formatDateString(date);
    const activeSelection = isSelecting ? tempSelection : selectedRange;
    
    return dateStr === activeSelection.startDate || dateStr === activeSelection.endDate;
  }, [isSelecting, tempSelection, selectedRange]);

  // Handle click-to-select functionality
  const handleDateClick = useCallback((date: Date) => {
    const dateStr = formatDateString(date);
    
    // Only allow selection on promotional dates that aren't past or blocked
    if (isPastDate(date) || !isCurrentMonth(date, calendarData.month) || !isPromotionalDate(date) || isBlocked(date)) {
      return;
    }
    
    // Use setTimeout to ensure this runs after mouseDown/mouseUp events have processed
    setTimeout(() => {
      // Only process click if we're not in the middle of a drag operation
      if (!isDragSelection && !isSelecting) {
        if (!clickSelectionStart) {
          // First click - set start date
          setClickSelectionStart(dateStr);
          setSelectedRange({
            startDate: null,
            endDate: null,
          });
          setTempSelection({
            startDate: dateStr,
            endDate: dateStr,
          });
        } else if (clickSelectionStart !== dateStr) {
          // Second click - complete the selection (only if different date)
          const startDate = clickSelectionStart <= dateStr ? clickSelectionStart : dateStr;
          const endDate = clickSelectionStart <= dateStr ? dateStr : clickSelectionStart;
          
          setSelectedRange({
            startDate,
            endDate,
          });
          
          // Dispatch event to update booking form
          const event = new CustomEvent('dateRangeSelected', {
            detail: {
              checkIn: startDate,
              checkOut: endDate,
            }
          });
          window.dispatchEvent(event);
          
          // Reset click selection state
          setClickSelectionStart(null);
          setTempSelection({ startDate: null, endDate: null });
        } else {
          // Same date clicked - reset selection
          setClickSelectionStart(null);
          setSelectedRange({ startDate: null, endDate: null });
          setTempSelection({ startDate: null, endDate: null });
        }
      }
    }, 250); // Sufficient delay to ensure drag detection completes
  }, [calendarData.month, isPromotionalDate, isBlocked, clickSelectionStart, isDragSelection, isSelecting]);

  // Handle interactive drag selection - only starts drag on mouse move
  const handleDateMouseDown = useCallback((date: Date) => {
    const dateStr = formatDateString(date);
    
    // Allow selection on promotional dates that are not blocked
    if (isPastDate(date) || !isCurrentMonth(date, calendarData.month) || !isPromotionalDate(date) || isBlocked(date)) {
      return;
    }
    
    // Record mouse down time and date for both drag and click detection
    setMouseDownTime(Date.now());
    setSelectionStart(dateStr);
    
    // Don't start drag immediately - wait for mouse move to distinguish from click
  }, [calendarData.month, isPromotionalDate, isBlocked]);

  const handleDateMouseEnter = useCallback((date: Date) => {
    // Only start drag selection on mouse enter if mouse is down
    if (selectionStart && mouseDownTime && !isDragSelection) {
      setIsDragSelection(true);
      setIsSelecting(true);
      setTempSelection({
        startDate: selectionStart,
        endDate: selectionStart,
      });
      // Clear click selection when drag starts
      setClickSelectionStart(null);
      setSelectedRange({ startDate: null, endDate: null });
    }
    
    if (!isSelecting || !selectionStart) return;
    
    const dateStr = formatDateString(date);
    
    // Apply same selection rules as mouseDown
    if (isPastDate(date) || !isCurrentMonth(date, calendarData.month) || !isPromotionalDate(date) || isBlocked(date)) {
      return;
    }
    
    // Determine start and end dates based on selection direction
    const startDate = selectionStart <= dateStr ? selectionStart : dateStr;
    const endDate = selectionStart <= dateStr ? dateStr : selectionStart;
    
    setTempSelection({
      startDate,
      endDate,
    });
  }, [isSelecting, selectionStart, calendarData.month, isPromotionalDate, isBlocked, mouseDownTime, isDragSelection]);

  const handleDateMouseUp = useCallback(() => {
    // If we have a drag selection, complete it
    if (isDragSelection && isSelecting && tempSelection.startDate && tempSelection.endDate) {
      setSelectedRange({
        startDate: tempSelection.startDate,
        endDate: tempSelection.endDate,
      });
      
      // Dispatch event to update booking form (if it exists on promotional pages)
      const event = new CustomEvent('dateRangeSelected', {
        detail: {
          checkIn: tempSelection.startDate,
          checkOut: tempSelection.endDate,
        }
      });
      window.dispatchEvent(event);
    }
    
    // Reset all drag flags
    setIsDragSelection(false);
    setIsSelecting(false);
    setSelectionStart(null);
    setTempSelection({ startDate: null, endDate: null });
    
    // Clear mouse down time after a delay to allow click processing
    setTimeout(() => setMouseDownTime(null), 300);
  }, [isSelecting, tempSelection, isDragSelection, mouseDownTime]);

  // Handle mouse leave to prevent stuck selection
  const handleCalendarMouseLeave = useCallback(() => {
    if (isSelecting) {
      handleDateMouseUp();
    }
  }, [isSelecting, handleDateMouseUp]);
  
  const getCellClass = useCallback((date: Date) => {
    const dateStr = formatDateString(date);
    let classes = "w-10 h-10 sm:w-12 sm:h-12 flex flex-col items-center justify-center text-xs rounded-md transition-colors p-1 relative ";
    
    // Add click-selection-start styling
    const isClickStart = clickSelectionStart === dateStr;
    
    // Add selection styling (EasyJet-like visual feedback)
    if (isInSelectionRange(date) || (isClickStart && !isDragSelection)) {
      if (isSelectionBoundary(date) || isClickStart) {
        // Start and end dates get stronger styling
        classes += "bg-blue-500 text-white ring-2 ring-blue-600 font-bold shadow-md ";
      } else {
        // Dates in between get lighter blue styling
        classes += "bg-blue-200 text-blue-900 font-medium ";
      }
    } else if (!isCurrentMonth(date, calendarData.month)) {
      classes += "text-gray-300 ";
    } else if (isPastDate(date)) {
      classes += "text-gray-400 ";
    } else if (isPromotionalDate(date) && !isBlocked(date)) {
      // Promotional dates with discount
      classes += "bg-gradient-to-br from-purple-100 to-pink-100 border-2 border-purple-300 text-purple-800 font-bold cursor-pointer hover:shadow-sm ";
    } else if (isBlocked(date)) {
      classes += "bg-red-100 text-red-800 font-medium ";
    } else {
      classes += "bg-gray-50 text-gray-500 ";
    }
    
    return classes;
  }, [calendarData.month, isPromotionalDate, isBlocked, isInSelectionRange, isSelectionBoundary, clickSelectionStart, isDragSelection]);
  
  const goToPreviousMonth = () => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() - 1);
      return newDate;
    });
  };
  
  const goToNextMonth = () => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + 1);
      return newDate;
    });
  };
  
  const getTranslations = (lang: string) => {
    const translations = {
      en: {
        offerEndsIn: "Offer ends in:",
        offerExpired: "Offer expired",
        discountedRate: "Discounted Rate",
        unavailable: "Unavailable",
        regularRate: "Regular Rate",
        limitedTimeOffer: "Limited time offer",
        specialOfferSelected: "Special Offer Dates Selected",
        was: "was",
        datesAutoFilled: "Dates automatically filled in booking form"
      },
      es: {
        offerEndsIn: "La oferta termina en:",
        offerExpired: "Oferta expirada",
        discountedRate: "Tarifa con Descuento",
        unavailable: "No Disponible",
        regularRate: "Tarifa Regular",
        limitedTimeOffer: "Oferta por tiempo limitado",
        specialOfferSelected: "Fechas de Oferta Especial Seleccionadas",
        was: "era",
        datesAutoFilled: "Fechas rellenadas automáticamente en el formulario de reserva"
      },
      fr: {
        offerEndsIn: "L'offre se termine dans:",
        offerExpired: "Offre expirée",
        discountedRate: "Tarif Réduit",
        unavailable: "Indisponible",
        regularRate: "Tarif Régulier",
        limitedTimeOffer: "Offre à durée limitée",
        specialOfferSelected: "Dates d'Offre Spéciale Sélectionnées",
        was: "était",
        datesAutoFilled: "Dates automatiquement remplies dans le formulaire de réservation"
      },
      nl: {
        offerEndsIn: "Aanbieding eindigt over:",
        offerExpired: "Aanbieding verlopen",
        discountedRate: "Korting Tarief",
        unavailable: "Niet Beschikbaar",
        regularRate: "Regulier Tarief",
        limitedTimeOffer: "Beperkte tijd aanbieding",
        specialOfferSelected: "Speciale Aanbieding Datums Geselecteerd",
        was: "was",
        datesAutoFilled: "Datums automatisch ingevuld in reserveringsformulier"
      },
      de: {
        offerEndsIn: "Angebot endet in:",
        offerExpired: "Angebot abgelaufen",
        discountedRate: "Ermäßigter Preis",
        unavailable: "Nicht Verfügbar",
        regularRate: "Regulärer Preis",
        limitedTimeOffer: "Zeitlich begrenztes Angebot",
        specialOfferSelected: "Spezialangebot Termine Ausgewählt",
        was: "war",
        datesAutoFilled: "Termine automatisch im Buchungsformular ausgefüllt"
      }
    };
    
    return translations[lang as keyof typeof translations] || translations.en;
  };

  const formatCountdown = () => {
    const trans = getTranslations(language);
    
    if (timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0) {
      return trans.offerExpired;
    }
    
    return `${timeLeft.days}d ${timeLeft.hours}h ${timeLeft.minutes}m`;
  };
  
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* Countdown Timer */}
      <div className="mb-6 text-center">
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg p-4">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Clock className="w-5 h-5" />
            <span className="text-lg font-semibold">{getTranslations(language).offerEndsIn}</span>
          </div>
          <div className="text-2xl font-bold text-yellow-300">
            {formatCountdown()}
          </div>
        </div>
      </div>
      
      {/* Calendar Header */}
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={goToPreviousMonth}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        
        <h3 className="text-lg font-semibold text-gray-800">
          {calendarData.year} {new Date(calendarData.year, calendarData.month).toLocaleDateString('en-US', { month: 'long' })}
        </h3>
        
        <button
          onClick={goToNextMonth}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
      
      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 mb-4" onMouseLeave={handleCalendarMouseLeave}>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
            {day}
          </div>
        ))}
        
        {calendarData.weeks.map((week, weekIndex) => (
          week.map((date, dayIndex) => {
            const isPromotional = isPromotionalDate(date) && !isBlocked(date);
            return (
              <div
                key={`${weekIndex}-${dayIndex}`}
                className={getCellClass(date)}
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleDateMouseDown(date);
                }}
                onMouseEnter={() => handleDateMouseEnter(date)}
                onMouseUp={handleDateMouseUp}
                onClick={() => handleDateClick(date)}
                style={{ userSelect: 'none', cursor: isPromotional ? 'pointer' : 'default' }}
              >
                <span className="text-xs font-medium">
                  {date.getDate()}
                </span>
                {isPromotional && (
                  <span className="text-xs font-bold text-purple-600">
                    €{discountedPrice}
                  </span>
                )}
                {isInSelectionRange(date) && isCurrentMonth(date, calendarData.month) && !isPastDate(date) && !isBlocked(date) && (
                  <div className="absolute inset-0 border-2 border-blue-400 rounded-md pointer-events-none"></div>
                )}
              </div>
            );
          })
        ))}
      </div>
      
      {/* Show selection message */}
      {selectedRange.startDate && selectedRange.endDate && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="text-blue-800 font-medium text-sm">
              {getTranslations(language).specialOfferSelected}
            </span>
          </div>
          <p className="text-blue-700 text-xs mt-1">
            {new Date(selectedRange.startDate).toLocaleDateString()} - {new Date(selectedRange.endDate).toLocaleDateString()}
            <span className="ml-2">€{discountedPrice}/night ({getTranslations(language).was} €{originalPrice})</span>
          </p>
          <p className="text-blue-600 text-xs mt-1">
            {getTranslations(language).datesAutoFilled}
          </p>
        </div>
      )}
      
      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gradient-to-br from-purple-100 to-pink-100 border-2 border-purple-300 rounded"></div>
          <span>{getTranslations(language).discountedRate} (€{discountedPrice})</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-100 rounded"></div>
          <span>{getTranslations(language).unavailable}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-50 rounded"></div>
          <span>{getTranslations(language).regularRate} (€{originalPrice})</span>
        </div>
      </div>
      
      {/* Promotional Message */}
      <div className="mt-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
        <p className="text-sm text-purple-800 font-medium text-center">
          {getTranslations(language).limitedTimeOffer}: {' '}
          <span className="font-bold">€{discountedPrice}</span> per night 
          <span className="text-gray-600"> (was €{originalPrice})</span>
        </p>
      </div>
    </div>
  );
};

export default PromotionalCalendar;