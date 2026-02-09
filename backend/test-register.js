const https = require('https');

const data = JSON.stringify({
  email: 'testuser@example.com',
  password: 'TestPassword123!',
  firstName: 'Test',
  lastName: 'User'
});

const options = {
  hostname: 'smk2uspx3i.execute-api.us-east-1.amazonaws.com',
  port: 443,
  path: '/prod/auth/register',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = https.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  
  let body = '';
  res.on('data', (chunk) => {
    body += chunk;
  });
  
  res.on('end', () => {
    console.log('Response:', body);
    try {
      const parsed = JSON.parse(body);
      console.log('Parsed:', JSON.stringify(parsed, null, 2));
    } catch (e) {
      console.log('Could not parse response');
    }
  });
});

req.on('error', (error) => {
  console.error('Error:', error);
});

req.write(data);
req.end();
