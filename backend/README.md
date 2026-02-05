# MovieDB Backend - AWS Serverless Architecture

## 🏗️ Architecture Overview

### AWS Services Used
- **AWS Lambda**: Serverless functions for API endpoints
- **API Gateway**: REST API management and routing
- **RDS PostgreSQL**: Production database
- **AWS Cognito**: User authentication and authorization
- **AWS Systems Manager**: Environment variables and secrets

### Local Development
- **PostgreSQL**: Local database for development
- **Node.js**: Runtime environment
- **Express.js**: Web framework for Lambda functions

## 📁 Project Structure

```
backend/
├── src/
│   ├── handlers/          # Lambda function handlers
│   ├── services/          # Business logic services
│   ├── models/            # Database models
│   ├── middleware/        # Authentication middleware
│   └── utils/             # Utility functions
├── database/
│   ├── migrations/        # Database schema migrations
│   └── seeds/             # Initial data
├── serverless.yml         # Serverless Framework configuration
└── package.json           # Dependencies
```

## 🚀 Getting Started

1. Install dependencies
2. Setup local PostgreSQL database
3. Configure environment variables
4. Run database migrations
5. Start local development server
6. Deploy to AWS

## 🔧 Environment Variables

```env
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/moviedb
AWS_RDS_ENDPOINT=your-rds-endpoint.amazonaws.com

# AWS Cognito
COGNITO_USER_POOL_ID=your-user-pool-id
COGNITO_CLIENT_ID=your-client-id

# API Configuration
API_STAGE=dev
CORS_ORIGIN=http://localhost:5173
```