const { Pool } = require('pg');

const createTables = async (event) => {
  const pool = new Pool({
    host: process.env.RDS_ENDPOINT,
    port: 5432,
    database: 'moviedb',
    user: 'moviedb_admin',
    password: process.env.RDS_PASSWORD,
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log('🔗 Connecting to RDS...');
    
    // Users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        first_name VARCHAR(100),
        last_name VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Users table created');

    // Favorites table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS favorites (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        movie_id INTEGER NOT NULL,
        media_type VARCHAR(10) NOT NULL CHECK (media_type IN ('movie', 'tv')),
        title VARCHAR(255) NOT NULL,
        poster_path VARCHAR(255),
        vote_average DECIMAL(3,1),
        release_date DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, movie_id, media_type)
      )
    `);
    console.log('✅ Favorites table created');

    // Grant permissions to app user
    await pool.query(`
      GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO moviedb_user;
      GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO moviedb_user;
    `);
    console.log('✅ Permissions granted');
    
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, message: 'Database tables created!' })
    };
  } catch (error) {
    console.error('❌ Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: error.message })
    };
  } finally {
    await pool.end();
  }
};

module.exports = { createTables };
