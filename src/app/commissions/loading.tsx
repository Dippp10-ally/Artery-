export default function CommissionsLoading() {
  return (
    <div className="bg-cream min-h-screen">
      {/* Hero skeleton */}
      <div className="border-b border-cream-dark py-14 px-6 md:px-12">
        <div className="max-w-6xl mx-auto flex items-end justify-between gap-6">
          <div className="space-y-3">
            <div className="h-3 w-32 bg-cream-dark rounded animate-pulse" />
            <div className="h-10 w-72 bg-cream-dark rounded animate-pulse" />
            <div className="h-4 w-80 bg-cream-dark rounded animate-pulse" />
          </div>
          <div className="h-10 w-40 bg-cream-dark rounded-lg animate-pulse" />
        </div>
      </div>

      {/* Filter skeleton */}
      <div className="border-b border-cream-dark px-6 md:px-12 py-4 bg-cream-card">
        <div className="max-w-6xl mx-auto flex gap-2 flex-wrap">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-8 w-24 bg-cream-dark rounded-md animate-pulse" />
          ))}
        </div>
      </div>

      {/* Cards skeleton */}
      <div className="py-10 px-6 md:px-12">
        <div className="max-w-6xl mx-auto space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-cream-card border border-cream-dark rounded-xl p-6">
              <div className="flex gap-5">
                <div className="w-24 h-24 bg-cream-dark rounded-sm animate-pulse flex-shrink-0" />
                <div className="flex-1 space-y-3">
                  <div className="h-3 w-20 bg-cream-dark rounded animate-pulse" />
                  <div className="h-6 w-3/4 bg-cream-dark rounded animate-pulse" />
                  <div className="h-4 w-full bg-cream-dark rounded animate-pulse" />
                  <div className="h-4 w-2/3 bg-cream-dark rounded animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
