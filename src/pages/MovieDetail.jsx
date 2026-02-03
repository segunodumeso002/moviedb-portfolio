import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import tmdbService from '../services/tmdbService'

function MovieDetail() {
  const { id } = useParams()
  const [item, setItem] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  // Determine type from URL path
  const type = window.location.pathname.includes('/tv/') ? 'tv' : 'movie'

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        let data
        if (type === 'movie') {
          data = await tmdbService.getMovieDetails(id)
        } else {
          data = await tmdbService.getTVShowDetails(id)
        }
        setItem(data)
        setLoading(false)
      } catch (err) {
        setError(err.message)
        setLoading(false)
      }
    }

    fetchDetails()
  }, [type, id])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading details...</div>
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

  if (!item) return null

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <Link 
          to="/" 
          className="inline-block mb-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          ← Back to Home
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Poster */}
          <div className="lg:col-span-1">
            <img
              src={tmdbService.getImageURL(item.poster_path, 'w780')}
              alt={item.title || item.name}
              className="w-full rounded-lg shadow-lg"
            />
          </div>

          {/* Details */}
          <div className="lg:col-span-2">
            <h1 className="text-4xl font-bold mb-4">{item.title || item.name}</h1>
            
            <div className="flex flex-wrap gap-4 mb-6">
              <span className="px-3 py-1 bg-blue-600 rounded-full text-sm">
                {type === 'movie' ? 'Movie' : 'TV Show'}
              </span>
              <span className="px-3 py-1 bg-gray-700 rounded-full text-sm">
                ⭐ {item.vote_average?.toFixed(1)}/10
              </span>
              <span className="px-3 py-1 bg-gray-700 rounded-full text-sm">
                {item.release_date || item.first_air_date}
              </span>
              {item.runtime && (
                <span className="px-3 py-1 bg-gray-700 rounded-full text-sm">
                  {item.runtime} min
                </span>
              )}
            </div>

            {/* Genres */}
            {item.genres && item.genres.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2">Genres</h3>
                <div className="flex flex-wrap gap-2">
                  {item.genres.map((genre) => (
                    <span key={genre.id} className="px-2 py-1 bg-gray-800 rounded text-sm">
                      {genre.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Overview */}
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2">Overview</h3>
              <p className="text-gray-300 leading-relaxed">{item.overview}</p>
            </div>

            {/* Additional Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {item.budget && (
                <div>
                  <h4 className="font-semibold">Budget</h4>
                  <p className="text-gray-300">${item.budget.toLocaleString()}</p>
                </div>
              )}
              {item.revenue && (
                <div>
                  <h4 className="font-semibold">Revenue</h4>
                  <p className="text-gray-300">${item.revenue.toLocaleString()}</p>
                </div>
              )}
              {item.number_of_seasons && (
                <div>
                  <h4 className="font-semibold">Seasons</h4>
                  <p className="text-gray-300">{item.number_of_seasons}</p>
                </div>
              )}
              {item.number_of_episodes && (
                <div>
                  <h4 className="font-semibold">Episodes</h4>
                  <p className="text-gray-300">{item.number_of_episodes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MovieDetail