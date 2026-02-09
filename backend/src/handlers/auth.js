const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { query } = require('../utils/database');
const { success, error } = require('../utils/response');

const register = async (event) => {
  try {
    console.log('Register function started');
    console.log('Environment:', { 
      NODE_ENV: process.env.NODE_ENV,
      RDS_ENDPOINT: process.env.RDS_ENDPOINT,
      JWT_SECRET: process.env.JWT_SECRET ? 'SET' : 'NOT SET'
    });

    const { email, password, firstName, lastName } = JSON.parse(event.body);

    if (!email || !password) {
      return error('Email and password are required', 400);
    }

    // Check if user exists
    const existingUser = await query('SELECT id FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return error('User already exists', 409);
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    const result = await query(
      'INSERT INTO users (email, password_hash, first_name, last_name) VALUES ($1, $2, $3, $4) RETURNING id, email, first_name, last_name',
      [email, passwordHash, firstName, lastName]
    );

    const user = result.rows[0];
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    return success({ user, token });
  } catch (err) {
    console.error('Registration error:', err);
    console.error('Error stack:', err.stack);
    return error(`Registration failed: ${err.message}`, 500);
  }
};

const login = async (event) => {
  try {
    console.log('Login function started');
    const { email, password } = JSON.parse(event.body);

    if (!email || !password) {
      return error('Email and password are required', 400);
    }

    // Find user
    const result = await query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return error('Invalid credentials', 401);
    }

    const user = result.rows[0];

    // Verify password
    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      return error('Invalid credentials', 401);
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    return success({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name
      },
      token
    });
  } catch (err) {
    console.error('Login error:', err);
    console.error('Error stack:', err.stack);
    return error(`Login failed: ${err.message}`, 500);
  }
};

module.exports = { register, login };