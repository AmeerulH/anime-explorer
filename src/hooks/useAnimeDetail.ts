import { useEffect, useState } from "react";
import { getAnimeDetails } from "../api/client";
import type { Anime } from "../types";

interface UseAnimeDetailResult {
  anime: Anime | null;
  isLoading: boolean;
  error: string | null;
}

const useAnimeDetail = (id?: number): UseAnimeDetailResult => {
  const [anime, setAnime] = useState<Anime | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    let cancelled = false;
    const load = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getAnimeDetails(id);
        if (!cancelled) {
          setAnime(data);
        }
      } catch (err) {
        if (cancelled) return;
        const message = err instanceof Error ? err.message : "Failed to load.";
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
  }, [id]);

  return { anime, isLoading, error };
};

export default useAnimeDetail;
