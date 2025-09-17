# Backend Deployment Guide for InvestLearn

## Quick Fix: Deploy Backend to Vercel

### Step 1: Deploy Backend to Vercel

1. **Go to Vercel:**
   - Visit [vercel.com](https://vercel.com)
   - Sign up/Login with GitHub

2. **Import Project:**
   - Click "New Project"
   - Import your `InvestLearn` repository
   - Vercel will auto-detect it's a Node.js project

3. **Configure Build Settings:**
   - **Framework Preset**: Other
   - **Root Directory**: Leave as root
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

4. **Set Environment Variables:**
   - Go to Project Settings → Environment Variables
   - Add these variables:
     ```
     DATABASE_URL=your-supabase-connection-string
     SESSION_SECRET=your-production-jwt-secret
     OPENAI_API_KEY=your-openai-api-key
     NODE_ENV=production
     ```

### Step 2: Update Frontend API URL

1. **Get Backend URL:**
   - After Vercel deployment, copy your backend URL
   - It will be something like: `https://investlearn-abc123.vercel.app`

2. **Update Netlify Environment Variables:**
   - Go to Netlify Dashboard → Site Settings → Environment Variables
   - Add: `VITE_API_URL=https://your-backend-url.vercel.app`
   - Redeploy the frontend

### Step 3: Test the Full Application

1. **Test Login:**
   - Go to your Netlify frontend URL
   - Try to register/login
   - Should now work with the backend!

2. **Test All Features:**
   - Learning modules
   - AI chatbot
   - Progress tracking
   - All should work now!

## Alternative: Railway Deployment

If Vercel doesn't work, try Railway:

1. **Go to Railway:**
   - Visit [railway.app](https://railway.app)
   - Sign up with GitHub

2. **Deploy:**
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository
   - Railway will auto-detect the Node.js app

3. **Set Environment Variables:**
   - Same as Vercel above

4. **Get URL:**
   - Railway will give you a URL like: `https://investlearn-production.up.railway.app`

## Troubleshooting

### Common Issues:

1. **CORS Errors:**
   - Make sure your backend has CORS enabled
   - Check that the frontend URL is allowed

2. **Database Connection:**
   - Verify your Supabase connection string
   - Make sure the database is accessible

3. **Environment Variables:**
   - Double-check all environment variables are set
   - Make sure there are no typos

### Quick Test:

1. **Test Backend Directly:**
   - Visit: `https://your-backend-url.vercel.app/api/modules`
   - Should return JSON data (or auth error, which is expected)

2. **Test Frontend:**
   - Visit your Netlify URL
   - Try to register a new account
   - Should work now!

## Next Steps After Deployment:

1. **Set up custom domain** (optional)
2. **Configure SSL certificates** (automatic)
3. **Set up monitoring** (optional)
4. **Configure backups** (optional)

Your app should now be fully functional! 🎉
