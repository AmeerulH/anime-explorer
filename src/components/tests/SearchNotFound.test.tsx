import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import SearchNotFound from "@/components/SearchNotFound";

describe("SearchNotFound", () => {
  it("shows query in message", () => {
    render(<SearchNotFound query="naruto" />);
    expect(
      screen.getByText(/Could not find “naruto”. Try a different anime!/i)
    ).toBeInTheDocument();
  });
});

