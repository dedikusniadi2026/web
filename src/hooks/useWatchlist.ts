import { useSyncExternalStore } from "react";

import {
  getSnapshot,
  isSaved as isSavedInStore,
  subscribe,
  toggle as toggleInStore,
} from "../utils/watchlistStore";

import type { Movie } from "../types/movie";

export function useWatchlist() {
  const watchlist =
    useSyncExternalStore(subscribe, getSnapshot)

  return {
    watchlist,
    isSaved: (movieId: number) =>
      isSavedInStore(movieId, watchlist),
    toggle: (movie: Movie) => toggleInStore(movie),
  }
}
