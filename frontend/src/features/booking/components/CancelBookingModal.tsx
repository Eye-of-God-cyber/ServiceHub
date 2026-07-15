import { useState } from "react";
import { AlertTriangle, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CancelBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  isCancelling: boolean;
}

export function CancelBookingModal({ isOpen, onClose, onConfirm, isCancelling }: CancelBookingModalProps) {
  const [reason, setReason] = useState("");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
      <div className="bg-card w-full max-w-md rounded-2xl shadow-xl border overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-6 border-b flex items-center justify-between">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <AlertTriangle className="text-destructive w-5 h-5" />
            Cancel Booking
          </h3>
          <Button variant="ghost" size="icon" onClick={onClose} disabled={isCancelling}>
            <X className="w-5 h-5" />
          </Button>
        </div>
        
        <div className="p-6 overflow-y-auto space-y-4">
          <p className="text-sm text-muted-foreground">
            Are you sure you want to cancel this booking? This action cannot be undone.
          </p>
          <div className="space-y-2">
            <label htmlFor="reason" className="text-sm font-medium">
              Cancellation Reason (Optional)
            </label>
            <textarea
              id="reason"
              rows={3}
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Why are you cancelling?"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              disabled={isCancelling}
            />
          </div>
        </div>
        
        <div className="p-6 border-t bg-muted/10 flex justify-end gap-3 mt-auto">
          <Button variant="outline" onClick={onClose} disabled={isCancelling}>
            Keep Booking
          </Button>
          <Button variant="destructive" onClick={() => onConfirm(reason)} disabled={isCancelling}>
            {isCancelling ? "Cancelling..." : "Cancel Booking"}
          </Button>
        </div>
      </div>
    </div>
  );
}
