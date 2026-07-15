import { CheckCircle2, XCircle, Sparkles } from "lucide-react";

interface ServiceOverviewProps {
  description: string;
  included: string[];
  notIncluded: string[];
  highlights: string[];
}

export function ServiceOverview({
  description,
  included,
  notIncluded,
  highlights,
}: ServiceOverviewProps) {
  return (
    <div className="space-y-8">
      {/* Description */}
      <div>
        <h3 className="text-xl font-bold tracking-tight mb-4">About this Service</h3>
        <p className="text-muted-foreground leading-relaxed">
          {description}
        </p>
      </div>

      {/* Highlights */}
      {highlights.length > 0 && (
        <div className="bg-primary/5 rounded-xl p-6 border border-primary/10">
          <h4 className="font-semibold text-primary mb-4 flex items-center gap-2">
            <Sparkles className="h-5 w-5" /> Why Choose Us
          </h4>
          <ul className="grid sm:grid-cols-2 gap-3">
            {highlights.map((highlight, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-foreground">
                <div className="mt-0.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                <span>{highlight}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Included / Not Included */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* What's Included */}
        <div className="border rounded-xl p-6 bg-card">
          <h4 className="font-semibold mb-4 text-foreground flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-500" /> What&apos;s Included
          </h4>
          <ul className="space-y-3">
            {included.map((item, index) => (
              <li key={index} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* What's Not Included */}
        <div className="border rounded-xl p-6 bg-card">
          <h4 className="font-semibold mb-4 text-foreground flex items-center gap-2">
            <XCircle className="h-5 w-5 text-destructive" /> What&apos;s Not Included
          </h4>
          <ul className="space-y-3">
            {notIncluded.map((item, index) => (
              <li key={index} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                <XCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
