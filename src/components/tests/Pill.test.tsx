import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Pill } from "@/components";

describe("Pill", () => {
  it("renders children", () => {
    render(<Pill>Score: 9.9</Pill>);
    expect(screen.getByText("Score: 9.9")).toBeInTheDocument();
  });
});

