import { BOOKING_STATUS } from "./booking-status";

export const BOOKING_STATUS_OPTIONS = [
  { label: "All Bookings", value: "ALL" },
  { label: "Pending", value: BOOKING_STATUS.PENDING },
  { label: "Confirmed", value: BOOKING_STATUS.CONFIRMED },
  { label: "In Progress", value: BOOKING_STATUS.IN_PROGRESS },
  { label: "Completed", value: BOOKING_STATUS.COMPLETED },
  { label: "Cancelled", value: BOOKING_STATUS.CANCELLED },
  { label: "No Show", value: BOOKING_STATUS.NO_SHOW },
] as const;
