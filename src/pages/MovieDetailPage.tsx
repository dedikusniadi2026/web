import { useEffect, useState } from "react";
import { isCancel } from "axios";
import {
  ArrowLeft,
  Clapperboard,
  Heart,
  Play,
  Star,
  User,
  Clock,
  Film,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";

import {
  getMovieCredits,
  getMovieDetail,
  getMovieVideos,
  getSimilarMovies,
} from "../api/movieApi";

import type {
  Cast,
  CreditsResponse,
  Movie,
  MovieDetail,
} from "../types/movie";

import Navbar from "../components/Navbar";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";
import MovieGrid from "../components/MovieGrid";
import { useWatchlist } from "../hooks/useWatchlist";

import {
  getBackdropUrl,
  getPosterUrl,
  getProfileUrl,
} from "../utils/image";

import { formatRuntime } from "../utils/format";

export default function MovieDetailPage() {
  const { movieId } = useParams()
  const { isSaved, toggle } = useWatchlist()

  const [movie, setMovie] = useState<MovieDetail | null>(null)
  const [credits, setCredits] = useState<CreditsResponse | null>(null)
  const [trailerKey, setTrailerKey] = useState<string | null>(null)
  const [similarMovies, setSimilarMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    const controller = new AbortController()

    async function loadMovie() {
      try {
        setLoading(true)
        setError("")

        const id = Number(movieId)

        if (Number.isNaN(id)) {
          throw new Error("Invalid movie ID")
        }

        const [
          movieData,
          creditsData,
          videosData,
          similarData,
        ] = await Promise.all([
          getMovieDetail(id, controller.signal),
          getMovieCredits(id, controller.signal),
          getMovieVideos(id, controller.signal),
          getSimilarMovies(id, controller.signal),
        ])

        setMovie(movieData)
        setCredits(creditsData)
        setSimilarMovies(similarData.results)

        const trailer =
          videosData.results.find(
            (video) =>
              video.site === "YouTube" &&
              video.type === "Trailer" &&
              video.official
          ) ??
          videosData.results.find(
            (video) =>
              video.site === "YouTube" && video.type === "Trailer"
          )

        setTrailerKey(trailer?.key ?? null)
      } catch (caughtError) {
        if (isCancel(caughtError)) {
          return
        }

        setError("Failed to load movie details.")
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    loadMovie()

    return () => {
      controller.abort()
    }
  }, [movieId, refreshKey])

  if (loading) {
    return (
      <PageLayout>
        <Loading />
      </PageLayout>
    )
  }

  if (error) {
    return (
      <PageLayout>
        <div className="py-12">
          <ErrorMessage
            message={error}
            onRetry={() => setRefreshKey((key) => key + 1)}/>

          <div className="mt-8 flex justify-center">
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/80 px-4 py-2.5 text-sm font-medium text-slate-300 shadow-md transition-all hover:bg-slate-800 hover:text-white">
              <ArrowLeft size={16} />
              <span>Back to movies</span>
            </Link>
          </div>
        </div>
      </PageLayout>
    )
  }

  if (!movie || !credits) {
    return null
  }

  const director = credits.crew.find(
    (person) => person.job === "Director"
  )
  const mainCast = credits.cast.slice(0, 8)
  const releaseYear = movie.release_date
    ? movie.release_date.slice(0, 4)
    : "N/A"

  const saved = isSaved(movie.id)

  return (
    <PageLayout>
      <Link
        to="/"
        className="group mb-6 inline-flex items-center gap-2 rounded-xl border border-slate-800/80 bg-slate-900/60 px-4 py-2 text-xs font-semibold text-slate-400 backdrop-blur-md shadow-sm transition-all duration-200 hover:border-slate-700 hover:bg-slate-800 hover:text-white">
        <ArrowLeft size={14} className="transition-transform duration-200 group-hover:-translate-x-0.5" />
        <span>Back to movies</span>
      </Link>

      <MovieHero
        movie={movie}
        releaseYear={releaseYear}
        director={director?.name}
        isSaved={saved}
        onWatchTrailer={() => {
          document.getElementById("trailer")?.scrollIntoView({
            behavior: "smooth",
          })
        }}
        onToggleWatchlist={() => {
          toggle(movie)
        }}/>

      {mainCast.length > 0 && (
        <section className="mt-16">
          <SectionHeading eyebrow="Cast & Crew" title="Main cast" />

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">
            {mainCast.map((actor) => (
              <CastCard key={actor.id} actor={actor} />
            ))}
          </div>
        </section>
      )}

      {trailerKey && (
        <section id="trailer" className="mt-16 scroll-mt-24">
          <SectionHeading eyebrow="Video preview" title="Official trailer" />

          <div className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-950/80 shadow-2xl shadow-indigo-950/20 ring-1 ring-white/10">
            <div className="aspect-video w-full bg-black">
              <iframe
                src={`https://www.youtube.com/embed/${trailerKey}`}
                title={`${movie.title} official trailer`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="h-full w-full"
              />
            </div>
          </div>
        </section>
      )}

      {similarMovies.length > 0 && (
        <section className="mt-16">
          <SectionHeading eyebrow="Recommendations" title="Similar movies" />

          <MovieGrid movies={similarMovies.slice(0, 10)} />
        </section>
      )}
    </PageLayout>
  )
}

interface PageLayoutProps {
  children: React.ReactNode
}

function PageLayout({ children }: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-black text-slate-100 selection:bg-black selection:text-white">
      <Navbar />
      <main className="mx-auto w-full max-w-7xl px-4 pt-6 pb-20 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  )
}

interface SectionHeadingProps {
  eyebrow: string
  title: string
}

function SectionHeading({ eyebrow, title }: SectionHeadingProps) {
  return (
    <div className="mb-6">
      <p className="text-xs font-semibold uppercase tracking-widest text-indigo-400">
        {eyebrow}
      </p>
      <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-100">
        {title}
      </h2>
    </div>
  )
}

interface MovieHeroProps {
  movie: MovieDetail
  releaseYear: string
  director?: string
  isSaved: boolean
  onWatchTrailer: () => void
  onToggleWatchlist: () => void
}

function MovieHero({
  movie,
  releaseYear,
  director,
  isSaved,
  onWatchTrailer,
  onToggleWatchlist,
}: MovieHeroProps) {
  const backdropUrl = getBackdropUrl(movie.backdrop_path)
  const posterUrl = getPosterUrl(movie.poster_path)

  return (
    <section className="relative rounded-3xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-md overflow-hidden shadow-2xl">
      {backdropUrl && (
        <div className="relative h-64 w-full overflow-hidden sm:h-80 lg:h-96">
          <img
            src={backdropUrl} alt="" className="h-full w-full object-cover object-center scale-105 blur-[1px] brightness-90"/>
          <div className="absolute inset-0 bg-linear-to-t from-[#070b15] via-[#070b15]/60 to-transparent" />
          <div className="absolute inset-0 bg-linear-to-r from-[#070b15]/80 via-transparent to-transparent" />
        </div>
      )}

      <div className="relative p-6 sm:p-8 lg:p-10">
        <div
          className={`grid gap-8 ${
            backdropUrl ? "-mt-24 sm:-mt-36 lg:-mt-44" : ""
          } md:grid-cols-[220px_1fr] lg:grid-cols-[260px_1fr]`}>
          <div className="shrink-0">
            <MoviePoster src={posterUrl} title={movie.title} />
          </div>

          <div className="flex flex-col justify-end pt-2">
            <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
              {movie.title}
            </h1>

            <MovieMeta
              releaseYear={releaseYear}
              rating={movie.vote_average}
              runtime={movie.runtime}/>

            {movie.genres.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {movie.genres.map((genre) => (
                  <span
                    key={genre.id}
                    className="rounded-full border border-slate-700/60 bg-slate-800/60 px-3 py-1 text-xs font-semibold text-slate-300 backdrop-blur-md shadow-sm">
                    {genre.name}
                  </span>
                ))}
              </div>
            )}

            <div className="mt-7 flex flex-wrap items-center gap-3.5">
              <button
                type="button"
                onClick={onWatchTrailer}
                className="flex items-center gap-2 rounded-xl bg-linear-to-r from-white to-slate-200 px-5 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-white/10 transition-all duration-200 hover:scale-[1.02] hover:bg-slate-100 active:scale-95">
                <Play size={16} fill="currentColor" />
                <span>Watch trailer</span>
              </button>

              <button
                type="button"
                aria-pressed={isSaved}
                onClick={onToggleWatchlist}
                className={`flex items-center gap-2 rounded-xl border px-5 py-3 text-sm font-semibold backdrop-blur-md transition-all duration-200 hover:scale-[1.02] active:scale-95 ${
                  isSaved
                    ? "border-rose-500/50 bg-rose-500/20 text-rose-300 shadow-md shadow-rose-500/20"
                    : "border-slate-700/80 bg-slate-800/70 text-slate-200 hover:border-slate-600 hover:bg-slate-700 hover:text-white"
                }`}>
                <Heart
                  size={16}
                  fill={isSaved ? "currentColor" : "none"}
                  className={isSaved ? "text-rose-400" : "text-slate-400"}
                />
                <span>
                  {isSaved ? "Saved to watchlist" : "Add to watchlist"}
                </span>
              </button>
            </div>

            <div className="mt-8 border-t border-slate-800/80 pt-6">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Synopsis
              </h2>
              <p className="mt-2.5 text-sm leading-relaxed text-slate-300 sm:text-base">
                {movie.overview || "No synopsis available."}
              </p>
            </div>

            <div className="mt-6 flex items-center gap-3 rounded-2xl border border-slate-800/60 bg-slate-950/40 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black text-indigo-400">
                <Film size={20} />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Director
                </p>
                <p className="text-sm font-semibold text-slate-200">
                  {director || "Unknown"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

interface MoviePosterProps {
  src: string | null
  title: string
}

function MoviePoster({ src, title }: MoviePosterProps) {
  if (!src) {
    return (
      <div
        role="img"
        aria-label={title}
        className="flex aspect-2/3 w-full max-w-64 items-center justify-center rounded-2xl border border-slate-800 bg-slate-900 text-slate-600 shadow-2xl">
        <Clapperboard size={36} />
      </div>
    )
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 shadow-2xl shadow-black/80 ring-1 ring-white/10">
      <img
        src={src}
        alt={title}
        className="aspect-2/3 w-full max-w-64 object-cover"/>
    </div>
  )
}

interface MovieMetaProps {
  releaseYear: string
  rating: number
  runtime: number | null
}

function MovieMeta({ releaseYear, rating, runtime }: MovieMetaProps) {
  return (
    <div className="mt-3.5 flex flex-wrap items-center gap-3 text-sm font-medium text-slate-400">
      <span className="rounded-md border border-slate-700/60 bg-slate-800/60 px-2.5 py-0.5 text-xs text-slate-300">
        {releaseYear}
      </span>

      <span className="flex items-center gap-1.5 rounded-md border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-xs font-semibold text-amber-300">
        <Star size={13} className="text-amber-400" fill="currentColor" />
        <span>{rating.toFixed(1)}</span>
      </span>

      {runtime !== null && (
        <span className="flex items-center gap-1 text-xs text-slate-400">
          <Clock size={13} className="text-slate-500" />
          <span>{formatRuntime(runtime)}</span>
        </span>
      )}
    </div>
  )
}

interface CastCardProps {
  actor: Cast
}

function CastCard({ actor }: CastCardProps) {
  const imageUrl = getProfileUrl(actor.profile_path)

  return (
    <article className="group overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/50 p-2 transition-all duration-300 hover:-translate-y-1 hover:border-indigo-500/40 hover:bg-slate-900/90 hover:shadow-xl">
      {imageUrl ? (
        <div className="overflow-hidden rounded-xl bg-slate-950">
          <img
            src={imageUrl}
            alt={actor.name}
            loading="lazy"
            className="aspect-2/3 w-full object-cover transition-transform duration-300 group-hover:scale-105"/>
        </div>
      ) : (
        <div
          role="img"
          aria-label={actor.name}
          className="flex aspect-2/3 items-center justify-center rounded-xl bg-slate-950 text-slate-600">
          <User size={24} />
        </div>
      )}

      <div className="mt-2.5 px-1 pb-1">
        <h3 className="truncate text-xs font-semibold text-slate-200 group-hover:text-indigo-300">
          {actor.name}
        </h3>
        <p className="mt-0.5 truncate text-[11px] text-slate-500">
          {actor.character}
        </p>
      </div>
    </article>
  )
}
