const { Pool } = require('pg');

const testConnection = async () => {
  console.log('🔍 Testing RDS connection...');
  console.log('Host:', 'moviedb-postgres.ckhec6syc2fy.us-east-1.rds.amazonaws.com');
  console.log('Port:', 5432);
  console.log('Database:', 'moviedb');
  console.log('User:', 'moviedb_admin');
  
  const pool = new Pool({
    host: 'moviedb-postgres.ckhec6syc2fy.us-east-1.rds.amazonaws.com',
    port: 5432,
    database: 'moviedb',
    user: 'moviedb_admin',
    password: 'MovieDB2024!',
    ssl: false,
    connectionTimeoutMillis: 10000,
  });

  try {
    const client = await pool.connect();
    console.log('✅ Connection successful!');
    
    const result = await client.query('SELECT version()');
    console.log('📊 PostgreSQL version:', result.rows[0].version);
    
    client.release();
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    console.log('\n🔧 Possible solutions:');
    console.log('1. Check if RDS security group allows inbound connections on port 5432');
    console.log('2. Verify the master password is correct');
    console.log('3. Ensure "Public accessibility" is enabled');
  } finally {
    await pool.end();
  }
};

testConnection();