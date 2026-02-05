const jwt = require('jsonwebtoken');

const verifyToken = async (event) => {
  try {
    const authHeader = event.headers.Authorization || event.headers.authorization;
    if (!authHeader) return null;

    const token = authHeader.replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (error) {
    return null;
  }
};

module.exports = { verifyToken };