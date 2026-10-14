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
  waitFor,
  act,
  fireEvent,
} from "@testing-library/react";

import userEvent from "@testing-library/user-event";

import {
  MemoryRouter,
} from "react-router-dom";

import HomePage from "./HomePage";

import {
  getPopular,
  searchMovies,
  getNowPlaying,
  getUpcoming,
} from "../api/movieApi"

import type { MovieResponse } from "../types/movie";

vi.mock("../api/movieApi");

const mockMovies = [
  {
    id: 1,
    title: "Movie One",
    overview: "Overview",
    poster_path: "/one.jpg",
    backdrop_path: null,
    release_date: "2025-01-01",
    vote_average: 8,
  },
  {
    id: 2,
    title: "Movie Two",
    overview: "Overview",
    poster_path: "/two.jpg",
    backdrop_path: null,
    release_date: "2024-01-01",
    vote_average: 7.5,
  },
]

describe("HomePage", () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  it("should load popular movies", async () => {
    vi.mocked(getPopular).mockResolvedValue({
      page: 1,
      results: mockMovies,
      total_pages: 2,
      total_results: 40,
    })

    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    )

    expect(
      screen.getByRole("status")
    ).toBeInTheDocument()

    expect(
      await screen.findByRole("heading", {
        name: "Movie One",
      })
    ).toBeInTheDocument()

    expect(
      screen.getByRole("heading", {
        name: "Movie Two",
      })
    ).toBeInTheDocument()

    expect(
      getPopular
    ).toHaveBeenCalledWith(1, expect.anything())
  })

it("should load more movies", async () => {
  const user = userEvent.setup()

  vi.mocked(getPopular)
    .mockResolvedValueOnce({
      page: 1,
      results: mockMovies,
      total_pages: 2,
      total_results: 40,
    })
    .mockResolvedValueOnce({
      page: 2,
      results: [
        {
          id: 3,
          title: "Movie Three",
          overview: "Overview",
          poster_path: "/three.jpg",
          backdrop_path: null,
          release_date: "2023-01-01",
          vote_average: 7,
        },
      ],
      total_pages: 2,
      total_results: 40,
    })

  render(
    <MemoryRouter>
      <HomePage />
    </MemoryRouter>
  )

  expect(
    await screen.findByRole("heading", {
      name: "Movie One",
    })
  ).toBeInTheDocument()

  const button =
    screen.getByRole("button", {
      name: "Load more",
    })

  await user.click(button)

  expect(
    await screen.findByRole("heading", {
      name: "Movie Three",
    })
  ).toBeInTheDocument()

  expect(
    getPopular
  ).toHaveBeenCalledWith(2, expect.anything())
})

it("should search movies", async () => {
  const user = userEvent.setup()

  vi.mocked(getPopular).mockResolvedValue({
    page: 1,
    results: mockMovies,
    total_pages: 1,
    total_results: 2,
  })

  vi.mocked(searchMovies).mockResolvedValue({
    page: 1,
    results: [
      {
        id: 10,
        title: "Batman",
        overview: "Batman movie",
        poster_path: "/batman.jpg",
        backdrop_path: null,
        release_date: "2025-01-01",
        vote_average: 8.5,
      },
    ],
    total_pages: 1,
    total_results: 1,
  })

  render(
    <MemoryRouter>
      <HomePage />
    </MemoryRouter>
  )

  await screen.findByRole("heading", {
    name: "Movie One",
  })

  const input =
    screen.getByRole("textbox", {
      name: "Search movies",
    })

  await user.type(input, "Batman")

  await waitFor(
    () => {
      expect(
        searchMovies
      ).toHaveBeenCalledWith(
        "Batman",
        1,
        expect.anything()
      )
    },
    {
      timeout: 1000,
    }
  )

  expect(
    await screen.findByRole("heading", {
      name: "Batman",
    })
  ).toBeInTheDocument()
})

it("should display error when API fails", async () => {
  vi.mocked(getPopular).mockRejectedValue(
    new Error("API error")
  )

  render(
    <MemoryRouter>
      <HomePage />
    </MemoryRouter>
  )

  expect(
    await screen.findByText(
      "Failed to load movies. Please try again."
    )
  ).toBeInTheDocument()
})

it("should filter duplicate movies when loading more pages", async () => {
  const user = userEvent.setup()

  vi.mocked(getPopular)
    .mockResolvedValueOnce({
      page: 1,
      results: [
        {
          id: 1,
          title: "Inception",
          overview: "",
          poster_path: "/inception.jpg",
          backdrop_path: null,
          release_date: "2010-07-16",
          vote_average: 8.4,
        },
      ],
      total_pages: 2,
      total_results: 2,
    })
    .mockResolvedValueOnce({
      page: 2,
      results: [
        {
          id: 1,
          title: "Inception",
          overview: "",
          poster_path: "/inception.jpg",
          backdrop_path: null,
          release_date: "2010-07-16",
          vote_average: 8.4,
        },
        {
          id: 2,
          title: "Interstellar",
          overview: "",
          poster_path: "/interstellar.jpg",
          backdrop_path: null,
          release_date: "2014-11-07",
          vote_average: 8.4,
        },
      ],
      total_pages: 2,
      total_results: 2,
    })

  render(
    <MemoryRouter>
      <HomePage />
    </MemoryRouter>
  )

  expect(
    await screen.findByRole("heading", {
      name: "Inception",
    })
  ).toBeInTheDocument()

  await user.click(
    screen.getByRole("button", {
      name: "Load more",
    })
  )

  expect(
    await screen.findByRole("heading", {
      name: "Interstellar",
    })
  ).toBeInTheDocument()

  expect(
    screen.getAllByRole("heading", {
      name: "Inception",
    })
  ).toHaveLength(1)
})

