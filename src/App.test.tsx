import {
  describe,
  it,
  expect,
  vi,
  beforeEach,
} from "vitest";

import {
  render,
  screen,
  act,
  waitFor,
} from "@testing-library/react";

import userEvent from "@testing-library/user-event";

import App from "./App";

vi.setConfig({ testTimeout: 15000 })

beforeEach(() => {
  window.history.pushState({}, "", "/")

  vi.spyOn(window, "scrollTo").mockImplementation(() => {})
})

vi.mock("./api/movieApi", () => ({
  getNowPlaying: vi
    .fn()
    .mockResolvedValue({
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
        overview: "A thief who steals corporate secrets.",
        poster_path: "/inception.jpg",
        backdrop_path: null,
        release_date: "2010-07-16",
        vote_average: 8.4,
      },
    ],
    total_pages: 1,
    total_results: 1,
  }),
  getTopRated: vi
    .fn()
    .mockResolvedValue({
      page: 1,
      results: [],
      total_pages: 1,
      total_results: 0,
    }),
  getUpcoming: vi
    .fn()
    .mockResolvedValue({
      page: 1,
      results: [],
      total_pages: 1,
      total_results: 0,
    }),
  searchMovies: vi
    .fn()
    .mockResolvedValue({
      page: 1,
      results: [],
      total_pages: 1,
      total_results: 0,
    }),
  getMovieDetail: vi.fn().mockResolvedValue({
    id: 1,
    title: "Inception",
    overview: "A thief who steals corporate secrets.",
    poster_path: "/inception.jpg",
    backdrop_path: null,
    release_date: "2010-07-16",
    vote_average: 8.4,
    runtime: 148,
    genres: [
      {
        id: 28,
        name: "Action",
      },
    ],
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
  getMovieVideos: vi
    .fn()
    .mockResolvedValue({
      results: [],
    }),
  getSimilarMovies: vi
    .fn()
    .mockResolvedValue({
      page: 1,
      results: [],
      total_pages: 1,
      total_results: 0,
    }),
}))

describe("App", () => {
  it("should display Movie App", async () => {
    render(<App />)

    expect(
      await screen.findByRole(
        "link",
        {
          name: "Movie App",
        },
        { timeout: 5000 }
      )
    ).toBeInTheDocument()
  })

  it("should render popular movies from the API", async () => {
    render(<App />)

    expect(
      await screen.findByText(
        "Inception",
        {},
        { timeout: 5000 }
      )
    ).toBeInTheDocument()
  })

  it("should render the watchlist page when navigating to /watchlist", async () => {
    const user = userEvent.setup()

    render(<App />)

    const watchlistLink = await screen.findByRole(
      "link",
      {
        name: "Watchlist",
      },
      { timeout: 5000 }
    )

    await user.click(watchlistLink)

    expect(
      await screen.findByRole(
        "heading",
        {
          name: "My Watchlist",
        },
        { timeout: 5000 }
      )
    ).toBeInTheDocument()
  })

  it("should render the not found page for unknown routes", async () => {
    render(<App />)

    await screen.findByRole(
      "link",
      {
        name: "Movie App",
      },
      { timeout: 5000 }
    )

    await act(async () => {
      window.history.pushState(
        {},
        "",
        "/unknown-page"
      )

      window.dispatchEvent(
        new PopStateEvent("popstate")
      )
    })

    expect(
      await screen.findByText(
        "The page you are looking for does not exist.",
        {},
        { timeout: 5000 }
      )
    ).toBeInTheDocument()
  })

  it("should render the movie detail page when a movie is opened", async () => {
    const user = userEvent.setup()

    render(<App />)

    const cardLink = await screen.findByRole(
      "link",
      {
        name: /inception/i,
      },
      { timeout: 5000 }
    )

    await user.click(cardLink)

    await waitFor(
      () => {
        expect(
          screen.getByRole("heading", {
            name: "Inception",
          })
        ).toBeInTheDocument()
      },
      { timeout: 10000 }
    )
  })
})