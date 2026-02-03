import { useFavorites } from '../context/FavoritesContext'

function FavoriteButton({ item, className = "" }) {
  const { isFavorite, toggleFavorite } = useFavorites()
  const favorite = isFavorite(item.id)

  const handleClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    toggleFavorite(item)
  }

  return (
    <button
      onClick={handleClick}
      className={`p-2 rounded-full transition-all duration-200 ${
        favorite 
          ? 'bg-red-600 text-white hover:bg-red-700' 
          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
      } ${className}`}
      title={favorite ? 'Remove from favorites' : 'Add to favorites'}
    >
      <svg 
        className="w-5 h-5 sm:w-6 sm:h-6" 
        fill={favorite ? 'currentColor' : 'none'} 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
        />
      </svg>
    </button>
  )
}

export default FavoriteButton