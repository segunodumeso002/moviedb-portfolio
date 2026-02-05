# MovieDB Backend - Local Development Setup

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Setup PostgreSQL Database
```sql
-- Connect to PostgreSQL as superuser
CREATE DATABASE moviedb;
CREATE USER moviedb_user WITH PASSWORD 'password';
GRANT ALL PRIVILEGES ON DATABASE moviedb TO moviedb_user;
```

### 3. Configure Environment
Update `.env` file with your PostgreSQL credentials:
```env
DATABASE_URL=postgresql://moviedb_user:password@localhost:5432/moviedb
JWT_SECRET=your-super-secret-jwt-key-here
```

### 4. Run Database Migration
```bash
npm run migrate
```

### 5. Start Development Server
```bash
npm run dev
```

## 🧪 Test API Endpoints

### Authentication
```bash
# Register
curl -X POST http://localhost:3000/dev/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","firstName":"John","lastName":"Doe"}'

# Login
curl -X POST http://localhost:3000/dev/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### Favorites (requires token)
```bash
# Get favorites
curl -X GET http://localhost:3000/dev/user/favorites \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Add favorite
curl -X POST http://localhost:3000/dev/user/favorites \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"movieId":550,"mediaType":"movie","title":"Fight Club","posterPath":"/path.jpg","voteAverage":8.8}'
```

## 🚀 Deploy to AWS
```bash
npm run deploy
```