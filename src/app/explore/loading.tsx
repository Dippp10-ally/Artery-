export default function ExploreLoading() {
  return (
    <div className="bg-cream min-h-screen">
      {/* Hero skeleton */}
      <div className="border-b border-cream-dark py-14 px-6 md:px-12">
        <div className="max-w-6xl mx-auto space-y-3">
          <div className="h-3 w-24 bg-cream-dark rounded animate-pulse" />
          <div className="h-10 w-64 bg-cream-dark rounded animate-pulse" />
          <div className="h-4 w-96 bg-cream-dark rounded animate-pulse" />
        </div>
      </div>

      {/* Starter prompts skeleton */}
      <div className="border-b border-cream-dark px-6 md:px-12 py-6 bg-cream-card">
        <div className="max-w-6xl mx-auto flex gap-2 flex-wrap">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-8 w-36 bg-cream-dark rounded-full animate-pulse" />
          ))}
        </div>
      </div>

      {/* Grid skeleton */}
      <div className="px-6 md:px-12 py-10">
        <div className="max-w-6xl mx-auto columns-2 md:columns-3 lg:columns-4 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="break-inside-avoid mb-4 rounded-xl overflow-hidden border border-cream-dark"
              style={{ height: `${180 + (i % 3) * 60}px` }}
            >
              <div className="w-full h-full bg-cream-dark animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
