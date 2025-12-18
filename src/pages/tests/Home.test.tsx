import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { createAnimeMock } from "@/test/mocks/anime";
import Home from "@/pages/Home";

const useAnimeListMock = vi.hoisted(() => vi.fn());
const useAnimeGenresMock = vi.hoisted(() => vi.fn());
const setSelectedGenreIdMock = vi.hoisted(() => vi.fn());

vi.mock("@/hooks", () => ({
  useAnimeList: (...args: unknown[]) => useAnimeListMock(...args),
  useAnimeGenres: () => useAnimeGenresMock(),
}));

vi.mock("@/store", () => ({
  useAnimeStore: (
    selector: (state: {
      selectedGenreId: number | null;
      setSelectedGenreId: (id: number | null) => void;
    }) => unknown
  ) =>
    selector({
      selectedGenreId: null,
      setSelectedGenreId: setSelectedGenreIdMock,
    }),
}));

const baseAnime = createAnimeMock({
  mal_id: 1,
  title: "Naruto",
  title_english: "Naruto",
  score: 8,
});

const setDefaultMocks = () => {
  useAnimeListMock.mockReturnValue({
    animeList: [baseAnime],
    isLoading: false,
    error: null,
    hasNextPage: false,
    loadMore: vi.fn(),
  });
  useAnimeGenresMock.mockReturnValue({
    genres: [
      { mal_id: 1, name: "Action", url: "", count: 0 },
      { mal_id: 2, name: "Comedy", url: "", count: 0 },
    ],
    isLoading: false,
    error: null,
  });
  setSelectedGenreIdMock.mockReset();
};

describe("Home page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setDefaultMocks();
  });

  it("renders anime list and search input", () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    expect(screen.getByPlaceholderText(/Search anime/i)).toBeInTheDocument();
    expect(screen.getByText(/Naruto/)).toBeInTheDocument();
  });

  it("shows error state", () => {
    useAnimeListMock.mockReturnValueOnce({
      animeList: [],
      isLoading: false,
      error: "Boom",
      hasNextPage: false,
      loadMore: vi.fn(),
    });

    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    expect(
      screen.getByText(/Something went wrong while fetching anime/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/Boom/)).toBeInTheDocument();
  });

  it("shows not found state when no results", () => {
    useAnimeListMock.mockReturnValueOnce({
      animeList: [],
      isLoading: false,
      error: null,
      hasNextPage: false,
      loadMore: vi.fn(),
    });

    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    expect(
      screen.getByText(/Could not find .*Try a different anime!/i)
    ).toBeInTheDocument();
  });

  it("shows loading state on load more button", () => {
    useAnimeListMock.mockReturnValueOnce({
      animeList: [],
      isLoading: true,
      error: null,
      hasNextPage: true,
      loadMore: vi.fn(),
    });

    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
  });

  it("calls setSelectedGenreId when genre changes", () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByRole("combobox"), { target: { value: "2" } });
    expect(setSelectedGenreIdMock).toHaveBeenCalledWith(2);
  });

  it("calls useAnimeList with debounced search value", async () => {
    vi.useFakeTimers();
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    useAnimeListMock.mockClear();

    fireEvent.change(screen.getByPlaceholderText(/Search anime/i), {
      target: { value: "Naruto" },
    });

    await act(async () => {
      vi.advanceTimersByTime(400);
    });

    const lastCall = useAnimeListMock.mock.calls.at(-1);
    expect(lastCall?.[0]).toBe("Naruto");

    vi.useRealTimers();
  });
});
