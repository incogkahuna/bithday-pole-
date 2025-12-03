# Deploy to Vercel via GitHub (The Usual Way)

## Step 1: Push to GitHub

1. **Create a new repository on GitHub:**
   - Go to [github.com](https://github.com) and click "New repository"
   - Name it something like `mammoth-poll` or `birthday-pole`
   - Don't initialize with README (we already have one)
   - Click "Create repository"

2. **Push your code:**
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git branch -M main
   git push -u origin main
   ```
   (Replace YOUR_USERNAME and YOUR_REPO_NAME with your actual GitHub username and repo name)

## Step 2: Deploy to Vercel

1. **Go to Vercel:**
   - Visit [vercel.com](https://vercel.com)
   - Sign in (or create account if needed)
   - Click "Add New..." → "Project"

2. **Import from GitHub:**
   - Click "Import Git Repository"
   - Select your `mammoth-poll` repository
   - Click "Import"

3. **Configure (usually auto-detected):**
   - Framework Preset: **Next.js** (should be auto-detected)
   - Root Directory: `./` (default)
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)
   - Click "Deploy"

4. **Wait for deployment** (takes ~1-2 minutes)

## Step 3: Add Storage (One-time)

1. **After deployment completes:**
   - Go to your project dashboard on Vercel
   - Click the **Storage** tab
   - Click **Create Database**
   - Select **KV**
   - Name it (e.g., "mammoth-poll-kv")
   - Click **Create**
   - It will automatically link to your project!

2. **Redeploy** (if needed):
   - Go to **Deployments** tab
   - Click the three dots on the latest deployment
   - Click **Redeploy**

## Done! 🎉

Your poll is now live! Share the Vercel URL with your friends.

## Future Updates

Just push to GitHub and Vercel will auto-deploy:
```bash
git add .
git commit -m "Update poll"
git push
```

