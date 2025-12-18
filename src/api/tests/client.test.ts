import { describe, it, expect, vi, beforeEach } from "vitest";
import { getAnimeList, getAnimeDetails, getAnimeGenres } from "@/api/client";
import { sampleAnime, sampleGenre } from "@/test/mocks/anime";
import type { AxiosError } from "axios";

const mockGet = vi.hoisted(() => vi.fn());

vi.mock("axios", () => {
  const get = mockGet;
  const create = vi.fn(() => ({ get }));
  const isAxiosError = (err: unknown): err is AxiosError =>
    !!err && typeof err === "object" && "isAxiosError" in err;
  return {
    default: { create, get, isAxiosError },
    create,
    get,
    isAxiosError,
  };
});

describe("api/client", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGet.mockReset();
  });

  it("calls getAnimeList with page, search, genre, and sort params", async () => {
    mockGet.mockResolvedValue({
      data: { data: [sampleAnime], pagination: { has_next_page: false } },
    });

    const result = await getAnimeList(2, "naruto", 5);

    expect(mockGet).toHaveBeenCalledWith("/anime", {
      params: {
        page: 2,
        q: "naruto",
        genres: 5,
        order_by: "title",
        sort: "asc",
      },
    });
    expect(result.data).toHaveLength(1);
  });

  it("throws friendly error on 429", async () => {
    mockGet.mockRejectedValue({
      isAxiosError: true,
      response: { status: 429, data: {} },
      message: "Rate limited",
    });

    await expect(getAnimeList()).rejects.toThrow(
      "Rate limit exceeded. Please wait and try again."
    );
  });

  it("gets anime details", async () => {
    mockGet.mockResolvedValue({ data: { data: sampleAnime } });
    const result = await getAnimeDetails(1);
    expect(mockGet).toHaveBeenCalledWith("/anime/1");
    expect(result.mal_id).toBe(1);
  });

  it("propagates message from API error response", async () => {
    mockGet.mockRejectedValue({
      isAxiosError: true,
      response: { status: 500, data: { message: "Boom" } },
      message: "fallback",
    });
    await expect(getAnimeList()).rejects.toThrow("Boom");
  });

  it("handles unexpected axios errors", async () => {
    mockGet.mockRejectedValue({
      isAxiosError: true,
      message: "Something went wrong",
    });
    await expect(getAnimeDetails(1)).rejects.toThrow("Something went wrong");
  });

  it("gets anime genres", async () => {
    mockGet.mockResolvedValue({ data: { data: [sampleGenre] } });
    const result = await getAnimeGenres();
    expect(mockGet).toHaveBeenCalledWith("/genres/anime");
    expect(result[0].mal_id).toBe(sampleGenre.mal_id);
  });

  it("handles genre fetch error", async () => {
    mockGet.mockRejectedValue({
      isAxiosError: true,
      response: { status: 429, data: {} },
      message: "Rate limited",
    });
    await expect(getAnimeGenres()).rejects.toThrow(
      "Rate limit exceeded. Please wait and try again."
    );
  });
});
