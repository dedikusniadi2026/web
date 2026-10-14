import {
  act,
  render,
  screen,
  waitFor,
} from "@testing-library/react";

import userEvent from "@testing-library/user-event";

import {
  MemoryRouter,
  Route,
  Routes,
} from "react-router-dom";

import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import {
  getMovieCredits,
  getMovieDetail,
  getMovieVideos,
  getSimilarMovies,
} from "../api/movieApi";

import type {
  CreditsResponse,
  MovieDetail,
} from "../types/movie";

import * as watchlistStore from "../utils/watchlistStore";
import MovieDetailPage from "./MovieDetailPage";

vi.mock("../api/movieApi")

const movie: MovieDetail = {
  id: 550,
  title: "Fight Club",
  overview:
    "A man forms an underground fight club.",
  poster_path: "/fight-club.jpg",
  backdrop_path: null,
  release_date: "1999-10-15",
  vote_average: 8.4,
  runtime: 139,
  genres: [
    {
      id: 18,
      name: "Drama",
    },
    {
      id: 53,
      name: "Thriller",
    },
  ],
}

const credits: CreditsResponse = {
  cast: [
    {
      id: 1,
      name: "Brad Pitt",
      character: "Tyler Durden",
      profile_path: "/brad.jpg",
    },
  ],
  crew: [
    {
      id: 2,
      name: "David Fincher",
      job: "Director",
      department: "Directing",
    },
  ],
}

function renderPage(route = "/movie/550") {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <Routes>
        <Route
          path="/movie/:movieId"
          element={<MovieDetailPage />}
        />
      </Routes>
    </MemoryRouter>
  )
}

function mockSuccessfulDetail() {
  vi.mocked(getMovieDetail).mockResolvedValue(movie)
  vi.mocked(getMovieCredits).mockResolvedValue(credits)
}

