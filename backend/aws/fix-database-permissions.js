const { Pool } = require('pg');

const fixDatabasePermissions = async () => {
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
    
    // Drop and recreate user to ensure clean state
    await pool.query(`DROP USER IF EXISTS moviedb_user;`);
    console.log('✅ Dropped existing user (if any)');
    
    // Create application user
    await pool.query(`CREATE USER moviedb_user WITH PASSWORD '${process.env.APP_DB_PASSWORD || 'SecurePassword2024!'}';`);
    console.log('✅ Application user created');

    // Grant all necessary permissions
    await pool.query(`
      GRANT ALL PRIVILEGES ON DATABASE moviedb TO moviedb_user;
      GRANT ALL PRIVILEGES ON SCHEMA public TO moviedb_user;
      GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO moviedb_user;
      GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO moviedb_user;
      ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO moviedb_user;
      ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO moviedb_user;
    `);
    
    console.log('✅ All permissions granted to moviedb_user');
    console.log('✅ Database setup complete!');
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
};

if (require.main === module) {
  fixDatabasePermissions().then(() => process.exit(0));
}

module.exports = fixDatabasePermissions;
