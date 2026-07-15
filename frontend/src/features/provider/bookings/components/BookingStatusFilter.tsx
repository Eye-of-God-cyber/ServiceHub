"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BOOKING_STATUS_OPTIONS } from "../constants/booking-status-options";
import { useRouter, useSearchParams } from "next/navigation";

export function BookingStatusFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentStatus = searchParams.get("status") || "ALL";

  const handleStatusChange = (val: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (!val || val === "ALL") {
      params.delete("status");
    } else {
      params.set("status", val);
    }
    params.set("page", "1"); // Reset to page 1 on filter change
    router.push(`/provider/bookings?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">Status:</span>
      <Select value={currentStatus} onValueChange={handleStatusChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent>
          {BOOKING_STATUS_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
