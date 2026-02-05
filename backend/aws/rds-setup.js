const AWS = require('aws-sdk');

const rds = new AWS.RDS({ region: 'us-east-1' });

const createRDSInstance = async () => {
  const params = {
    DBInstanceIdentifier: 'moviedb-postgres',
    DBInstanceClass: 'db.t3.micro', // Free tier eligible
    Engine: 'postgres',
    EngineVersion: '15.4',
    MasterUsername: 'moviedb_admin',
    MasterUserPassword: process.env.RDS_PASSWORD || 'MovieDB2024!',
    AllocatedStorage: 20,
    StorageType: 'gp2',
    BackupRetentionPeriod: 7,
    MultiAZ: false,
    PubliclyAccessible: true,
    StorageEncrypted: true,
    DeletionProtection: false,
    DBName: 'moviedb'
  };

  try {
    console.log('🚀 Creating RDS PostgreSQL instance...');
    const result = await rds.createDBInstance(params).promise();
    console.log('✅ RDS instance creation initiated:', result.DBInstance.DBInstanceIdentifier);
    console.log('⏳ Instance will be available in 5-10 minutes');
    return result;
  } catch (error) {
    console.error('❌ Error creating RDS instance:', error.message);
    throw error;
  }
};

const checkInstanceStatus = async () => {
  try {
    const result = await rds.describeDBInstances({
      DBInstanceIdentifier: 'moviedb-postgres'
    }).promise();
    
    const instance = result.DBInstances[0];
    console.log(`📊 Status: ${instance.DBInstanceStatus}`);
    console.log(`🌐 Endpoint: ${instance.Endpoint?.Address || 'Not available yet'}`);
    console.log(`🔌 Port: ${instance.Endpoint?.Port || 'Not available yet'}`);
    
    return instance;
  } catch (error) {
    console.error('❌ Error checking instance status:', error.message);
  }
};

module.exports = { createRDSInstance, checkInstanceStatus };

if (require.main === module) {
  const action = process.argv[2];
  
  if (action === 'create') {
    createRDSInstance();
  } else if (action === 'status') {
    checkInstanceStatus();
  } else {
    console.log('Usage: node rds-setup.js [create|status]');
  }
}