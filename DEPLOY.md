# Deployment Guide for Vercel (No GitHub Required!)

## Super Simple Deployment (3 Steps)

### Step 1: Install Vercel CLI
```bash
npm i -g vercel
```

### Step 2: Login and Deploy
```bash
vercel login
vercel
```
Follow the prompts - it's that simple!

### Step 3: Set up Storage (One-time setup)
1. After deployment, go to your project on [vercel.com](https://vercel.com)
2. Click on your project → **Storage** tab
3. Click **Create Database** → Select **KV**
4. Give it a name (e.g., "mammoth-poll-kv")
5. Click **Create**
6. Vercel will automatically link it to your project!

That's it! Your app will now work with persistent storage.

## Redeploy After Changes
```bash
vercel --prod
```

## Local Development

The app works locally with file-based storage (no setup needed):
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

**Note:** Votes are stored in `data/votes.json` locally. On Vercel, they're stored in KV automatically.

