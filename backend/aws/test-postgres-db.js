const { Pool } = require('pg');

const testPostgresDB = async () => {
  console.log('🔍 Testing connection to postgres database...');
  
  const pool = new Pool({
    host: 'moviedb-postgres.ckhec6syc2fy.us-east-1.rds.amazonaws.com',
    port: 5432,
    database: 'postgres', // Default database
    user: 'moviedb_admin',
    password: 'MovieDB2024!',
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 10000,
  });

  try {
    const client = await pool.connect();
    console.log('✅ Connected to postgres database!');
    
    // Create moviedb database
    await client.query('CREATE DATABASE moviedb');
    console.log('✅ Created moviedb database');
    
    client.release();
    await pool.end();
    
    // Now connect to moviedb database
    const moviedbPool = new Pool({
      host: 'moviedb-postgres.ckhec6syc2fy.us-east-1.rds.amazonaws.com',
      port: 5432,
      database: 'moviedb',
      user: 'moviedb_admin',
      password: 'MovieDB2024!',
      ssl: { rejectUnauthorized: false },
    });
    
    const moviedbClient = await moviedbPool.connect();
    console.log('✅ Connected to moviedb database!');
    moviedbClient.release();
    await moviedbPool.end();
    
    return true;
  } catch (error) {
    console.error('❌ Error:', error.message);
    await pool.end();
    return false;
  }
};

testPostgresDB();