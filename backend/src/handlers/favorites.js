const { query } = require('../utils/database');
const { success, error } = require('../utils/response');
const { verifyToken } = require('../middleware/auth');

const getFavorites = async (event) => {
  try {
    const user = await verifyToken(event);
    if (!user) return error('Unauthorized', 401);

    const result = await query(
      'SELECT movie_id, media_type, title, poster_path, vote_average, release_date FROM favorites WHERE user_id = $1 ORDER BY created_at DESC',
      [user.userId]
    );

    return success(result.rows);
  } catch (err) {
    return error('Failed to fetch favorites', 500);
  }
};

const addFavorite = async (event) => {
  try {
    const user = await verifyToken(event);
    if (!user) return error('Unauthorized', 401);

    const { movieId, mediaType, title, posterPath, voteAverage, releaseDate } = JSON.parse(event.body);

    if (!movieId || !mediaType || !title) {
      return error('Movie ID, media type, and title are required', 400);
    }

    await query(
      'INSERT INTO favorites (user_id, movie_id, media_type, title, poster_path, vote_average, release_date) VALUES ($1, $2, $3, $4, $5, $6, $7) ON CONFLICT (user_id, movie_id, media_type) DO NOTHING',
      [user.userId, movieId, mediaType, title, posterPath, voteAverage, releaseDate]
    );

    return success({ message: 'Added to favorites' });
  } catch (err) {
    return error('Failed to add favorite', 500);
  }
};

const removeFavorite = async (event) => {
  try {
    const user = await verifyToken(event);
    if (!user) return error('Unauthorized', 401);

    const { id } = event.pathParameters;
    const { mediaType } = event.queryStringParameters || {};

    await query(
      'DELETE FROM favorites WHERE user_id = $1 AND movie_id = $2 AND media_type = $3',
      [user.userId, id, mediaType || 'movie']
    );

    return success({ message: 'Removed from favorites' });
  } catch (err) {
    return error('Failed to remove favorite', 500);
  }
};

module.exports = { getFavorites, addFavorite, removeFavorite };