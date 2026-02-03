import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { useFavorites } from '../context/FavoritesContext'

function Navbar() {
  const location = useLocation()
  const { favorites } = useFavorites()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const isActive = (path) => {
    return location.pathname === path ? 'bg-blue-600' : 'hover:bg-gray-700'
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <nav className="bg-gray-800 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-xl sm:text-2xl font-bold text-white">
            🎬 MovieDB
          </Link>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-4">
            <Link
              to="/"
              className={`px-4 py-2 rounded-lg text-white transition-colors ${isActive('/')}`}
            >
              Home
            </Link>
            <Link
              to="/movies"
              className={`px-4 py-2 rounded-lg text-white transition-colors ${isActive('/movies')}`}
            >
              Movies
            </Link>
            <Link
              to="/tv-shows"
              className={`px-4 py-2 rounded-lg text-white transition-colors ${isActive('/tv-shows')}`}
            >
              TV Shows
            </Link>
            <Link
              to="/favorites"
              className={`px-4 py-2 rounded-lg text-white transition-colors relative ${isActive('/favorites')}`}
            >
              Favorites
              {favorites.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {favorites.length}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden text-white p-2"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden pb-4">
            <div className="flex flex-col space-y-2">
              <Link
                to="/"
                onClick={() => setIsMenuOpen(false)}
                className={`px-4 py-2 rounded-lg text-white transition-colors ${isActive('/')}`}
              >
                Home
              </Link>
              <Link
                to="/movies"
                onClick={() => setIsMenuOpen(false)}
                className={`px-4 py-2 rounded-lg text-white transition-colors ${isActive('/movies')}`}
              >
                Movies
              </Link>
              <Link
                to="/tv-shows"
                onClick={() => setIsMenuOpen(false)}
                className={`px-4 py-2 rounded-lg text-white transition-colors ${isActive('/tv-shows')}`}
              >
                TV Shows
              </Link>
              <Link
                to="/favorites"
                onClick={() => setIsMenuOpen(false)}
                className={`px-4 py-2 rounded-lg text-white transition-colors relative ${isActive('/favorites')}`}
              >
                <div className="flex items-center justify-between">
                  Favorites
                  {favorites.length > 0 && (
                    <span className="bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {favorites.length}
                    </span>
                  )}
                </div>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar