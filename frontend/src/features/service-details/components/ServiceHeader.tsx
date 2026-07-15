import { ArrowLeft, Star, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";

interface ServiceHeaderProps {
  title: string;
  categoryName: string;
  rating: number;
  reviewsCount: number;
  startingPrice: number;
  duration: string;
  tagline: string;
  imageUrl: string;
}

export function ServiceHeader({
  title,
  categoryName,
  rating,
  reviewsCount,
  startingPrice,
  duration,
  tagline,
  imageUrl,
}: ServiceHeaderProps) {
  const router = useRouter();

  return (
    <div className="relative overflow-hidden rounded-2xl bg-card border shadow-sm">
      <div className="grid md:grid-cols-2 gap-0">
        {/* Text Content */}
        <div className="p-6 md:p-10 flex flex-col justify-center order-2 md:order-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="w-fit mb-6 text-muted-foreground hover:text-foreground -ml-3"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Catalog
          </Button>

          <Badge variant="secondary" className="w-fit mb-4 bg-primary/10 text-primary hover:bg-primary/20">
            {categoryName}
          </Badge>

          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
            {title}
          </h1>
          
          <p className="text-lg text-muted-foreground mb-6 line-clamp-2">
            {tagline}
          </p>

          <div className="flex flex-wrap items-center gap-6 text-sm font-medium">
            <div className="flex items-center text-amber-500">
              <Star className="mr-1.5 h-5 w-5 fill-current" />
              <span className="text-base font-bold">{rating}</span>
              <span className="ml-1.5 text-muted-foreground font-normal">({reviewsCount} reviews)</span>
            </div>
            <div className="flex items-center text-muted-foreground">
              <Clock className="mr-1.5 h-5 w-5" />
              <span>Est. {duration}</span>
            </div>
            <div className="text-lg">
              <span className="text-muted-foreground text-sm font-normal">From </span>
              <span className="font-bold text-primary">${startingPrice.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Hero Image */}
        <div className="relative h-64 md:h-full order-1 md:order-2 bg-muted">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* Gradient overlay for better text contrast if needed, mostly aesthetic */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent md:bg-gradient-to-l md:from-transparent md:to-black/10" />
        </div>
      </div>
    </div>
  );
}
