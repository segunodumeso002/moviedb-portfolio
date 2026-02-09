const { Pool } = require('pg');

// Environment detection
const isProduction = process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'prod';
const isMigration = process.argv[1] && process.argv[1].includes('migrate');

console.log('Database config - Environment:', { isProduction, isMigration, NODE_ENV: process.env.NODE_ENV });

// Database configuration
const getDatabaseConfig = () => {
  if (isProduction) {
    console.log('Using production database config');
    return {
      host: process.env.RDS_ENDPOINT,
      port: 5432,
      database: 'moviedb',
      user: 'moviedb_user',
      password: process.env.APP_DB_PASSWORD,
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 10000,
      idleTimeoutMillis: 30000
    };
  } else {
    console.log('Using local database config');
    return {
      user: isMigration ? 'postgres' : 'moviedb_user',
      host: 'localhost',
      database: 'moviedb',
      password: isMigration ? '!@#$AyoCode001' : 'password',
      port: 5432,
    };
  }
};

const pool = new Pool(getDatabaseConfig());

pool.on('error', (err) => {
  console.error('Unexpected database error:', err);
});

const query = async (text, params) => {
  const client = await pool.connect();
  try {
    const result = await client.query(text, params);
    return result;
  } catch (error) {
    console.error('Query error:', error);
    throw error;
  } finally {
    client.release();
  }
};

module.exports = { query, pool };