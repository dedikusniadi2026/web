import { Link } from "react-router-dom";
import { Film } from "lucide-react";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-[#060913]/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2">
          <Film className="text-indigo-500" />
          <span className="font-black text-xl text-white">Movie App</span>
        </Link>
      </div>
    </header>
  );
}