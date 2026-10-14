# Movie App

A responsive movie discovery web application built with **React, TypeScript, Vite, and Tailwind CSS**, powered by the [TMDB](https://www.themoviedb.org/) API.

## Features

* Browse movies by category:

  * Now Playing
  * Popular
  * Top Rated
  * Upcoming
* Search movies with debounced input, request cancellation, and a clear button
* Infinite scroll via IntersectionObserver with a "Load More" button fallback
* Duplicate movie filtering across pages
* Responsive UI for desktop, tablet, and mobile devices
* Movie detail page with:

  * Poster and backdrop
  * Genres
  * Runtime
  * Director
  * Synopsis
  * Main cast
* YouTube trailer embed
* Similar Movies section
* Watchlist with `localStorage` persistence
* Dedicated `/watchlist` page
* Loading states and skeleton UI
* Error handling with retry functionality
* Fallback states for missing movie data
* 404 page for unknown routes
* Code-split routes using `React.lazy`
* Unit testing with React Testing Library and Vitest

## Getting Started

### Prerequisites

* Node.js 22+
* A TMDB API Read Access Token

Create a free TMDB account at [themoviedb.org](https://www.themoviedb.org/signup), then generate an API Read Access Token from **Settings → API**.

### Setup

```bash
npm install
cp .env.example .env
```

Then edit `.env` and set your TMDB token:

```env
VITE_TMDB_ACCESS_TOKEN=your_tmdb_access_token
```

> Do not commit your `.env` file or expose your API token in the repository.

### Run

Start the development server:

```bash
npm run dev
```

Build the application for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

Run unit tests:

```bash
npm run test:run
```

Run tests with coverage:

```bash
npm run test:coverage
```

Run lint:

```bash
npm run lint
```

## Testing

The application is tested using:

* Vitest
* React Testing Library
* Testing Library User Event

The test suite covers:

* Movie list rendering
* Movie search
* Category filtering
* Pagination / Load More
* Movie detail rendering
* API success and error states
* Loading states
* Movie trailer
* Similar movies
* Watchlist interactions
* Form and user interactions
* Fallback states
* Infinite scroll behavior

Coverage is enforced at **100% for statements, branches, functions, and lines** via `coverage.thresholds` in `vite.config.ts`, so any untested code fails the check.

## Tech Stack

* [React 19](https://react.dev/)
* [TypeScript](https://www.typescriptlang.org/)
* [Vite](https://vite.dev/)
* [Tailwind CSS 4](https://tailwindcss.com/)
* [React Router 7](https://reactrouter.com/)
* [Axios](https://axios-http.com/)
* [Vitest](https://vitest.dev/)
* [Testing Library](https://testing-library.com/)
* [TMDB API](https://developer.themoviedb.org/)

## Project Structure

```text
src/
├── api/             # TMDB API client and endpoint functions
├── components/      # Reusable UI components
├── hooks/           # Custom React hooks
├── pages/           # Route pages
├── test/            # Test setup
├── types/           # Shared TypeScript types
└── utils/            # Utility functions and local storage helpers
```

## Application Routes

```text
/                   # Movie discovery page
/movie/:movieId     # Movie detail page
/watchlist          # Saved movies
/*                  # 404 Not Found
```

## TMDB Attribution

This product uses the TMDB API but is not endorsed or certified by TMDB.

Movie data and images are provided by [The Movie Database (TMDB)](https://www.themoviedb.org/).

## Notes

* Movie data is fetched from TMDB.
* Watchlist data is persisted locally using browser `localStorage`.
* The application is designed to work across desktop, tablet, and mobile screen sizes.
* API credentials should be stored in environment variables and should not be committed to source control.
