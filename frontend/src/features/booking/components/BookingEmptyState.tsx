import { CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";

export function BookingEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed rounded-2xl bg-muted/20">
      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
        <CalendarDays className="w-8 h-8 text-primary" />
      </div>
      <h3 className="text-xl font-bold mb-2">No bookings found</h3>
      <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
        You haven&apos;t booked any services yet. Browse our catalog to find professionals near you.
      </p>
      <Button render={<Link href={ROUTES.CATALOG} />}>
        Browse Services
      </Button>
    </div>
  );
}
