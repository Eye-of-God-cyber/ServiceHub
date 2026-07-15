import { type ProviderBooking } from "../types/domain.types";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Calendar, User } from "lucide-react";
import { BookingStatusBadge } from "./BookingStatusBadge";
import { BookingStatusActions } from "./BookingStatusActions";

export function ProviderBookingCard({ booking }: { booking: ProviderBooking }) {
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(booking.scheduledAt);

  const formattedTime = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  }).format(booking.scheduledAt);

  const formattedCreatedAt = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(booking.createdAt);

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-medium text-muted-foreground">ID: #{booking.id}</span>
                <BookingStatusBadge status={booking.status} />
              </div>
              <h3 className="text-xl font-bold">{booking.serviceName}</h3>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-primary">
                ${booking.totalAmount.toFixed(2)}
              </div>
              {booking.discountAmount > 0 && (
                <div className="text-sm text-muted-foreground line-through">
                  ${booking.baseAmount.toFixed(2)}
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 text-sm">
            <div className="flex items-start gap-3">
              <User className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">{booking.customerName}</p>
                <p className="text-muted-foreground">{booking.customerEmail}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Scheduled For</p>
                <p className="text-muted-foreground">
                  {formattedDate} at {formattedTime}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Service Address</p>
                <p className="text-muted-foreground">
                  {booking.addressLine1}
                  {booking.addressLine2 && <>, {booking.addressLine2}</>}
                  <br />
                  {booking.addressCity}, {booking.addressState} {booking.addressPincode}
                </p>
              </div>
            </div>
          </div>
          
          {booking.notes && (
            <div className="mt-4 p-4 bg-muted/50 rounded-lg text-sm">
              <p className="font-medium mb-1">Customer Notes:</p>
              <p className="text-muted-foreground">{booking.notes}</p>
            </div>
          )}

          <div className="mt-6 pt-6 border-t flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-sm text-muted-foreground">
              Booked on {formattedCreatedAt}
            </div>
            <BookingStatusActions bookingId={booking.id} currentStatus={booking.status} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
