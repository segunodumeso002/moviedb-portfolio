const { Pool } = require('pg');

const createProductionTables = async () => {
  const pool = new Pool({
    host: process.env.RDS_ENDPOINT || 'moviedb-postgres.ckhec6syc2fy.us-east-1.rds.amazonaws.com',
    port: 5432,
    database: 'moviedb',
    user: 'moviedb_admin',
    password: process.env.RDS_PASSWORD || 'MovieDB2024!',
    ssl: false
  });

  try {
    console.log('🔗 Connecting to AWS RDS PostgreSQL...');
    
    // Create application user
    await pool.query(`
      CREATE USER moviedb_user WITH PASSWORD '${process.env.APP_DB_PASSWORD || 'SecurePassword2024!'}';
    `);
    console.log('✅ Application user created');

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

    // Grant permissions
    await pool.query(`
      GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO moviedb_user;
      GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO moviedb_user;
    `);

    console.log('✅ Production database tables created successfully');
    console.log('✅ Permissions granted to application user');
  } catch (error) {
    console.error('❌ Error setting up production database:', error);
  } finally {
    await pool.end();
  }
};

if (require.main === module) {
  createProductionTables().then(() => process.exit(0));
}

module.exports = createProductionTables;