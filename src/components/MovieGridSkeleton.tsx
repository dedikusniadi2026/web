const CARD_COUNT = 10

export default function MovieGridSkeleton() {
  return (
    <div
      role="status"
      aria-label="Loading movies"
      className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 lg:gap-6">
      {Array.from({ length: CARD_COUNT }).map((_, index) => (
        <div
          key={index}
          className="relative overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/60 shadow-lg">
          <div className="relative aspect-2/3 w-full overflow-hidden bg-slate-800/70">
            <div className="absolute inset-0 -translate-x-full animate-shimmer bg-linear-to-r from-transparent via-slate-700/30 to-transparent" />
          </div>

          <div className="space-y-3 p-4">
            <div className="relative h-4 w-5/6 overflow-hidden rounded-md bg-slate-800">
              <div className="absolute inset-0 -translate-x-full animate-shimmer bg-linear-to-r from-transparent via-slate-700/40 to-transparent" />
            </div>

            <div className="flex items-center justify-between pt-1">
              <div className="relative h-3.5 w-1/3 overflow-hidden rounded-md bg-slate-800">
                <div className="absolute inset-0 -translate-x-full animate-shimmer bg-linear-to-r from-transparent via-slate-700/40 to-transparent" />
              </div>
              <div className="relative h-3.5 w-1/4 overflow-hidden rounded-md bg-slate-800">
                <div className="absolute inset-0 -translate-x-full animate-shimmer bg-linear-to-r from-transparent via-slate-700/40 to-transparent" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
