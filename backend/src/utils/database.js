const { Pool } = require('pg');

// Environment detection
const isProduction = process.env.NODE_ENV === 'production';
const isMigration = process.argv[1].includes('migrate');

// Database configuration
const getDatabaseConfig = () => {
  if (isProduction) {
    return {
      host: process.env.RDS_ENDPOINT,
      port: 5432,
      database: 'moviedb',
      user: 'moviedb_user',
      password: process.env.APP_DB_PASSWORD,
      ssl: { rejectUnauthorized: false }
    };
  } else {
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

const query = async (text, params) => {
  const client = await pool.connect();
  try {
    const result = await client.query(text, params);
    return result;
  } finally {
    client.release();
  }
};

module.exports = { query, pool };