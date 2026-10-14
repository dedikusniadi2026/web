import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Clapperboard, User } from "lucide-react";
import { getMovieDetail, getMovieCredits } from "../api/movieApi";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";
import { getPosterUrl, getProfileUrl } from "../utils/image";
import type { MovieDetail, CreditsResponse, Cast } from "../types/movie";

export default function MovieDetailPage() {
  const { movieId } = useParams();
  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [credits, setCredits] = useState<CreditsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError("");
        const id = Number(movieId);
        if (Number.isNaN(id)) throw new Error("Invalid ID");

        const [detail, creditsData] = await Promise.all([
          getMovieDetail(id),
          getMovieCredits(id),
        ]);
        setMovie(detail);
        setCredits(creditsData);
      } catch {
        setError("Failed to load movie details");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [movieId]);

  if (loading) return <div className="py-20"><Loading /></div>;
  if (error) return <div className="py-12"><ErrorMessage message={error} onRetry={() => window.location.reload()} /></div>;
  if (!movie ||!credits) return null;

  const director = credits.crew.find((p) => p.job === "Director");
  const mainCast = credits.cast.slice(0, 8);

  return (
    <div>
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white mb-6"
      >
        <ArrowLeft size={16} /> Back
      </Link>

      <div className="grid md:grid-cols-[260px_1fr] gap-8">
        {movie.poster_path? (
          <img
            src={getPosterUrl(movie.poster_path) || ""}
            alt={movie.title}
            className="rounded-2xl w-full shadow-2xl"
          />
        ) : (
          <div className="aspect-[2/3] w-full grid place-items-center rounded-2xl bg-slate-900 text-slate-600">
            <Clapperboard size={36} />
          </div>
        )}

        <div>
          <h1 className="text-4xl font-black tracking-tight">{movie.title}</h1>
          <p className="text-slate-400 mt-2 text-sm">
            {movie.release_date?.slice(0,4) || "N/A"} • {movie.vote_average.toFixed(1)} ★
            {director && ` • Director: ${director.name}`}
          </p>

          <div className="mt-6">
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500">Synopsis</h2>
            <p className="mt-2 leading-relaxed text-slate-300">
              {movie.overview || "No synopsis available."}
            </p>
          </div>

          {movie.genres?.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {movie.genres.map((g) => (
                <span key={g.id} className="px-3 py-1 rounded-full bg-slate-800 text-xs text-slate-300">
                  {g.name}
                </span>
              ))}
            </div>
          )}

          <div className="mt-6 p-4 rounded-2xl border border-slate-800 bg-slate-900/40">
            <p className="text-xs uppercase tracking-widest text-slate-500">Director</p>
            <p className="font-semibold mt-1">{director?.name || "Unknown"}</p>
          </div>

          {mainCast.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">Main Cast</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {mainCast.map((actor: Cast) => (
                  <div key={actor.id} className="rounded-xl border border-slate-800 bg-slate-900/50 p-2">
                    {actor.profile_path? (
                      <img src={getProfileUrl(actor.profile_path) || ""} alt={actor.name} className="aspect-[2/3] w-full object-cover rounded-lg" />
                    ) : (
                      <div className="aspect-[2/3] grid place-items-center bg-slate-950 rounded-lg text-slate-600">
                        <User size={20} />
                      </div>
                    )}
                    <p className="mt-2 text-xs font-semibold truncate">{actor.name}</p>
                    <p className="text- text-slate-500 truncate">{actor.character}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}