import { BOOKING_STATUS, type BookingStatus } from "./booking-status";

export const BOOKING_STATUS_STYLE: Record<BookingStatus, { variant: "default" | "secondary" | "destructive" | "outline", className?: string }> = {
  [BOOKING_STATUS.PENDING]: { variant: "secondary", className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100" },
  [BOOKING_STATUS.CONFIRMED]: { variant: "secondary", className: "bg-blue-100 text-blue-800 hover:bg-blue-100" },
  [BOOKING_STATUS.IN_PROGRESS]: { variant: "secondary", className: "bg-indigo-100 text-indigo-800 hover:bg-indigo-100" },
  [BOOKING_STATUS.COMPLETED]: { variant: "secondary", className: "bg-green-100 text-green-800 hover:bg-green-100" },
  [BOOKING_STATUS.CANCELLED]: { variant: "destructive" },
  [BOOKING_STATUS.NO_SHOW]: { variant: "destructive", className: "bg-red-100 text-red-800 hover:bg-red-100" },
};
