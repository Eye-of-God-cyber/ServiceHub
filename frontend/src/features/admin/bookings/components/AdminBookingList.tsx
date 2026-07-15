import { useState } from "react";
import { DetailedBooking } from "@/features/booking/types/domain.types";
import { BookingStatusBadge } from "@/features/booking/components/BookingStatusBadge";
import { Calendar, MapPin, ChevronRight, User, Briefcase } from "lucide-react";
import { AdminBookingDetails } from "./AdminBookingDetails";

interface AdminBookingListProps {
  bookings: DetailedBooking[];
  isLoading: boolean;
  error?: Error | null;
}

export function AdminBookingList({ bookings, isLoading, error }: AdminBookingListProps) {
  const [selectedBooking, setSelectedBooking] = useState<DetailedBooking | null>(null);

  if (error) {
    return (
      <div className="p-8 text-center text-destructive bg-destructive/10 rounded-2xl border border-destructive/20">
        <h3 className="font-semibold mb-2">Failed to load bookings</h3>
        <p className="text-sm">{error.message}</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-56 rounded-2xl bg-muted/50 animate-pulse border" />
        ))}
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="p-12 text-center border-2 border-dashed rounded-2xl">
        <h3 className="text-lg font-semibold">No bookings found</h3>
        <p className="text-muted-foreground mt-2">Try adjusting your filters.</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {bookings.map((booking) => {
          const formattedDate = new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
          }).format(booking.scheduledAt);

          return (
            <div 
              key={booking.id}
              onClick={() => setSelectedBooking(booking)}
              className="block group bg-card border rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:border-primary/40 transition-all cursor-pointer"
            >
              <div className="p-5">
                <div className="flex justify-between items-start mb-4">
                  <div className="min-w-0 flex-1 pr-4">
                    <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors truncate">
                      {booking.service.name}
                    </h3>
                    <div className="text-sm text-muted-foreground mt-2 space-y-1">
                      <div className="flex items-center gap-1.5 truncate">
                        <User className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{booking.customer.name}</span>
                      </div>
                      <div className="flex items-center gap-1.5 truncate">
                        <Briefcase className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{booking.provider.name}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <BookingStatusBadge status={booking.status} />
                    <span className="font-bold text-lg">${booking.totalAmount.toFixed(2)}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-2 pt-4 border-t border-border/50">
                  <div className="flex items-center text-sm text-muted-foreground gap-2">
                    <Calendar className="w-4 h-4 text-primary/70 shrink-0" />
                    <span className="truncate">{formattedDate}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-muted-foreground gap-2">
                    <div className="flex items-center gap-2 truncate">
                      <MapPin className="w-4 h-4 text-primary/70 shrink-0" />
                      <span className="truncate">{booking.address.city}, {booking.address.state}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground/50" />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <AdminBookingDetails 
        booking={selectedBooking} 
        onClose={() => setSelectedBooking(null)} 
      />
    </>
  );
}
