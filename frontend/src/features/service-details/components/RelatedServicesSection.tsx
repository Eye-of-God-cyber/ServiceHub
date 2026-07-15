import { ServiceCard } from "@/features/catalog/components/ServiceCard";
import type { CatalogService } from "@/features/catalog/types/domain.types";

interface RelatedServicesSectionProps {
  services: CatalogService[];
}

export function RelatedServicesSection({ services }: RelatedServicesSectionProps) {
  if (services.length === 0) {
    return null;
  }

  return (
    <div>
      <h3 className="text-xl font-bold tracking-tight mb-6">Related Services</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {services.map((service) => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </div>
    </div>
  );
}
