import { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'
import backendService from '../services/backendService'

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
  const [loading, setLoading] = useState(false)
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    if (isAuthenticated) {
      loadFavorites()
    } else {
      // Load from localStorage for non-authenticated users
      const savedFavorites = localStorage.getItem('moviedb-favorites')
      if (savedFavorites) {
        try {
          setFavorites(JSON.parse(savedFavorites))
        } catch (error) {
          console.error('Error loading favorites:', error)
          setFavorites([])
        }
      }
    }
  }, [isAuthenticated])

  const loadFavorites = async () => {
    if (!isAuthenticated) return
    
    setLoading(true)
    try {
      const userFavorites = await backendService.getFavorites()
      setFavorites(userFavorites.map(fav => ({
        id: fav.movie_id,
        media_type: fav.media_type,
        title: fav.title,
        poster_path: fav.poster_path,
        vote_average: fav.vote_average,
        release_date: fav.release_date
      })))
    } catch (error) {
      console.error('Error loading favorites:', error)
    }
    setLoading(false)
  }

  const addToFavorites = async (item) => {
    if (isAuthenticated) {
      try {
        await backendService.addFavorite(item)
        setFavorites(prev => [...prev, item])
      } catch (error) {
        console.error('Error adding favorite:', error)
      }
    } else {
      // Fallback to localStorage for non-authenticated users
      const newFavorites = [...favorites, item]
      setFavorites(newFavorites)
      localStorage.setItem('moviedb-favorites', JSON.stringify(newFavorites))
    }
  }

  const removeFromFavorites = async (id, mediaType = 'movie') => {
    if (isAuthenticated) {
      try {
        await backendService.removeFavorite(id, mediaType)
        setFavorites(prev => prev.filter(item => item.id !== id))
      } catch (error) {
        console.error('Error removing favorite:', error)
      }
    } else {
      // Fallback to localStorage for non-authenticated users
      const newFavorites = favorites.filter(item => item.id !== id)
      setFavorites(newFavorites)
      localStorage.setItem('moviedb-favorites', JSON.stringify(newFavorites))
    }
  }

  const isFavorite = (id) => {
    return favorites.some(item => item.id === id)
  }

  const toggleFavorite = async (item) => {
    if (isFavorite(item.id)) {
      await removeFromFavorites(item.id, item.media_type)
    } else {
      await addToFavorites(item)
    }
  }

  return (
    <FavoritesContext.Provider value={{
      favorites,
      loading,
      addToFavorites,
      removeFromFavorites,
      isFavorite,
      toggleFavorite,
      loadFavorites
    }}>
      {children}
    </FavoritesContext.Provider>
  )
}