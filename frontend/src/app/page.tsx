/**
 * Home page — placeholder landing screen.
 *
 * This is the root route ("/").
 * Full landing page UI (hero, category grid, CTA, featured providers)
 * will be built in a future milestone.
 */
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home",
  description: "Welcome to ServiceHub — your trusted home services marketplace.",
};

export default function HomePage() {
  return (
    <section className="flex flex-1 flex-col items-center justify-center gap-6 px-4 py-24 text-center">
      <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
        Welcome to{" "}
        <span className="text-primary">Service</span>Hub
      </h1>

      <p className="max-w-xl text-lg text-muted-foreground">
        Discover and book trusted home service professionals — plumbing,
        electrical, cleaning, and more. On demand.
      </p>

      <p className="rounded-md border border-dashed px-4 py-2 text-sm text-muted-foreground">
        🚧 Frontend Milestone 1A — Foundation Only. Pages coming soon.
      </p>
    </section>
  );
}
