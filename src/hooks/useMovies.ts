import { useEffect, useState } from "react";
import { isCancel } from "axios";

import {
  getNowPlaying,
  getPopular,
  getTopRated,
  getUpcoming,
  searchMovies,
} from "../api/movieApi";

import type {
  Movie,
  MovieResponse,
} from "../types/movie";

import { useDebounce } from "./useDebounce";

export type MovieCategory =
  | "now_playing"
  | "popular"
  | "top_rated"
  | "upcoming"

const fetchersByCategory: Record<
  MovieCategory,
  (
    page: number,
    signal?: AbortSignal
  ) => Promise<MovieResponse>
> = {
  now_playing: getNowPlaying,
  popular: getPopular,
  top_rated: getTopRated,
  upcoming: getUpcoming,
}

interface UseMoviesOptions {
  category: MovieCategory
  search: string
}

export function useMovies({
  category,
  search,
}: UseMoviesOptions) {
  const [movies, setMovies] = useState<
    Movie[]
  >([])

  const debouncedSearch =
    useDebounce(search, 500)

  const [page, setPage] = useState(1)

  const [totalPages, setTotalPages] =
    useState(1)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    setPage(1)
  }, [category, debouncedSearch])

  useEffect(() => {
    const controller = new AbortController()

    async function loadMovies() {
      try {
        setLoading(true)
        setError("")

        if (page === 1) {
          setMovies([])
        }

        const query =
          debouncedSearch.trim()

        const response = query
          ? await searchMovies(
              query,
              page,
              controller.signal
            )
          : await fetchersByCategory[category](
              page,
              controller.signal
            )

        setMovies((previousMovies) => {
          if (page === 1) {
            return response.results
          }

          const existingIds = new Set(
            previousMovies.map(
              (movie) => movie.id
            )
          )

          return [
            ...previousMovies,
            ...response.results.filter(
              (movie) =>
                !existingIds.has(movie.id)
            ),
          ]
        })

        setTotalPages(response.total_pages)
      } catch (caughtError) {
        if (isCancel(caughtError)) {
          return
        }

        setError(
          "Failed to load movies. Please try again."
        )
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    loadMovies()

    return () => {
      controller.abort()
    }
  }, [
    category,
    debouncedSearch,
    page,
    refreshKey,
  ])

  function loadMore() {
    setPage((previousPage) => previousPage + 1)
  }

  function retry() {
    setRefreshKey((key) => key + 1)
  }

  return {
    movies,
    loading,
    error,
    page,
    totalPages,
    loadMore,
    retry,
  }
}
