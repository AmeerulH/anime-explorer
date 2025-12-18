import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Loading } from "@/components";

describe("Loading", () => {
  it("renders label", () => {
    render(<Loading label="Please wait" />);
    expect(screen.getByText("Please wait")).toBeInTheDocument();
  });
});

