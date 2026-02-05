const { query } = require('../utils/database');
const { success, error } = require('../utils/response');
const { verifyToken } = require('../middleware/auth');

const getProfile = async (event) => {
  try {
    const user = await verifyToken(event);
    if (!user) return error('Unauthorized', 401);

    const result = await query(
      'SELECT id, email, first_name, last_name, created_at FROM users WHERE id = $1',
      [user.userId]
    );

    if (result.rows.length === 0) {
      return error('User not found', 404);
    }

    const userProfile = result.rows[0];
    return success({
      id: userProfile.id,
      email: userProfile.email,
      firstName: userProfile.first_name,
      lastName: userProfile.last_name,
      createdAt: userProfile.created_at
    });
  } catch (err) {
    return error('Failed to fetch profile', 500);
  }
};

const updateProfile = async (event) => {
  try {
    const user = await verifyToken(event);
    if (!user) return error('Unauthorized', 401);

    const { firstName, lastName } = JSON.parse(event.body);

    const result = await query(
      'UPDATE users SET first_name = $1, last_name = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING id, email, first_name, last_name',
      [firstName, lastName, user.userId]
    );

    if (result.rows.length === 0) {
      return error('User not found', 404);
    }

    const updatedUser = result.rows[0];
    return success({
      id: updatedUser.id,
      email: updatedUser.email,
      firstName: updatedUser.first_name,
      lastName: updatedUser.last_name
    });
  } catch (err) {
    return error('Failed to update profile', 500);
  }
};

module.exports = { getProfile, updateProfile };