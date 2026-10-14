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
import MovieCard from "./MovieCard";
import type { Movie } from "../types/movie";

const movie: Movie = {
  id: 123,
  title: "Avengers: Endgame",
  overview: "The Avengers face their final battle.",
  poster_path: "/poster.jpg",
  backdrop_path: null,
  release_date: "2019-04-24",
  vote_average: 8.3,
};

const movieNoPoster: Movie = {
  ...movie,
  id: 999,
  title: "No Poster Movie",
  poster_path: null,
};

describe("MovieCard", () => {
  it("should display movie information", () => {
    render(
      <MemoryRouter>
        <MovieCard movie={movie} />
      </MemoryRouter>
    );

    expect(
      screen.getByRole("heading", {
        name: "Avengers: Endgame",
      })
    ).toBeInTheDocument();

    expect(screen.getByText("2019")).toBeInTheDocument();
    expect(screen.getByText("8.3")).toBeInTheDocument();
  });

  it("should display star rating icon", () => {
    const { container } = render(
      <MemoryRouter>
        <MovieCard movie={movie} />
      </MemoryRouter>
    );

    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("should link to movie detail page", () => {
    render(
      <MemoryRouter>
        <MovieCard movie={movie} />
      </MemoryRouter>
    );

    expect(screen.getByRole("link")).toHaveAttribute(
      "href",
      "/movie/123"
    );
  });

  it("should display movie poster", () => {
    render(
      <MemoryRouter>
        <MovieCard movie={movie} />
      </MemoryRouter>
    );

    expect(screen.getByRole("img")).toHaveAttribute(
      "alt",
      "Avengers: Endgame"
    );

    expect(screen.getByRole("img")).toHaveAttribute(
      "src",
      "https://image.tmdb.org/t/p/w500/poster.jpg"
    );
  });

  it("shows N/A when the release date is missing", () => {
    render(
      <MemoryRouter>
        <MovieCard
          movie={{ ...movie, release_date: "" }}
        />
      </MemoryRouter>
    );

    expect(screen.getByText("N/A")).toBeInTheDocument();
  });

  it("should show a fallback when no poster is available", () => {
    render(
      <MemoryRouter>
        <MovieCard movie={movieNoPoster} />
      </MemoryRouter>
    );

    expect(
      screen.getAllByText("No Poster Movie").length
    ).toBeGreaterThan(0);
  });
});