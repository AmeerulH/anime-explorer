import { useEffect, useState } from "react";
import { getAnimeList } from "../api/client";
import type { Anime } from "../types";

interface UseAnimeListResult {
  animeList: Anime[];
  isLoading: boolean;
  error: string | null;
  hasNextPage: boolean;
  loadMore: () => void;
}

const useAnimeList = (
  searchQuery: string,
  genreId: number | null
): UseAnimeListResult => {
  const [animeList, setAnimeList] = useState<Anime[]>([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasNextPage, setHasNextPage] = useState(true);

  // reset when search or genre changes
  useEffect(() => {
    setAnimeList([]);
    setPage(1);
  }, [searchQuery, genreId]);

  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await getAnimeList(
          page,
          searchQuery || undefined,
          genreId ?? undefined
        );
        if (cancelled) return;

        setHasNextPage(response.pagination?.has_next_page ?? false);
        setAnimeList((prev) =>
          page === 1 ? response.data : [...prev, ...response.data]
        );
      } catch (err) {
        if (cancelled) return;
        const message =
          err instanceof Error ? err.message : "Failed to load anime.";
        setError(message);
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      cancelled = true;
    };
  }, [page, searchQuery, genreId]);

  const loadMore = () => {
    if (isLoading || !hasNextPage) return;
    setPage((prev) => prev + 1);
  };

  return { animeList, isLoading, error, hasNextPage, loadMore };
};

export default useAnimeList;
