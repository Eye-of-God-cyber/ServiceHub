import { ProviderBookingList } from "@/features/provider/bookings/components/ProviderBookingList";
import { BookingStatusFilter } from "@/features/provider/bookings/components/BookingStatusFilter";

interface PageProps {
  searchParams: { page?: string; status?: string };
}

export default function ProviderBookingsPage({ searchParams }: PageProps) {
  const page = searchParams.page ? parseInt(searchParams.page, 10) : 1;
  const status = searchParams.status || undefined;

  return (
    <div className="max-w-5xl mx-auto pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight">Bookings</h1>
        <BookingStatusFilter />
      </div>
      
      <ProviderBookingList page={page} limit={10} status={status} />
    </div>
  );
}
