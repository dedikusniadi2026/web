import { Link } from "react-router-dom";
import { Film } from "lucide-react";
import Navbar from "../components/Navbar";
import { ArrowLeft } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="relative min-h-screen bg-black text-slate-100">
      <div className="pointer-events-none fixed top-1/2 left-1/2 h-125 w-125 -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-600/10 blur-[130px]" />

      <Navbar />

      <main className="relative mx-auto flex max-w-7xl flex-col items-center justify-center px-4 py-28 text-center sm:py-36">
        <div className="flex h-16 w-16 items-center justify-center rounded-3xl border border-indigo-500/20 bg-black text-indigo-400 shadow-xl">
          <Film size={32} />
        </div>

        <h1 className="mt-6 text-7xl font-black tracking-tight text-transparent bg-clip-text bg-linear-to-r from-indigo-400 via-purple-400 to-pink-400 sm:text-8xl">
          404
        </h1>

        <h2 className="mt-3 text-xl font-bold text-white sm:text-2xl">
          Scene Not Found
        </h2>

        <p className="mt-2.5 max-w-md text-sm leading-relaxed text-slate-400 sm:text-base">
          The page you are looking for does not exist.
        </p>

        <Link
          to="/"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-linear-to-r from-white via-slate-100 to-slate-200 px-7 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-white/10 transition-all duration-200 hover:scale-105 active:scale-95">
          <ArrowLeft size={18} /> Back to Movies
        </Link>
      </main>
    </div>
  )
}
