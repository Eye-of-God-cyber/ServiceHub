export function ServiceDetailsSkeleton() {
  return (
    <div className="flex flex-col gap-10 pb-16 max-w-7xl mx-auto min-h-[calc(100vh-8rem)]">
      {/* Breadcrumbs */}
      <div className="px-4 md:px-0 pt-2">
        <div className="h-6 w-64 bg-muted rounded animate-pulse" />
      </div>

      {/* Service Header */}
      <section className="px-4 md:px-0">
        <div className="rounded-2xl border bg-card shadow-sm h-64 md:h-80 w-full animate-pulse" />
      </section>

      <div className="grid lg:grid-cols-3 gap-10 px-4 md:px-0">
        {/* Left Column (Overview & FAQs) */}
        <div className="lg:col-span-2 flex flex-col gap-10">
          <section className="space-y-4">
            <div className="h-8 w-48 bg-muted rounded animate-pulse" />
            <div className="space-y-2">
              <div className="h-4 w-full bg-muted rounded animate-pulse" />
              <div className="h-4 w-full bg-muted rounded animate-pulse" />
              <div className="h-4 w-3/4 bg-muted rounded animate-pulse" />
            </div>
          </section>
          
          <section className="grid md:grid-cols-2 gap-6">
             <div className="h-48 border rounded-xl bg-card animate-pulse" />
             <div className="h-48 border rounded-xl bg-card animate-pulse" />
          </section>
          
          <section className="h-64 border rounded-2xl bg-card animate-pulse" />
        </div>

        {/* Right Column (Available Providers) */}
        <div className="lg:col-span-1 space-y-4">
          <div className="h-8 w-56 bg-muted rounded animate-pulse mb-6" />
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-40 border rounded-xl bg-card animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