describe("MovieDetailPage", () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()

    watchlistStore
      .getSnapshot()
      .forEach((savedMovie) => {
        watchlistStore.remove(savedMovie.id)
      })

    vi.mocked(getMovieVideos).mockResolvedValue({
      results: [],
    })

    vi.mocked(getSimilarMovies).mockResolvedValue({
      page: 1,
      results: [],
      total_pages: 1,
      total_results: 0,
    })
  })

  it("should display movie detail", async () => {
    mockSuccessfulDetail()

    renderPage()

    expect(
      await screen.findByRole("heading", {
        name: "Fight Club",
      })
    ).toBeInTheDocument()

    expect(
      screen.getByText(
        "A man forms an underground fight club."
      )
    ).toBeInTheDocument()

    expect(
      screen.getByText("David Fincher")
    ).toBeInTheDocument()

    expect(
      screen.getByText("Brad Pitt")
    ).toBeInTheDocument()

    expect(
      getMovieDetail
    ).toHaveBeenCalledWith(550, expect.anything())

    expect(
      getMovieCredits
    ).toHaveBeenCalledWith(550, expect.anything())
  })

  it("adds the current movie to the watchlist", async () => {
    const user = userEvent.setup()

    mockSuccessfulDetail()
    renderPage()

    await screen.findByRole("heading", {
      name: "Fight Club",
    })

    await user.click(
      screen.getByRole("button", {
        name: "Add to watchlist",
      })
    )

    expect(
      screen.getByRole("button", {
        name: "Saved to watchlist",
      })
    ).toHaveAttribute("aria-pressed", "true")

    expect(
      watchlistStore.isSaved(550)
    ).toBe(true)
  })

  it("should display trailer and similar movies", async () => {
    const user = userEvent.setup()
    const scrollIntoView = vi.fn()

    Object.defineProperty(
      window.HTMLElement.prototype,
      "scrollIntoView",
      {
        configurable: true,
        value: scrollIntoView,
      }
    )

    mockSuccessfulDetail()

    vi.mocked(getMovieVideos).mockResolvedValue({
      results: [
        {
          id: "v1",
          key: "abc123",
          name: "Official Trailer",
          site: "YouTube",
          type: "Trailer",
          official: true,
        },
      ],
    })

    vi.mocked(getSimilarMovies).mockResolvedValue({
      page: 1,
      results: [
        {
          id: 900,
          title: "Se7en",
          overview: "",
          poster_path: "/seven.jpg",
          backdrop_path: null,
          release_date: "1995-09-22",
          vote_average: 8.6,
        },
      ],
      total_pages: 1,
      total_results: 1,
    })

    renderPage()

    expect(
      await screen.findByRole("heading", {
        name: "Fight Club",
      })
    ).toBeInTheDocument()

    expect(
      screen.getByTitle("Fight Club official trailer")
    ).toBeInTheDocument()

    expect(
      await screen.findByRole("heading", {
        name: "Se7en",
      })
    ).toBeInTheDocument()

    await user.click(
      screen.getByRole("button", {
        name: "Watch trailer",
      })
    )

    expect(scrollIntoView).toHaveBeenCalledWith({
      behavior: "smooth",
    })
  })

  it("should display error when detail API fails", async () => {
    vi.mocked(getMovieDetail).mockRejectedValue(
      new Error("API error")
    )

    vi.mocked(getMovieCredits).mockResolvedValue(credits)

    renderPage()

    expect(
      await screen.findByText(
        "Failed to load movie details."
      )
    ).toBeInTheDocument()
  })

  it("shows an error for an invalid movie id", async () => {
    renderPage("/movie/abc")

    expect(
      await screen.findByText(
        "Failed to load movie details."
      )
    ).toBeInTheDocument()

    expect(getMovieDetail).not.toHaveBeenCalled()
  })

  it("renders nothing when the detail payload is missing", async () => {
    vi.mocked(getMovieDetail).mockResolvedValue(
      undefined as never
    )

    vi.mocked(getMovieCredits).mockResolvedValue(credits)

    const { container } = renderPage()

    await waitFor(() => {
      expect(container.textContent).toBe("")
    })

    expect(
      screen.queryByText(
        "Failed to load movie details."
      )
    ).not.toBeInTheDocument()
  })

  it("shows fallbacks for missing movie data", async () => {
    vi.mocked(getMovieDetail).mockResolvedValue({
      ...movie,
      poster_path: null,
      backdrop_path: null,
      overview: "",
      runtime: null,
      release_date: "",
    })

    vi.mocked(getMovieCredits).mockResolvedValue({
      cast: [
        {
          id: 9,
          name: "No Photo Actor",
          character: "Hero",
          profile_path: null,
        },
      ],
      crew: [],
    })

    renderPage()

    expect(
      await screen.findByRole("heading", {
        name: "Fight Club",
      })
    ).toBeInTheDocument()

    expect(
      screen.getByText("No synopsis available.")
    ).toBeInTheDocument()

    expect(
      screen.getByText("Unknown")
    ).toBeInTheDocument()

    expect(
      screen.getAllByText("N/A")
    ).toHaveLength(1)

    expect(
      screen.getByRole("img", {
        name: "No Photo Actor",
      })
    ).toBeInTheDocument()

    expect(
      screen.getByRole("img", {
        name: "Fight Club",
      })
    ).toBeInTheDocument()
  })

  it("falls back to an unofficial trailer and shows the backdrop", async () => {
    vi.mocked(getMovieDetail).mockResolvedValue({
      ...movie,
      backdrop_path: "/backdrop.jpg",
    })

    vi.mocked(getMovieCredits).mockResolvedValue(credits)

    vi.mocked(getMovieVideos).mockResolvedValue({
      results: [
        {
          id: "v2",
          key: "xyz789",
          name: "Teaser",
          site: "YouTube",
          type: "Trailer",
          official: false,
        },
      ],
    })

    renderPage()

    const iframe = await screen.findByTitle(
      "Fight Club official trailer"
    )

    expect(iframe).toHaveAttribute(
      "src",
      "https://www.youtube.com/embed/xyz789"
    )
  })

  it("ignores canceled requests", async () => {
    vi.mocked(getMovieDetail).mockRejectedValue({
      __CANCEL__: true,
    })

    vi.mocked(getMovieCredits).mockResolvedValue(credits)

    const { container } = renderPage()

    await waitFor(() => {
      expect(container.textContent).toBe("")
    })

    expect(
      screen.queryByText(
        "Failed to load movie details."
      )
    ).not.toBeInTheDocument()
  })

  it("retries loading when Try Again is clicked", async () => {
    const user = userEvent.setup()

    vi.mocked(getMovieDetail)
      .mockRejectedValueOnce(new Error("API error"))
      .mockResolvedValueOnce(movie)

    vi.mocked(getMovieCredits).mockResolvedValue(credits)

    renderPage()

    expect(
      await screen.findByText(
        "Failed to load movie details."
      )
    ).toBeInTheDocument()

    await user.click(
      screen.getByRole("button", {
        name: "Try Again",
      })
    )

    expect(
      await screen.findByRole("heading", {
        name: "Fight Club",
      })
    ).toBeInTheDocument()
  })

  it("does not update state after unmount", async () => {
    let rejectRequest: (reason?: unknown) => void =
      () => {}

    vi.mocked(getMovieDetail).mockImplementation(
      () =>
        new Promise<MovieDetail>(
          (_resolve, reject) => {
            rejectRequest = reject
          }
        )
    )

    const { unmount } = renderPage()

    unmount()

    await act(async () => {
      rejectRequest(new Error("late response"))
    })
  })
})
