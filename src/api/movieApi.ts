import { tmdbApi } from "./tmdb";

import type {
    MovieDetail,
    MovieResponse,
    CreditsResponse,
    VideosResponse,
  } from "../types/movie";

export async function getNowPlaying(
  page = 1,
  signal?: AbortSignal
): Promise<MovieResponse> {
  const response = await tmdbApi.get<MovieResponse>(
    "/movie/now_playing",
    {
      params: {
        language: "en-US",
        page,
      },
      signal,
    }
  )

  return response.data
}

export async function getMovieCredits(
    movieId: number,
    signal?: AbortSignal
  ): Promise<CreditsResponse> {
    const response =
      await tmdbApi.get<CreditsResponse>(
        `/movie/${movieId}/credits`,
        {
          params: {
            language: "en-US",
          },
          signal,
        }
      )
  
    return response.data
  }

export async function getPopular(
  page = 1,
  signal?: AbortSignal
): Promise<MovieResponse> {
  const response = await tmdbApi.get<MovieResponse>(
    "/movie/popular",
    {
      params: {
        language: "en-US",
        page,
      },
      signal,
    }
  )

  return response.data
}

export async function getTopRated(
  page = 1,
  signal?: AbortSignal
): Promise<MovieResponse> {
  const response = await tmdbApi.get<MovieResponse>(
    "/movie/top_rated",
    {
      params: {
        language: "en-US",
        page,
      },
      signal,
    }
  )

  return response.data
}

export async function getMovieDetail(
    movieId: number,
    signal?: AbortSignal
  ): Promise<MovieDetail> {
    const response = await tmdbApi.get<MovieDetail>(
      `/movie/${movieId}`,
      {
        params: {
          language: "en-US",
        },
        signal,
      }
    )
  
    return response.data
  }

export async function getUpcoming(
  page = 1,
  signal?: AbortSignal
): Promise<MovieResponse> {
  const response = await tmdbApi.get<MovieResponse>(
    "/movie/upcoming",
    {
      params: {
        language: "en-US",
        page,
      },
      signal,
    }
  )

  return response.data
}

export async function searchMovies(
  query: string,
  page = 1,
  signal?: AbortSignal
): Promise<MovieResponse> {
  const response = await tmdbApi.get<MovieResponse>(
    "/search/movie",
    {
      params: {
        language: "en-US",
        query,
        page,
      },
      signal,
    }
  )

  return response.data
}

export async function getMovieVideos(
  movieId: number,
  signal?: AbortSignal
): Promise<VideosResponse> {
  const response = await tmdbApi.get<VideosResponse>(
    `/movie/${movieId}/videos`,
    {
      params: {
        language: "en-US",
      },
      signal,
    }
  )

  return response.data
}

export async function getSimilarMovies(
  movieId: number,
  signal?: AbortSignal
): Promise<MovieResponse> {
  const response = await tmdbApi.get<MovieResponse>(
    `/movie/${movieId}/similar`,
    {
      params: {
        language: "en-US",
        page: 1,
      },
      signal,
    }
  )

  return response.data
}