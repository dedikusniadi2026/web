import { AlertTriangle, RotateCcw } from "lucide-react";

interface ErrorMessageProps {
  message?: string
  onRetry?: () => void
}

export default function ErrorMessage({
  message = "Something went wrong.",
  onRetry,
}: ErrorMessageProps) {
  return (
    <div className="mx-auto max-w-lg overflow-hidden rounded-2xl border border-rose-500/30 bg-linear-to-b from-rose-950/40 to-slate-900/90 p-6 text-center shadow-xl shadow-rose-950/20 backdrop-blur-xl">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-rose-500/30 bg-rose-500/10 text-rose-400">
        <AlertTriangle size={24} />
      </div>

      <h3 className="mt-4 text-base font-semibold text-rose-200">
        Unable to load content
      </h3>

      <p className="mt-1.5 text-sm leading-relaxed text-rose-300/80">
        {message}
      </p>

      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-rose-600 to-red-600 px-4 py-2.5 text-sm font-medium text-white shadow-md shadow-rose-600/30 transition-all duration-200 hover:scale-105 hover:from-rose-500 hover:to-red-500 active:scale-95"
        >
          <RotateCcw size={16} />
          <span>Try Again</span>
        </button>
      )}
    </div>
  )
}