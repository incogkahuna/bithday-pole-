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

## Deployment to Vercel (No GitHub Required!)

**Super Easy 3-Step Process:**

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Login and deploy:
```bash
vercel login
vercel
```

3. Add storage (one-time):
   - Go to your project on vercel.com
   - Click **Storage** → **Create Database** → **KV**
   - Create it and it auto-links!

That's it! Your poll is live. See `DEPLOY.md` for detailed instructions.

**Note:** The app automatically uses file storage locally and Vercel KV when deployed. No configuration needed!

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- React
- Modern CSS with gradient effects

