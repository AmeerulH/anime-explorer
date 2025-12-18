import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useAnimeGenres } from "@/hooks";
import { useAnimeStore } from "@/store";
import type { AxiosError } from "axios";
import { createJSONStorage } from "zustand/middleware";

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

class MemoryStorage implements Storage {
  private store: Record<string, string> = {};
  length = 0;
  clear() {
    this.store = {};
    this.length = 0;
  }
  getItem(key: string) {
    return key in this.store ? this.store[key] : null;
  }
  key(index: number) {
    return Object.keys(this.store)[index] ?? null;
  }
  removeItem(key: string) {
    if (key in this.store) {
      delete this.store[key];
      this.length = Object.keys(this.store).length;
    }
  }
  setItem(key: string, value: string) {
    this.store[key] = value;
    this.length = Object.keys(this.store).length;
  }
}

const memoryStorage = new MemoryStorage();

describe("useAnimeGenres", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGet.mockReset();
    memoryStorage.clear();
    useAnimeStore.persist?.setOptions({
      storage: createJSONStorage(() => memoryStorage),
    });
    useAnimeStore.setState({ genres: [] });
  });

  it("loads genres and stores them", async () => {
    mockGet.mockResolvedValue({
      data: { data: [{ mal_id: 1, name: "Action", url: "", count: 0 }] },
    });

    const { result } = renderHook(() => useAnimeGenres());
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.genres[0]?.name).toBe("Action");
  });

  it("handles axios error (429)", async () => {
    mockGet.mockRejectedValue({
      isAxiosError: true,
      response: { status: 429, data: {} },
      message: "Rate limited",
    });

    const { result } = renderHook(() => useAnimeGenres());
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.error).toMatch(/Rate limit exceeded/i);
  });
});
