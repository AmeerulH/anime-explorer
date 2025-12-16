import { Link } from "react-router-dom";
import clsx from "clsx";

const NotFound = () => {
  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-linear-to-b from-slate-50 to-slate-100 px-4 py-12">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 text-center">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg">
          <img
            src="/luffy_disappointed.png"
            alt="Luffy disappointed"
            className="h-full w-full max-h-130 object-cover"
          />
        </div>
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-600">
            404 • Lost at Sea
          </p>
          <h1 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">
            Aww... don’t cry, captain!
          </h1>
          <p className="text-slate-600">
            The page you’re looking for walked the plank. Let’s sail back and
            find some anime treasure.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            to="/"
            className={clsx(
              "inline-flex items-center justify-center rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition",
              "hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-300"
            )}
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
