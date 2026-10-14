export default function Loading() {
  return (
    <div
      role="status"
      aria-label="Loading"
      className="flex flex-col items-center justify-center gap-3 py-12">
      <div className="relative flex items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-indigo-500/20 border-t-indigo-500 shadow-lg shadow-indigo-500/20" />
        <div className="absolute h-6 w-6 animate-spin rounded-full border-2 border-pink-500/20 border-b-pink-500 [animation-direction:reverse]" />
      </div>

      <span className="text-xs font-medium tracking-wider text-slate-400 uppercase">
        Loading...
      </span>
    </div>
  )
}