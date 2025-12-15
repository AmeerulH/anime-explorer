import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Anime, Genre } from "../types";

interface AnimeStore {
  favorites: Anime[];
  genres: Genre[];
  selectedGenreId: number | null;
  addFavorite: (anime: Anime) => void;
  removeFavorite: (id: number) => void;
  isFavorite: (id: number) => boolean;
  setGenres: (genres: Genre[]) => void;
  setSelectedGenreId: (id: number | null) => void;
}

export const useAnimeStore = create<AnimeStore>()(
  persist(
    (set, get) => ({
      favorites: [],
      genres: [],
      selectedGenreId: null,
      addFavorite: (anime: Anime) =>
        set((state) =>
          state.favorites.some((item) => item.mal_id === anime.mal_id)
            ? state
            : { favorites: [...state.favorites, anime] }
        ),
      removeFavorite: (id: number) =>
        set((state) => ({
          favorites: state.favorites.filter((anime) => anime.mal_id !== id),
        })),
      isFavorite: (id: number) =>
        get().favorites.some((anime) => anime.mal_id === id),
      setGenres: (genres: Genre[]) => set({ genres }),
      setSelectedGenreId: (id: number | null) => set({ selectedGenreId: id }),
    }),
    {
      name: "anime-favorites",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ favorites: state.favorites }),
    }
  )
);

export default useAnimeStore;
