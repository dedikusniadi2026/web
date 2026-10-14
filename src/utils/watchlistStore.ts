import type { Movie } from "../types/movie";

const STORAGE_KEY = "movie-app:watchlist";
const CHANGE_EVENT = "movie-app:watchlist-change";

export function parseStoredMovies(
  raw: string | null
): Movie[] {
  if (!raw) {
    return []
  }

  try {
    const parsed = JSON.parse(raw)

    return Array.isArray(parsed)
      ? (parsed as Movie[])
      : []
  } catch {
    return []
  }
}

function readFromStorage(): Movie[] {
  return parseStoredMovies(
    window.localStorage.getItem(STORAGE_KEY)
  )
}

let snapshot: Movie[] = readFromStorage()

function persist(list: Movie[]): void {
  snapshot = list

  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(list)
    )
  } catch {
  }

  window.dispatchEvent(new Event(CHANGE_EVENT))
}

export function subscribe(
  listener: () => void
): () => void {
  window.addEventListener(CHANGE_EVENT, listener)

  return () => {
    window.removeEventListener(CHANGE_EVENT, listener)
  }
}

export function getSnapshot(): Movie[] {
  return snapshot
}

export function isSaved(
  movieId: number,
  list: Movie[] = snapshot
): boolean {
  return list.some((movie) => movie.id === movieId)
}

export function toggle(movie: Movie): void {
  if (isSaved(movie.id)) {
    persist(snapshot.filter((item) => item.id !== movie.id))
  } else {
    persist([movie, ...snapshot])
  }
}

export function remove(movieId: number): void {
  persist(snapshot.filter((item) => item.id !== movieId))
}
