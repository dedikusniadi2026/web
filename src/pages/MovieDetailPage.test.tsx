import { render, screen, act } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { getMovieCredits, getMovieDetail } from "../api/movieApi";
import type { CreditsResponse, MovieDetail } from "../types/movie";
import MovieDetailPage from "./MovieDetailPage";

vi.mock("../api/movieApi");

const movie: MovieDetail = {
  id: 550,
  title: "Fight Club",
  overview: "A man forms an underground fight club.",
  poster_path: "/fight-club.jpg",
  backdrop_path: null,
  release_date: "1999-10-15",
  vote_average: 8.4,
  runtime: 139,
  genres: [{ id: 18, name: "Drama" }],
};

const credits: CreditsResponse = {
  cast: [{ id: 1, name: "Brad Pitt", character: "Tyler Durden", profile_path: "/brad.jpg" }],
  crew: [{ id: 2, name: "David Fincher", job: "Director", department: "Directing" }],
};

function renderPage(route = "/movie/550") {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <Routes>
        <Route path="/movie/:movieId" element={<MovieDetailPage />} />
      </Routes>
    </MemoryRouter>
  );
}

describe("MovieDetailPage PDF", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getMovieDetail).mockResolvedValue(movie);
    vi.mocked(getMovieCredits).mockResolvedValue(credits);
  });

  it("should display movie detail", async () => {
    renderPage();
    expect(await screen.findByRole("heading", { name: "Fight Club" })).toBeInTheDocument();
    expect(screen.getByText("A man forms an underground fight club.")).toBeInTheDocument();
    expect(screen.getByText("David Fincher")).toBeInTheDocument();
    expect(screen.getByText("Brad Pitt")).toBeInTheDocument();
  });

  it("should display error when detail API fails", async () => {
    vi.mocked(getMovieDetail).mockRejectedValue(new Error("API error"));
    renderPage();
    expect(await screen.findByText(/Failed to load movie details/i)).toBeInTheDocument();
  });

  it("shows an error for an invalid movie id", async () => {
    renderPage("/movie/abc");
    expect(await screen.findByText(/Failed to load movie details/i)).toBeInTheDocument();
    expect(getMovieDetail).not.toHaveBeenCalled();
  });

  it("should have Back button to movie list", async () => {
    renderPage();
    await screen.findByRole("heading", { name: "Fight Club" });
    expect(screen.getByRole("link", { name: /Back/i })).toHaveAttribute("href", "/");
  });

  it("shows fallbacks for missing data", async () => {
    vi.mocked(getMovieDetail).mockResolvedValue({...movie, overview: "", poster_path: null });
    vi.mocked(getMovieCredits).mockResolvedValue({ cast: [], crew: [] });
    renderPage();
    expect(await screen.findByRole("heading", { name: "Fight Club" })).toBeInTheDocument();
    expect(screen.getByText("No synopsis available.")).toBeInTheDocument();
    expect(screen.getByText("Unknown")).toBeInTheDocument();
  });

  it("does not update state after unmount", async () => {
    let rejectRequest: any = () => {};
    vi.mocked(getMovieDetail).mockImplementation(() => new Promise((_r, rej) => { rejectRequest = rej; }));
    const { unmount } = renderPage();
    unmount();
    await act(async () => { rejectRequest(new Error("late")); });
  });
});