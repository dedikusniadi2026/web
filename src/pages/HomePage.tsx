import { useState } from "react";
import { Sparkles, TrendingUp, Compass, Play, Heart, Star } from "lucide-react";
import { Link } from "react-router-dom";

import ErrorMessage from "../components/ErrorMessage";
import Loading from "../components/Loading";
import MovieGrid from "../components/MovieGrid";
import MovieGridSkeleton from "../components/MovieGridSkeleton";
import Navbar from "../components/Navbar";
import SearchBar from "../components/SearchBar";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";
import { useMovies } from "../hooks/useMovies";
import type { MovieCategory } from "../hooks/useMovies";
import type { Movie } from "../types/movie";
import { useWatchlist } from "../hooks/useWatchlist";
import { getBackdropUrl, getPosterUrl } from "../utils/image";

const categories: {
  label: string
  value: MovieCategory
}[] = [
  { label: "Now Playing", value: "now_playing" },
  { label: "Popular", value: "popular" },
  { label: "Top Rated", value: "top_rated" },
  { label: "Upcoming", value: "upcoming" },
]

export default function HomePage() {
  const [category, setCategory] = useState<MovieCategory>("popular")
  const [search, setSearch] = useState("")

  const {
    movies,
    loading,
    error,
    page,
    totalPages,
    loadMore,
    retry,
  } = useMovies({
    category,
    search,
  })

  const hasMore = page < totalPages
  const isSearching = search.trim().length > 0
  const showInitialLoading = loading && page === 1
  const showEmptyState = !loading && !error && movies.length === 0

  const featuredMovie = !isSearching && movies.length > 1 ? movies[0] : null
  const gridMovies = !isSearching && movies.length > 1 ? movies.slice(1) : movies

  const sentinelRef = useInfiniteScroll(loadMore, {
    enabled: !loading && !error && hasMore,
  })

  function handleCategoryChange(value: MovieCategory) {
    setCategory(value)
  }

  function handleClearSearch() {
    setSearch("")
  }

  return (
    <div className="relative min-h-screen bg-black text-slate-100 selection:bg-black selection:text-white">
      <div className="pointer-events-none fixed top-0 left-1/4 h-125 w-125 -translate-x-1/2 rounded-full bg-black blur-[130px]" />
      <div className="pointer-events-none fixed top-1/3 right-10 h-112.5 w-112.5 rounded-full bg-black blur-[130px]" />

      <Navbar />

      <main className="relative mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-8 text-left">
          <h1 className="mt-3.5 text-3xl font-black tracking-tight text-transparent bg-clip-text bg-linear-to-r from-white via-slate-100 to-slate-400 sm:text-5xl lg:text-6xl">
            Discover something worth watching
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-400 sm:text-base">
            Browse popular movies, new releases, top-rated titles, and upcoming releases.
          </p>
        </header>

        <div className="mb-8 max-w-3xl">
          <SearchBar value={search} onChange={setSearch} />
        </div>

        {!isSearching && (
          <CategoryTabs
            activeCategory={category}
            onChange={handleCategoryChange}
          />
        )}

        {featuredMovie && !showInitialLoading && (
          <FeaturedSpotlight movie={featuredMovie} />
        )}

        {isSearching && (
          <SearchSummary search={search} onClear={handleClearSearch} />
        )}

        {showInitialLoading && <MovieGridSkeleton />}

        {!showInitialLoading && error && (
          <div className="py-12">
            <ErrorMessage message={error} onRetry={retry} />
          </div>
        )}

        {showEmptyState && <EmptyState />}

        {!error && movies.length > 0 && (
          <>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold tracking-tight text-slate-200">
                {isSearching
                  ? "Search Results"
                  : `Trending ${
                      categories.find((c) => c.value === category)?.label ?? ""
                    }`}
              </h2>
              <span className="text-xs font-semibold text-slate-500">
                {movies.length} titles
              </span>
            </div>

            <MovieGrid movies={gridMovies} />

            {loading && page > 1 && (
              <div className="mt-10">
                <Loading />
              </div>
            )}
          </>
        )}

        <div ref={sentinelRef} className="h-px" aria-hidden="true" />

        {hasMore && !loading && !error && (
          <div className="mt-12 flex justify-center">
            <button
              type="button"
              onClick={loadMore}
              className="group flex items-center gap-2 rounded-full border border-slate-700/80 bg-slate-900/80 px-7 py-3 text-sm font-semibold text-slate-200 shadow-lg backdrop-blur-md transition-all duration-300 hover:border-indigo-500/50 hover:bg-slate-800 hover:text-white hover:shadow-indigo-500/10 active:scale-95">
              <TrendingUp size={16} className="text-indigo-400 transition-transform group-hover:translate-y-px" />
              <span>Load more</span>
            </button>
          </div>
        )}

        {!hasMore && !loading && !error && movies.length > 0 && page > 1 && (
          <p className="mt-12 text-center text-xs font-semibold text-slate-500">
            You've reached the end of the results.
          </p>
        )}
      </main>
    </div>
  )
}

interface CategoryTabsProps {
  activeCategory: MovieCategory
  onChange: (category: MovieCategory) => void
}

function CategoryTabs({ activeCategory, onChange }: CategoryTabsProps) {
  return (
    <div className="mb-8 overflow-x-auto pb-2">
      <nav
        aria-label="Movie categories"
        className="flex w-max items-center gap-2 rounded-2xl border border-slate-800/80 bg-slate-900/60 p-1.5 backdrop-blur-md shadow-inner">
        {categories.map((category) => {
          const isActive = activeCategory === category.value

          return (
            <button
              key={category.value}
              type="button"
              onClick={() => onChange(category.value)}
              className={`relative rounded-xl px-4.5 py-2.5 text-sm font-semibold transition-all duration-200 shrink-0 ${
                isActive
                  ? "bg-linear-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-600/30"
                  : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
              }`}>
              {category.label}
            </button>
          )
        })}
      </nav>
    </div>
  )
}

