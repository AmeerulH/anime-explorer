import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useAnimeDetail } from "@/hooks";
import { useAnimeStore } from "@/store";
import { createAnimeMock } from "@/test/mocks/anime";
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

const sampleAnime = createAnimeMock({ mal_id: 7, title: "Detail", score: 8 });

describe("useAnimeDetail", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGet.mockReset();
    const storage = new MemoryStorage();
    vi.stubGlobal("localStorage", storage);
    // ensure any persisted stores don't explode in tests
    useAnimeStore.persist?.setOptions({
      storage: createJSONStorage(() => storage),
    });
  });

  it("fetches anime detail", async () => {
    mockGet.mockResolvedValue({ data: { data: sampleAnime } });

    const { result } = renderHook(() => useAnimeDetail(7));

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.anime?.mal_id).toBe(7);
  });

  it("handles errors", async () => {
    mockGet.mockRejectedValue({
      isAxiosError: true,
      message: "Boom",
    });

    const { result } = renderHook(() => useAnimeDetail(7));
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.error).toBe("Boom");
  });
});
