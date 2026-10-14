import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import App from "./App";

vi.mock("./api/movieApi", () => ({
  getNowPlaying: vi.fn().mockResolvedValue({
    page: 1,
    results: [],
    total_pages: 1,
    total_results: 0,
  }),

  getPopular: vi.fn().mockResolvedValue({
    page: 1,
    results: [
      {
        id: 1,
        title: "Inception",
        overview: "A mind-bending thriller",
        poster_path: "/in.jpg",
        backdrop_path: null,
        release_date: "2010-07-16",
        vote_average: 8.4,
      },
    ],
    total_pages: 1,
    total_results: 1,
  }),

  getTopRated: vi.fn().mockResolvedValue({
    page: 1,
    results: [],
    total_pages: 1,
    total_results: 0,
  }),

  getUpcoming: vi.fn().mockResolvedValue({
    page: 1,
    results: [],
    total_pages: 1,
    total_results: 0,
  }),

  searchMovies: vi.fn().mockResolvedValue({
    page: 1,
    results: [],
    total_pages: 1,
    total_results: 0,
  }),

  getMovieDetail: vi.fn().mockResolvedValue({
    id: 1,
    title: "Inception",
    overview: "A mind-bending thriller",
    poster_path: "/in.jpg",
    backdrop_path: null,
    release_date: "2010-07-16",
    vote_average: 8.4,
    runtime: 148,
    genres: [{ id: 28, name: "Action" }],
  }),

  getMovieCredits: vi.fn().mockResolvedValue({
    cast: [
      {
        id: 11,
        name: "Leonardo DiCaprio",
        character: "Cobb",
        profile_path: "/leo.jpg",
      },
    ],
    crew: [
      {
        id: 12,
        name: "Christopher Nolan",
        job: "Director",
        department: "Directing",
      },
    ],
  }),
}));

function renderApp(initialEntry = "/") {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <App />
    </MemoryRouter>
  );
}

describe("App PDF", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it("should display Movie App", async () => {
    renderApp();

    expect(
      await screen.findByRole("link", {
        name: "Movie App",
      })
    ).toBeInTheDocument();
  });

  it("should render popular movies from the API", async () => {
    renderApp();

    expect(
      await screen.findByText("Inception")
    ).toBeInTheDocument();
  });

  it("should render the not found page for unknown routes", async () => {
    renderApp("/unknown-page");

    expect(
      await screen.findByText(
        "The page you are looking for does not exist."
      )
    ).toBeInTheDocument();
  });

  it("should render the movie detail page when opened", async () => {
    renderApp("/movie/1");
  
    expect(
      await screen.findByRole("heading", {
        name: "Inception",
      })
    ).toBeInTheDocument();
  });

});