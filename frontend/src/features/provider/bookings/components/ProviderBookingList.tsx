"use client";

import { useProviderBookings } from "../hooks/useProviderBookings";
import { ProviderBookingCard } from "./ProviderBookingCard";
import { CalendarX, AlertCircle, Loader2 } from "lucide-react";

export function ProviderBookingList({ page, limit, status }: { page: number; limit: number; status?: string }) {
  const { data, isLoading, isError, refetch } = useProviderBookings({ page, limit, status });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-8 text-center bg-destructive/10 rounded-xl border border-destructive/20 text-destructive">
        <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-80" />
        <h3 className="text-lg font-bold mb-2">Failed to load bookings</h3>
        <p className="mb-4">There was a problem loading your bookings. Please try again.</p>
        <button onClick={() => refetch()} className="underline font-medium">Retry</button>
      </div>
    );
  }

  if (!data?.items.length) {
    return (
      <div className="p-12 text-center bg-muted/30 rounded-xl border border-dashed">
        <CalendarX className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-bold mb-2">No bookings found</h3>
        <p className="text-muted-foreground">You don&apos;t have any bookings matching the current filters.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {data.items.map((booking) => (
          <ProviderBookingCard key={booking.id} booking={booking} />
        ))}
      </div>

      {data.meta.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <span className="text-sm text-muted-foreground">Page {page} of {data.meta.totalPages}</span>
        </div>
      )}
    </div>
  );
}
