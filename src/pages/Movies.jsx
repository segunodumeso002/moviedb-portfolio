import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import tmdbService from '../services/tmdbService'
import GenreFilter from '../components/GenreFilter'
import FavoriteButton from '../components/FavoriteButton'

function Movies() {
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [selectedGenre, setSelectedGenre] = useState(null)
  const [genreMovies, setGenreMovies] = useState([])
  const [isLoadingGenre, setIsLoadingGenre] = useState(false)

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const data = await tmdbService.getPopularMovies()
        setMovies(data.results)
        setLoading(false)
      } catch (err) {
        setError(err.message)
        setLoading(false)
      }
    }

    fetchMovies()
  }, [])

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!searchQuery.trim()) return
    
    setIsSearching(true)
    try {
      const data = await tmdbService.searchMulti(searchQuery)
      setSearchResults(data.results.filter(item => item.media_type === 'movie' || !item.media_type))
    } catch (err) {
      setError(err.message)
    }
    setIsSearching(false)
  }

  const clearSearch = () => {
    setSearchQuery('')
    setSearchResults([])
  }

  const handleGenreChange = async (genreId) => {
    setSelectedGenre(genreId)
    if (genreId === null) {
      setGenreMovies([])
      return
    }

    setIsLoadingGenre(true)
    try {
      const data = await tmdbService.getMoviesByGenre(genreId)
      setGenreMovies(data.results)
    } catch (err) {
      setError(err.message)
    }
    setIsLoadingGenre(false)
  }

  const getDisplayMovies = () => {
    if (searchResults.length > 0) return searchResults
    if (selectedGenre !== null) return genreMovies
    return movies
  }

  const getTitle = () => {
    if (searchResults.length > 0) return `Search Results (${searchResults.length})`
    if (selectedGenre !== null) return `Genre Movies (${genreMovies.length})`
    return 'Popular Movies'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading movies...</div>
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
        <h1 className="text-3xl sm:text-4xl font-bold text-center mb-8">Movies</h1>
        
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-8">
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search movies..."
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

        {/* Genre Filter */}
        {searchResults.length === 0 && (
          <GenreFilter 
            type="movie" 
            onGenreChange={handleGenreChange} 
            selectedGenre={selectedGenre}
          />
        )}
        
        <h2 className="text-xl sm:text-2xl font-semibold mb-6">{getTitle()}</h2>
        
        {isLoadingGenre ? (
          <div className="text-center text-gray-400">Loading genre movies...</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-6">
            {getDisplayMovies().map((movie) => {
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
        )}
      </div>
    </div>
  )
}

export default Movies