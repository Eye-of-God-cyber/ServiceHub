import Link from "next/link";
import { Calendar, MapPin, ChevronRight } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import { BookingStatusBadge } from "./BookingStatusBadge";
import type { DetailedBooking } from "../types/domain.types";

interface BookingCardProps {
  booking: DetailedBooking;
}

export function BookingCard({ booking }: BookingCardProps) {
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  }).format(booking.scheduledAt);

  return (
    <Link 
      href={ROUTES.BOOKING_DETAIL(booking.id)}
      className="block group bg-card border rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:border-primary/40 transition-all"
    >
      <div className="p-5">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
              {booking.service.name}
            </h3>
            <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1.5">
              <span className="font-medium text-foreground">{booking.provider.name}</span>
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <BookingStatusBadge status={booking.status} />
            <span className="font-bold text-lg">${booking.totalAmount.toFixed(2)}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-border/50">
          <div className="flex items-center text-sm text-muted-foreground gap-2">
            <Calendar className="w-4 h-4 text-primary/70 shrink-0" />
            <span className="truncate">{formattedDate}</span>
          </div>
          <div className="flex items-center justify-between sm:justify-start text-sm text-muted-foreground gap-2">
            <div className="flex items-center gap-2 truncate">
              <MapPin className="w-4 h-4 text-primary/70 shrink-0" />
              <span className="truncate">{booking.address.city}, {booking.address.state}</span>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground/50 sm:hidden" />
          </div>
        </div>
      </div>
    </Link>
  );
}
