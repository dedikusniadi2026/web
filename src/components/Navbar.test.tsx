import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Navbar from "./Navbar";

describe("Navbar", () => {
  it("links the brand to the home page", () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    )

    expect(
      screen.getByRole("link", {
        name: "Movie App",
      })
    ).toHaveAttribute("href", "/")
  })

  it("links to the watchlist page", () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    )

    expect(
      screen.getByRole("link", {
        name: "Watchlist",
      })
    ).toHaveAttribute("href", "/watchlist")
  })
})
