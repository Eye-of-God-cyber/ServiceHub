"use client";

import { use, useState } from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";

import { useServiceDetails } from "@/features/catalog/hooks";
import { useAddresses, useCreateBooking } from "@/features/booking/hooks";

import {
  DateTimeSelector,
  AddressSelector,
  BookingSummary,
  BookingSuccess,
} from "@/features/booking/components";

import type { BookingResult } from "@/features/booking/types/domain.types";
import { Button } from "@/components/ui/button";

export default function BookingPage({
  params,
}: {
  params: Promise<{ serviceId: string; providerServiceId: string }>;
}) {
  const resolvedParams = use(params);
  const { serviceId, providerServiceId } = resolvedParams;

  // Queries
  const { data: service, isLoading: isLoadingService, isError: isErrorService } = useServiceDetails(serviceId);
  const { data: addresses = [], isLoading: isLoadingAddresses } = useAddresses();
  const { mutate: createBooking, isPending: isCreatingBooking, error: bookingError } = useCreateBooking();

  // Form State
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  
  // Result State
  const [bookingResult, setBookingResult] = useState<BookingResult | null>(null);

  // Derive active address (user selected or default)
  const activeAddressId = selectedAddressId ?? (addresses.length > 0 ? (addresses.find((a) => a.isDefault)?.id || addresses[0].id) : null);

  if (isLoadingService) {
    return (
      <div className="container py-8 max-w-5xl mx-auto space-y-6">
        <div className="h-8 w-32 bg-muted animate-pulse rounded" />
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="h-64 bg-muted animate-pulse rounded-2xl" />
            <div className="h-48 bg-muted animate-pulse rounded-2xl" />
          </div>
          <div className="h-96 bg-muted animate-pulse rounded-2xl" />
        </div>
      </div>
    );
  }

  if (isErrorService || !service) {
    return (
      <div className="container py-12 text-center max-w-md mx-auto">
        <h2 className="text-2xl font-bold mb-4">Service not found</h2>
        <Button render={<Link href={ROUTES.CATALOG} />}>
          Back to Catalog
        </Button>
      </div>
    );
  }

  // Find the selected provider from the service
  const provider = service.providers.find(
    (p) => p.providerServiceId === providerServiceId
  );

  if (!provider) {
    return (
      <div className="container py-12 text-center max-w-md mx-auto">
        <h2 className="text-2xl font-bold mb-4">Provider not available</h2>
        <p className="text-muted-foreground mb-6">
          The selected professional is not available for this service.
        </p>
        <Button render={<Link href={ROUTES.SERVICE_DETAIL(serviceId)} />}>
          Go Back
        </Button>
      </div>
    );
  }

  // Handle Success State
  if (bookingResult) {
    return (
      <div className="container py-12 max-w-5xl mx-auto">
        <BookingSuccess booking={bookingResult} />
      </div>
    );
  }

  const selectedAddress = addresses.find((a) => a.id === activeAddressId);
  const isSubmitDisabled = !selectedDate || !selectedTime || !activeAddressId;

  const handleSubmit = () => {
    if (isSubmitDisabled) return;

    // Combine date and time into ISO8601
    const scheduledAt = new Date(`${selectedDate}T${selectedTime}:00`).toISOString();

    createBooking(
      {
        providerServiceId: parseInt(providerServiceId, 10),
        addressId: parseInt(activeAddressId as string, 10),
        scheduledAt,
      },
      {
        onSuccess: (result) => {
          setBookingResult(result);
        },
      }
    );
  };

  return (
    <div className="container py-8 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6">
        <div>
          <Link
            href={ROUTES.SERVICE_DETAIL(serviceId)}
            className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors mb-3"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to {service.title}
          </Link>
          <h1 className="text-3xl font-extrabold tracking-tight">Complete Your Booking</h1>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 items-start relative">
        {/* Left Column: Form */}
        <div className="lg:col-span-2 space-y-8">
          
          <div className="p-6 border rounded-2xl bg-card shadow-sm space-y-6">
            <DateTimeSelector
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              onDateChange={setSelectedDate}
              onTimeChange={setSelectedTime}
            />
          </div>

          <div className="p-6 border rounded-2xl bg-card shadow-sm space-y-6">
            <AddressSelector
              addresses={addresses}
              selectedAddressId={activeAddressId}
              onSelectAddress={setSelectedAddressId}
              isLoading={isLoadingAddresses}
            />
          </div>

          {bookingError && (
            <div className="p-4 bg-destructive/10 text-destructive rounded-xl border border-destructive/20 text-sm">
              Failed to create booking: {bookingError.message || "Please check your details and try again."}
            </div>
          )}
        </div>

        {/* Right Column: Summary */}
        <div className="lg:col-span-1">
          <BookingSummary
            service={service}
            provider={provider}
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            selectedAddress={selectedAddress}
            onSubmit={handleSubmit}
            isSubmitting={isCreatingBooking}
            isSubmitDisabled={isSubmitDisabled}
          />
        </div>
      </div>
    </div>
  );
}
