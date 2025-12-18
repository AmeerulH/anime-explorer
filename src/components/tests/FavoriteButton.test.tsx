import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { FavoriteButton } from "@/components";

describe("FavoriteButton", () => {
  it("calls onToggle and renders label", () => {
    const onToggle = vi.fn();
    render(<FavoriteButton isFavorite={false} onToggle={onToggle} />);

    expect(screen.getByText("Add to Favorites")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button"));
    expect(onToggle).toHaveBeenCalled();
  });
});

