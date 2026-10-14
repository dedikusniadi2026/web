import { Search, X } from "lucide-react";

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
}

export default function SearchBar({
  value,
  onChange,
}: SearchBarProps) {
  const hasValue = value.trim().length > 0

  return (
    <div className="group relative w-full">
      <div className="absolute -inset-0.5 rounded-2xl bg-linear-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 opacity-0 blur-md transition-opacity duration-300 group-focus-within:opacity-100" />

      <div className="relative flex items-center rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-xl shadow-lg transition-all duration-300 group-focus-within:border-indigo-500/80 group-focus-within:bg-slate-900/90 group-focus-within:shadow-indigo-500/10">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-4.5 text-slate-400 transition-colors duration-200 group-focus-within:text-indigo-400">
          <Search size={20} />
        </span>

        <input
          type="text"
          aria-label="Search movies"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Search movies..."
          className="w-full bg-transparent py-3.5 pl-12 pr-12 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none sm:text-base"/>

        {hasValue ? (
          <button
            type="button"
            onClick={() => onChange("")}
            aria-label="Clear search"
            className="absolute right-3.5 flex h-7 w-7 items-center justify-center rounded-full bg-slate-800/80 text-slate-400 shadow-sm transition-all duration-200 hover:bg-rose-500/20 hover:text-rose-400">
            <X size={16} />
          </button>
        ) : (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute right-4 hidden items-center gap-1 rounded-md border border-slate-700/60 bg-slate-800/60 px-2 py-1 text-[11px] font-medium tracking-wide text-slate-400 sm:flex">
            <span>Search</span>
          </div>
        )}
      </div>
    </div>
  )
}
