import { Star } from "lucide-react";
import { Link } from "react-router-dom";
import type { Movie } from "../types/movie";
import { getPosterUrl } from "../utils/image";

interface Props {
  movie: Movie;
}

export default function MovieCard({ movie }: Props) {
  const posterUrl = getPosterUrl(movie.poster_path);
  const year = movie.release_date? movie.release_date.slice(0, 4) : "N/A";

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/10">
      <Link to={`/movie/${movie.id}`} className="flex flex-1 flex-col">
        <div className="relative aspect-[2/3] w-full overflow-hidden bg-slate-950">
          {posterUrl? (
            <img
              src={posterUrl}
              alt={movie.title}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-slate-900 p-4 text-center text-xs text-slate-500">
              {movie.title}
            </div>
          )}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/10 to-transparent opacity-70" />

          <div className="absolute top-3 left-3 rounded-md border border-white/10 bg-slate-950/70 px-2 py-0.5 text- font-bold tracking-wider text-slate-300 backdrop-blur-md">
            HD
          </div>
        </div>

        <div className="flex flex-1 flex-col justify-between p-4">
          <h2 className="line-clamp-2 text- font-bold tracking-tight text-white group-hover:text-indigo-300">
            {movie.title}
          </h2>

          <div className="mt-3.5 flex items-center justify-between text-xs">
            <span className="rounded-md border border-slate-800 bg-slate-950/60 px-2 py-0.5 text-slate-400">
              {year}
            </span>
            <span className="flex items-center gap-1 text-slate-300">
              <Star size={14} className="text-amber-400" fill="currentColor" />
              {movie.vote_average.toFixed(1)}
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}