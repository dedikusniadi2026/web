import { useState } from "react";
import SearchBar from "../components/SearchBar";
import MovieGrid from "../components/MovieGrid";
import MovieGridSkeleton from "../components/MovieGridSkeleton";
import ErrorMessage from "../components/ErrorMessage";
import Loading from "../components/Loading";
import { useMovies } from "../hooks/useMovies";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";

const CATEGORIES = [
  { label: "Now Playing", value: "now_playing" },
  { label: "Popular", value: "popular" },
  { label: "Top Rated", value: "top_rated" },
  { label: "Upcoming", value: "upcoming" },
] as const;

type Category = typeof CATEGORIES[number]["value"];

export default function HomePage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<Category>("popular");

  const { movies, loading, error, page, totalPages, loadMore, retry } =
    useMovies({ search, category });

  const hasMore = page < totalPages;
  const sentinelRef = useInfiniteScroll(loadMore, {
    enabled:!loading &&!error && hasMore,
  });

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">Popular Movies</h1>
      <p className="text-slate-400 mb-6">Discover popular movies from TMDB</p>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {CATEGORIES.map((c) => (
          <button
            key={c.value}
            onClick={() => setCategory(c.value)}
            aria-label={c.label}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors whitespace-nowrap ${
              category === c.value
               ? "bg-white text-black border-white"
                : "bg-[#1a1f2e] text-slate-400 border-slate-800 hover:text-white"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="max-w-xl mb-8">
        <SearchBar value={search} onChange={setSearch} />
      </div>

      {search && movies.length > 0 &&!loading &&!error && (
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-slate-400">
            Showing results for "{search}"
          </p>
          <button onClick={() => setSearch("")} className="text-sm underline">
            Clear
          </button>
        </div>
      )}

      {loading && page === 1 && <MovieGridSkeleton />}
      {error && <ErrorMessage message={error} onRetry={retry} />}

      {!error && movies.length > 0 && (
        <>
          <MovieGrid movies={movies} />
          {loading && page > 1 && (
            <div className="mt-6">
              <Loading />
            </div>
          )}
          <div ref={sentinelRef} className="h-10" />

          {hasMore &&!loading && (
            <div className="mt-6 text-center">
              <button
                onClick={loadMore}
                className="px-6 py-2.5 bg-white text-black rounded-xl font-bold"
              >
                Load more
              </button>
            </div>
          )}
        </>
      )}

      {!loading &&!error && movies.length === 0 && (
        <p className="text-center text-slate-500 py-20">No movies found</p>
      )}
    </div>
  );
}