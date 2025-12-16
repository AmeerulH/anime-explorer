import { Link } from "react-router-dom";
import clsx from "clsx";

interface NotFoundAnimeProps {
  title?: string;
  message?: string;
  error?: string | null;
}

const NotFoundAnime = ({
  title = "This anime got lost in the multiverse.",
  message = "Double-check the ID or head back to browse more anime.",
  error = null,
}: NotFoundAnimeProps) => {
  return (
    <div className="flex flex-col items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-6 text-center shadow-sm">
      <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-slate-100">
        <img
          src="/luffy_disappointed.png"
          alt="Luffy disappointed"
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </div>
      <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
      <p className="text-sm text-slate-600">{message}</p>
      {error ? <p className="text-xs text-slate-500">{error}</p> : null}
      <div className="flex flex-wrap justify-center gap-2">
        <Link
          to="/"
          className={clsx(
            "inline-flex items-center justify-center rounded-md bg-slate-900 px-3 py-2 text-sm font-semibold text-white shadow-sm transition",
            "hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-300"
          )}
        >
          Go Home
        </Link>
      </div>
    </div>
  );
};

export default NotFoundAnime;
