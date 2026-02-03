import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import tmdbService from '../services/tmdbService'
import FavoriteButton from '../components/FavoriteButton'

function Home() {
  const [movies, setMovies] = useState([])
  const [tvShows, setTVShows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [moviesData, tvData] = await Promise.all([
          tmdbService.getPopularMovies(),
          tmdbService.getPopularTVShows()
        ])
        setMovies(moviesData.results.slice(0, 4))
        setTVShows(tvData.results.slice(0, 4))
        setLoading(false)
      } catch (err) {
        setError(err.message)
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!searchQuery.trim()) return
    
    setIsSearching(true)
    try {
      const data = await tmdbService.searchMulti(searchQuery)
      setSearchResults(data.results.filter(item => item.media_type === 'movie' || item.media_type === 'tv'))
    } catch (err) {
      setError(err.message)
    }
    setIsSearching(false)
  }

  const clearSearch = () => {
    setSearchQuery('')
    setSearchResults([])
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-red-500 text-xl">Error: {error}</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-center mb-8">
          Welcome to MovieDB
        </h1>
        
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-8">
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search movies and TV shows..."
              className="flex-1 px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
            />
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={isSearching}
                className="flex-1 sm:flex-none px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {isSearching ? 'Searching...' : 'Search'}
              </button>
              {searchResults.length > 0 && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </form>
        
        {searchResults.length > 0 ? (
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold mb-6">Search Results ({searchResults.length})</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-6">
              {searchResults.map((item) => (
                <div key={item.id} className="relative group">
                  <Link
                    to={`/${item.media_type}/${item.id}`}
                    className="block bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:scale-105 transition-transform duration-200"
                  >
                    <img
                      src={tmdbService.getImageURL(item.poster_path)}
                      alt={item.title || item.name}
                      className="w-full h-48 sm:h-64 md:h-80 object-cover"
                    />
                    <div className="p-2 sm:p-4">
                      <h3 className="text-sm sm:text-lg font-semibold mb-1 sm:mb-2 line-clamp-2">{item.title || item.name}</h3>
                      <div className="flex justify-between items-center">
                        <p className="text-gray-400 text-xs sm:text-sm">
                          {(item.release_date || item.first_air_date)?.split('-')[0]}
                        </p>
                        <span className="px-1 sm:px-2 py-1 bg-blue-600 text-xs rounded">
                          {item.media_type === 'tv' ? 'TV' : 'Movie'}
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
        ) : (
          <div>
            {/* Popular Movies Section */}
            <div className="mb-12">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl sm:text-2xl font-semibold">Popular Movies</h2>
                <Link to="/movies" className="text-blue-400 hover:text-blue-300 text-sm sm:text-base">
                  View All →
                </Link>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-6">
                {movies.map((movie) => {
                  const movieWithType = { ...movie, media_type: 'movie' }
                  return (
                    <div key={movie.id} className="relative group">
                      <Link
                        to={`/movie/${movie.id}`}
                        className="block bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:scale-105 transition-transform duration-200"
                      >
                        <img
                          src={tmdbService.getImageURL(movie.poster_path)}
                          alt={movie.title}
                          className="w-full h-48 sm:h-64 md:h-80 object-cover"
                        />
                        <div className="p-2 sm:p-4">
                          <h3 className="text-sm sm:text-lg font-semibold mb-1 sm:mb-2 line-clamp-2">{movie.title}</h3>
                          <div className="flex justify-between items-center">
                            <p className="text-gray-400 text-xs sm:text-sm">
                              {movie.release_date?.split('-')[0]}
                            </p>
                            <span className="px-1 sm:px-2 py-1 bg-yellow-600 text-xs rounded">
                              ⭐ {movie.vote_average?.toFixed(1)}
                            </span>
                          </div>
                        </div>
                      </Link>
                      
                      {/* Favorite Button */}
                      <div className="absolute top-2 right-2">
                        <FavoriteButton item={movieWithType} />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Popular TV Shows Section */}
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl sm:text-2xl font-semibold">Popular TV Shows</h2>
                <Link to="/tv-shows" className="text-blue-400 hover:text-blue-300 text-sm sm:text-base">
                  View All →
                </Link>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-6">
                {tvShows.map((show) => {
                  const showWithType = { ...show, media_type: 'tv' }
                  return (
                    <div key={show.id} className="relative group">
                      <Link
                        to={`/tv/${show.id}`}
                        className="block bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:scale-105 transition-transform duration-200"
                      >
                        <img
                          src={tmdbService.getImageURL(show.poster_path)}
                          alt={show.name}
                          className="w-full h-48 sm:h-64 md:h-80 object-cover"
                        />
                        <div className="p-2 sm:p-4">
                          <h3 className="text-sm sm:text-lg font-semibold mb-1 sm:mb-2 line-clamp-2">{show.name}</h3>
                          <div className="flex justify-between items-center">
                            <p className="text-gray-400 text-xs sm:text-sm">
                              {show.first_air_date?.split('-')[0]}
                            </p>
                            <span className="px-1 sm:px-2 py-1 bg-yellow-600 text-xs rounded">
                              ⭐ {show.vote_average?.toFixed(1)}
                            </span>
                          </div>
                        </div>
                      </Link>
                      
                      {/* Favorite Button */}
                      <div className="absolute top-2 right-2">
                        <FavoriteButton item={showWithType} />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Home