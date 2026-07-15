import { BOOKING_STATUS, type BookingStatus } from "./booking-status";

export interface BookingAction {
  label: string;
  targetStatus: BookingStatus;
  variant: "default" | "secondary" | "destructive" | "outline";
  requiresReason?: boolean;
}

export const BOOKING_STATUS_ACTIONS: Record<BookingStatus, BookingAction[]> = {
  [BOOKING_STATUS.PENDING]: [
    { label: "Accept", targetStatus: BOOKING_STATUS.CONFIRMED, variant: "default" },
    { label: "Reject", targetStatus: BOOKING_STATUS.CANCELLED, variant: "destructive", requiresReason: true },
  ],
  [BOOKING_STATUS.CONFIRMED]: [
    { label: "Start Job", targetStatus: BOOKING_STATUS.IN_PROGRESS, variant: "default" },
    { label: "Cancel", targetStatus: BOOKING_STATUS.CANCELLED, variant: "destructive", requiresReason: true },
  ],
  [BOOKING_STATUS.IN_PROGRESS]: [
    { label: "Complete Job", targetStatus: BOOKING_STATUS.COMPLETED, variant: "default" },
    { label: "No Show", targetStatus: BOOKING_STATUS.NO_SHOW, variant: "destructive" },
  ],
  [BOOKING_STATUS.COMPLETED]: [],
  [BOOKING_STATUS.CANCELLED]: [],
  [BOOKING_STATUS.NO_SHOW]: [],
};
