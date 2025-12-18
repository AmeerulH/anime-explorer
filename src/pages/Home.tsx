import { useEffect, useMemo, useState } from "react";
import type { ChangeEvent } from "react";
import debounce from "lodash.debounce";
import clsx from "clsx";
import {
  AnimeCard,
  GenreDropdown,
  ErrorMessage,
  Loading,
  SearchNotFound,
} from "@/components";
import { useAnimeList } from "@/hooks";
import { useAnimeStore } from "@/store";

const Home = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sfwOnly, setSfwOnly] = useState(true);
  const selectedGenreId = useAnimeStore((state) => state.selectedGenreId);
  const setSelectedGenreId = useAnimeStore((state) => state.setSelectedGenreId);
  const { animeList, isLoading, error, hasNextPage, loadMore } = useAnimeList(
    debouncedSearch,
    selectedGenreId,
    sfwOnly
  );

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const debouncedSetter = useMemo(
    () => debounce((value: string) => setDebouncedSearch(value.trim()), 350),
    []
  );

  useEffect(() => {
    debouncedSetter(searchQuery);
    return () => debouncedSetter.cancel();
  }, [searchQuery, debouncedSetter]);

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
          <button
            type="button"
            onClick={() => setSfwOnly((prev) => !prev)}
            className={clsx(
              "inline-flex items-center justify-center rounded-md border px-3 py-2 text-sm font-semibold shadow-sm transition",
              sfwOnly
                ? "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
            )}
            aria-pressed={sfwOnly}
          >
            {sfwOnly ? "SFW On" : "SFW Off"}
          </button>
        </div>
      </div>

      {error && (
        <ErrorMessage
          variant="illustrated"
          title="Something went wrong while fetching anime."
          message={error || "Please try again or adjust your search."}
        />
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {animeList.map((anime) => (
          <AnimeCard key={anime.mal_id} anime={anime} />
        ))}
      </div>

      {!isLoading && animeList.length === 0 && !error && (
        <SearchNotFound query={debouncedSearch} />
      )}

      {(animeList.length > 0 || isLoading) && (
        <div className="flex justify-center">
          <button
            type="button"
            onClick={loadMore}
            disabled={!hasNextPage || isLoading}
            className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {isLoading ? (
              <Loading label="Loading..." />
            ) : hasNextPage ? (
              "Load More"
            ) : (
              "No More Results"
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;
