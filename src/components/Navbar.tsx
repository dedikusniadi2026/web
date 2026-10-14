import { Link, useLocation } from "react-router-dom";
import { Film } from "lucide-react";

export default function Navbar() {
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-[#060913]/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2">
          <Film className="text-indigo-500" />
          <span className="font-black text-xl text-white">Movie App</span>
        </Link>
        <Link
          to="/"
          className={`px-4 py-2 rounded-xl text-sm font-semibold ${isHome? "bg-slate-800 text-white" : "text-slate-400"}`}
        >
          Discover
        </Link>
      </div>
    </header>
  );
}