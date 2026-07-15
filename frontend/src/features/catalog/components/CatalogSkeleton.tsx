export function CatalogSkeleton() {
  return (
    <div className="flex flex-col gap-8 pb-16 max-w-7xl mx-auto">
      <div className="px-4 md:px-0 pt-2 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="h-8 w-48 bg-muted rounded-md animate-pulse" />
          <div className="h-4 w-72 bg-muted rounded-md animate-pulse" />
        </div>
        <div className="w-full md:w-72 h-10 bg-muted rounded-md animate-pulse" />
      </div>

      <div className="px-4 md:px-0">
        <div className="flex gap-2 overflow-hidden">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-9 w-24 bg-muted rounded-full animate-pulse shrink-0" />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-4 md:px-0">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="flex flex-col border rounded-xl overflow-hidden bg-card">
            <div className="h-48 bg-muted animate-pulse" />
            <div className="p-5 flex flex-col flex-1 gap-4">
              <div className="space-y-2">
                <div className="h-5 w-3/4 bg-muted rounded animate-pulse" />
                <div className="h-4 w-1/2 bg-muted rounded animate-pulse" />
              </div>
              <div className="h-10 w-full bg-muted rounded mt-auto animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
