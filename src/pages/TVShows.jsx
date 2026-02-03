import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import tmdbService from '../services/tmdbService'
import GenreFilter from '../components/GenreFilter'
import FavoriteButton from '../components/FavoriteButton'

function TVShows() {
  const [tvShows, setTVShows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [selectedGenre, setSelectedGenre] = useState(null)
  const [genreShows, setGenreShows] = useState([])
  const [isLoadingGenre, setIsLoadingGenre] = useState(false)

  useEffect(() => {
    const fetchTVShows = async () => {
      try {
        const data = await tmdbService.getPopularTVShows()
        setTVShows(data.results)
        setLoading(false)
      } catch (err) {
        setError(err.message)
        setLoading(false)
      }
    }

    fetchTVShows()
  }, [])

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!searchQuery.trim()) return
    
    setIsSearching(true)
    try {
      const data = await tmdbService.searchMulti(searchQuery)
      setSearchResults(data.results.filter(item => item.media_type === 'tv'))
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
      setGenreShows([])
      return
    }

    setIsLoadingGenre(true)
    try {
      const data = await tmdbService.getTVShowsByGenre(genreId)
      setGenreShows(data.results)
    } catch (err) {
      setError(err.message)
    }
    setIsLoadingGenre(false)
  }

  const getDisplayShows = () => {
    if (searchResults.length > 0) return searchResults
    if (selectedGenre !== null) return genreShows
    return tvShows
  }

  const getTitle = () => {
    if (searchResults.length > 0) return `Search Results (${searchResults.length})`
    if (selectedGenre !== null) return `Genre TV Shows (${genreShows.length})`
    return 'Popular TV Shows'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading TV shows...</div>
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
        <h1 className="text-3xl sm:text-4xl font-bold text-center mb-8">TV Shows</h1>
        
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-8">
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search TV shows..."
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
            type="tv" 
            onGenreChange={handleGenreChange} 
            selectedGenre={selectedGenre}
          />
        )}
        
        <h2 className="text-xl sm:text-2xl font-semibold mb-6">{getTitle()}</h2>
        
        {isLoadingGenre ? (
          <div className="text-center text-gray-400">Loading genre shows...</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-6">
            {getDisplayShows().map((show) => {
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
        )}
      </div>
    </div>
  )
}

export default TVShows