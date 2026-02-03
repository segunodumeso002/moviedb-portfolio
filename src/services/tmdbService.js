const API_KEY = '5f6612fae4ed6995b059fe008bf078af';
const BASE_URL = import.meta.env.VITE_TMDB_BASE_URL || 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = import.meta.env.VITE_TMDB_IMAGE_BASE_URL || 'https://image.tmdb.org/t/p/w500';

class TMDBService {
  async fetchFromAPI(endpoint) {
    if (!API_KEY) {
      throw new Error('TMDB API key not found. Check your .env.local file.');
    }
    
    const separator = endpoint.includes('?') ? '&' : '?';
    const url = `${BASE_URL}${endpoint}${separator}api_key=${API_KEY}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`TMDB API Error: ${response.status}`);
    }
    
    return response.json();
  }

  // Get popular movies
  async getPopularMovies(page = 1) {
    return this.fetchFromAPI(`/movie/popular?page=${page}`);
  }

  // Get popular TV shows
  async getPopularTVShows(page = 1) {
    return this.fetchFromAPI(`/tv/popular?page=${page}`);
  }

  // Search movies and TV shows
  async searchMulti(query, page = 1) {
    return this.fetchFromAPI(`/search/multi?query=${encodeURIComponent(query)}&page=${page}`);
  }

  // Get movie details
  async getMovieDetails(movieId) {
    return this.fetchFromAPI(`/movie/${movieId}`);
  }

  // Get TV show details
  async getTVShowDetails(tvId) {
    return this.fetchFromAPI(`/tv/${tvId}`);
  }

  // Get movies by genre
  async getMoviesByGenre(genreId, page = 1) {
    return this.fetchFromAPI(`/discover/movie?with_genres=${genreId}&page=${page}`);
  }

  // Get TV shows by genre
  async getTVShowsByGenre(genreId, page = 1) {
    return this.fetchFromAPI(`/discover/tv?with_genres=${genreId}&page=${page}`);
  }

  // Get genres
  async getMovieGenres() {
    return this.fetchFromAPI('/genre/movie/list');
  }

  async getTVGenres() {
    return this.fetchFromAPI('/genre/tv/list');
  }

  // Helper method to get full image URL
  getImageURL(path, size = 'w500') {
    if (!path) return null;
    return `https://image.tmdb.org/t/p/${size}${path}`;
  }
}

export default new TMDBService();