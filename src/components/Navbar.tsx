import clsx from "clsx";
import { NavLink, Link } from "react-router-dom";
import { useAnimeStore } from "@/store";

const linkBase =
  "text-sm font-medium px-3 py-2 rounded-md transition hover:bg-slate-100";

const Navbar = () => {
  const favoritesCount = useAnimeStore((state) => state.favorites.length);

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link
          to="/"
          className="flex items-center gap-2 text-lg font-semibold text-slate-900 hover:text-slate-700"
          aria-label="Go to Anime Explorer home"
        >
          <img
            src="/animedotjs.svg"
            alt="Anime Explorer logo"
            className="h-7 w-7 filter brightness-0"
          />
          <span>Anime Explorer</span>
        </Link>
        <nav className="flex items-center gap-2">
          <NavLink
            to="/"
            className={({ isActive }) =>
              clsx(
                linkBase,
                isActive ? "bg-slate-100 text-slate-900" : "text-slate-700"
              )
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/favorites"
            className={({ isActive }) =>
              clsx(
                linkBase,
                isActive ? "bg-slate-100 text-slate-900" : "text-slate-700"
              )
            }
          >
            <span className="flex items-center gap-2">
              Favorites
              <span className="rounded-full bg-slate-900 px-2 py-0.5 text-xs font-semibold text-white">
                {favoritesCount}
              </span>
            </span>
          </NavLink>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
