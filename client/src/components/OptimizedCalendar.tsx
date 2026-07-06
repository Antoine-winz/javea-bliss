import { useState, useMemo, useCallback, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/contexts/LanguageContext";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCalendarData, formatDateString, createDateSet, isPastDate, isCurrentMonth, getSeasonalRate } from "@/utils/calendarUtils";

interface CalendarData {
  blockedDates: string[];
  checkInDates: string[];
  checkOutDates: string[];
  lastUpdated: string;
}

const OptimizedCalendar = () => {
  const { t } = useLanguage();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedRange, setSelectedRange] = useState<{
    startDate: string | null;
    endDate: string | null;
    discountedPrice?: number;
    originalPrice?: number;
    discountPercentage?: number;
  }>({
    startDate: null,
    endDate: null,
  });
  
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
  
  // Click-to-select state
  const [clickSelectionStart, setClickSelectionStart] = useState<string | null>(null);
  const [isDragSelection, setIsDragSelection] = useState(false);
  const [mouseDownTime, setMouseDownTime] = useState<number | null>(null);
  
  // Optimized query with proper error handling
  const { data, isLoading, error } = useQuery<CalendarData>({
    queryKey: ["/api/calendar/blocked-dates"],
    refetchInterval: 5 * 60 * 1000, // 5 minutes
    staleTime: 0,
    retry: 3,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  // Fetch active promotional offers
  const { data: promotionalOffers } = useQuery({
    queryKey: ["/api/promotional-offers"],
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  // Compute 6-month pricing window
  const pricingRange = useMemo(() => {
    const start = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const end = new Date(start);
    end.setMonth(end.getMonth() + 6);
    return {
      start: formatDateString(start),
      end: formatDateString(end)
    };
  }, [currentDate]);

  // Fetch custom daily rates from backend
  const { data: pricingData } = useQuery<{ date: string; rate: number }[]>({
    queryKey: ['pricing', { start: pricingRange.start, end: pricingRange.end, stayLength: null }],
    queryFn: async () => {
      const response = await fetch(`/api/pricing?start=${pricingRange.start}&end=${pricingRange.end}`);
      if (!response.ok) throw new Error('Failed to fetch pricing');
      return response.json();
    },
    staleTime: 12 * 60 * 60 * 1000, // 12 hours
    refetchInterval: 30 * 60 * 1000, // 30 minutes background refresh
  });

  // Create Map for O(1) custom rate lookups
  const customRatesMap = useMemo(() => {
    if (!pricingData) return new Map<string, number>();
    return new Map(pricingData.map(item => [item.date, item.rate]));
  }, [pricingData]);
  
  const blockedDates = data?.blockedDates || [];
  const checkInDates = data?.checkInDates || [];
  const checkOutDates = data?.checkOutDates || [];
  
  // Create Set for O(1) date lookups
  const blockedDateSet = useMemo(() => createDateSet(blockedDates), [blockedDates]);
  const checkInDateSet = useMemo(() => createDateSet(checkInDates), [checkInDates]);
  const checkOutDateSet = useMemo(() => createDateSet(checkOutDates), [checkOutDates]);

  // Use shared calendar data utility
  const calendarData = useCalendarData(currentDate);
  
  // Listen for promotional date selection events
  useEffect(() => {
    const handlePromotionalDateSelection = (event: CustomEvent) => {
      const { startDate, endDate, discountedPrice, originalPrice, discountPercentage } = event.detail;
      setSelectedRange({
        startDate,
        endDate,
        discountedPrice,
        originalPrice,
        discountPercentage,
      });
      
      // Navigate to the month containing the start date
      const promotionalStartDate = new Date(startDate);
      setCurrentDate(promotionalStartDate);
    };

    // Listen for date range selection events (from booking form)
    const handleDateRangeSelection = (event: CustomEvent) => {
      const { checkIn, checkOut } = event.detail;
      if (checkIn && checkOut) {
        setSelectedRange({
          startDate: checkIn,
          endDate: checkOut,
        });
        
        // Navigate to the month containing the start date
        const startDate = new Date(checkIn);
        setCurrentDate(startDate);
      }
    };

    // Listen for navigation requests (from suggested dates)
    const handleNavigateToMonth = (event: CustomEvent) => {
      const { date } = event.detail;
      if (date) {
        const targetDate = new Date(date);
        setCurrentDate(targetDate);
      }
    };

    window.addEventListener('selectPromotionalDates', handlePromotionalDateSelection as EventListener);
    window.addEventListener('dateRangeSelected', handleDateRangeSelection as EventListener);
    window.addEventListener('navigateToMonth', handleNavigateToMonth as EventListener);
    
    return () => {
      window.removeEventListener('selectPromotionalDates', handlePromotionalDateSelection as EventListener);
      window.removeEventListener('dateRangeSelected', handleDateRangeSelection as EventListener);
      window.removeEventListener('navigateToMonth', handleNavigateToMonth as EventListener);
    };
  }, []);
  
  // Memoized helper functions using shared utilities
  const isBlocked = useCallback((date: Date) => {
    return blockedDateSet.has(formatDateString(date));
  }, [blockedDateSet]);

  const isCheckIn = useCallback((date: Date) => {
    return checkInDateSet.has(formatDateString(date));
  }, [checkInDateSet]);

  const isCheckOut = useCallback((date: Date) => {
    return checkOutDateSet.has(formatDateString(date));
  }, [checkOutDateSet]);

  const isToday = useCallback((date: Date) => {
    return date.toDateString() === calendarData.today.toDateString();
  }, [calendarData.today]);
  
  const getRateForDate = useCallback((date: Date, stayLength?: number) => {
    // Check custom rates first, then fall back to seasonal
    const dateStr = formatDateString(date);
    const customRate = customRatesMap.get(dateStr);
    const baseRate = customRate !== undefined ? customRate : getSeasonalRate(date, stayLength);
    
    // Check for active promotional offers
    const today = new Date();
    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);
    
    if (promotionalOffers && Array.isArray(promotionalOffers)) {
      // Find active promotional offers valid for this date
      const activePromo = promotionalOffers.find((offer: any) => {
        if (!offer.isActive) return false;
        
        const validUntil = new Date(offer.validUntil);
        const startDate = new Date(offer.startDate);
        const endDate = new Date(offer.endDate);
        
        // Check if offer is still valid and date falls within promotional period
        return today <= validUntil && checkDate >= startDate && checkDate <= endDate;
      });
      
      if (activePromo) {
        return activePromo.discountedPrice;
      }
    }
    
    // Check for last-minute booking discount (next 7 days)
    const todayNormalized = new Date(today);
    todayNormalized.setHours(0, 0, 0, 0);
    const diffTime = checkDate.getTime() - todayNormalized.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    // Apply last-minute discount if date is within next 7 days and not blocked
    if (diffDays > 0 && diffDays <= 7 && !isBlocked(date) && baseRate === 210) {
      return 168; // 20% discount: €210 -> €168
    }
    
    return baseRate;
  }, [customRatesMap, checkInDates, promotionalOffers, isBlocked]);

  const isDiscountedRate = useCallback((date: Date, stayLength?: number) => {
    const baseRate = getSeasonalRate(date, stayLength);
    const actualRate = getRateForDate(date, stayLength);
    return actualRate < baseRate;
  }, [getRateForDate]);
  
  // Handle click-to-select functionality
  const handleDateClick = useCallback((date: Date) => {
    const dateStr = formatDateString(date);
    
    // Basic validation - only block past dates and dates outside current month
    if (isPastDate(date) || !isCurrentMonth(date, calendarData.month)) {
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
  }, [calendarData.month, clickSelectionStart, isDragSelection, isSelecting, mouseDownTime]);

  // Handle interactive drag selection - only starts drag on mouse move
  const handleDateMouseDown = useCallback((date: Date) => {
    const dateStr = formatDateString(date);
    
    // Basic validation - only block past dates and dates outside current month
    if (isPastDate(date) || !isCurrentMonth(date, calendarData.month)) {
      return;
    }
    
    // Record mouse down time and date for both drag and click detection
    setMouseDownTime(Date.now());
    setSelectionStart(dateStr);
    
    // Don't start drag immediately - wait for mouse move to distinguish from click
  }, [calendarData.month]);

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
    
    // Basic validation - only block past dates and dates outside current month
    if (isPastDate(date) || !isCurrentMonth(date, calendarData.month)) {
      return;
    }
    
    // Determine start and end dates based on selection direction
    const startDate = selectionStart <= dateStr ? selectionStart : dateStr;
    const endDate = selectionStart <= dateStr ? dateStr : selectionStart;
    
    setTempSelection({
      startDate,
      endDate,
    });
  }, [isSelecting, selectionStart, calendarData.month, mouseDownTime, isDragSelection]);

  const handleDateMouseUp = useCallback(() => {
    // If we have a drag selection, complete it
    if (isDragSelection && isSelecting && tempSelection.startDate && tempSelection.endDate) {
      setSelectedRange({
        startDate: tempSelection.startDate,
        endDate: tempSelection.endDate,
      });
      
      // Dispatch event to update booking form
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
    } else if (isCheckIn(date)) {
      // Check-in date: half available (green) until 4pm, half booked (red) after 4pm
      classes += "bg-gradient-to-r from-green-50 to-red-100 text-gray-700 font-medium border border-gray-300 ";
    } else if (isCheckOut(date)) {
      // Check-out date: half booked (red) until 11am, half available (green) after 11am
      classes += "bg-gradient-to-r from-red-100 to-green-50 text-gray-700 font-medium border border-gray-300 ";
    } else if (isBlocked(date)) {
      classes += "bg-red-100 text-red-800 font-medium ";
    } else {
      classes += "bg-green-50 text-green-700 hover:bg-green-100 cursor-pointer hover:shadow-sm ";
    }
    
    return classes;
  }, [calendarData.month, isCheckIn, isCheckOut, isBlocked, isInSelectionRange, isSelectionBoundary, clickSelectionStart, isDragSelection]);
  
  // Navigation functions
  const goToPreviousMonth = useCallback(() => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() - 1);
      return newDate;
    });
  }, []);
  
  const goToNextMonth = useCallback(() => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + 1);
      return newDate;
    });
  }, []);
  
  // Format month/year display - using fallback month names if translations are missing
  const monthNames = useMemo(() => [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ], []);
  
  const dayNames = useMemo(() => [
    'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'
  ], []);
  
  // Error handling
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800 text-sm">
          Failed to load calendar data - Please try refreshing the page
        </p>
      </div>
    );
  }
  
  return (
    <div className="bg-gray-50 rounded-lg shadow-sm border border-gray-200 p-2 sm:p-4 w-full max-w-lg">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-2 sm:mb-4">
        <button
          onClick={goToPreviousMonth}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Previous month"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <h3 className="text-lg font-semibold">
          {monthNames[calendarData.month]} {calendarData.year}
        </h3>
        <button
          onClick={goToNextMonth}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Next month"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
      
      {/* Loading state */}
      {isLoading && (
        <div className="text-center py-4">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-32 mx-auto"></div>
          </div>
        </div>
      )}
      
      {/* Day names header */}
      <div className="grid grid-cols-7 gap-1 mb-1 sm:mb-2">
        {dayNames.map((day, index) => (
          <div key={index} className="text-center text-sm font-medium text-gray-600 py-2">
            {day}
          </div>
        ))}
      </div>
      
      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1" onMouseLeave={handleCalendarMouseLeave}>
        {calendarData.weeks.map((week, weekIndex) =>
          week.map((date, dayIndex) => {
            const rate = getRateForDate(date);
            // Allow selection on: available dates, checkout dates, and current month dates that aren't in the past
            const available = !isPastDate(date) && isCurrentMonth(date, calendarData.month);
            
            // Check if this date is in the selected promotional range
            const dateString = formatDateString(date);
            const isInSelectedRange = selectedRange.startDate && selectedRange.endDate && 
              dateString >= selectedRange.startDate && dateString <= selectedRange.endDate;
            const isPromotionalPrice = isInSelectedRange && selectedRange.discountedPrice;
            
            // Check-out dates: if past, show as past; if future, show half red (left) and half green (right)
            if (isCheckOut(date) && isCurrentMonth(date, calendarData.month)) {
              // If checkout date is in the past, show as past date
              if (isPastDate(date)) {
                return (
                  <div
                    key={`${weekIndex}-${dayIndex}`}
                    className="w-10 h-10 sm:w-12 sm:h-12 flex flex-col items-center justify-center text-xs rounded-md transition-colors p-1 text-gray-400"
                    title="Past date"
                  >
                    <span className="font-medium">
                      {date.getDate()}
                    </span>
                  </div>
                );
              }
              // If checkout date is today or future, show half red (left) and half green (right) with clean split
              return (
                <div
                  key={`${weekIndex}-${dayIndex}`}
                  data-testid={`calendar-checkout-${formatDateString(date)}`}
                  className="w-10 h-10 sm:w-12 sm:h-12 flex flex-col items-center justify-center text-xs rounded-md transition-colors p-1 relative overflow-hidden border-2 border-orange-400"
                  title={`Check-out until 12pm, then available at €${rate}/night`}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleDateMouseDown(date);
                  }}
                  onMouseEnter={() => handleDateMouseEnter(date)}
                  onMouseUp={handleDateMouseUp}
                  onClick={() => handleDateClick(date)}
                  style={{ userSelect: 'none', cursor: available ? 'pointer' : 'default' }}
                >
                  {/* Left half (red) - occupied until 12pm */}
                  <div className="absolute top-0 left-0 w-1/2 h-full bg-red-100"></div>
                  {/* Right half (green) - available from 12pm */}
                  <div className="absolute top-0 right-0 w-1/2 h-full bg-green-50"></div>
                  {/* Content overlay */}
                  <div className="relative z-10 flex flex-col items-center justify-center text-gray-700 font-medium">
                    <span className="font-medium">
                      {date.getDate()}
                    </span>
                    <span className={`text-xs ${isDiscountedRate(date) ? 'text-red-600' : 'text-green-600'}`}>
                      €{rate}
                    </span>
                  </div>
                  {/* Selection highlighting for checkout dates */}
                  {isInSelectionRange(date) && isCurrentMonth(date, calendarData.month) && !isPastDate(date) && (
                    <div className="absolute inset-0 border-2 border-blue-400 rounded-md pointer-events-none"></div>
                  )}
                </div>
              );
            }
            
            // Check-in dates get special split-color treatment (including today)
            if (isCheckIn(date) && isCurrentMonth(date, calendarData.month)) {
              return (
                <div
                  key={`${weekIndex}-${dayIndex}`}
                  data-testid={`calendar-checkin-${formatDateString(date)}`}
                  className="w-10 h-10 sm:w-12 sm:h-12 flex flex-col items-center justify-center text-xs rounded-md transition-colors p-1 relative overflow-hidden border-2 border-orange-400"
                  title={isToday(date) ? "Today - guests arriving at 4pm" : "Check-in day - guests arriving at 4pm"}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleDateMouseDown(date);
                  }}
                  onMouseEnter={() => handleDateMouseEnter(date)}
                  onMouseUp={handleDateMouseUp}
                  onClick={() => handleDateClick(date)}
                  style={{ userSelect: 'none', cursor: available ? 'pointer' : 'default' }}
                >
                  {/* Split background: left green, right red */}
                  <div className="absolute inset-0 flex">
                    <div className="w-1/2 bg-green-100"></div>
                    <div className="w-1/2 bg-red-100"></div>
                  </div>
                  <span className="font-medium relative z-10 text-gray-800">
                    {date.getDate()}
                  </span>
                  {/* Show rate on check-in dates */}
                  <span className={`text-xs relative z-10 ${isDiscountedRate(date) ? 'text-red-600' : 'text-green-600'}`}>
                    €{rate}
                  </span>
                  {/* Selection highlighting for check-in dates */}
                  {isInSelectionRange(date) && isCurrentMonth(date, calendarData.month) && !isPastDate(date) && (
                    <div className="absolute inset-0 border-2 border-blue-400 rounded-md pointer-events-none"></div>
                  )}
                </div>
              );
            }


            
            return (
              <div
                key={`${weekIndex}-${dayIndex}`}
                className={getCellClass(date)}
                title={available ? `${isPromotionalPrice ? `Special offer: €${selectedRange.discountedPrice}/night (was €${selectedRange.originalPrice})` : `€${rate}/night`}` : undefined}
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleDateMouseDown(date);
                }}
                onMouseEnter={() => handleDateMouseEnter(date)}
                onMouseUp={handleDateMouseUp}
                onClick={() => handleDateClick(date)}
                style={{ userSelect: 'none', cursor: available ? 'pointer' : 'default' }}
              >
                <span className={`font-medium ${isBlocked(date) && isCurrentMonth(date, calendarData.month) ? 'line-through' : ''}`}>
                  {date.getDate()}
                </span>
                {isCurrentMonth(date, calendarData.month) && !isPastDate(date) && !isBlocked(date) && (
                  <span className={`text-xs ${isPromotionalPrice ? 'text-blue-600 font-bold' : isDiscountedRate(date) ? 'text-red-600' : 'text-green-600'}`}>
                    €{isPromotionalPrice ? selectedRange.discountedPrice : rate}
                  </span>
                )}
                {isInSelectionRange(date) && isCurrentMonth(date, calendarData.month) && !isPastDate(date) && (
                  <div className="absolute inset-0 border-2 border-blue-400 rounded-md pointer-events-none"></div>
                )}
              </div>
            );
          })
        )}
      </div>
      
      {/* Show selection message */}
      {selectedRange.startDate && selectedRange.endDate && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="text-blue-800 font-medium text-sm">
              {selectedRange.discountPercentage ? t('specialOfferSelected') : t('datesSelected')}
            </span>
          </div>
          <p className="text-blue-700 text-xs mt-1">
            {new Date(selectedRange.startDate).toLocaleDateString()} - {new Date(selectedRange.endDate).toLocaleDateString()}
            {selectedRange.discountedPrice && (
              <span className="ml-2">
                €{selectedRange.discountedPrice}/night ({t('was')} €{selectedRange.originalPrice})
              </span>
            )}
          </p>
          {!selectedRange.discountedPrice && (
            <p className="text-blue-600 text-xs mt-1">
              {t('datesAutoFilled')}
            </p>
          )}
        </div>
      )}



      {/* Legend */}
      <div className="flex items-center justify-center gap-4 mt-2 sm:mt-4 text-xs">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-green-50 border border-green-200 rounded"></div>
          <span className="text-gray-600">{t('available')}</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-red-100 border border-red-200 rounded"></div>
          <span className="text-gray-600">{t('booked')}</span>
        </div>
        {selectedRange.startDate && (
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-blue-100 border border-blue-400 rounded ring-1 ring-blue-400"></div>
            <span className="text-gray-600">{t('specialOffer')}</span>
          </div>
        )}
      </div>
      
      {data?.lastUpdated && (
        <p className="text-xs text-gray-500 text-center mt-1 sm:mt-2">
          {t('lastUpdated')}: {new Date(data.lastUpdated).toLocaleString()}
        </p>
      )}
    </div>
  );
};

export default OptimizedCalendar;