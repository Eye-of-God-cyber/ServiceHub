"use client";

import { Button } from "@/components/ui/button";

interface HeroBannerProps {
  greeting: string;
  headline: string;
  subheadline: string;
  primaryAction?: { label: string; onClick?: () => void };
  secondaryAction?: { label: string; onClick?: () => void };
}

export function HeroBanner({
  greeting,
  headline,
  subheadline,
  primaryAction,
  secondaryAction,
}: HeroBannerProps) {
  return (
    <div className="relative overflow-hidden rounded-xl bg-primary px-6 py-12 md:px-12 md:py-16 text-primary-foreground shadow-sm">
      {/* Abstract background shapes */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 -ml-16 -mb-16 h-48 w-48 rounded-full bg-black/10 blur-2xl"></div>

      <div className="relative z-10 max-w-2xl">
        <p className="mb-2 text-sm font-medium tracking-wide text-primary-foreground/80 uppercase">
          {greeting}
        </p>
        <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
          {headline}
        </h2>
        <p className="mb-8 max-w-xl text-lg text-primary-foreground/90 leading-relaxed">
          {subheadline}
        </p>

        <div className="flex flex-wrap items-center gap-4">
          {primaryAction && (
            <Button
              size="lg"
              variant="secondary"
              onClick={primaryAction.onClick}
              className="font-semibold shadow-sm"
            >
              {primaryAction.label}
            </Button>
          )}
          {secondaryAction && (
            <Button
              size="lg"
              variant="outline"
              onClick={secondaryAction.onClick}
              className="bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground font-medium"
            >
              {secondaryAction.label}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
