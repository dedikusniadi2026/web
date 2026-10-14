import { Link } from "react-router-dom";
import { Film, Sparkles } from "lucide-react";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-[#060913]/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="group flex items-center gap-3 hover:scale-[1.02] transition-transform"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 to-pink-500 shadow-lg ring-1 ring-white/20">
            <Film className="h-5 w-5 text-white" />
            <div className="absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-pink-500 ring-2 ring-[#060913]">
              <Sparkles className="h-2 w-2 text-white" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="bg-gradient-to-r from-white to-slate-300 bg-clip-text text-xl font-black text-transparent">
              Movie App
            </span>
            <span className="text- font-semibold uppercase tracking-widest text-indigo-400">
              Cinema Hub
            </span>
          </div>
        </Link>
      </div>
    </header>
  );
}