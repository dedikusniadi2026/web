import {
  describe,
  it,
  expect,
} from "vitest";

import {
  render,
  screen,
} from "@testing-library/react";

import { MemoryRouter } from "react-router-dom";
import MovieGrid from "./MovieGrid";
import type { Movie } from "../types/movie";

const movies: Movie[] = [
  {
    id: 1,
    title: "Movie One",
    overview: "Overview one",
    poster_path: "/one.jpg",
    backdrop_path: null,
    release_date: "2025-01-01",
    vote_average: 8,
  },
  {
    id: 2,
    title: "Movie Two",
    overview: "Overview two",
    poster_path: "/two.jpg",
    backdrop_path: null,
    release_date: "2024-01-01",
    vote_average: 7.5,
  },
]

describe("MovieGrid", () => {
  it("should render all movies", () => {
    render(
      <MemoryRouter>
        <MovieGrid movies={movies} />
      </MemoryRouter>
    )

    expect(
      screen.getByRole("heading", {
        name: "Movie One",
      })
    ).toBeInTheDocument()

    expect(
      screen.getByRole("heading", {
        name: "Movie Two",
      })
    ).toBeInTheDocument()
  })

  it("should display empty state", () => {
    render(
      <MemoryRouter>
        <MovieGrid movies={[]} />
      </MemoryRouter>
    )

    expect(
      screen.getByText("No movies found.")
    ).toBeInTheDocument()
  })
})