import type { DetailedBooking } from "../types/domain.types";
import { BookingCard } from "./BookingCard";
import { BookingEmptyState } from "./BookingEmptyState";

interface BookingListProps {
  bookings: DetailedBooking[];
  isLoading: boolean;
  error?: Error | null;
}

export function BookingList({ bookings, isLoading, error }: BookingListProps) {
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
      <div className="grid gap-4 md:grid-cols-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-48 rounded-2xl bg-muted/50 animate-pulse border" />
        ))}
      </div>
    );
  }

  if (bookings.length === 0) {
    return <BookingEmptyState />;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {bookings.map((booking) => (
        <BookingCard key={booking.id} booking={booking} />
      ))}
    </div>
  );
}
