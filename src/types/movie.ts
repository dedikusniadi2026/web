export interface Movie {
  id: number
  title: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  release_date: string
  vote_average: number
}

export interface MovieResponse {
  page: number
  results: Movie[]
  total_pages: number
  total_results: number
}

export interface MovieDetail extends Movie {
  runtime: number | null
  genres: {
    id: number
    name: string
  }[]
}

export interface VideoResult {
  id: string
  key: string
  name: string
  site: string
  type: string
  official: boolean
}

export interface VideosResponse {
  results: VideoResult[]
}

export interface Cast {
  id: number
  name: string
  character: string
  profile_path: string | null
}

export interface Crew {
  id: number
  name: string
  job: string
  department: string
}

export interface CreditsResponse {
  cast: Cast[]
  crew: Crew[]
}