interface FeaturedSpotlightProps {
  movie: Movie
}

function FeaturedSpotlight({ movie }: FeaturedSpotlightProps) {
  const { isSaved, toggle } = useWatchlist()
  const saved = isSaved(movie.id)
  const backdropUrl = getBackdropUrl(movie.backdrop_path)
  const posterUrl = getPosterUrl(movie.poster_path)

  const releaseYear = movie.release_date
    ? movie.release_date.slice(0, 4)
    : "N/A"

  return (
    <section className="group relative mb-12 overflow-hidden rounded-3xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-md shadow-2xl transition-all duration-300 hover:border-slate-700">
      {backdropUrl && (
        <div className="absolute inset-0 overflow-hidden">
          <img
            src={backdropUrl}
            alt=""
            className="h-full w-full object-cover object-center scale-105 opacity-40 transition-transform duration-700 group-hover:scale-110"/>
          <div className="absolute inset-0 bg-linear-to-t from-[#070b15] via-[#070b15]/80 to-transparent" />
          <div className="absolute inset-0 bg-linear-to-r from-[#070b15] via-[#070b15]/70 to-transparent" />
        </div>
      )}

      <div className="relative z-10 flex flex-col gap-6 p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between lg:p-10">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-blac px-3 py-1 text-xs font-bold uppercase tracking-widest text-indigo-300 shadow-sm">
            <Sparkles size={13} className="text-indigo-400" />
            <span>Featured Spotlight</span>
          </div>

          <h2 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl">
            {movie.title}
          </h2>

          <div className="mt-3 flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-300">
            <span className="rounded-md border border-slate-700 bg-slate-800/80 px-2.5 py-0.5 text-slate-300">
              {releaseYear}
            </span>
            <span className="flex items-center gap-1.5 rounded-md border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-amber-300 font-bold">
              <Star size={13} className="text-amber-400" fill="currentColor" />
              <span>{movie.vote_average.toFixed(1)}</span>
            </span>
            <span className="rounded-md border border-slate-800 bg-slate-950/60 px-2 py-0.5 text-slate-400">
              HD
            </span>
          </div>

          <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-slate-300 sm:text-base">
            {movie.overview || "No overview available."}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3.5">
            <Link
              to={`/movie/${movie.id}`}
              className="flex items-center gap-2.5 rounded-xl bg-linear-to-r from-white via-slate-100 to-slate-200 px-6 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-white/10 transition-all duration-200 hover:scale-105 active:scale-95">
              <Play size={16} fill="currentColor" />
              <span>View Details</span>
            </Link>

            <button
              type="button"
              onClick={() => toggle(movie)}
              aria-label={
                saved
                  ? `Remove ${movie.title} from watchlist`
                  : `Add ${movie.title} to watchlist`
              }
              aria-pressed={saved}
              className={`flex items-center gap-2 rounded-xl border px-5 py-3 text-sm font-semibold backdrop-blur-md transition-all duration-200 hover:scale-105 active:scale-95 ${
                saved
                  ? "border-rose-500/50 bg-rose-500/20 text-rose-300 shadow-md shadow-rose-500/20"
                  : "border-slate-700 bg-slate-900/80 text-slate-200 hover:bg-slate-800 hover:text-white"
              }`}>
              <Heart
                size={16}
                fill={saved ? "currentColor" : "none"}
                className={saved ? "text-rose-400" : "text-slate-400"}
              />
              <span>{saved ? "Saved" : "Add to Watchlist"}</span>
            </button>
          </div>
        </div>

        {posterUrl && (
          <div className="hidden shrink-0 lg:block">
            <div className="relative overflow-hidden rounded-2xl border border-white/10 shadow-2xl ring-1 ring-white/10">
              <img
                src={posterUrl}
                alt={movie.title}
                className="h-64 w-44 object-cover"
              />
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

interface SearchSummaryProps {
  search: string
  onClear: () => void
}

function SearchSummary({ search, onClear }: SearchSummaryProps) {
  return (
    <div className="mb-8 flex items-center justify-between rounded-2xl border border-slate-800/80 bg-slate-900/60 px-5 py-3.5 backdrop-blur-md">
      <div className="flex items-center gap-2.5">
        <Compass size={18} className="text-indigo-400" />
        <div>
          <p className="text-xs text-slate-500">Search results for</p>
          <p className="text-base font-semibold text-slate-100">"{search.trim()}"</p>
        </div>
      </div>

      <button
        type="button"
        onClick={onClear}
        className="rounded-xl bg-slate-800/80 px-3.5 py-1.5 text-xs font-semibold text-slate-300 transition-colors hover:bg-rose-500/20 hover:text-rose-300">
        Clear
      </button>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="my-12 flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-800 bg-slate-900/30 py-20 px-6 text-center backdrop-blur-sm">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-800/80 text-slate-400 ring-1 ring-white/10 shadow-inner">
        <Compass size={32} />
      </div>

      <h2 className="mt-6 text-xl font-bold tracking-tight text-slate-200">
        No movies found
      </h2>

      <p className="mt-2 max-w-md text-sm leading-relaxed text-slate-400">
        Try another search query or switch categories to explore different films.
      </p>
    </div>
  )
}
