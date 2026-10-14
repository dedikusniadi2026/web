import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import NotFoundPage from "./NotFoundPage";

describe("NotFoundPage", () => {
  it("should render 404 page", () => {
    render(
      <MemoryRouter>
        <NotFoundPage />
      </MemoryRouter>
    );

    expect(
      screen.getByRole("heading", { name: "404" })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("heading", { name: "Scene Not Found" })
    ).toBeInTheDocument();
  });

  it("should display not found message", () => {
    render(
      <MemoryRouter>
        <NotFoundPage />
      </MemoryRouter>
    );

    expect(
      screen.getByText(
        "The page you are looking for does not exist."
      )
    ).toBeInTheDocument();
  });

  it("should render Back to Movies link", () => {
    render(
      <MemoryRouter>
        <NotFoundPage />
      </MemoryRouter>
    );

    const link = screen.getByRole("link", {
      name: /Back to Movies/i,
    });

    expect(link).toBeInTheDocument();
  });

  it("should navigate to home when clicking Back to Movies", () => {
    render(
      <MemoryRouter>
        <NotFoundPage />
      </MemoryRouter>
    );

    const link = screen.getByRole("link", {
      name: /Back to Movies/i,
    });

    expect(link).toHaveAttribute("href", "/");
  });
});