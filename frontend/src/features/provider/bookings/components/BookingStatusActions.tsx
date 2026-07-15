"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useUpdateBookingStatus } from "../hooks/useUpdateBookingStatus";
import { BOOKING_STATUS_ACTIONS, type BookingAction } from "../constants/booking-status-actions";
import { type BookingStatus } from "../constants/booking-status";
import { Loader2 } from "lucide-react";

export function BookingStatusActions({ bookingId, currentStatus }: { bookingId: string, currentStatus: BookingStatus }) {
  const [selectedAction, setSelectedAction] = useState<BookingAction | null>(null);
  const [reason, setReason] = useState("");
  const { mutate: updateStatus, isPending } = useUpdateBookingStatus();

  const actions = BOOKING_STATUS_ACTIONS[currentStatus] || [];

  if (actions.length === 0) return null;

  const handleActionClick = (action: BookingAction) => {
    if (action.requiresReason) {
      setSelectedAction(action);
      setReason("");
    } else {
      updateStatus({ id: bookingId, payload: { status: action.targetStatus } });
    }
  };

  const handleConfirmWithReason = () => {
    if (!selectedAction) return;
    updateStatus(
      { id: bookingId, payload: { status: selectedAction.targetStatus, cancellationReason: reason } },
      { onSuccess: () => setSelectedAction(null) }
    );
  };

  return (
    <>
      <div className="flex flex-wrap gap-2">
        {actions.map((action) => (
          <Button
            key={action.targetStatus}
            variant={action.variant}
            onClick={() => handleActionClick(action)}
            disabled={isPending}
            size="sm"
          >
            {isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
            {action.label}
          </Button>
        ))}
      </div>

      <Dialog open={!!selectedAction} onOpenChange={(open) => !open && setSelectedAction(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedAction?.label} Booking</DialogTitle>
            <DialogDescription>
              Please provide a reason for this action. This will be recorded and shared with the customer.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Reason (optional, max 255 chars)"
            disabled={isPending}
            maxLength={255}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedAction(null)} disabled={isPending}>
              Cancel
            </Button>
            <Button variant={selectedAction?.variant} onClick={handleConfirmWithReason} disabled={isPending}>
              {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
