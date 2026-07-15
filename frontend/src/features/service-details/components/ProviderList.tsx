import { Users } from "lucide-react";
import type { ServiceProvider } from "@/features/catalog/types/domain.types";
import { ProviderCard } from "./ProviderCard";

interface ProviderListProps {
  providers: ServiceProvider[];
  serviceId: string;
}

export function ProviderList({ providers, serviceId }: ProviderListProps) {
  if (providers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center border rounded-xl bg-muted/30 border-dashed">
        <Users className="h-10 w-10 text-muted-foreground mb-4" />
        <h4 className="text-lg font-bold mb-2">No providers available</h4>
        <p className="text-muted-foreground text-sm max-w-sm">
          There are currently no professionals available for this service. Please check back later.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {providers.map((provider) => (
        <ProviderCard key={provider.id} provider={provider} serviceId={serviceId} />
      ))}
    </div>
  );
}
