import { Link } from "react-router-dom";
import type { Anime } from "../types";

interface AnimeCardProps {
  anime: Anime;
}

const AnimeCard = ({ anime }: AnimeCardProps) => {
  const title = anime.title_english || anime.title;
  const imageSrc =
    anime.images.webp?.large_image_url ||
    anime.images.jpg?.large_image_url ||
    anime.images.jpg?.image_url;

  return (
    <Link
      to={`/anime/${anime.mal_id}`}
      className="group block overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
    >
      <div className="aspect-[3/4] w-full bg-slate-100">
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={title}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-slate-400">
            No image
          </div>
        )}
      </div>
      <div className="space-y-1 px-3 py-3">
        <h3 className="line-clamp-2 text-sm font-semibold text-slate-900">
          {title}
        </h3>
        <p className="text-xs font-medium text-amber-600">
          Score: {typeof anime.score === "number" ? anime.score.toFixed(1) : "N/A"}
        </p>
      </div>
    </Link>
  );
};

export default AnimeCard;

