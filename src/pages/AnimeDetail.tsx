import { useParams } from "react-router-dom";
import useAnimeStore from "../store/useAnimeStore";
import useAnimeDetail from "../hooks/useAnimeDetail";
import FavoriteButton from "../components/FavoriteButton";
import Pill from "../components/Pill";
import Loading from "../components/Loading";
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
    return <Loading />;
  }

  if (error) {
    return (
      <ErrorMessage
        variant="illustrated"
        title="This anime slipped through the cracks."
        message={
          error || "Either the ID is wrong or the Grand Line ate it. Try again!"
        }
        showActions
      />
    );
  }

  if (!anime) {
    return (
      <ErrorMessage
        variant="illustrated"
        title="This anime got lost in the multiverse."
        message="Double-check the ID or head back to browse more anime."
        showActions
      />
    );
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
            <div className="min-w-0 max-w-3xl">
              <h1 className="text-2xl font-semibold leading-snug line-clamp-2 wrap-break-word">
                {anime.title}
              </h1>
              {anime.title_english && anime.title_english !== anime.title && (
                <p className="text-sm text-slate-600 line-clamp-1 wrap-break-word">
                  {anime.title_english}
                </p>
              )}
            </div>
            <FavoriteButton isFavorite={isFav} onToggle={toggleFavorite} />
          </div>

          <div className="flex flex-wrap gap-3 text-sm text-slate-700">
            <Pill>Score: {anime.score ?? "N/A"}</Pill>
            {anime.year ? <Pill>Year: {anime.year}</Pill> : null}
            {anime.season ? <Pill>Season: {anime.season}</Pill> : null}
            {anime.episodes ? <Pill>Episodes: {anime.episodes}</Pill> : null}
            {anime.type ? <Pill>Type: {anime.type}</Pill> : null}
            {anime.rating ? <Pill>Rating: {anime.rating}</Pill> : null}
          </div>

          {anime.genres?.length ? (
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-slate-800">Genres</h3>
              <div className="flex flex-wrap gap-2">
                {anime.genres.map((genre) => (
                  <Pill key={genre.mal_id} size="xs" roundedFull>
                    {genre.name}
                  </Pill>
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
