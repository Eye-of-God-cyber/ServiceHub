"use client";

import { useState } from "react";
import { AdminBookingList } from "@/features/admin/bookings/components/AdminBookingList";
import { useAdminBookings } from "@/features/admin/bookings/hooks/useAdminBookings";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookingStatus } from "@/features/booking/types/domain.types";

export default function AdminBookingsPage() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<BookingStatus | "ALL">("ALL");
  const limit = 12;

  const { data, isLoading, error } = useAdminBookings({
    page,
    limit,
    ...(status !== "ALL" ? { status } : {}),
  });

  return (
    <div className="flex flex-col gap-6 p-6 md:p-8 max-w-[1600px] mx-auto w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Booking Management</h1>
          <p className="text-muted-foreground mt-2">
            View and manage all platform bookings across all customers and providers.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Select 
            value={status} 
            onValueChange={(val) => {
              setStatus(val as BookingStatus | "ALL");
              setPage(1); // Reset page on filter change
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Statuses</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="CONFIRMED">Confirmed</SelectItem>
              <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
              <SelectItem value="COMPLETED">Completed</SelectItem>
              <SelectItem value="CANCELLED">Cancelled</SelectItem>
              <SelectItem value="NO_SHOW">No Show</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <AdminBookingList 
        bookings={data?.data || []} 
        isLoading={isLoading} 
        error={error} 
      />

      {data && data.meta.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <Button
            variant="outline"
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground min-w-[4rem] text-center">
            {page} / {data.meta.totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => setPage(p => p + 1)}
            disabled={page >= data.meta.totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
