import axios from "axios";
import type { Anime, Genre, JikanResponse } from "../types";

const client = axios.create({
  baseURL: "https://api.jikan.moe/v4",
  timeout: 10000,
});

const handleJikanError = (error: unknown): Error => {
  if (axios.isAxiosError(error)) {
    if (error.response?.status === 429) {
      return new Error("Rate limit exceeded. Please wait and try again.");
    }

    const message =
      error.response?.data?.message ||
      error.message ||
      "Unexpected API error occurred.";

    return new Error(message);
  }

  return new Error("Unexpected error occurred.");
};

export const getAnimeList = async (
  page = 1,
  searchQuery?: string,
  genreId?: number,
  sfw?: boolean
): Promise<JikanResponse<Anime[]>> => {
  try {
    const response = await client.get<JikanResponse<Anime[]>>("/anime", {
      params: {
        page,
        q: searchQuery || undefined,
        genres: genreId || undefined,
        sfw: sfw ? true : undefined,
        order_by: "title",
        sort: "asc",
      },
    });

    return response.data;
  } catch (error) {
    throw handleJikanError(error);
  }
};

export const getAnimeDetails = async (id: number): Promise<Anime> => {
  try {
    const response = await client.get<JikanResponse<Anime>>(`/anime/${id}`);
    return response.data.data;
  } catch (error) {
    throw handleJikanError(error);
  }
};

export const getAnimeGenres = async (): Promise<Genre[]> => {
  try {
    const response = await client.get<JikanResponse<Genre[]>>("/genres/anime");
    return response.data.data;
  } catch (error) {
    throw handleJikanError(error);
  }
};

export default client;
