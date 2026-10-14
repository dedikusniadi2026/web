import { describe, it, expect } from "vitest";

import { formatRuntime } from "./format"

describe("formatRuntime", () => {
  it("returns N/A when the runtime is unknown", () => {
    expect(formatRuntime(null)).toBe("N/A")
  })

  it("returns N/A for a zero runtime", () => {
    expect(formatRuntime(0)).toBe("N/A")
  })

  it("formats minutes under an hour", () => {
    expect(formatRuntime(45)).toBe("45m")
  })

  it("formats hours and minutes", () => {
    expect(formatRuntime(139)).toBe("2h 19m")
  })

  it("formats a whole hour", () => {
    expect(formatRuntime(60)).toBe("1h 0m")
  })
})
