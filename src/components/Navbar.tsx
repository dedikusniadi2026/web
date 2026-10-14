import { Link, useLocation } from "react-router-dom"
import { Film, Heart, Sparkles } from "lucide-react"
import { useWatchlist } from "../hooks/useWatchlist"

export default function Navbar() {
  const location = useLocation()
  const { watchlist } = useWatchlist()

  const isWatchlistActive = location.pathname === "/watchlist"
  const isHomeActive = location.pathname === "/"

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-[#060913]/85 backdrop-blur-xl shadow-xl shadow-black/40 transition-all duration-300">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="group flex items-center gap-3 transition-transform duration-300 hover:scale-[1.02]">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-linear-to-tr from-indigo-600 via-purple-600 to-pink-500 shadow-lg shadow-indigo-500/30 ring-1 ring-white/20 transition-all duration-300 group-hover:shadow-indigo-500/50 group-hover:ring-white/40">
            <Film className="h-5 w-5 text-white transition-transform duration-300 group-hover:rotate-12" />
            <div className="absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-pink-500 ring-2 ring-[#060913]">
              <Sparkles className="h-2 w-2 text-white" />
            </div>
          </div>

          <div className="flex flex-col">
            <span className="bg-linear-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-xl font-black tracking-tight text-transparent">
              Movie App
            </span>
            <span
              aria-hidden="true"
              className="text-[10px] font-semibold uppercase tracking-widest text-indigo-400">
              Cinema Hub
            </span>
          </div>
        </Link>

        <nav className="flex items-center gap-2 sm:gap-3">
          <Link
            to="/"
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-200 ${
              isHomeActive
                ? "bg-slate-800/90 text-white shadow-md ring-1 ring-slate-700/80"
                : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
            }`}>
            <span>Discover</span>
          </Link>

          <Link
            to="/watchlist"
            className={`relative flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-200 ${
              isWatchlistActive
                ? "bg-linear-to-r from-rose-500/20 via-pink-500/20 to-rose-500/20 text-rose-300 ring-1 ring-rose-500/40 shadow-md shadow-rose-500/10"
                : "bg-slate-900/80 text-slate-300 ring-1 ring-slate-800 hover:bg-slate-800 hover:text-white"
            }`}>
            <Heart
              size={17}
              className={`transition-colors duration-200 ${
                watchlist.length > 0 || isWatchlistActive
                  ? "fill-rose-500 text-rose-500"
                  : "text-slate-400"
              }`}/>
            <span>Watchlist</span>

            {watchlist.length > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1.5 text-[11px] font-bold text-white shadow-md shadow-rose-500/40 ring-2 ring-[#060913]">
                {watchlist.length}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  )
}