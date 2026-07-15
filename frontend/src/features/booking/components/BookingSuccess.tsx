import { CheckCircle, Calendar, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import type { BookingResult } from "../types/domain.types";

interface BookingSuccessProps {
  booking: BookingResult;
}

export function BookingSuccess({ booking }: BookingSuccessProps) {
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  }).format(booking.scheduledAt).replace(' at ', ' at ');

  return (
    <div className="flex flex-col items-center text-center max-w-lg mx-auto py-12 px-4">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 shadow-sm">
        <CheckCircle className="w-10 h-10 text-green-600" />
      </div>
      
      <h2 className="text-3xl font-bold tracking-tight mb-3">Booking Confirmed!</h2>
      <p className="text-muted-foreground mb-8 text-lg">
        Your service has been successfully scheduled. The professional will arrive at the selected time.
      </p>

      <div className="w-full bg-card border rounded-2xl p-6 text-left shadow-sm mb-10">
        <div className="flex justify-between items-center mb-4 pb-4 border-b border-border/50">
          <span className="text-muted-foreground text-sm font-medium uppercase tracking-wider">Booking ID</span>
          <span className="font-mono font-bold bg-muted px-2 py-1 rounded text-sm">
            #{booking.id}
          </span>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <Calendar className="w-5 h-5 text-primary mt-0.5" />
            <div>
              <p className="font-semibold">{formattedDate}</p>
              <p className="text-sm text-muted-foreground mt-0.5">Please ensure someone is available at the address.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
        <Button 
          render={<Link href={ROUTES.DASHBOARD} />} 
          variant="outline" 
          size="lg"
          className="rounded-full"
        >
            Return to Dashboard
        </Button>
        <Button 
          render={<Link href={ROUTES.BOOKINGS} />} 
          size="lg"
          className="rounded-full shadow-md"
        >
            View My Bookings <ArrowRight className="ml-2 w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
