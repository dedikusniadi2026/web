import { useState } from "react";
import SearchBar from "../components/SearchBar";
import MovieGrid from "../components/MovieGrid";
import MovieGridSkeleton from "../components/MovieGridSkeleton";
import ErrorMessage from "../components/ErrorMessage";
import Loading from "../components/Loading";
import { useMovies } from "../hooks/useMovies";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";

export default function HomePage() {
  const [search, setSearch] = useState("");
  const { movies, loading, error, page, totalPages, loadMore, retry } = useMovies({ search, category: "popular" });

  const hasMore = page < totalPages;
  const sentinelRef = useInfiniteScroll(loadMore, { enabled:!loading &&!error && hasMore });

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Popular Movies</h1>
      <p className="text-slate-400 mb-6">Discover popular movies from TMDB</p>

      <div className="max-w-xl mb-8">
        <SearchBar value={search} onChange={setSearch} />
      </div>

      {loading && page === 1 && <MovieGridSkeleton />}
      {error && <ErrorMessage message={error} onRetry={retry} />}

      {!error && movies.length > 0 && (
        <>
          <MovieGrid movies={movies} />
          {loading && page > 1 && <div className="mt-6"><Loading /></div>}
          <div ref={sentinelRef} className="h-px" />
        </>
      )}

      {!loading &&!error && movies.length === 0 && (
        <p className="text-center text-slate-500 py-20">No movies found</p>
      )}
    </div>
  );
}