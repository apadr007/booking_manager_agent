# ✦ Opportunity Finder

AI-powered speaking and networking opportunity tracker for Alex Padrón.

## Setup

### 1. Clone & install
```bash
git clone https://github.com/YOUR_USERNAME/opportunity-finder.git
cd opportunity-finder
npm install
```

### 2. Add your Anthropic API key
```bash
cp .env.local.example .env.local
```
Then edit `.env.local` and replace `sk-ant-your-key-here` with your real key from https://console.anthropic.com

### 3. Run locally
```bash
npm run dev
```
Open http://localhost:3000

---

## Deploy to Vercel

### Option A — Vercel dashboard (easiest)
1. Push this repo to GitHub
2. Go to https://vercel.com/new
3. Import the GitHub repo
4. Under **Environment Variables**, add:
   - Key: `ANTHROPIC_API_KEY`
   - Value: your Anthropic API key
5. Click Deploy

### Option B — Vercel CLI
```bash
npm i -g vercel
vercel
# Follow prompts, then add env var:
vercel env add ANTHROPIC_API_KEY
```

---

## How it works

- **`/src/app/api/claude/route.js`** — server-side API route that proxies requests to Anthropic. Your API key never reaches the browser.
- **`/src/components/OpportunityFinder.js`** — the main React component with both tables.
- Data is saved to `localStorage` in your browser.
- "Find New" uses Claude to generate fresh, upcoming opportunities relevant to your niche.
