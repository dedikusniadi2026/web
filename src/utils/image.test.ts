import { describe, it, expect } from "vitest";

import {
  getBackdropUrl,
  getPosterUrl,
  getProfileUrl,
} from "./image"

describe("image url helpers", () => {
  it("builds a w500 poster url", () => {
    expect(
      getPosterUrl("/poster.jpg")
    ).toBe(
      "https://image.tmdb.org/t/p/w500/poster.jpg"
    )
  })

  it("returns null when the poster is missing", () => {
    expect(getPosterUrl(null)).toBeNull()
  })

  it("builds a w1280 backdrop url", () => {
    expect(
      getBackdropUrl("/backdrop.jpg")
    ).toBe(
      "https://image.tmdb.org/t/p/w1280/backdrop.jpg"
    )
  })

  it("returns null when the backdrop is missing", () => {
    expect(getBackdropUrl(null)).toBeNull()
  })

  it("builds a w185 profile url", () => {
    expect(getProfileUrl("/cast.jpg")).toBe(
      "https://image.tmdb.org/t/p/w185/cast.jpg"
    )
  })

  it("returns null when the profile is missing", () => {
    expect(getProfileUrl(null)).toBeNull()
  })
})
