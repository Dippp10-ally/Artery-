export default function OrdersLoading() {
  return (
    <div className="bg-cream min-h-screen">
      {/* Header skeleton */}
      <div className="border-b border-cream-dark py-12 px-6 md:px-12">
        <div className="max-w-5xl mx-auto space-y-2">
          <div className="h-3 w-24 bg-cream-dark rounded animate-pulse" />
          <div className="h-9 w-52 bg-cream-dark rounded animate-pulse" />
          <div className="h-4 w-72 bg-cream-dark rounded animate-pulse" />
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 md:px-12 py-10 space-y-10">
        {/* Section heading */}
        <div>
          <div className="h-7 w-48 bg-cream-dark rounded animate-pulse mb-4" />
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-cream-card border border-cream-dark rounded-xl p-5 flex gap-4">
                <div className="w-16 h-16 bg-cream-dark rounded-sm animate-pulse flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-5 w-1/2 bg-cream-dark rounded animate-pulse" />
                  <div className="h-3 w-1/3 bg-cream-dark rounded animate-pulse" />
                  <div className="h-4 w-3/4 bg-cream-dark rounded animate-pulse" />
                  <div className="h-3 w-1/4 bg-cream-dark rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
