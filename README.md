# Mammoth Weekend Poll

A sleek, technical polling website for voting on the best weekend to visit Mammoth.

## Features

- Vote on preferred weekends through February 1st
- See real-time results with percentages
- View who voted for which dates
- Supplemental questions:
  - Can you drive up?
  - Do you have an Ikon pass?
  - Would you pitch in on a private jet flight?

## Getting Started

### Local Development

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Deployment to Vercel

**Option 1: Via GitHub (Recommended)**
1. Push to GitHub (see `GITHUB_DEPLOY.md` for details)
2. Import repo on [vercel.com](https://vercel.com)
3. Add Storage → Create Database → KV
4. Done!

**Option 2: Via CLI (No GitHub)**
1. `npm i -g vercel`
2. `vercel login && vercel`
3. Add Storage → Create Database → KV

See `DEPLOY.md` or `GITHUB_DEPLOY.md` for detailed instructions.

**Note:** The app automatically uses file storage locally and Vercel KV when deployed. No configuration needed!

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- React
- Modern CSS with gradient effects

