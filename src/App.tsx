import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";

import Loading from "./components/Loading";
import ScrollToTop from "./components/ScrollToTop";
import ErrorBoundary from "./components/ErrorBoundary"; // senior wajib ada
import MainLayout from "./layouts/MainLayout";

// Senior: kasih nama chunk biar kebaca di build, bukan angka 0.js 1.js
const HomePage = lazy(() => import("./pages/HomePage" /* webpackChunkName: "home" */));
const MovieDetailPage = lazy(() => import("./pages/MovieDetailPage" /* webpackChunkName: "detail" */));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));

const ROUTES = {
  HOME: "/",
  DETAIL: "/movie/:movieId",
} as const;

function App() {
  return (
    <>
      <ScrollToTop />
      <ErrorBoundary>
        <Suspense
          fallback={
            <div className="min-h-screen bg-gray-950 grid place-items-center">
              <Loading />
            </div>
          }
        >
          <Routes>
            {/* Layout biar Navbar/Footer gak ikut re-render / suspense */}
            <Route element={<MainLayout />}>
              <Route path={ROUTES.HOME} element={<HomePage />} />
              <Route path={ROUTES.DETAIL} element={<MovieDetailPage />} />
            </Route>

            {/* 404 di luar layout, biar full page */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </>
  );
}

export default App;