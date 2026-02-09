const { Pool } = require('pg');

const fixPermissions = async (event) => {
  const pool = new Pool({
    host: process.env.RDS_ENDPOINT,
    port: 5432,
    database: 'moviedb',
    user: 'moviedb_admin',
    password: process.env.RDS_PASSWORD || 'MovieDB2024!',
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log('🔗 Connecting to RDS...');
    
    // Reset password for existing user
    await pool.query(`ALTER USER moviedb_user WITH PASSWORD '${process.env.APP_DB_PASSWORD}';`);
    console.log('✅ Password reset');

    // Grant permissions
    await pool.query(`
      GRANT ALL PRIVILEGES ON DATABASE moviedb TO moviedb_user;
      GRANT ALL PRIVILEGES ON SCHEMA public TO moviedb_user;
      GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO moviedb_user;
      GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO moviedb_user;
      ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO moviedb_user;
      ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO moviedb_user;
    `);
    
    console.log('✅ Permissions granted');
    
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, message: 'Database permissions fixed!' })
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

module.exports = { fixPermissions };
