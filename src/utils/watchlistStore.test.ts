import {
  describe,
  it,
  expect,
  beforeEach,
  vi,
} from "vitest";

import * as store from "./watchlistStore";
import type { Movie } from "../types/movie";

const movieA: Movie = {
  id: 1,
  title: "Inception",
  overview: "",
  poster_path: null,
  backdrop_path: null,
  release_date: "2010-07-16",
  vote_average: 8.4,
}

const movieB: Movie = {
  id: 2,
  title: "Interstellar",
  overview: "",
  poster_path: null,
  backdrop_path: null,
  release_date: "2014-11-07",
  vote_average: 8.4,
}

describe("watchlistStore", () => {
  beforeEach(() => {
    localStorage.clear()

    store.getSnapshot().forEach((movie) => {
      store.remove(movie.id)
    })
  })

  it("starts with an empty watchlist", () => {
    expect(store.getSnapshot()).toEqual([])
  })

  it("toggles a movie in and out of the watchlist", () => {
    store.toggle(movieA)

    expect(store.getSnapshot()).toEqual([movieA])
    expect(store.isSaved(movieA.id)).toBe(true)
    expect(store.isSaved(999)).toBe(false)

    store.toggle(movieA)

    expect(store.getSnapshot()).toEqual([])
    expect(store.isSaved(movieA.id)).toBe(false)
  })

  it("persists to localStorage", () => {
    store.toggle(movieA)

    const stored = JSON.parse(
      localStorage.getItem("movie-app:watchlist") ?? "[]"
    )

    expect(stored).toHaveLength(1)
    expect(stored[0].id).toBe(1)
  })

  it("notifies subscribers on change", () => {
    const listener = vi.fn()

    const unsubscribe = store.subscribe(listener)

    store.toggle(movieA)

    expect(listener).toHaveBeenCalled()

    unsubscribe()
  })

  it("removes a movie by id", () => {
    store.toggle(movieA)
    store.toggle(movieB)

    store.remove(movieA.id)

    expect(store.getSnapshot()).toEqual([movieB])
    expect(store.isSaved(movieA.id)).toBe(false)
    expect(store.isSaved(movieB.id)).toBe(true)
  })

  it("keeps the most recently added movie first", () => {
    store.toggle(movieA)
    store.toggle(movieB)

    expect(store.getSnapshot()).toEqual([
      movieB,
      movieA,
    ])
  })

  it("parses missing storage as empty", () => {
    expect(store.parseStoredMovies(null)).toEqual(
      []
    )

    expect(store.parseStoredMovies("")).toEqual(
      []
    )
  })

  it("parses invalid JSON as empty", () => {
    expect(
      store.parseStoredMovies("{invalid json")
    ).toEqual([])
  })

  it("parses non-array data as empty", () => {
    expect(
      store.parseStoredMovies(
        JSON.stringify({ id: 1 })
      )
    ).toEqual([])
  })

  it("parses stored arrays into movies", () => {
    expect(
      store.parseStoredMovies(
        JSON.stringify([movieA])
      )
    ).toEqual([movieA])
  })

  it("keeps the in-memory list when writes to storage fail", () => {
    const setItem = vi
      .spyOn(Storage.prototype, "setItem")
      .mockImplementation(() => {
        throw new Error("QuotaExceededError")
      })

    store.toggle(movieA)

    expect(store.getSnapshot()).toEqual([movieA])

    setItem.mockRestore()

    store.remove(movieA.id)
  })
})
