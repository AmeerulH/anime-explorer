/// <reference types="@testing-library/jest-dom" />
import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import GenreDropdown from "../GenreDropdown";
import type { Genre } from "../../types";

const mockGenres: Genre[] = [
  { mal_id: 1, name: "Action", url: "", count: 0 },
  { mal_id: 2, name: "Comedy", url: "", count: 0 },
];

const useAnimeGenresMock = vi.fn();

vi.mock("@/hooks", () => ({
  useAnimeGenres: () => useAnimeGenresMock(),
}));

describe("GenreDropdown", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAnimeGenresMock.mockReturnValue({
      genres: mockGenres,
      isLoading: false,
      error: null,
    });
  });

  it("renders options and calls onSelect", () => {
    const onSelect = vi.fn();
    render(<GenreDropdown selectedId={null} onSelect={onSelect} />);

    mockGenres.forEach((genre) => {
      expect(screen.getByText(genre.name)).toBeInTheDocument();
    });

    fireEvent.change(screen.getByRole("combobox"), { target: { value: "2" } });
    expect(onSelect).toHaveBeenCalledWith(2);
  });

  it("renders the error message if error is present", () => {
    useAnimeGenresMock.mockReturnValueOnce({
      genres: [],
      isLoading: false,
      error: "Error",
    });

    render(<GenreDropdown selectedId={null} onSelect={vi.fn()} />);
    expect(
      screen.getByText("Failed to load genres: Error")
    ).toBeInTheDocument();
  });
});
