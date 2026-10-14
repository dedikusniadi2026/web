import {
  describe,
  it,
  expect,
  vi,
  afterEach,
} from "vitest";

import { renderHook, act } from "@testing-library/react";
import { useDebounce } from "./useDebounce";

describe("useDebounce", () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it("returns the initial value immediately", () => {
    const { result } = renderHook(() =>
      useDebounce("hello", 500)
    )

    expect(result.current).toBe("hello")
  })

  it("delays updating the debounced value", () => {
    vi.useFakeTimers()

    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 500),
      {
        initialProps: { value: "first" },
      }
    )

    rerender({ value: "second" })

    act(() => {
      vi.advanceTimersByTime(250)
    })

    expect(result.current).toBe("first")

    act(() => {
      vi.advanceTimersByTime(250)
    })

    expect(result.current).toBe("second")
  })

  it("uses the default 500ms delay when none is given", () => {
    vi.useFakeTimers()

    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value),
      {
        initialProps: { value: "first" },
      }
    )

    rerender({ value: "second" })

    act(() => {
      vi.advanceTimersByTime(499)
    })

    expect(result.current).toBe("first")

    act(() => {
      vi.advanceTimersByTime(1)
    })

    expect(result.current).toBe("second")
  })
})
