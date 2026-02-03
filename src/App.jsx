import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { FavoritesProvider } from './context/FavoritesContext'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Movies from './pages/Movies'
import TVShows from './pages/TVShows'
import Favorites from './pages/Favorites'
import MovieDetail from './pages/MovieDetail'
import './App.css'

function App() {
  return (
    <FavoritesProvider>
      <Router>
        <div className="min-h-screen bg-gray-900">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/movies" element={<Movies />} />
            <Route path="/tv-shows" element={<TVShows />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/movie/:id" element={<MovieDetail />} />
            <Route path="/tv/:id" element={<MovieDetail />} />
          </Routes>
        </div>
      </Router>
    </FavoritesProvider>
  )
}

export default App
