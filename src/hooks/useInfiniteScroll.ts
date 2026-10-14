import { useEffect, useRef } from "react";

interface UseInfiniteScrollOptions {
  enabled?: boolean
}

export function useInfiniteScroll(
  onIntersect: () => void,
  { enabled = true }: UseInfiniteScrollOptions = {}
) {
  const sentinelRef = useRef<HTMLDivElement | null>(
    null
  )

  const callbackRef = useRef(onIntersect)

  useEffect(() => {
    callbackRef.current = onIntersect
  }, [onIntersect])

  useEffect(() => {
    const element = sentinelRef.current

    if (
      !enabled ||
      !element ||
      typeof IntersectionObserver ===
        "undefined"
    ) {
      return
    }

    const observer =
      new IntersectionObserver(
        (entries) => {
          if (
            entries.some(
              (entry) => entry.isIntersecting
            )
          ) {
            callbackRef.current()
          }
        },
        { rootMargin: "400px" }
      )

    observer.observe(element)

    return () => {
      observer.disconnect()
    }
  }, [enabled])

  return sentinelRef
}