it("should clear the search with the clear button", async () => {
  const user = userEvent.setup()

  vi.mocked(getPopular).mockResolvedValue({
    page: 1,
    results: mockMovies,
    total_pages: 1,
    total_results: 2,
  })

  vi.mocked(searchMovies).mockResolvedValue({
    page: 1,
    results: [
      {
        id: 10,
        title: "Batman",
        overview: "Batman movie",
        poster_path: "/batman.jpg",
        backdrop_path: null,
        release_date: "2025-01-01",
        vote_average: 8.5,
      },
    ],
    total_pages: 1,
    total_results: 1,
  })

  render(
    <MemoryRouter>
      <HomePage />
    </MemoryRouter>
  )

  await screen.findByRole("heading", {
    name: "Movie One",
  })

  const input = screen.getByRole("textbox", {
    name: "Search movies",
  })

  await user.type(input, "Batman")

  await user.click(
    await screen.findByRole("button", {
      name: "Clear search",
    })
  )

  expect(input).toHaveValue("")
})

it("should clear the search from the results header", async () => {
  const user = userEvent.setup()

  vi.mocked(getPopular).mockResolvedValue({
    page: 1,
    results: mockMovies,
    total_pages: 1,
    total_results: 2,
  })

  vi.mocked(searchMovies).mockResolvedValue({
    page: 1,
    results: [
      {
        id: 10,
        title: "Batman",
        overview: "Batman movie",
        poster_path: "/batman.jpg",
        backdrop_path: null,
        release_date: "2025-01-01",
        vote_average: 8.5,
      },
    ],
    total_pages: 1,
    total_results: 1,
  })

  render(
    <MemoryRouter>
      <HomePage />
    </MemoryRouter>
  )

  await screen.findByRole("heading", {
    name: "Movie One",
  })

  const input = screen.getByRole("textbox", {
    name: "Search movies",
  })

  await user.type(input, "Batman")

  await user.click(
    screen.getByRole("button", {
      name: "Clear",
    })
  )

  expect(input).toHaveValue("")
})

it("loads now playing movies when the category is selected", async () => {
  vi.mocked(getNowPlaying).mockResolvedValue({
    page: 1,
    results: [],
    total_pages: 1,
    total_results: 0,
  } satisfies MovieResponse)

  vi.mocked(getPopular).mockResolvedValue({
    page: 1,
    results: mockMovies,
    total_pages: 1,
    total_results: 2,
  })

  render(
    <MemoryRouter>
      <HomePage />
    </MemoryRouter>
  )

  expect(
    await screen.findByRole("heading", {
      name: "Movie One",
    })
  ).toBeInTheDocument()

  fireEvent.click(
    screen.getByRole("button", {
      name: "Now Playing",
    })
  )

  await waitFor(() => {
    expect(getNowPlaying).toHaveBeenCalledWith(
      1,
      expect.anything()
    )
  })
})

it("loads upcoming movies when the category is selected", async () => {
  vi.mocked(getUpcoming).mockResolvedValue({
    page: 1,
    results: [],
    total_pages: 1,
    total_results: 0,
  } satisfies MovieResponse)

  vi.mocked(getPopular).mockResolvedValue({
    page: 1,
    results: mockMovies,
    total_pages: 1,
    total_results: 2,
  })

  render(
    <MemoryRouter>
      <HomePage />
    </MemoryRouter>
  )

  expect(
    await screen.findByRole("heading", {
      name: "Movie One",
    })
  ).toBeInTheDocument()

  fireEvent.click(
    screen.getByRole("button", {
      name: "Upcoming",
    })
  )

  await waitFor(() => {
    expect(getUpcoming).toHaveBeenCalledWith(
      1,
      expect.anything()
    )
  })
})

it("ignores canceled requests while mounted", async () => {
  vi.mocked(getPopular).mockRejectedValue({
    __CANCEL__: true,
  })

  render(
    <MemoryRouter>
      <HomePage />
    </MemoryRouter>
  )

  await waitFor(() => {
    expect(
      screen.getByText("No movies found")
    ).toBeInTheDocument()
  })

  expect(
    screen.queryByText(
      "Failed to load movies. Please try again."
    )
  ).not.toBeInTheDocument()
})

it("does not update state after unmount", async () => {
  let rejectRequest: (reason?: unknown) => void =
    () => {}

  vi.mocked(getPopular).mockImplementation(
    () =>
      new Promise<MovieResponse>(
        (_resolve, reject) => {
          rejectRequest = reject
        }
      )
  )

  const { unmount } = render(
    <MemoryRouter>
      <HomePage />
    </MemoryRouter>
  )

  unmount()

  await act(async () => {
    rejectRequest(new Error("late response"))
  })
})

it("retries loading when Try Again is clicked", async () => {
  const user = userEvent.setup()

  vi.mocked(getPopular)
    .mockRejectedValueOnce(new Error("API error"))
    .mockResolvedValueOnce({
      page: 1,
      results: mockMovies,
      total_pages: 2,
      total_results: 40,
    })

  render(
    <MemoryRouter>
      <HomePage />
    </MemoryRouter>
  )

  expect(
    await screen.findByText(
      "Failed to load movies. Please try again."
    )
  ).toBeInTheDocument()

  await user.click(
    screen.getByRole("button", {
      name: "Try Again",
    })
  )

  expect(
    await screen.findByRole("heading", {
      name: "Movie One",
    })
  ).toBeInTheDocument()
})
})
