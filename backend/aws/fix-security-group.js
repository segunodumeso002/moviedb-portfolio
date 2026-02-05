const AWS = require('aws-sdk');

const ec2 = new AWS.EC2({ region: 'us-east-1' });
const rds = new AWS.RDS({ region: 'us-east-1' });

const fixRDSSecurityGroup = async () => {
  try {
    console.log('🔍 Finding RDS instance security groups...');
    
    // Get RDS instance details
    const rdsResult = await rds.describeDBInstances({
      DBInstanceIdentifier: 'moviedb-postgres'
    }).promise();
    
    const dbInstance = rdsResult.DBInstances[0];
    const securityGroups = dbInstance.VpcSecurityGroups;
    
    console.log('📋 Security Groups:', securityGroups.map(sg => sg.GroupId));
    
    // Get your current IP
    const response = await fetch('https://api.ipify.org?format=json');
    const { ip } = await response.json();
    console.log('🌐 Your IP address:', ip);
    
    // Update security group rules
    for (const sg of securityGroups) {
      try {
        await ec2.authorizeSecurityGroupIngress({
          GroupId: sg.GroupId,
          IpPermissions: [{
            IpProtocol: 'tcp',
            FromPort: 5432,
            ToPort: 5432,
            IpRanges: [{
              CidrIp: `${ip}/32`,
              Description: 'Allow PostgreSQL access from current IP'
            }]
          }]
        }).promise();
        
        console.log(`✅ Added rule to security group ${sg.GroupId}`);
      } catch (error) {
        if (error.code === 'InvalidPermission.Duplicate') {
          console.log(`ℹ️ Rule already exists in ${sg.GroupId}`);
        } else {
          console.log(`⚠️ Error updating ${sg.GroupId}:`, error.message);
        }
      }
    }
    
    console.log('🎉 Security group updated! Try connecting again in 1-2 minutes.');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
};

fixRDSSecurityGroup();