import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AnimeCard } from "@/components";
import { createAnimeMock } from "@/test/mocks/anime";

describe("AnimeCard", () => {
  it("renders title and score and links to detail page", () => {
    const sampleAnime = createAnimeMock({
      mal_id: 42,
      title: "Original Title",
      title_english: "English Title",
      score: 8.1,
    });
    render(
      <MemoryRouter>
        <AnimeCard anime={sampleAnime} />
      </MemoryRouter>
    );

    expect(screen.getByText(/English Title/)).toBeInTheDocument();
    expect(screen.getByText(/Score:/)).toHaveTextContent("8.1");
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/anime/42");
  });

  it("renders the image if images", () => {
    const anime = createAnimeMock({
      title_english: "English Title",
      images: {
        jpg: {
          image_url: "https://example.com/image.jpg",
          small_image_url: "",
          large_image_url: "",
        },
        webp: {
          image_url: "",
          small_image_url: "",
          large_image_url: "https://example.com/webp-large.jpg",
        },
      },
    });
    render(
      <MemoryRouter>
        <AnimeCard anime={anime} />
      </MemoryRouter>
    );
    expect(screen.getByAltText(/English Title/)).toBeInTheDocument();
  });
});
