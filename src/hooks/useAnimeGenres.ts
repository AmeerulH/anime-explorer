import { useEffect, useRef, useState } from "react";
import { getAnimeGenres } from "../api/client";
import useAnimeStore from "../store/useAnimeStore";
import type { Genre } from "../types";

interface UseAnimeGenresResult {
  genres: Genre[];
  isLoading: boolean;
  error: string | null;
}

const useAnimeGenres = (): UseAnimeGenresResult => {
  const genres = useAnimeStore((state) => state.genres);
  const setGenres = useAnimeStore((state) => state.setGenres);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hasRequested = useRef(false);

  useEffect(() => {
    if (genres.length > 0) {
      setIsLoading(false);
      setError(null);
      return;
    }

    if (hasRequested.current) return;
    hasRequested.current = true;

    let cancelled = false;

    const load = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getAnimeGenres();
        setGenres(data);
        if (cancelled) return;
      } catch (err) {
        if (cancelled) return;
        const message =
          err instanceof Error ? err.message : "Failed to load genres.";
        setError(message);
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [genres.length, setGenres]);

  return { genres, isLoading, error };
};

export default useAnimeGenres;
