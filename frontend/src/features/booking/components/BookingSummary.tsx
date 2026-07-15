import { Calendar, MapPin, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { DetailedService, ServiceProvider } from "@/features/catalog/types/domain.types";
import type { Address } from "../types/domain.types";

interface BookingSummaryProps {
  service: DetailedService;
  provider: ServiceProvider;
  selectedDate: string;
  selectedTime: string;
  selectedAddress?: Address;
  onSubmit: () => void;
  isSubmitting: boolean;
  isSubmitDisabled: boolean;
}

export function BookingSummary({
  service,
  provider,
  selectedDate,
  selectedTime,
  selectedAddress,
  onSubmit,
  isSubmitting,
  isSubmitDisabled,
}: BookingSummaryProps) {
  
  let formattedDateTime = "Select Date & Time";
  if (selectedDate && selectedTime) {
    try {
      const dateObj = new Date(`${selectedDate}T${selectedTime}`);
      formattedDateTime = new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      }).format(dateObj);
    } catch {
      // Ignore invalid dates during typing
    }
  }

  const basePrice = provider.startingPrice;

  return (
    <div className="rounded-2xl border bg-card shadow-sm sticky top-24 overflow-hidden flex flex-col h-[calc(100vh-8rem)]">
      <div className="bg-muted/30 p-6 border-b">
        <h3 className="text-xl font-bold tracking-tight">Booking Summary</h3>
      </div>
      
      <div className="p-6 space-y-6 flex-1 overflow-y-auto">
        
        {/* Service Info */}
        <div>
          <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Service</h4>
          <p className="font-medium text-base">{service.title}</p>
        </div>

        {/* Provider Info */}
        <div>
          <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Professional</h4>
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={provider.avatarUrl} 
              alt={provider.name} 
              className="w-10 h-10 rounded-full border shadow-sm"
            />
            <div>
              <p className="font-medium text-sm">{provider.name}</p>
              <div className="flex items-center text-xs text-muted-foreground mt-0.5">
                <Tag className="w-3 h-3 mr-1" />
                {provider.experienceYears} Years Experience
              </div>
            </div>
          </div>
        </div>

        {/* Schedule Info */}
        <div>
          <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Schedule</h4>
          <div className="flex items-start gap-2 text-sm">
            <Calendar className="w-4 h-4 mt-0.5 text-primary shrink-0" />
            <span className={!selectedDate || !selectedTime ? "text-muted-foreground italic" : "font-medium"}>
              {formattedDateTime}
            </span>
          </div>
        </div>

        {/* Address Info */}
        <div>
          <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Location</h4>
          <div className="flex items-start gap-2 text-sm">
            <MapPin className="w-4 h-4 mt-0.5 text-primary shrink-0" />
            <span className={!selectedAddress ? "text-muted-foreground italic" : "font-medium line-clamp-2"}>
              {selectedAddress ? selectedAddress.formattedAddress : "Select an address"}
            </span>
          </div>
        </div>

      </div>

      {/* Pricing & CTA - Pinned to bottom */}
      <div className="p-6 bg-muted/10 border-t mt-auto">
        <div className="flex justify-between items-center mb-6">
          <span className="text-muted-foreground font-medium">Total Amount</span>
          <span className="text-2xl font-bold text-foreground">
            ${basePrice.toFixed(2)}
          </span>
        </div>

        <Button 
          className="w-full rounded-full h-12 text-base font-semibold shadow-md"
          size="lg"
          onClick={onSubmit}
          disabled={isSubmitDisabled || isSubmitting}
        >
          {isSubmitting ? "Confirming Booking..." : "Confirm & Book"}
        </Button>
        <p className="text-xs text-center text-muted-foreground mt-3">
          You won&apos;t be charged until the service is completed.
        </p>
      </div>
    </div>
  );
}
