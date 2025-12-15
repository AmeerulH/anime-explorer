import { useState } from "react";
import type { ChangeEvent } from "react";
import AnimeCard from "../components/AnimeCard";
import GenreDropdown from "../components/GenreDropdown";
import ErrorMessage from "../components/ErrorMessage";
import useAnimeList from "../hooks/useAnimeList";
import useAnimeStore from "../store/useAnimeStore";

const Home = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const selectedGenreId = useAnimeStore((state) => state.selectedGenreId);
  const setSelectedGenreId = useAnimeStore((state) => state.setSelectedGenreId);
  const { animeList, isLoading, error, hasNextPage, loadMore } = useAnimeList(
    searchQuery,
    selectedGenreId
  );

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Home</h1>
          <p className="text-slate-600">Search and browse anime.</p>
        </div>
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
          <div className="w-full sm:w-80">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search anime..."
              className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm outline-none ring-0 transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
            />
          </div>
          <GenreDropdown
            selectedId={selectedGenreId}
            onSelect={setSelectedGenreId}
          />
        </div>
      </div>

      {error && <ErrorMessage message={error} />}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {animeList.map((anime) => (
          <AnimeCard key={anime.mal_id} anime={anime} />
        ))}
      </div>

      {!isLoading && animeList.length === 0 && !error && (
        <p className="text-sm text-slate-600">No anime found.</p>
      )}

      {(animeList.length > 0 || isLoading) && (
        <div className="flex justify-center">
          <button
            type="button"
            onClick={loadMore}
            disabled={!hasNextPage || isLoading}
            className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {isLoading
              ? "Loading..."
              : hasNextPage
              ? "Load More"
              : "No More Results"}
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;
