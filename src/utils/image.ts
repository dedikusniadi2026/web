const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p"

export function getPosterUrl(
  posterPath: string | null
): string | null {
  if (!posterPath) {
    return null
  }

  return `${TMDB_IMAGE_BASE}/w500${posterPath}`
}

export function getBackdropUrl(
  backdropPath: string | null
): string | null {
  if (!backdropPath) {
    return null
  }

  return `${TMDB_IMAGE_BASE}/w1280${backdropPath}`
}

export function getProfileUrl(
  profilePath: string | null
): string | null {
  if (!profilePath) {
    return null
  }

  return `${TMDB_IMAGE_BASE}/w185${profilePath}`
}