# Movie App

A responsive movie discovery web application built with **React, TypeScript, Vite, and Tailwind CSS**, powered by the [TMDB](https://www.themoviedb.org/) API.

This project was built to fulfill the **Web Application Technical Test** requirements.

## Features - Sesuai Technical Test

### 1. Display Movie List
- Fetch movie data from TMDB API
- Display movies as cards with title, release year, and poster
- Each card links to the movie detail page

### 2. Movie Search
- Search movies by title with debounced input
- Request cancellation to avoid race conditions
- Clear button to reset search
- Displays matching results

### 3. Filtering by Category
- Now Playing
- Popular
- Top Rated
- Upcoming

### 4. Movie Detail Page
- Poster and backdrop
- Synopsis / Overview
- Main cast
- Director
- Genres and Runtime
- Back button to movie list

### 5. Pagination
- Infinite scroll via IntersectionObserver
- Load More button fallback
- Duplicate movie filtering across pages

### Additional
- Loading states and skeleton UI
- Error handling with retry
- Fallback for missing data
- 404 page for unknown routes
- Responsive for desktop, tablet, mobile
- Unit testing with React Testing Library

## Getting Started

### Prerequisites
- Node.js 22+
- TMDB API Read Access Token from https://www.themoviedb.org/ - Settings -> API

### Setup
```bash
npm install
cp .env.example .env