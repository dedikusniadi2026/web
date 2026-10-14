import { lazy, Suspense } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Loading from "./components/Loading";
import ScrollToTop from "./components/ScrollToTop";
import Footer from "./components/Footer";

const HomePage = lazy(
  () => import("./pages/HomePage")
)
const MovieDetailPage = lazy(
  () => import("./pages/MovieDetailPage")
)
const WatchlistPage = lazy(
  () => import("./pages/WatchlistPage")
)
const NotFoundPage = lazy(
  () => import("./pages/NotFoundPage")
)

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />

      <Suspense
        fallback={
          <div className="min-h-screen bg-gray-950">
            <Loading />
          </div>
        }
      >
        <Routes>
          <Route
            path="/"
            element={<HomePage />
          }
          />

          <Route
            path="/movie/:movieId"
            element={
              <MovieDetailPage />
            }
          />

          <Route
            path="/watchlist"
            element={<WatchlistPage />
          }
          />

          <Route
            path="*"
            element={
              <NotFoundPage />
            }
          />
        </Routes>

        <Footer />
      </Suspense>
    </BrowserRouter>
  )
}

export default App