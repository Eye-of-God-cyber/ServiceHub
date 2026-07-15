import { Star, Briefcase, BadgeCheck, ShieldAlert, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ROUTES } from "@/constants/routes";
import type { ServiceProvider } from "@/features/catalog/types/domain.types";

interface ProviderCardProps {
  provider: ServiceProvider;
  serviceId: string;
}

export function ProviderCard({ provider, serviceId }: ProviderCardProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-5 p-5 border rounded-xl bg-card shadow-sm hover:shadow-md transition-shadow">
      {/* Avatar & Verification */}
      <div className="flex flex-col items-center sm:items-start shrink-0">
        <Avatar className="h-24 w-24 border-2 border-background shadow-sm">
          <AvatarImage src={provider.avatarUrl} alt={provider.name} />
          <AvatarFallback className="text-xl bg-primary/10 text-primary">
            {provider.name.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div className="mt-3 flex justify-center w-full">
          {provider.isVerified ? (
            <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100 flex items-center gap-1 text-[10px]">
              <BadgeCheck className="h-3 w-3" /> Verified
            </Badge>
          ) : (
            <Badge variant="outline" className="text-muted-foreground flex items-center gap-1 text-[10px]">
              <ShieldAlert className="h-3 w-3" /> Unverified
            </Badge>
          )}
        </div>
      </div>

      {/* Provider Details */}
      <div className="flex flex-col flex-1">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2">
          <div>
            <h4 className="text-lg font-bold tracking-tight">{provider.name}</h4>
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
              {provider.bio}
            </p>
          </div>
          <div className="text-left sm:text-right shrink-0">
            <p className="text-sm text-muted-foreground">Starting from</p>
            <p className="text-lg font-bold text-primary">
              ${provider.startingPrice.toFixed(2)}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-x-6 gap-y-2 mt-4 text-sm font-medium">
          <div className="flex items-center text-amber-500">
            <Star className="mr-1.5 h-4 w-4 fill-current" />
            <span>{provider.rating}</span>
          </div>
          <div className="flex items-center text-muted-foreground">
            <Briefcase className="mr-1.5 h-4 w-4" />
            <span>{provider.experienceYears} Years Exp.</span>
          </div>
          <div className="flex items-center text-muted-foreground col-span-2 sm:col-span-1">
            <span>{provider.totalJobs} Jobs Completed</span>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-5 sm:mt-auto pt-4 flex items-center justify-between border-t border-border/50">
          <div>
            {provider.isAvailable ? (
              <span className="inline-flex items-center gap-1.5 text-sm font-medium text-green-600">
                <span className="h-2 w-2 rounded-full bg-green-500" /> Available Now
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
                <span className="h-2 w-2 rounded-full bg-muted-foreground" /> Unavailable
              </span>
            )}
          </div>
          
          <Button 
            disabled={!provider.isAvailable} 
            className="rounded-full px-6"
            render={<Link href={ROUTES.BOOKING_FLOW(serviceId, provider.providerServiceId)} />}
          >
            Select & Continue <ChevronRight className="ml-1.5 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
