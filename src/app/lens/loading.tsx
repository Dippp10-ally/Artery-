export default function LensLoading() {
  return (
    <div className="bg-cream min-h-screen">
      {/* Hero skeleton */}
      <div className="border-b border-cream-dark py-16 px-6 md:px-12">
        <div className="max-w-6xl mx-auto space-y-4">
          <div className="h-3 w-28 bg-cream-dark rounded animate-pulse" />
          <div className="h-12 w-80 bg-cream-dark rounded animate-pulse" />
          <div className="h-4 w-96 bg-cream-dark rounded animate-pulse" />
          <div className="flex gap-2 pt-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-9 w-24 bg-cream-dark rounded-full animate-pulse" />
            ))}
          </div>
        </div>
      </div>

      {/* Cards skeleton */}
      <div className="py-10 px-6 md:px-12">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-cream-card border border-cream-dark rounded-xl overflow-hidden">
              <div className="h-48 bg-cream-dark animate-pulse" />
              <div className="p-5 space-y-3">
                <div className="h-5 w-3/4 bg-cream-dark rounded animate-pulse" />
                <div className="h-4 w-1/2 bg-cream-dark rounded animate-pulse" />
                <div className="h-4 w-full bg-cream-dark rounded animate-pulse" />
                <div className="flex gap-2">
                  {Array.from({ length: 3 }).map((_, j) => (
                    <div key={j} className="h-6 w-16 bg-cream-dark rounded-full animate-pulse" />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
