import { createContext, useContext, useState, useEffect } from 'react'

const FavoritesContext = createContext()

export const useFavorites = () => {
  const context = useContext(FavoritesContext)
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider')
  }
  return context
}

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([])

  useEffect(() => {
    const savedFavorites = localStorage.getItem('moviedb-favorites')
    if (savedFavorites) {
      try {
        setFavorites(JSON.parse(savedFavorites))
      } catch (error) {
        console.error('Error loading favorites:', error)
        setFavorites([])
      }
    }
  }, [])

  const addToFavorites = (item) => {
    const newFavorites = [...favorites, item]
    setFavorites(newFavorites)
    localStorage.setItem('moviedb-favorites', JSON.stringify(newFavorites))
  }

  const removeFromFavorites = (id) => {
    const newFavorites = favorites.filter(item => item.id !== id)
    setFavorites(newFavorites)
    localStorage.setItem('moviedb-favorites', JSON.stringify(newFavorites))
  }

  const isFavorite = (id) => {
    return favorites.some(item => item.id === id)
  }

  const toggleFavorite = (item) => {
    if (isFavorite(item.id)) {
      removeFromFavorites(item.id)
    } else {
      addToFavorites(item)
    }
  }

  return (
    <FavoritesContext.Provider value={{
      favorites,
      addToFavorites,
      removeFromFavorites,
      isFavorite,
      toggleFavorite
    }}>
      {children}
    </FavoritesContext.Provider>
  )
}