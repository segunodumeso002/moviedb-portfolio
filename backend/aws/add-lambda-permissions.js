const AWS = require('aws-sdk');

const iam = new AWS.IAM({ region: 'us-east-1' });

const addLambdaPermissions = async () => {
  const userName = 'shophub-uploader';
  
  const policies = [
    'arn:aws:iam::aws:policy/AWSLambdaFullAccess',
    'arn:aws:iam::aws:policy/CloudFormationFullAccess',
    'arn:aws:iam::aws:policy/AmazonAPIGatewayAdministrator',
    'arn:aws:iam::aws:policy/IAMFullAccess'
  ];

  try {
    console.log('🔧 Adding Lambda deployment permissions...');
    
    for (const policyArn of policies) {
      try {
        await iam.attachUserPolicy({
          UserName: userName,
          PolicyArn: policyArn
        }).promise();
        
        const policyName = policyArn.split('/').pop();
        console.log(`✅ Added ${policyName}`);
      } catch (error) {
        if (error.code === 'EntityAlreadyExists') {
          console.log(`ℹ️ ${policyArn.split('/').pop()} already attached`);
        } else {
          console.log(`⚠️ Error attaching ${policyArn}:`, error.message);
        }
      }
    }
    
    console.log('🎉 Permissions updated! Try deploying again.');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
};

addLambdaPermissions();