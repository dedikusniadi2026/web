import {
  describe,
  it,
  expect,
  vi,
  beforeEach,
} from "vitest";

import {
  getNowPlaying,
  getPopular,
  getTopRated,
  getUpcoming,
  searchMovies,
  getMovieDetail,
  getMovieCredits,
  getMovieVideos,
  getSimilarMovies,
} from "./movieApi";

import { tmdbApi } from "./tmdb";

vi.mock("./tmdb", () => ({
  tmdbApi: {
    get: vi.fn(),
  },
}))

const listResponse = {
  page: 1,
  results: [],
  total_pages: 1,
  total_results: 0,
}

describe("movieApi", () => {
  const signal = new AbortController().signal

  beforeEach(() => {
    vi.clearAllMocks()

    vi.mocked(tmdbApi.get).mockResolvedValue(
      {
        data: listResponse,
      } as never
    )
  })

  it("getNowPlaying fetches now playing movies", async () => {
    await expect(
      getNowPlaying(2, signal)
    ).resolves.toEqual(listResponse)

    expect(tmdbApi.get).toHaveBeenCalledWith(
      "/movie/now_playing",
      {
        params: {
          language: "en-US",
          page: 2,
        },
        signal,
      }
    )
  })

  it("getPopular fetches popular movies", async () => {
    await expect(
      getPopular(3, signal)
    ).resolves.toEqual(listResponse)

    expect(tmdbApi.get).toHaveBeenCalledWith(
      "/movie/popular",
      {
        params: {
          language: "en-US",
          page: 3,
        },
        signal,
      }
    )
  })

  it("getTopRated fetches top rated movies", async () => {
    await expect(
      getTopRated(1, signal)
    ).resolves.toEqual(listResponse)

    expect(tmdbApi.get).toHaveBeenCalledWith(
      "/movie/top_rated",
      {
        params: {
          language: "en-US",
          page: 1,
        },
        signal,
      }
    )
  })

  it("getUpcoming fetches upcoming movies", async () => {
    await expect(
      getUpcoming(4, signal)
    ).resolves.toEqual(listResponse)

    expect(tmdbApi.get).toHaveBeenCalledWith(
      "/movie/upcoming",
      {
        params: {
          language: "en-US",
          page: 4,
        },
        signal,
      }
    )
  })

  it("searchMovies fetches search results for a query", async () => {
    await expect(
      searchMovies("batman", 5, signal)
    ).resolves.toEqual(listResponse)

    expect(tmdbApi.get).toHaveBeenCalledWith(
      "/search/movie",
      {
        params: {
          language: "en-US",
          query: "batman",
          page: 5,
        },
        signal,
      }
    )
  })

  it("getMovieDetail fetches a single movie", async () => {
    await expect(
      getMovieDetail(550, signal)
    ).resolves.toEqual(listResponse)

    expect(tmdbApi.get).toHaveBeenCalledWith(
      "/movie/550",
      {
        params: {
          language: "en-US",
        },
        signal,
      }
    )
  })

  it("getMovieCredits fetches movie credits", async () => {
    await expect(
      getMovieCredits(550, signal)
    ).resolves.toEqual(listResponse)

    expect(tmdbApi.get).toHaveBeenCalledWith(
      "/movie/550/credits",
      {
        params: {
          language: "en-US",
        },
        signal,
      }
    )
  })

  it("getMovieVideos fetches movie videos", async () => {
    await expect(
      getMovieVideos(550, signal)
    ).resolves.toEqual(listResponse)

    expect(tmdbApi.get).toHaveBeenCalledWith(
      "/movie/550/videos",
      {
        params: {
          language: "en-US",
        },
        signal,
      }
    )
  })

  it("getSimilarMovies fetches similar movies", async () => {
    await expect(
      getSimilarMovies(550, signal)
    ).resolves.toEqual(listResponse)

    expect(tmdbApi.get).toHaveBeenCalledWith(
      "/movie/550/similar",
      {
        params: {
          language: "en-US",
          page: 1,
        },
        signal,
      }
    )
  })
})
