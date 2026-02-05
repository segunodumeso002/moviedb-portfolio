const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/dev';

class BackendService {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = localStorage.getItem('auth_token');
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(url, config);
    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || 'Request failed');
    }

    return data.data;
  }

  // Authentication
  async register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async login(credentials) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  // User Profile
  async getProfile() {
    return this.request('/user/profile');
  }

  async updateProfile(userData) {
    return this.request('/user/profile', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  // Favorites
  async getFavorites() {
    return this.request('/user/favorites');
  }

  async addFavorite(item) {
    return this.request('/user/favorites', {
      method: 'POST',
      body: JSON.stringify({
        movieId: item.id,
        mediaType: item.media_type || (item.title ? 'movie' : 'tv'),
        title: item.title || item.name,
        posterPath: item.poster_path,
        voteAverage: item.vote_average,
        releaseDate: item.release_date || item.first_air_date,
      }),
    });
  }

  async removeFavorite(movieId, mediaType = 'movie') {
    return this.request(`/user/favorites/${movieId}?mediaType=${mediaType}`, {
      method: 'DELETE',
    });
  }
}

export default new BackendService();