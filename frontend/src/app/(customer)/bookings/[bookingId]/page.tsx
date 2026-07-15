"use client";

import { use, useState } from "react";
import Link from "next/link";
import { ArrowLeft, MapPin, Tag, User, Receipt, Clock, CheckCircle2 } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import { Button } from "@/components/ui/button";

import { useBookingDetails, useCancelBooking } from "@/features/booking/hooks";
import { BookingStatusBadge, CancelBookingModal } from "@/features/booking/components";

export default function BookingDetailsPage({
  params,
}: {
  params: Promise<{ bookingId: string }>;
}) {
  const resolvedParams = use(params);
  const { bookingId } = resolvedParams;

  const { data: booking, isLoading, error } = useBookingDetails(bookingId);
  const { mutate: cancelBooking, isPending: isCancelling } = useCancelBooking();

  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="container py-8 max-w-4xl mx-auto space-y-6">
        <div className="h-8 w-32 bg-muted animate-pulse rounded" />
        <div className="h-48 bg-muted animate-pulse rounded-2xl" />
        <div className="grid md:grid-cols-2 gap-6">
          <div className="h-64 bg-muted animate-pulse rounded-2xl" />
          <div className="h-64 bg-muted animate-pulse rounded-2xl" />
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="container py-12 text-center max-w-md mx-auto">
        <h2 className="text-2xl font-bold mb-4">Booking not found</h2>
        <p className="text-muted-foreground mb-6">
          The booking you are looking for does not exist or you do not have permission to view it.
        </p>
        <Button render={<Link href={ROUTES.BOOKINGS} />} />
          Back to Bookings
      </div>
    );
  }

  const formattedDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  }).format(booking.scheduledAt).replace(' at ', ' at ');

  const canCancel = booking.status === "PENDING" || booking.status === "CONFIRMED";

  const handleConfirmCancel = (reason: string) => {
    cancelBooking(
      { bookingId: booking.id, reason },
      {
        onSuccess: () => {
          setIsCancelModalOpen(false);
        },
      }
    );
  };

  return (
    <div className="container py-8 max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6">
        <div>
          <Link
            href={ROUTES.BOOKINGS}
            className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors mb-3"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Bookings
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-extrabold tracking-tight">Booking #{booking.id}</h1>
            <BookingStatusBadge status={booking.status} className="text-sm px-3 py-1" />
          </div>
        </div>
        
        {canCancel && (
          <Button 
            variant="destructive" 
            onClick={() => setIsCancelModalOpen(true)}
            className="shadow-sm"
          >
            Cancel Booking
          </Button>
        )}
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        
        {/* Main Details */}
        <div className="md:col-span-2 space-y-8">
          
          {/* Service Info */}
          <section className="space-y-4">
            <h2 className="text-lg font-bold flex items-center gap-2 border-b pb-2">
              <Tag className="w-5 h-5 text-primary" />
              Service Details
            </h2>
            <div className="bg-card border rounded-2xl p-6 shadow-sm flex gap-6 items-start">
              {booking.service.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img 
                  src={booking.service.imageUrl} 
                  alt={booking.service.name} 
                  className="w-24 h-24 rounded-xl object-cover border"
                />
              ) : (
                <div className="w-24 h-24 rounded-xl bg-muted flex items-center justify-center border">
                  <Tag className="w-8 h-8 text-muted-foreground/50" />
                </div>
              )}
              
              <div>
                <h3 className="text-xl font-bold mb-1">{booking.service.name}</h3>
                <p className="text-muted-foreground text-sm flex items-center gap-2 mb-4">
                  <Clock className="w-4 h-4" />
                  Scheduled for {formattedDate}
                </p>
                {booking.notes && (
                  <div className="bg-muted/30 p-3 rounded-lg text-sm border">
                    <span className="font-semibold block mb-1">Your Notes:</span>
                    {booking.notes}
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Provider Info */}
          <section className="space-y-4">
            <h2 className="text-lg font-bold flex items-center gap-2 border-b pb-2">
              <User className="w-5 h-5 text-primary" />
              Professional
            </h2>
            <div className="bg-card border rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center border text-lg font-bold text-primary">
                  {booking.provider.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-lg">{booking.provider.name}</h3>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground mt-1">
                    {booking.provider.phone && <span>{booking.provider.phone}</span>}
                    <span>{booking.provider.email}</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Location Info */}
          <section className="space-y-4">
            <h2 className="text-lg font-bold flex items-center gap-2 border-b pb-2">
              <MapPin className="w-5 h-5 text-primary" />
              Service Address
            </h2>
            <div className="bg-card border rounded-2xl p-6 shadow-sm flex gap-4">
              <div className="bg-primary/10 p-2.5 rounded-full h-fit">
                <MapPin className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">{booking.address.formattedAddress}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {booking.address.city}, {booking.address.state} {booking.address.pincode}
                </p>
              </div>
            </div>
          </section>

        </div>

        {/* Sidebar */}
        <div className="md:col-span-1 space-y-8">
          
          {/* Price Summary */}
          <div className="bg-card border rounded-2xl overflow-hidden shadow-sm sticky top-24">
            <div className="bg-muted/30 p-5 border-b">
              <h2 className="font-bold flex items-center gap-2">
                <Receipt className="w-5 h-5 text-primary" />
                Payment Summary
              </h2>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Base Amount</span>
                <span className="font-medium">${booking.baseAmount.toFixed(2)}</span>
              </div>
              
              {booking.discountAmount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Discount</span>
                  <span className="font-medium">-${booking.discountAmount.toFixed(2)}</span>
                </div>
              )}
              
              <div className="border-t pt-4 flex justify-between items-center">
                <span className="font-bold text-foreground">Total</span>
                <span className="font-extrabold text-2xl">${booking.totalAmount.toFixed(2)}</span>
              </div>
            </div>
            
            <div className="bg-primary/5 p-4 border-t text-sm flex gap-3">
              <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
              <p className="text-muted-foreground">
                Payment is collected securely after the service is completed.
              </p>
            </div>
          </div>

        </div>
      </div>

      <CancelBookingModal 
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        onConfirm={handleConfirmCancel}
        isCancelling={isCancelling}
      />
    </div>
  );
}
