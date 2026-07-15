import { DetailedBooking, BookingStatus } from "@/features/booking/types/domain.types";
import { BookingStatusBadge } from "@/features/booking/components/BookingStatusBadge";
import { useUpdateAdminBookingStatus } from "../hooks/useAdminBookings";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Loader2, Calendar, MapPin, CreditCard, User, Briefcase } from "lucide-react";

interface AdminBookingDetailsProps {
  booking: DetailedBooking | null;
  onClose: () => void;
}

export function AdminBookingDetails({ booking, onClose }: AdminBookingDetailsProps) {
  const [newStatus, setNewStatus] = useState<BookingStatus | "">("");
  const [cancellationReason, setCancellationReason] = useState("");
  
  const { mutate: updateStatus, isPending } = useUpdateAdminBookingStatus();

  if (!booking) return null;

  const handleUpdateStatus = () => {
    if (!newStatus) return;
    
    updateStatus({
      bookingId: booking.id,
      payload: {
        status: newStatus,
        ...(newStatus === "CANCELLED" && cancellationReason ? { cancellationReason } : {})
      }
    }, {
      onSuccess: () => {
        setNewStatus("");
        setCancellationReason("");
        onClose();
      }
    });
  };

  const formattedDate = new Intl.DateTimeFormat('en-US', {
    month: 'long', day: 'numeric', year: 'numeric',
    hour: 'numeric', minute: '2-digit',
  }).format(booking.scheduledAt);

  const formattedCreatedDate = new Intl.DateTimeFormat('en-US', {
    month: 'long', day: 'numeric', year: 'numeric',
  }).format(booking.createdAt);

  return (
    <Dialog open={!!booking} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" key={booking.id}>
        <DialogHeader>
          <div className="flex items-center justify-between gap-4 pr-6">
            <DialogTitle className="text-2xl">Booking Details</DialogTitle>
            <BookingStatusBadge status={booking.status} />
          </div>
          <DialogDescription>
            ID: {booking.id} • Created {formattedCreatedDate}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4 md:grid-cols-2">
          {/* Service Info */}
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">Service</h4>
              <p className="font-semibold text-lg">{booking.service.name}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">Schedule & Location</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span>{formattedDate}</span>
                </div>
                <div className="flex items-start gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-primary mt-0.5" />
                  <span>{booking.address.formattedAddress}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Info */}
          <div className="space-y-4 bg-muted/30 p-4 rounded-xl border">
            <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <CreditCard className="w-4 h-4" /> Payment Details
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Base Amount</span>
                <span>${booking.baseAmount.toFixed(2)}</span>
              </div>
              {booking.discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Discount</span>
                  <span>-${booking.discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-base pt-2 border-t">
                <span>Total Amount</span>
                <span>${booking.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Customer & Provider */}
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2 mb-2">
                <User className="w-4 h-4" /> Customer
              </h4>
              <div className="p-3 bg-muted/50 rounded-lg text-sm space-y-1">
                <p className="font-medium">{booking.customer.name}</p>
                <p className="text-muted-foreground">{booking.customer.email}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2 mb-2">
                <Briefcase className="w-4 h-4" /> Provider
              </h4>
              <div className="p-3 bg-muted/50 rounded-lg text-sm space-y-1">
                <p className="font-medium">{booking.provider.name}</p>
                <p className="text-muted-foreground">{booking.provider.email}</p>
                {booking.provider.phone && <p className="text-muted-foreground">{booking.provider.phone}</p>}
              </div>
            </div>
          </div>
        </div>

        {/* Admin Actions */}
        <div className="mt-6 border-t pt-6">
          <h4 className="text-sm font-medium text-muted-foreground mb-4">Admin Actions (Override Status)</h4>
          <div className="flex flex-col sm:flex-row gap-3">
            <Select 
              value={newStatus} 
              onValueChange={(val) => setNewStatus(val as BookingStatus)}
            >
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Select new status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PENDING">PENDING</SelectItem>
                <SelectItem value="CONFIRMED">CONFIRMED</SelectItem>
                <SelectItem value="IN_PROGRESS">IN_PROGRESS</SelectItem>
                <SelectItem value="COMPLETED">COMPLETED</SelectItem>
                <SelectItem value="CANCELLED">CANCELLED</SelectItem>
                <SelectItem value="NO_SHOW">NO_SHOW</SelectItem>
              </SelectContent>
            </Select>

            {newStatus === "CANCELLED" && (
              <Input
                placeholder="Cancellation reason (required)"
                value={cancellationReason}
                onChange={(e) => setCancellationReason(e.target.value)}
                className="flex-1"
              />
            )}

            <Button 
              onClick={handleUpdateStatus} 
              disabled={!newStatus || (newStatus === "CANCELLED" && !cancellationReason) || isPending}
            >
              {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Update Status
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
