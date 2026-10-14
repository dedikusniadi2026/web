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
} from "@testing-library/react";

import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";

import HomePage from "./HomePage";
import { useMovies } from "../hooks/useMovies";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";


vi.mock("../hooks/useMovies", () => ({
  useMovies: vi.fn(),
}));

vi.mock("../hooks/useInfiniteScroll", () => ({
  useInfiniteScroll: vi.fn(),
}));

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
];

const mockBatman = [
  {
    id: 10,
    title: "Batman",
    overview: "Batman movie",
    poster_path: "/batman.jpg",
    backdrop_path: null,
    release_date: "2025-01-01",
    vote_average: 8.5,
  },
];

const mockLoadMore = vi.fn();
const mockRetry = vi.fn();

let observedCallback: (() => void) | undefined;

function renderHomePage() {
  return render(
    <MemoryRouter>
      <HomePage />
    </MemoryRouter>
  );
}

describe("HomePage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    observedCallback = undefined;

    vi.mocked(useInfiniteScroll).mockImplementation(
      ((callback: () => void) => {
        observedCallback = callback;
        return { current: null };
      }) as typeof useInfiniteScroll
    );

    vi.mocked(useMovies).mockImplementation(({ search }) => ({
      movies: search.trim() ? mockBatman : mockMovies,
      loading: false,
      error: "",
      page: 1,
      totalPages: 2,
      loadMore: mockLoadMore,
      retry: mockRetry,
    }));
  });

  it("renders popular movies", () => {
    renderHomePage();

    expect(
      screen.getByRole("heading", {
        name: "Popular Movies",
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("heading", {
        name: "Movie One",
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("heading", {
        name: "Movie Two",
      })
    ).toBeInTheDocument();

    expect(useMovies).toHaveBeenCalledWith(
      expect.objectContaining({
        search: "",
        category: "popular",
      })
    );
  });

  it("shows loading skeleton while the first page loads", () => {
    vi.mocked(useMovies).mockReturnValue({
      movies: [],
      loading: true,
      error: "",
      page: 1,
      totalPages: 1,
      loadMore: mockLoadMore,
      retry: mockRetry,
    });

    renderHomePage();

    expect(
      screen.queryByText("No movies found")
    ).not.toBeInTheDocument();
  });

  it("searches movies when the search input changes", async () => {
    const user = userEvent.setup();

    renderHomePage();

    await user.type(
      screen.getByRole("textbox", {
        name: "Search movies",
      }),
      "Batman"
    );

    expect(
      await screen.findByRole("heading", {
        name: "Batman",
      })
    ).toBeInTheDocument();

    expect(useMovies).toHaveBeenLastCalledWith(
      expect.objectContaining({
        search: "Batman",
        category: "popular",
      })
    );
  });

  it("clears the search using the search input clear button", async () => {
    const user = userEvent.setup();

    renderHomePage();

    const input = screen.getByRole("textbox", {
      name: "Search movies",
    });

    await user.type(input, "Batman");

    expect(
      await screen.findByRole("heading", {
        name: "Batman",
      })
    ).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", {
        name: "Clear search",
      })
    );

    expect(input).toHaveValue("");

    expect(
      await screen.findByRole("heading", {
        name: "Movie One",
      })
    ).toBeInTheDocument();
  });

  it("calls loadMore when the infinite-scroll callback fires", () => {
    renderHomePage();

    expect(observedCallback).toBeDefined();

    observedCallback?.();

    expect(mockLoadMore).toHaveBeenCalledTimes(1);
  });

  it("does not enable infinite scroll when loading", () => {
    vi.mocked(useMovies).mockReturnValue({
      movies: mockMovies,
      loading: true,
      error: "",
      page: 1,
      totalPages: 2,
      loadMore: mockLoadMore,
      retry: mockRetry,
    });

    renderHomePage();

    expect(useInfiniteScroll).toHaveBeenCalledWith(
      mockLoadMore,
      expect.objectContaining({
        enabled: false,
      })
    );
  });

  it("does not enable infinite scroll when an error occurs", () => {
    vi.mocked(useMovies).mockReturnValue({
      movies: [],
      loading: false,
      error: "Failed to load movies. Please try again.",
      page: 1,
      totalPages: 2,
      loadMore: mockLoadMore,
      retry: mockRetry,
    });

    renderHomePage();

    expect(
      screen.getByText(
        "Failed to load movies. Please try again."
      )
    ).toBeInTheDocument();

    expect(useInfiniteScroll).toHaveBeenCalledWith(
      mockLoadMore,
      expect.objectContaining({
        enabled: false,
      })
    );
  });

  it("shows an empty state when no movies are found", () => {
    vi.mocked(useMovies).mockReturnValue({
      movies: [],
      loading: false,
      error: "",
      page: 1,
      totalPages: 1,
      loadMore: mockLoadMore,
      retry: mockRetry,
    });

    renderHomePage();

    expect(
      screen.getByText("No movies found")
    ).toBeInTheDocument();
  });

  it("retries when Try Again is clicked", async () => {
    const user = userEvent.setup();

    vi.mocked(useMovies).mockReturnValue({
      movies: [],
      loading: false,
      error: "Failed to load movies. Please try again.",
      page: 1,
      totalPages: 1,
      loadMore: mockLoadMore,
      retry: mockRetry,
    });

    renderHomePage();

    await user.click(
      screen.getByRole("button", {
        name: "Try Again",
      })
    );

    expect(mockRetry).toHaveBeenCalledTimes(1);
  });

  it("does not render an error message when there is no error", () => {
    renderHomePage();

    expect(
      screen.queryByText(
        "Failed to load movies. Please try again."
      )
    ).not.toBeInTheDocument();
  });
});