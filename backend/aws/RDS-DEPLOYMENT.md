# AWS RDS PostgreSQL Deployment Guide

## Prerequisites
- AWS CLI configured with appropriate permissions
- Node.js and npm installed
- AWS account with RDS permissions

## Step 1: Install Dependencies
```bash
cd backend
npm install
```

## Step 2: Configure AWS Credentials
```bash
aws configure
# Enter your AWS Access Key ID, Secret Access Key, and region (us-east-1)
```

## Step 3: Set Environment Variables
Update `.env.production` with your values:
```env
RDS_PASSWORD=YourSecurePassword123!
APP_DB_PASSWORD=YourAppPassword123!
JWT_SECRET=your-super-secure-jwt-secret-key
CORS_ORIGIN=https://your-frontend-domain.netlify.app
```

## Step 4: Create RDS Instance
```bash
# Set environment variables
export RDS_PASSWORD=YourSecurePassword123!

# Create RDS instance
node aws/rds-setup.js create
```

## Step 5: Wait for RDS Instance
```bash
# Check status (repeat until "available")
node aws/rds-setup.js status
```

## Step 6: Get RDS Endpoint
After the instance is available, note the endpoint from the status command and update `.env.production`:
```env
RDS_ENDPOINT=moviedb-postgres.xxxxxxxxx.us-east-1.rds.amazonaws.com
```

## Step 7: Run Production Migration
```bash
# Set all environment variables
export RDS_ENDPOINT=your-rds-endpoint.amazonaws.com
export RDS_PASSWORD=YourSecurePassword123!
export APP_DB_PASSWORD=YourAppPassword123!

# Run migration
node aws/migrate-production.js
```

## Step 8: Test Connection
```bash
# Test the database connection
psql -h your-rds-endpoint.amazonaws.com -U moviedb_admin -d moviedb
```

## Security Notes
- RDS instance is configured with SSL/TLS encryption
- Database passwords should be stored in AWS Secrets Manager for production
- Consider using VPC for additional security
- Enable automated backups (already configured)

## Cost Optimization
- Using db.t3.micro (free tier eligible)
- 20GB storage (free tier eligible)
- Consider stopping instance when not in use during development

## Next Steps
After RDS setup is complete:
1. Deploy Lambda functions
2. Update frontend API endpoints
3. Test full application flow