# 🚀 AWS Deployment Guide - MovieDB

## Prerequisites
- AWS Account (Free Tier)
- GitHub Account
- Your project pushed to GitHub

## Step 1: Push to GitHub

1. **Initialize Git** (if not already done):
```bash
git init
git add .
git commit -m "Initial commit - MovieDB Portfolio Project"
```

2. **Create GitHub Repository**:
   - Go to GitHub.com
   - Click "New Repository"
   - Name: `moviedb-portfolio`
   - Make it Public (for free deployment)
   - Don't initialize with README (you already have files)

3. **Push to GitHub**:
```bash
git remote add origin https://github.com/YOUR_USERNAME/moviedb-portfolio.git
git branch -M main
git push -u origin main
```

## Step 2: Deploy with AWS Amplify

1. **Go to AWS Amplify Console**:
   - Login to AWS Console
   - Search for "Amplify"
   - Click "AWS Amplify"

2. **Create New App**:
   - Click "New app" → "Host web app"
   - Choose "GitHub"
   - Authorize AWS Amplify to access your GitHub

3. **Select Repository**:
   - Choose your `moviedb-portfolio` repository
   - Branch: `main`
   - Click "Next"

4. **Configure Build Settings**:
   - App name: `moviedb-portfolio`
   - Environment: `production`
   - Build settings should auto-detect (uses amplify.yml)
   - Click "Next"

5. **Environment Variables**:
   - Click "Advanced settings"
   - Add environment variables:
     ```
     VITE_TMDB_API_KEY = 5f6612fae4ed6995b059fe008bf078af
     VITE_TMDB_BASE_URL = https://api.themoviedb.org/3
     VITE_TMDB_IMAGE_BASE_URL = https://image.tmdb.org/t/p/w500
     ```

6. **Deploy**:
   - Review settings
   - Click "Save and deploy"
   - Wait 3-5 minutes for deployment

## Step 3: Get Your Live URL

After deployment completes:
- You'll get a URL like: `https://main.d1234567890.amplifyapp.com`
- Your app is now live and accessible worldwide!

## Step 4: Custom Domain (Optional)

If you have a custom domain:
1. Go to "Domain management" in Amplify
2. Add your domain
3. Follow DNS configuration steps

## 🎯 Portfolio Benefits

✅ **Professional URL** - Share with employers
✅ **Auto-deployments** - Updates when you push to GitHub  
✅ **HTTPS Enabled** - Secure by default
✅ **Global CDN** - Fast loading worldwide
✅ **Mobile Optimized** - Perfect responsive design
✅ **Free Hosting** - No monthly costs

## 📊 AWS Free Tier Limits
- **Build minutes**: 1000/month (plenty for portfolio)
- **Storage**: 15GB (more than enough)
- **Data transfer**: 15GB/month
- **Cost**: $0 for typical portfolio usage

## 🔄 Future Updates

To update your live app:
1. Make changes locally
2. Push to GitHub: `git push`
3. Amplify auto-deploys in 2-3 minutes

## 🎉 Success!

Your MovieDB app is now:
- ✅ Live on AWS
- ✅ Professional portfolio piece
- ✅ Mobile-responsive
- ✅ Feature-complete
- ✅ Ready for job applications

**Next Steps**: Add this URL to your resume and LinkedIn!