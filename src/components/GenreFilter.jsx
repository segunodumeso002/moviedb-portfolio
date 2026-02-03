import { useState, useEffect } from 'react'

function GenreFilter({ type, onGenreChange, selectedGenre }) {
  const [genres, setGenres] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/genre/${type}/list?api_key=5f6612fae4ed6995b059fe008bf078af`
        )
        const data = await response.json()
        setGenres(data.genres)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching genres:', error)
        setLoading(false)
      }
    }

    fetchGenres()
  }, [type])

  if (loading) return <div className="text-gray-400">Loading genres...</div>

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-3">Filter by Genre</h3>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onGenreChange(null)}
          className={`px-3 py-1 rounded-full text-sm transition-colors ${
            selectedGenre === null
              ? 'bg-blue-600 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          All
        </button>
        {genres.map((genre) => (
          <button
            key={genre.id}
            onClick={() => onGenreChange(genre.id)}
            className={`px-3 py-1 rounded-full text-sm transition-colors ${
              selectedGenre === genre.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {genre.name}
          </button>
        ))}
      </div>
    </div>
  )
}

export default GenreFilter