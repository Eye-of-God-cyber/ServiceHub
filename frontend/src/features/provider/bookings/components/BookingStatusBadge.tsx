import { Badge } from "@/components/ui/badge";
import { BOOKING_STATUS_STYLE } from "../constants/booking-status-style";
import { type BookingStatus } from "../constants/booking-status";

export function BookingStatusBadge({ status }: { status: BookingStatus }) {
  const config = BOOKING_STATUS_STYLE[status] || { variant: "default" };
  const label = status.replace("_", " ");
  
  return (
    <Badge variant={config.variant} className={config.className}>
      {label}
    </Badge>
  );
}
