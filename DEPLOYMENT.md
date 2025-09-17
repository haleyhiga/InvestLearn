# InvestLearn Deployment Guide

## Netlify Deployment (Frontend)

### Prerequisites
- GitHub repository: `https://github.com/haleyhiga/InvestLearn.git`
- Netlify account (free at netlify.com)

### Step 1: Deploy Frontend to Netlify

1. **Go to Netlify Dashboard**
   - Visit [netlify.com](https://netlify.com)
   - Sign up/Login with GitHub

2. **Create New Site from Git**
   - Click "New site from Git"
   - Choose "GitHub" as provider
   - Select your `InvestLearn` repository

3. **Configure Build Settings**
   - **Build command**: `npm run build`
   - **Publish directory**: `dist/public`
   - **Node version**: 18

4. **Set Environment Variables**
   - Go to Site settings → Environment variables
   - Add these variables:
     ```
     NODE_ENV=production
     VITE_API_URL=https://your-backend-url.herokuapp.com
     ```

### Step 2: Backend Deployment Options

Since Netlify doesn't support Node.js backends directly, you have several options:

#### Option A: Vercel (Recommended)
1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Vercel will auto-detect it's a Node.js app
4. Set environment variables:
   - `DATABASE_URL`
   - `SESSION_SECRET`
   - `OPENAI_API_KEY`

#### Option B: Railway
1. Go to [railway.app](https://railway.app)
2. Connect GitHub repository
3. Deploy the server folder
4. Set environment variables

#### Option C: Heroku
1. Go to [heroku.com](https://heroku.com)
2. Create new app
3. Connect GitHub repository
4. Set environment variables in Heroku dashboard

### Step 3: Update Frontend API URLs

After deploying the backend, update the frontend to use the production API URL:

1. **Update API calls** in your frontend code
2. **Set environment variable** `VITE_API_URL` in Netlify
3. **Redeploy** the frontend

### Step 4: Database Setup

1. **Supabase Production Database**
   - Use your existing Supabase project
   - Run migrations: `npm run db:migrate`
   - Update `DATABASE_URL` in your backend environment

2. **Environment Variables for Backend**
   ```
   DATABASE_URL=your-supabase-connection-string
   SESSION_SECRET=your-production-jwt-secret
   OPENAI_API_KEY=your-openai-api-key
   NODE_ENV=production
   ```

### Step 5: Domain Configuration

1. **Custom Domain** (Optional)
   - Go to Netlify Site settings
   - Add custom domain
   - Configure DNS settings

2. **SSL Certificate**
   - Netlify provides free SSL certificates
   - Automatically enabled for custom domains

## Production Checklist

- [ ] Frontend deployed to Netlify
- [ ] Backend deployed to Vercel/Railway/Heroku
- [ ] Environment variables configured
- [ ] Database migrations run
- [ ] API URLs updated
- [ ] SSL certificate active
- [ ] Custom domain configured (optional)
- [ ] Performance testing completed

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check Node.js version (use 18)
   - Verify all dependencies are in package.json
   - Check build logs in Netlify dashboard

2. **API Connection Issues**
   - Verify backend URL is correct
   - Check CORS settings
   - Ensure environment variables are set

3. **Database Connection Issues**
   - Verify DATABASE_URL is correct
   - Check Supabase project is active
   - Run database migrations

### Support

- Netlify Docs: https://docs.netlify.com/
- Vercel Docs: https://vercel.com/docs
- Railway Docs: https://docs.railway.app/
