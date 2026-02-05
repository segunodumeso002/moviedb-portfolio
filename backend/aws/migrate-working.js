const { Pool } = require('pg');

const step1_createUser = async () => {
  const pool = new Pool({
    host: 'moviedb-postgres.ckhec6syc2fy.us-east-1.rds.amazonaws.com',
    port: 5432,
    database: 'postgres',
    user: 'moviedb_admin',
    password: 'MovieDB2024!',
    ssl: { rejectUnauthorized: false },
  });

  try {
    const client = await pool.connect();
    console.log('✅ Connected to postgres database');
    
    await client.query(`CREATE USER moviedb_user WITH PASSWORD 'SecurePassword2024!';`);
    console.log('✅ Application user created');
    
    client.release();
  } catch (error) {
    if (error.message.includes('already exists')) {
      console.log('ℹ️ Application user already exists');
    } else {
      console.error('❌ Error creating user:', error.message);
    }
  } finally {
    await pool.end();
  }
};

const step2_createTables = async () => {
  const pool = new Pool({
    host: 'moviedb-postgres.ckhec6syc2fy.us-east-1.rds.amazonaws.com',
    port: 5432,
    database: 'moviedb',
    user: 'moviedb_admin',
    password: 'MovieDB2024!',
    ssl: { rejectUnauthorized: false },
  });

  try {
    const client = await pool.connect();
    console.log('✅ Connected to moviedb database');

    // Users table
    await client.query(`
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
    await client.query(`
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

    // Grant permissions
    await client.query(`
      GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO moviedb_user;
      GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO moviedb_user;
    `);
    console.log('✅ Permissions granted');

    client.release();
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
};

const runMigration = async () => {
  console.log('🚀 Starting AWS RDS Migration...');
  await step1_createUser();
  await step2_createTables();
  console.log('🎉 Migration completed!');
};

runMigration();