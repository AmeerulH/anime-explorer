import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor, act } from "@testing-library/react";
import { useAnimeList } from "@/hooks";
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

describe("useAnimeList", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGet.mockReset();
  });

  it("fetches list with search and genre", async () => {
    mockGet.mockResolvedValue({
      data: { data: [], pagination: { has_next_page: false } },
    });

    const { result } = renderHook(() => useAnimeList("naruto", 5, true));

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(mockGet).toHaveBeenCalled();
  });

  it("handles errors", async () => {
    mockGet.mockRejectedValue({
      isAxiosError: true,
      message: "Boom",
    });

    const { result } = renderHook(() => useAnimeList("naruto", null, true));
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.error).toBe("Boom");
  });

  it("loadMore increments page when not loading and hasNextPage", async () => {
    mockGet.mockResolvedValue({
      data: { data: [{ mal_id: 1 }], pagination: { has_next_page: true } },
    });

    const { result } = renderHook(() => useAnimeList("naruto", null, true));
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    mockGet.mockResolvedValueOnce({
      data: { data: [{ mal_id: 2 }], pagination: { has_next_page: false } },
    });

    act(() => {
      result.current.loadMore();
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(mockGet).toHaveBeenCalledTimes(2);
  });

  it("loadMore does nothing when loading or no next page", async () => {
    mockGet.mockResolvedValue({
      data: { data: [{ mal_id: 1 }], pagination: { has_next_page: false } },
    });

    const { result } = renderHook(() => useAnimeList("naruto", null, true));
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    mockGet.mockClear();
    act(() => {
      result.current.loadMore();
    });
    expect(mockGet).not.toHaveBeenCalled();
  });
});
