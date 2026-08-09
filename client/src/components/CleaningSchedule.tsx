import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Copy, Check, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from "@tanstack/react-query";

export default function CleaningSchedule() {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  // Fetch calendar events
  const { data: eventsData, isLoading } = useQuery({
    queryKey: ['/api/calendar/events'],
    queryFn: async () => {
      const response = await fetch('/api/calendar/events');
      return response.json();
    }
  });

  const events = eventsData?.events || [];

  // Format dates for WhatsApp message
  const formatCleaningSchedule = (events: any[]) => {
    if (!events || events.length === 0) return "No upcoming bookings";

    // Filter out past events and events beyond 45 days (only show next 45 days)
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset to start of day for comparison
    
    const fortyFiveDaysFromNow = new Date(today);
    fortyFiveDaysFromNow.setDate(fortyFiveDaysFromNow.getDate() + 45);
    
    const upcomingEvents = events.filter(event => {
      const startDate = new Date(event.startDate);
      // Only include actual reservations, not "Not available" blocks
      const isReservation = event.summary && (event.summary.includes('Reserved') || event.summary.includes('Reservation'));
      return startDate >= today && startDate <= fortyFiveDaysFromNow && isReservation;
    });

    if (upcomingEvents.length === 0) return "No upcoming bookings";

    // Sort events by start date
    const sortedEvents = upcomingEvents.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

    // Generate cleaning schedule in Spanish
    let schedule = `🏠 *Piso Arenal - Calendario de entrada salida*\n📅 ${sortedEvents.length} reserva${sortedEvents.length === 1 ? '' : 's'} próxima${sortedEvents.length === 1 ? '' : 's'}\n\n`;
    
    // Add cleaning reminder before the first booking
    if (sortedEvents.length > 0) {
      const firstBooking = sortedEvents[0];
      const firstStartDate = new Date(firstBooking.startDate);
      const firstArrivalDay = firstStartDate.toLocaleDateString('es-ES', { 
        weekday: 'long', 
        day: 'numeric', 
        month: 'long' 
      });
      schedule += `🧹 *Gracias por limpiar antes de: ${firstArrivalDay} antes de las 16:00*⏰\n\n`;
    }
    
    sortedEvents.forEach((event, index) => {
      const startDate = new Date(event.startDate);
      const endDate = new Date(event.endDate);
      
      // Guest arrival day in Spanish
      const arrivalDay = startDate.toLocaleDateString('es-ES', { 
        weekday: 'long', 
        day: 'numeric', 
        month: 'long' 
      });
      
      // Guest departure day in Spanish
      const departureDay = endDate.toLocaleDateString('es-ES', { 
        weekday: 'long', 
        day: 'numeric', 
        month: 'long' 
      });

      schedule += `🏠 *Reserva ${index + 1}*\n`;
      schedule += `📅 Llegada: ${arrivalDay} a las 16:00 (4:00 PM)\n`;
      schedule += `📅 Salida: ${departureDay} a las 12:00 (12:00 PM)\n`;
      
      // Calculate cleaning deadline for NEXT booking (if exists)
      if (index < sortedEvents.length - 1) {
        const nextBooking = sortedEvents[index + 1];
        const nextStartDate = new Date(nextBooking.startDate);
        const nextArrivalDay = nextStartDate.toLocaleDateString('es-ES', { 
          weekday: 'long', 
          day: 'numeric', 
          month: 'long' 
        });
        schedule += `🧹 *Gracias por limpiar antes de: ${nextArrivalDay} antes de las 16:00*⏰\n\n`;
      } else {
        // Last booking - no next booking to clean for
        schedule += `🧹 *Última reserva del período*⏰\n\n`;
      }
    });

    schedule += "¡Gracias! 🙏";

    return schedule;
  };

  const copyToClipboard = () => {
    if (!events || events.length === 0) return;
    
    const schedule = formatCleaningSchedule(events);
    navigator.clipboard.writeText(schedule).then(() => {
      setCopied(true);
      toast({
        title: "Copied!",
        description: "Cleaning schedule copied to clipboard. Ready to send via WhatsApp!",
      });
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      });
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Cleaning Schedule
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-gray-600">
            <RefreshCw className="w-4 h-4 animate-spin" />
            Loading schedule...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Cleaning Schedule
        </CardTitle>
        <CardDescription>
          Generate a WhatsApp message for your cleaning crew with upcoming check-in/check-out times
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium">WhatsApp Message Preview</h3>
            <Button 
              onClick={copyToClipboard}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? "Copied!" : "Copy"}
            </Button>
          </div>
          <div className="bg-white rounded border p-3 text-sm whitespace-pre-wrap font-mono">
            {formatCleaningSchedule(events)}
          </div>
        </div>
        
        <div className="text-sm text-gray-600 space-y-2">
          <p><strong>How to use:</strong></p>
          <ol className="list-decimal list-inside space-y-1">
            <li>Click "Copy" to copy the schedule to your clipboard</li>
            <li>Open WhatsApp and go to your cleaning crew chat</li>
            <li>Paste the message and send</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
}