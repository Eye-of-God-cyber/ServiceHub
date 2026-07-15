import Link from "next/link";
import { Star, Clock, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ROUTES } from "@/constants/routes";
import type { CatalogService } from "../types/domain.types";

interface ServiceCardProps {
  service: CatalogService;
}

export function ServiceCard({ service }: ServiceCardProps) {
  return (
    <div className="group flex flex-col overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md">
      {/* Image Container */}
      <div className="relative aspect-video w-full overflow-hidden bg-muted">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={service.imageUrl}
          alt={service.title}
          className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute top-3 left-3">
          <Badge variant="secondary" className="bg-background/90 backdrop-blur-sm shadow-sm font-semibold">
            {service.categoryName}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2 flex items-center justify-between gap-2">
          <div className="flex items-center text-sm font-medium text-amber-500">
            <Star className="mr-1 h-4 w-4 fill-current" />
            <span>{service.rating}</span>
            <span className="ml-1 text-muted-foreground">({service.reviewsCount})</span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="mr-1 h-4 w-4" />
            <span>{service.duration}</span>
          </div>
        </div>

        <h4 className="mb-1 text-base font-bold tracking-tight">
          {service.title}
        </h4>
        
        <p className="mb-4 text-sm text-muted-foreground line-clamp-2">
          {service.description}
        </p>
        
        <div className="mt-auto pt-4 flex items-center justify-between border-t border-border/50">
          <div>
            <p className="text-xs text-muted-foreground">Starts from</p>
            <p className="text-lg font-bold text-primary">
              ${service.startingPrice.toFixed(2)}
            </p>
          </div>
          <Button 
            size="sm" 
            variant="default" 
            render={<Link href={ROUTES.SERVICE_DETAIL(service.id)} />} 
            className="rounded-full px-4"
          >
            Book <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
