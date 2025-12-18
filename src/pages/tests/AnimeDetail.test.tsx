import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import AnimeDetail from "@/pages/AnimeDetail";
import { createAnimeMock } from "@/test/mocks/anime";

const useAnimeDetailMock = vi.hoisted(() => vi.fn());
const addFavoriteMock = vi.hoisted(() => vi.fn());
const removeFavoriteMock = vi.hoisted(() => vi.fn());
const favoritesMock = vi.hoisted(() => [] as { mal_id: number }[]);

vi.mock("@/hooks", () => ({
  useAnimeDetail: (...args: unknown[]) => useAnimeDetailMock(...args),
}));

vi.mock("@/store", () => ({
  useAnimeStore: (
    selector: (state: {
      favorites: unknown[];
      addFavorite: () => void;
      removeFavorite: () => void;
    }) => unknown
  ) =>
    selector({
      favorites: favoritesMock,
      addFavorite: addFavoriteMock,
      removeFavorite: removeFavoriteMock,
    }),
}));

describe("AnimeDetail page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAnimeDetailMock.mockReturnValue({
      anime: createAnimeMock({
        mal_id: 1,
        title: "One Piece",
        title_english: "One Piece",
        genres: [{ mal_id: 10, name: "Action", url: "", type: "genre" }],
        synopsis: "Pirates",
        background: "A background",
        images: {
          jpg: {
            image_url: "jpg",
            small_image_url: "sjpg",
            large_image_url: "ljpg",
          },
          webp: {
            image_url: "w",
            small_image_url: "sw",
            large_image_url: "lwebp",
          },
        },
        score: 9,
        year: 2024,
        season: "spring",
        episodes: 12,
        type: "TV",
        rating: "PG",
      }),
      isLoading: false,
      error: null,
    });
    favoritesMock.length = 0;
  });

  it("renders anime detail title", () => {
    render(
      <MemoryRouter initialEntries={["/anime/1"]}>
        <Routes>
          <Route path="/anime/:id" element={<AnimeDetail />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText(/One Piece/)).toBeInTheDocument();
  });

  it("shows loading state", () => {
    useAnimeDetailMock.mockReturnValueOnce({
      anime: null,
      isLoading: true,
      error: null,
    });
    render(
      <MemoryRouter initialEntries={["/anime/1"]}>
        <Routes>
          <Route path="/anime/:id" element={<AnimeDetail />} />
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
  });

  it("shows error state", () => {
    useAnimeDetailMock.mockReturnValueOnce({
      anime: null,
      isLoading: false,
      error: "Boom",
    });
    render(
      <MemoryRouter initialEntries={["/anime/1"]}>
        <Routes>
          <Route path="/anime/:id" element={<AnimeDetail />} />
        </Routes>
      </MemoryRouter>
    );
    expect(
      screen.getByText(/This anime slipped through the cracks/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/Boom/)).toBeInTheDocument();
  });

  it("shows not found when anime is missing", () => {
    useAnimeDetailMock.mockReturnValueOnce({
      anime: null,
      isLoading: false,
      error: null,
    });
    render(
      <MemoryRouter initialEntries={["/anime/1"]}>
        <Routes>
          <Route path="/anime/:id" element={<AnimeDetail />} />
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByText(/lost in the multiverse/i)).toBeInTheDocument();
  });

  it("renders details, image, genres, synopsis, background", () => {
    render(
      <MemoryRouter initialEntries={["/anime/1"]}>
        <Routes>
          <Route path="/anime/:id" element={<AnimeDetail />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByAltText("One Piece")).toHaveAttribute("src", "lwebp");
    expect(screen.getByText("Score: 9")).toBeInTheDocument();
    expect(screen.getByText(/Year: 2024/)).toBeInTheDocument();
    expect(screen.getByText(/Season: spring/)).toBeInTheDocument();
    expect(screen.getByText(/Episodes: 12/)).toBeInTheDocument();
    expect(screen.getByText(/Type: TV/)).toBeInTheDocument();
    expect(screen.getByText(/Rating: PG/)).toBeInTheDocument();
    expect(screen.getByText("Action")).toBeInTheDocument();
    expect(screen.getByText("Pirates")).toBeInTheDocument();
    expect(screen.getByText("A background")).toBeInTheDocument();
  });

  it("adds favorite when not already favorite", () => {
    render(
      <MemoryRouter initialEntries={["/anime/1"]}>
        <Routes>
          <Route path="/anime/:id" element={<AnimeDetail />} />
        </Routes>
      </MemoryRouter>
    );

    screen.getByRole("button", { name: /Add to Favorites/i }).click();
    expect(addFavoriteMock).toHaveBeenCalled();
    expect(removeFavoriteMock).not.toHaveBeenCalled();
  });

  it("removes favorite when already favorite", () => {
    favoritesMock.push({ mal_id: 1 });

    render(
      <MemoryRouter initialEntries={["/anime/1"]}>
        <Routes>
          <Route path="/anime/:id" element={<AnimeDetail />} />
        </Routes>
      </MemoryRouter>
    );

    screen.getByRole("button", { name: /Remove Favorite/i }).click();
    expect(removeFavoriteMock).toHaveBeenCalled();
    expect(addFavoriteMock).not.toHaveBeenCalled();
  });
});
