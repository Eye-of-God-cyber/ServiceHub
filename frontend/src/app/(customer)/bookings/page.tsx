"use client";

import { useBookings } from "@/features/booking/hooks";
import { BookingList } from "@/features/booking/components";

export default function BookingsPage() {
  // We can add filtering by status later if needed. For now, fetch all.
  const { data, isLoading, error } = useBookings();

  return (
    <div className="container py-8 max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight mb-2">My Bookings</h1>
        <p className="text-muted-foreground">
          View and manage all your past and upcoming service bookings.
        </p>
      </div>

      <BookingList 
        bookings={data?.data || []} 
        isLoading={isLoading} 
        error={error} 
      />
    </div>
  );
}
