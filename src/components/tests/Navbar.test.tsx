import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Navbar from "@/components/Navbar";

vi.mock("@/store", () => ({
  useAnimeStore: (
    selector: (state: { favorites: { mal_id: number }[] }) => unknown
  ) => selector({ favorites: [{ mal_id: 1 }] }),
}));

describe("Navbar", () => {
  it("renders links and favorites count", () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );
    expect(screen.getByText("Anime Explorer")).toBeInTheDocument();
    expect(screen.getByText("Favorites")).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument();
  });
});
