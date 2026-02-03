import { Link } from 'react-router-dom'
import { useFavorites } from '../context/FavoritesContext'
import FavoriteButton from '../components/FavoriteButton'
import tmdbService from '../services/tmdbService'

function Favorites() {
  const { favorites } = useFavorites()

  if (favorites.length === 0) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-center mb-8">My Favorites</h1>
          <div className="text-center">
            <div className="text-6xl sm:text-8xl mb-4">💔</div>
            <h2 className="text-xl sm:text-2xl mb-4">No favorites yet</h2>
            <p className="text-gray-400 mb-8 text-sm sm:text-base">
              Start adding movies and TV shows to your favorites!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/movies"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Browse Movies
              </Link>
              <Link
                to="/tv-shows"
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Browse TV Shows
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-center mb-8">
          My Favorites ({favorites.length})
        </h1>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-6">
          {favorites.map((item) => (
            <div key={item.id} className="relative group">
              <Link
                to={`/${item.media_type || (item.title ? 'movie' : 'tv')}/${item.id}`}
                className="block bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:scale-105 transition-transform duration-200"
              >
                <img
                  src={tmdbService.getImageURL(item.poster_path)}
                  alt={item.title || item.name}
                  className="w-full h-48 sm:h-64 md:h-80 object-cover"
                />
                <div className="p-2 sm:p-4">
                  <h3 className="text-sm sm:text-lg font-semibold mb-1 sm:mb-2 line-clamp-2">
                    {item.title || item.name}
                  </h3>
                  <div className="flex justify-between items-center">
                    <p className="text-gray-400 text-xs sm:text-sm">
                      {(item.release_date || item.first_air_date)?.split('-')[0]}
                    </p>
                    <span className="px-1 sm:px-2 py-1 bg-yellow-600 text-xs rounded">
                      ⭐ {item.vote_average?.toFixed(1)}
                    </span>
                  </div>
                </div>
              </Link>
              
              {/* Favorite Button */}
              <div className="absolute top-2 right-2">
                <FavoriteButton item={item} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Favorites