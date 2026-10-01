import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import './App.css'
import AppLayout from '../components/layout/AppLayout.jsx'
import HomePage from '../pages/HomePage.jsx'

const SearchPage = lazy(() => import('../pages/SearchPage.jsx'))
const FavoritesPage = lazy(() => import('../pages/FavoritesPage.jsx'))
const WatchlistPage = lazy(() => import('../pages/WatchlistPage.jsx'))
const CategoryPage = lazy(() => import('../pages/CategoryPage.jsx'))
const MediaDetailsPage = lazy(() => import('../pages/MediaDetailsPage.jsx'))

function PageFallback() {
  return (
    <div className="min-h-[50vh] w-full flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
    </div>
  )
}

function App() {
  return (
    <div>
      <Suspense fallback={<PageFallback />}>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/discover/:category" element={<CategoryPage />} />
            <Route path="/discover/:id" element={<CategoryPage />} />
            <Route path="/:mediaType/:id" element={<MediaDetailsPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="/watchlist" element={<WatchlistPage />} />
            <Route path="*" element={<HomePage />} />
          </Route>
        </Routes>
      </Suspense>
    </div>
  )
}

export default App
