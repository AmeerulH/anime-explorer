import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Favorites from "@/pages/Favorites";
import { createAnimeMock } from "@/test/mocks/anime";

const favoritesMock = vi.hoisted(
  () => [] as ReturnType<typeof createAnimeMock>[]
);

vi.mock("@/store", () => ({
  useAnimeStore: (
    selector: (state: {
      favorites: ReturnType<typeof createAnimeMock>[];
    }) => unknown
  ) =>
    selector({
      favorites: favoritesMock,
    }),
}));

describe("Favorites page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    favoritesMock.length = 0;
  });

  it("renders empty state", () => {
    render(
      <MemoryRouter>
        <Favorites />
      </MemoryRouter>
    );
    expect(screen.getByText(/No favorites yet/i)).toBeInTheDocument();
  });

  it("renders favorite cards", () => {
    favoritesMock.push(createAnimeMock({ mal_id: 1, title: "Fav 1" }));

    render(
      <MemoryRouter>
        <Favorites />
      </MemoryRouter>
    );

    expect(screen.getByText(/Fav 1/i)).toBeInTheDocument();
  });
});
