import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ErrorMessage } from "@/components";

describe("ErrorMessage", () => {
  it("renders inline variant", () => {
    render(<ErrorMessage message="Oops" />);
    expect(screen.getByText("Oops")).toBeInTheDocument();
  });

  it("renders illustrated variant with actions", () => {
    render(
      <MemoryRouter>
        <ErrorMessage
          variant="illustrated"
          title="Nope"
          message="Not found"
          showActions
        />
      </MemoryRouter>
    );
    expect(screen.getByText("Nope")).toBeInTheDocument();
    expect(screen.getByText("Not found")).toBeInTheDocument();
    expect(screen.getByText("Go Home")).toBeInTheDocument();
  });
});
