export default function PatronDashboardLoading() {
  return (
    <div className="bg-cream min-h-screen">
      <div className="max-w-6xl mx-auto px-6 md:px-12 py-10 flex gap-8">

        {/* Sidebar skeleton */}
        <aside className="hidden md:block w-64 flex-shrink-0">
          <div className="bg-cream-card border border-cream-dark rounded-xl p-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-cream-dark animate-pulse mx-auto" />
            <div className="h-5 w-32 bg-cream-dark rounded animate-pulse mx-auto" />
            <div className="h-4 w-24 bg-cream-dark rounded animate-pulse mx-auto" />
            <div className="pt-4 border-t border-cream-dark space-y-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-10 w-full bg-cream-dark rounded-lg animate-pulse" />
              ))}
            </div>
          </div>
        </aside>

        {/* Content skeleton */}
        <div className="flex-1 space-y-4">
          <div className="h-8 w-48 bg-cream-dark rounded animate-pulse" />
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="aspect-square bg-cream-dark rounded-xl animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
