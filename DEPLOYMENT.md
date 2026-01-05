# Product Management Dashboard - Backend Deployment Guide

## Deploy Backend to Render

### Step 1: Prepare Render Account
1. Go to [render.com](https://render.com) and sign up/login
2. Click "New +" and select "Web Service"

### Step 2: Connect Repository
1. Connect your GitHub account
2. Select repository: `orzbirou/products-management-dashboard`
3. Click "Connect"

### Step 3: Configure Web Service
Fill in the following details:

- **Name**: `products-management-api` (or your preferred name)
- **Region**: Choose closest to you
- **Branch**: `main`
- **Root Directory**: `server`
- **Runtime**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Instance Type**: `Free`

### Step 4: Environment Variables
Add the following environment variable:
- Key: `NODE_ENV`
- Value: `production`

### Step 5: Deploy
1. Click "Create Web Service"
2. Wait for deployment (2-3 minutes)
3. Copy your service URL (e.g., `https://products-management-api.onrender.com`)

### Step 6: Update Angular Environment
1. Open `client/src/environments/environment.ts`
2. Replace `YOUR_RENDER_URL_HERE` with your Render URL:
   ```typescript
   export const environment = {
     production: true,
     apiUrl: 'https://products-management-api.onrender.com/api'
   };
   ```
3. Commit and push changes

### Step 7: Test
Your GitHub Pages site will now connect to the deployed backend!

## Alternative: Deploy to Railway

1. Go to [railway.app](https://railway.app)
2. Click "Start a New Project"
3. Select "Deploy from GitHub repo"
4. Choose your repository
5. Set root directory to `server`
6. Railway will auto-detect Node.js and deploy
7. Copy the URL and update Angular environment

## Note
**Important**: Free tier services may have cold starts (15-30 seconds delay on first request after inactivity).
