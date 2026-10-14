import { Film } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-black bg-black py-10 text-slate-400">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-4 text-center sm:flex-row sm:px-6 sm:text-left lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-tr from-indigo-600 via-purple-600 to-pink-500 text-white shadow-sm">
            <Film size={18} />
          </div>
          <span className="text-sm font-bold tracking-tight text-slate-200">
            Movie App
          </span>
        </div>

        <div className="text-xs leading-relaxed text-slate-500">
          <p>
            This product uses the TMDB API but is not endorsed or certified by
            TMDB.
          </p>

          <a
            href="https://www.themoviedb.org/"
            target="_blank"
            rel="noreferrer"
            className="mt-1 inline-flex items-center gap-1 font-medium text-indigo-400 transition-colors hover:text-indigo-300 hover:underline">
            Dedi Kusniadi
          </a>
        </div>
      </div>
    </footer>
  )
}
