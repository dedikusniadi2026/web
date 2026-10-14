import type { MouseEvent } from "react";
import { Clapperboard, Heart, Star } from "lucide-react";
import { Link } from "react-router-dom";

import { useWatchlist } from "../hooks/useWatchlist";
import type { Movie } from "../types/movie";
import { getPosterUrl } from "../utils/image";

interface MovieCardProps {
  movie: Movie
}

export default function MovieCard({ movie }: MovieCardProps) {
  const { isSaved, toggle } = useWatchlist()

  const saved = isSaved(movie.id)
  const posterUrl = getPosterUrl(movie.poster_path)

  const releaseYear = movie.release_date
    ? movie.release_date.slice(0, 4)
    : "N/A"

  function handleToggleSave(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault()
    event.stopPropagation()

    toggle(movie)
  }

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-md transition-all duration-300 hover:-translate-y-2 hover:border-indigo-500/50 hover:bg-slate-900/80 hover:shadow-2xl hover:shadow-indigo-500/20">
      <Link to={`/movie/${movie.id}`} className="flex flex-1 flex-col">
        <div className="relative aspect-2/3 w-full overflow-hidden bg-slate-950">
          <MoviePoster posterUrl={posterUrl} title={movie.title} />

          <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/20 to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-85" />

          <div className="absolute top-3 left-3 z-10 flex items-center gap-1 rounded-md border border-white/10 bg-slate-950/70 px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase text-slate-300 backdrop-blur-md shadow-sm">
            HD
          </div>
        </div>

        <div className="flex flex-1 flex-col justify-between p-4">
          <h2 className="line-clamp-2 text-base font-bold tracking-tight text-white transition-colors duration-200 group-hover:text-indigo-300">
            {movie.title}
          </h2>

          <div className="mt-3.5 flex items-center justify-between text-xs font-semibold text-slate-400">
            <span className="rounded-md border border-slate-800 bg-slate-950/60 px-2 py-0.5 text-slate-400">
              {releaseYear}
            </span>

            <span className="flex items-center gap-1 text-slate-300">
              <Star
                size={14}
                className="text-amber-400"
                fill="currentColor"
              />
              <span>{movie.vote_average.toFixed(1)}</span>
            </span>
          </div>
        </div>
      </Link>

      <button
        type="button"
        onClick={handleToggleSave}
        aria-label={
          saved
            ? `Remove ${movie.title} from watchlist`
            : `Add ${movie.title} to watchlist`
        }
        aria-pressed={saved}
        className={`absolute top-3 right-3 z-10 flex h-9 w-9 items-center justify-center rounded-full border shadow-lg backdrop-blur-md transition-all duration-300 hover:scale-110 active:scale-95 ${
          saved
            ? "border-rose-500/50 bg-rose-500 text-white shadow-rose-500/40 hover:bg-rose-600"
            : "border-white/15 bg-slate-950/70 text-slate-300 hover:border-white/30 hover:bg-slate-900 hover:text-white"
        }`}>
        <Heart size={18} fill={saved ? "currentColor" : "none"} />
      </button>
    </article>
  )
}

interface MoviePosterProps {
  posterUrl: string | null
  title: string
}

function MoviePoster({ posterUrl, title }: MoviePosterProps) {
  if (!posterUrl) {
    return (
      <div
        role="img"
        aria-label="Movie"
        className="flex h-full w-full flex-col items-center justify-center gap-3 bg-slate-900 p-4 text-slate-500 transition-colors group-hover:text-slate-400">
        <Clapperboard size={36} className="text-slate-600" />
        <span className="px-2 text-center text-xs font-semibold text-slate-400">
          {title}
        </span>
      </div>
    )
  }

  return (
    <img
      src={posterUrl}
      alt={title}
      loading="lazy"
      className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"/>
  )
}
