# 🚀 Deployment Guide - MovieDB
## Frontend: Netlify | Backend: AWS

## 📋 Deployment Strategy

**Frontend**: Netlify (Free tier - perfect for React apps)
**Backend**: AWS Lambda + API Gateway + RDS PostgreSQL
**Cost**: ~$0-5/month for portfolio usage

---

## 🎯 Phase 1: Frontend Deployment (Netlify)

### Step 1: Push to GitHub

```bash
# Initialize git (if not done)
git init
git add .
git commit -m "MovieDB Portfolio - Frontend ready for Netlify"

# Create GitHub repository and push
git remote add origin https://github.com/YOUR_USERNAME/moviedb-portfolio.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy to Netlify

1. **Go to Netlify**: [netlify.com](https://netlify.com)
2. **Sign up/Login** with GitHub
3. **New site from Git** → Choose GitHub
4. **Select repository**: `moviedb-portfolio`
5. **Build settings**:
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Node version: `18`

6. **Environment Variables** (Site settings → Environment variables):
   ```
   VITE_TMDB_API_KEY = 5f6612fae4ed6995b059fe008bf078af
   VITE_TMDB_BASE_URL = https://api.themoviedb.org/3
   VITE_TMDB_IMAGE_BASE_URL = https://image.tmdb.org/t/p/w500
   ```

7. **Deploy**: Click "Deploy site"

### Step 3: Get Your Live URL
- You'll get: `https://amazing-name-123456.netlify.app`
- **Custom domain** available (optional)

---

## 🔧 Phase 2: Backend Development & AWS Deployment

### Backend Architecture
```
AWS Lambda (Node.js/Express)
├── User Authentication (JWT)
├── Favorites API
├── Reviews & Ratings
├── User Profiles
└── PostgreSQL Database (AWS RDS)
```

### Step 1: Create Backend Structure

```bash
# Create backend folder
mkdir moviedb-backend
cd moviedb-backend

# Initialize Node.js project
npm init -y

# Install dependencies
npm install express cors helmet bcryptjs jsonwebtoken pg dotenv
npm install -D serverless serverless-offline
```

### Step 2: AWS Services Setup

#### A. RDS PostgreSQL Database
1. **AWS Console** → RDS
2. **Create database**:
   - Engine: PostgreSQL
   - Template: Free tier
   - DB instance: db.t3.micro
   - Storage: 20GB (free tier)
   - Username: `moviedb_admin`
   - Password: `[secure-password]`

#### B. Lambda + API Gateway
1. **Install Serverless Framework**:
```bash
npm install -g serverless
serverless create --template aws-nodejs --path moviedb-api
```

2. **Configure serverless.yml**:
```yaml
service: moviedb-api
provider:
  name: aws
  runtime: nodejs18.x
  region: us-east-1
functions:
  api:
    handler: handler.server
    events:
      - http:
          path: /{proxy+}
          method: ANY
          cors: true
```

### Step 3: Backend API Endpoints

```javascript
// Essential endpoints to build:
POST   /api/auth/register     # User registration
POST   /api/auth/login        # User login
GET    /api/user/profile      # Get user profile
POST   /api/favorites         # Add to favorites
GET    /api/favorites         # Get user favorites
DELETE /api/favorites/:id     # Remove from favorites
POST   /api/reviews           # Add movie review
GET    /api/reviews/:movieId  # Get movie reviews
```

### Step 4: Deploy Backend to AWS

```bash
# Deploy to AWS
serverless deploy

# Get API Gateway URL
# Example: https://abc123.execute-api.us-east-1.amazonaws.com/dev
```

### Step 5: Connect Frontend to Backend

Update Netlify environment variables:
```
VITE_API_BASE_URL = https://your-api-gateway-url.amazonaws.com/dev
```

---

## 💰 Cost Breakdown

### Netlify (Frontend)
- **Hosting**: Free (100GB bandwidth)
- **Build minutes**: Free (300 minutes/month)
- **Custom domain**: Free
- **Total**: $0/month

### AWS (Backend)
- **Lambda**: Free (1M requests/month)
- **API Gateway**: Free (1M calls/month)
- **RDS PostgreSQL**: Free tier (750 hours/month)
- **Data transfer**: Minimal costs
- **Total**: $0-5/month for portfolio usage

---

## 🎯 Development Phases

### ✅ Phase 1: Frontend Live (Current)
- Deploy React app to Netlify
- All current features working
- Professional URL for portfolio

### 🔄 Phase 2: Backend Development (Next)
- User authentication system
- Favorites API with database
- User reviews and ratings
- Profile management

### 🚀 Phase 3: Full-Stack Integration
- Connect frontend to backend
- User registration/login
- Persistent favorites across devices
- Social features (reviews, ratings)

---

## 📱 Immediate Benefits

**After Phase 1 (Netlify deployment)**:
- ✅ Professional live URL
- ✅ Mobile-responsive showcase
- ✅ All current features working
- ✅ Ready for job applications
- ✅ GitHub portfolio piece

**After Phase 2 (AWS backend)**:
- ✅ Full-stack developer showcase
- ✅ Database management skills
- ✅ API development experience
- ✅ Cloud deployment expertise
- ✅ Authentication implementation

---

## 🎉 Quick Start: Deploy Frontend Now

1. **Push to GitHub** (5 minutes)
2. **Deploy to Netlify** (5 minutes)
3. **Get live URL** (immediate)
4. **Update resume/LinkedIn** (immediate)

**Total time to live portfolio**: ~10 minutes

Ready to deploy your frontend to Netlify first?