const { Pool } = require('pg');

const testPasswords = async () => {
  const passwords = [
    'MovieDB2024!',
    'moviedb2024!',
    'password',
    'Password123!',
    'admin123',
    'postgres'
  ];

  for (const password of passwords) {
    console.log(`🔍 Testing password: ${password.replace(/./g, '*')}`);
    
    const pool = new Pool({
      host: 'moviedb-postgres.ckhec6syc2fy.us-east-1.rds.amazonaws.com',
      port: 5432,
      database: 'moviedb',
      user: 'moviedb_admin',
      password: password,
      ssl: false,
      connectionTimeoutMillis: 5000,
    });

    try {
      const client = await pool.connect();
      console.log(`✅ SUCCESS! Password works: ${password}`);
      client.release();
      await pool.end();
      return password;
    } catch (error) {
      console.log(`❌ Failed: ${error.message.substring(0, 50)}...`);
      await pool.end();
    }
  }
  
  console.log('\n🤔 None of the common passwords worked.');
  console.log('Please check what password you set when creating the RDS instance.');
};

testPasswords();