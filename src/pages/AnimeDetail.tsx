import { useParams } from "react-router-dom";
import useAnimeStore from "../store/useAnimeStore";
import useAnimeDetail from "../hooks/useAnimeDetail";
import FavoriteButton from "../components/FavoriteButton";
import ErrorMessage from "../components/ErrorMessage";

const AnimeDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { anime, isLoading, error } = useAnimeDetail(
    id ? Number(id) : undefined
  );

  const favorites = useAnimeStore((state) => state.favorites);
  const addFavorite = useAnimeStore((state) => state.addFavorite);
  const removeFavorite = useAnimeStore((state) => state.removeFavorite);

  const toggleFavorite = () => {
    if (!anime) return;
    const isFav = favorites.some((item) => item.mal_id === anime.mal_id);
    if (isFav) {
      removeFavorite(anime.mal_id);
    } else {
      addFavorite(anime);
    }
  };

  if (isLoading) {
    return <p className="text-sm text-slate-600">Loading...</p>;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (!anime) {
    return <p className="text-sm text-slate-600">Anime not found.</p>;
  }

  const imageSrc =
    anime.images.webp?.large_image_url ||
    anime.images.jpg?.large_image_url ||
    anime.images.jpg?.image_url;

  const isFav = favorites.some((item) => item.mal_id === anime.mal_id);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
        <div className="w-full max-w-xs overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
          {imageSrc ? (
            <img
              src={imageSrc}
              alt={anime.title}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="flex h-64 items-center justify-center text-slate-400">
              No image
            </div>
          )}
        </div>

        <div className="flex-1 space-y-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold">{anime.title}</h1>
              {anime.title_english && anime.title_english !== anime.title && (
                <p className="text-sm text-slate-600">{anime.title_english}</p>
              )}
            </div>
            <FavoriteButton isFavorite={isFav} onToggle={toggleFavorite} />
          </div>

          <div className="flex flex-wrap gap-3 text-sm text-slate-700">
            <span className="rounded bg-slate-100 px-2 py-1">
              Score: {anime.score ?? "N/A"}
            </span>
            {anime.year ? (
              <span className="rounded bg-slate-100 px-2 py-1">
                Year: {anime.year}
              </span>
            ) : null}
            {anime.season ? (
              <span className="rounded bg-slate-100 px-2 py-1">
                Season: {anime.season}
              </span>
            ) : null}
            {anime.episodes ? (
              <span className="rounded bg-slate-100 px-2 py-1">
                Episodes: {anime.episodes}
              </span>
            ) : null}
            {anime.type ? (
              <span className="rounded bg-slate-100 px-2 py-1">
                Type: {anime.type}
              </span>
            ) : null}
            {anime.rating ? (
              <span className="rounded bg-slate-100 px-2 py-1">
                Rating: {anime.rating}
              </span>
            ) : null}
          </div>

          {anime.genres?.length ? (
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-slate-800">Genres</h3>
              <div className="flex flex-wrap gap-2">
                {anime.genres.map((genre) => (
                  <span
                    key={genre.mal_id}
                    className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-800"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
            </div>
          ) : null}

          {anime.synopsis && (
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-slate-800">Synopsis</h3>
              <p className="text-sm leading-relaxed text-slate-700">
                {anime.synopsis}
              </p>
            </div>
          )}

          {anime.background && (
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-slate-800">
                Background
              </h3>
              <p className="text-sm leading-relaxed text-slate-700">
                {anime.background}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnimeDetail;
