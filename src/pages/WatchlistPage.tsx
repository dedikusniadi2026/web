import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BookmarkPlus,
  Compass,
  Heart,
  SlidersHorizontal,
  Sparkles,
  Star,
} from "lucide-react";

import Navbar from "../components/Navbar";
import MovieGrid from "../components/MovieGrid";
import { useWatchlist } from "../hooks/useWatchlist";

type SortOption = "date" | "rating" | "title"

export default function WatchlistPage() {
  const { watchlist } = useWatchlist()
  const [sortBy, setSortBy] = useState<SortOption>("date")

  const hasSavedMovies = watchlist.length > 0

  const sortedWatchlist = [...watchlist].sort((a, b) => {
    if (sortBy === "rating") {
      return b.vote_average - a.vote_average
    }

    if (sortBy === "title") {
      return a.title.localeCompare(b.title)
    }

    return 0
  })

  return (
    <div className="min-h-screen bg-black text-slate-100 selection:bg-white selection:text-black">
      <Navbar />
      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-10 flex flex-col gap-6 rounded-3xl border border-slate-800 bg-black p-6 shadow-2xl sm:flex-row sm:items-end sm:justify-between sm:p-8">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-rose-500/20 bg-rose-500/10 px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-rose-400">
              <Heart
                size={13}
                className="fill-rose-400 text-rose-400"/>
              <span>Personal Collection</span>
            </div>

            <h1 className="mt-3.5 text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl">
              My Watchlist
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-400 sm:text-base">
              {hasSavedMovies
                ? "Keep track of the films you want to watch next."
                : "Build a shortlist of movies before you decide what to watch."}
            </p>
          </div>

          <div className="inline-flex items-center gap-2.5 rounded-2xl border border-slate-800 bg-black px-5 py-2.5 text-sm font-bold text-slate-200 shadow-md">
            <span className="flex h-2.5 w-2.5 animate-pulse rounded-full bg-rose-500 shadow-sm shadow-rose-500" />

            <span>
              {watchlist.length} saved{" "}
              {watchlist.length === 1 ? "movie" : "movies"}
            </span>
          </div>
        </header>

        {hasSavedMovies && (
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-black px-5 py-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
              <SlidersHorizontal
                size={14}
                className="text-indigo-400"/>

              <span>Sort Collection</span>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setSortBy("date")}
                className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all duration-200 ${
                  sortBy === "date"
                    ? "bg-slate-800 text-white ring-1 ring-slate-700"
                    : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"
                }`}>
                Date Added
              </button>

              <button
                type="button"
                onClick={() => setSortBy("rating")}
                className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all duration-200 ${
                  sortBy === "rating"
                    ? "bg-slate-800 text-white ring-1 ring-slate-700"
                    : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"
                }`}>
                Highest Rated
              </button>

              <button
                type="button"
                onClick={() => setSortBy("title")}
                className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all duration-200 ${
                  sortBy === "title"
                    ? "bg-slate-800 text-white ring-1 ring-slate-700"
                    : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"
                }`}>
                Title (A-Z)
              </button>
            </div>
          </div>
        )}

        {hasSavedMovies ? (
          <MovieGrid movies={sortedWatchlist} />
        ) : (
          <EmptyWatchlist />
        )}
      </main>
    </div>
  )
}

function EmptyWatchlist() {
  return (
    <section className="relative mx-auto max-w-3xl overflow-hidden rounded-3xl border border-slate-800 bg-black p-8 text-center shadow-2xl sm:p-12">
      <div className="relative z-10 flex flex-col items-center">
        <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl border border-slate-800 bg-black text-rose-400 shadow-xl">
          <BookmarkPlus size={36} className="text-rose-400" />

          <div className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-rose-500 text-white shadow-md">
            <Sparkles size={12} />
          </div>
        </div>

        <div className="mt-6 inline-flex items-center gap-1.5 rounded-full border border-rose-500/20 bg-rose-500/10 px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-rose-300">
          <span>Your Cinema Queue</span>
        </div>

        <h2 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl">
          Your watchlist is empty
        </h2>

        <p className="mt-3 max-w-lg text-sm leading-relaxed text-slate-400 sm:text-base">
          Save movies from the list or detail page and they will appear here
          for quick access later.
        </p>

        <div className="mt-8 grid w-full gap-4 text-left sm:grid-cols-3">
          <div className="group rounded-2xl border border-slate-800 bg-black p-4 transition-all duration-300 hover:border-slate-700 hover:bg-slate-950 hover:shadow-lg">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-indigo-400">
              <Compass size={20} />
            </div>

            <h3 className="mt-3 text-xs font-bold text-slate-200">
              Discover
            </h3>

            <p className="mt-1 text-[11px] leading-relaxed text-slate-400">
              Find trending and top-rated movies across categories.
            </p>
          </div>

          <div className="group rounded-2xl border border-slate-800 bg-black p-4 transition-all duration-300 hover:border-slate-700 hover:bg-slate-950 hover:shadow-lg">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-500/10 text-rose-400">
              <Heart size={20} />
            </div>

            <h3 className="mt-3 text-xs font-bold text-slate-200">
              Bookmark
            </h3>

            <p className="mt-1 text-[11px] leading-relaxed text-slate-400">
              Save films with a single click from any movie card.
            </p>
          </div>

          <div className="group rounded-2xl border border-slate-800 bg-black p-4 transition-all duration-300 hover:border-slate-700 hover:bg-slate-950 hover:shadow-lg">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
              <Star size={20} />
            </div>

            <h3 className="mt-3 text-xs font-bold text-slate-200">
              Organize
            </h3>

            <p className="mt-1 text-[11px] leading-relaxed text-slate-400">
              Sort by ratings, titles, or date added anytime.
            </p>
          </div>
        </div>

        <div className="mt-10 flex justify-center">
          <Link
            to="/"
            className="group inline-flex items-center gap-2.5 rounded-full bg-white px-8 py-3.5 text-sm font-extrabold text-black shadow-xl transition-all duration-300 hover:scale-105 hover:bg-slate-200 active:scale-95">
            <span>Discover movies</span>
            <ArrowRight
              size={18}
              className="transition-transform duration-300 group-hover:translate-x-1"/>
          </Link>
        </div>
      </div>
    </section>
  )
}