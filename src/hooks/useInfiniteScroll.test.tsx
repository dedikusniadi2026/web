import {
  describe,
  it,
  expect,
  vi,
  afterEach,
} from "vitest";

import { render, act } from "@testing-library/react";
import { useInfiniteScroll } from "./useInfiniteScroll";

class MockIntersectionObserver {
  static instances: MockIntersectionObserver[] =
    []

  callback: IntersectionObserverCallback
  observed: Element[] = []
  disconnected = false

  constructor(
    callback: IntersectionObserverCallback
  ) {
    this.callback = callback
    MockIntersectionObserver.instances.push(
      this
    )
  }

  observe(element: Element) {
    this.observed.push(element)
  }

  unobserve() {}

  disconnect() {
    this.disconnected = true
  }
}

interface TestComponentProps {
  onIntersect: () => void
  enabled?: boolean
}

function TestComponent({
  onIntersect,
  enabled,
}: TestComponentProps) {
  const sentinelRef = useInfiniteScroll(
    onIntersect,
    { enabled }
  )

  return (
    <div
      ref={sentinelRef}
      data-testid="sentinel"
    />
  )
}

function getObserver() {
  return MockIntersectionObserver.instances[0]
}

describe("useInfiniteScroll", () => {
  afterEach(() => {
    vi.unstubAllGlobals()

    MockIntersectionObserver.instances = []
  })

  it("observes the sentinel element when enabled", () => {
    vi.stubGlobal(
      "IntersectionObserver",
      MockIntersectionObserver as never
    )

    render(
      <TestComponent onIntersect={vi.fn()} />
    )

    const observer = getObserver()

    expect(observer).toBeDefined()
    expect(observer.observed).toHaveLength(1)
  })

  it("does not observe when disabled", () => {
    vi.stubGlobal(
      "IntersectionObserver",
      MockIntersectionObserver as never
    )

    render(
      <TestComponent
        onIntersect={vi.fn()}
        enabled={false}
      />
    )

    expect(
      MockIntersectionObserver.instances
    ).toHaveLength(0)
  })

  it("does nothing when IntersectionObserver is unavailable", () => {
    vi.stubGlobal(
      "IntersectionObserver",
      undefined
    )

    expect(() =>
      render(
        <TestComponent onIntersect={vi.fn()} />
      )
    ).not.toThrow()

    expect(
      MockIntersectionObserver.instances
    ).toHaveLength(0)
  })

  it("calls onIntersect when the sentinel intersects", () => {
    vi.stubGlobal(
      "IntersectionObserver",
      MockIntersectionObserver as never
    )

    const onIntersect = vi.fn()

    render(<TestComponent onIntersect={onIntersect} />)

    const observer = getObserver()

    act(() => {
      observer.callback(
        [
          {
            isIntersecting: true,
          } as unknown as IntersectionObserverEntry,
        ],
        observer as unknown as IntersectionObserver
      )
    })

    expect(onIntersect).toHaveBeenCalledTimes(1)
  })

  it("ignores entries that are not intersecting", () => {
    vi.stubGlobal(
      "IntersectionObserver",
      MockIntersectionObserver as never
    )

    const onIntersect = vi.fn()

    render(<TestComponent onIntersect={onIntersect} />)

    const observer = getObserver()

    act(() => {
      observer.callback(
        [
          {
            isIntersecting: false,
          } as unknown as IntersectionObserverEntry,
        ],
        observer as unknown as IntersectionObserver
      )
    })

    expect(onIntersect).not.toHaveBeenCalled()
  })

  it("uses the latest callback after re-renders", () => {
    vi.stubGlobal(
      "IntersectionObserver",
      MockIntersectionObserver as never
    )

    const firstCallback = vi.fn()
    const latestCallback = vi.fn()

    const { rerender } = render(
      <TestComponent onIntersect={firstCallback} />
    )

    rerender(
      <TestComponent onIntersect={latestCallback} />
    )

    const observer = getObserver()

    act(() => {
      observer.callback(
        [
          {
            isIntersecting: true,
          } as unknown as IntersectionObserverEntry,
        ],
        observer as unknown as IntersectionObserver
      )
    })

    expect(firstCallback).not.toHaveBeenCalled()
    expect(latestCallback).toHaveBeenCalledTimes(1)
  })

  it("disconnects the observer on unmount", () => {
    vi.stubGlobal(
      "IntersectionObserver",
      MockIntersectionObserver as never
    )

    const { unmount } = render(
      <TestComponent onIntersect={vi.fn()} />
    )

    const observer = getObserver()

    unmount()

    expect(observer.disconnected).toBe(true)
  })
})
