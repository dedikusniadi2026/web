import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";

import WatchlistPage from "./WatchlistPage";
import { useWatchlist } from "../hooks/useWatchlist";
import type { Movie } from "../types/movie";

vi.mock("../hooks/useWatchlist", () => ({
  useWatchlist: vi.fn(),
}));

vi.mock("../components/Navbar", () => ({
  default: () => <nav>Navbar</nav>,
}));

vi.mock("../components/MovieGrid", () => ({
  default: ({ movies }: { movies: Movie[] }) => (
    <div data-testid="movie-grid">
      {movies.map((movie) => (
        <div key={movie.id} data-testid="movie">
          {movie.title} - {movie.vote_average}
        </div>
      ))}
    </div>
  ),
}));

const mockedUseWatchlist = vi.mocked(useWatchlist);

const movies = [
  {
    id: 1,
    title: "Batman",
    vote_average: 7.5,
  },
  {
    id: 2,
    title: "Avatar",
    vote_average: 8.5,
  },
  {
    id: 3,
    title: "Citizen Kane",
    vote_average: 9,
  },
] as Movie[];

const mockWatchlist = (watchlist: Movie[]) => {
  mockedUseWatchlist.mockReturnValue({
    watchlist,
    isSaved: vi.fn().mockReturnValue(false),
    toggle: vi.fn(),
  });
};

const renderPage = () => {
  return render(
    <MemoryRouter>
      <WatchlistPage />
    </MemoryRouter>
  );
};

describe("WatchlistPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should display empty watchlist state when there are no movies", () => {
    mockWatchlist([]);

    renderPage();

    expect(
      screen.getByRole("heading", {
        name: /your watchlist is empty/i,
      })
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        /save movies from the list or detail page/i
      )
    ).toBeInTheDocument();

    expect(
      screen.getByRole("link", {
        name: /discover movies/i,
      })
    ).toHaveAttribute("href", "/");
  });

  it("should display saved movie count", () => {
    mockWatchlist(movies);

    renderPage();

    expect(
      screen.getByText("3 saved movies")
    ).toBeInTheDocument();
  });

  it("should display singular movie when there is only one movie", () => {
    mockWatchlist([movies[0]]);

    renderPage();

    expect(
      screen.getByText("1 saved movie")
    ).toBeInTheDocument();
  });

  it("should display movies in the watchlist", () => {
    mockWatchlist(movies);

    renderPage();

    expect(
      screen.getByText("Batman - 7.5")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Avatar - 8.5")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Citizen Kane - 9")
    ).toBeInTheDocument();
  });

  it("should sort movies by highest rating", async () => {
    const user = userEvent.setup();

    mockWatchlist(movies);

    renderPage();

    await user.click(
      screen.getByRole("button", {
        name: /highest rated/i,
      })
    );

    const movieElements = screen.getAllByTestId("movie");

    expect(movieElements[0]).toHaveTextContent(
      "Citizen Kane - 9"
    );

    expect(movieElements[1]).toHaveTextContent(
      "Avatar - 8.5"
    );

    expect(movieElements[2]).toHaveTextContent(
      "Batman - 7.5"
    );
  });

  it("should sort movies by title A-Z", async () => {
    const user = userEvent.setup();

    mockWatchlist(movies);

    renderPage();

    await user.click(
      screen.getByRole("button", {
        name: /title \(a-z\)/i,
      })
    );

    const movieElements = screen.getAllByTestId("movie");

    expect(movieElements[0]).toHaveTextContent(
      "Avatar - 8.5"
    );

    expect(movieElements[1]).toHaveTextContent(
      "Batman - 7.5"
    );

    expect(movieElements[2]).toHaveTextContent(
      "Citizen Kane - 9"
    );
  });

  it("should keep original order when sorting by date added", async () => {
    const user = userEvent.setup();

    mockWatchlist(movies);

    renderPage();

    await user.click(
      screen.getByRole("button", {
        name: /highest rated/i,
      })
    );

    await user.click(
      screen.getByRole("button", {
        name: /date added/i,
      })
    );

    const movieElements = screen.getAllByTestId("movie");

    expect(movieElements[0]).toHaveTextContent(
      "Batman - 7.5"
    );

    expect(movieElements[1]).toHaveTextContent(
      "Avatar - 8.5"
    );

    expect(movieElements[2]).toHaveTextContent(
      "Citizen Kane - 9"
    );
  });

  it("should show sorting controls when watchlist has movies", () => {
    mockWatchlist(movies);

    renderPage();

    expect(
      screen.getByRole("button", {
        name: /date added/i,
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: /highest rated/i,
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: /title \(a-z\)/i,
      })
    ).toBeInTheDocument();
  });

  it("should not show sorting controls when watchlist is empty", () => {
    mockWatchlist([]);

    renderPage();

    expect(
      screen.queryByRole("button", {
        name: /highest rated/i,
      })
    ).not.toBeInTheDocument();

    expect(
      screen.queryByRole("button", {
        name: /title \(a-z\)/i,
      })
    ).not.toBeInTheDocument();
  });
});