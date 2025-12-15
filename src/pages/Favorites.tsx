import useAnimeStore from "../store/useAnimeStore";
import AnimeCard from "../components/AnimeCard";

const Favorites = () => {
  const favorites = useAnimeStore((state) => state.favorites);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Favorites</h1>
        <p className="text-slate-600">Your saved anime.</p>
      </div>

      {favorites.length === 0 ? (
        <p className="text-sm text-slate-600">No favorites yet.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {favorites.map((anime) => (
            <AnimeCard key={anime.mal_id} anime={anime} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;
