import { describe, it, expect } from "vitest";

import { tmdbApi } from "./tmdb";

describe("tmdbApi", () => {
  it("targets the TMDB v3 API", () => {
    expect(tmdbApi.defaults.baseURL).toBe("https://api.themoviedb.org/3")
  })

  it("sends the bearer token header", () => {
    const headers = tmdbApi.defaults
      .headers as Record<string, unknown>

    expect(headers.Authorization).toBe(
      `Bearer ${import.meta.env.VITE_TMDB_ACCESS_TOKEN}`
    )
  })

  it("accepts JSON responses", () => {
    const headers = tmdbApi.defaults
      .headers as Record<string, unknown>

    expect(headers.accept).toBe(
      "application/json"
    )
  })
})
