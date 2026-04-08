# 📈 Portfolio Dashboard

A real-time stock portfolio tracker for Indian markets (NSE/BSE), built with Next.js, TypeScript, and Tailwind CSS.

## 🚀 Live Demo
[Deploy link here after Vercel deployment]

---

## 💡 Why I Built This

Managing a stock portfolio across NSE and BSE is painful — most free tools either don't support Indian markets or require expensive subscriptions. I wanted a single dashboard that shows all my holdings, live prices, and sector-wise performance in one place.

---

## ✨ Features

- **Live stock prices** — fetches real-time CMP from Twelve Data API
- **Auto-refresh every 15s** — with a visual countdown timer
- **Sector grouping** — Financial, Technology, Consumer, Power, Others
- **Gain/Loss tracking** — color-coded green/red per stock and per sector
- **Portfolio allocation** — donut chart showing sector weights
- **Summary cards** — total invested, current value, overall return %
- **Graceful fallback** — shows last known prices if API is unavailable
- **Export to CSV** — download your holdings data
- **Responsive** — works on mobile and desktop

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Table | @tanstack/react-table |
| Charts | Recharts |
| Data | Twelve Data API |

---

## 📁 Project Structure

portfolio-dashboard/
├── app/
│   ├── api/quotes/route.ts   # backend — fetches live prices
│   ├── page.tsx              # main dashboard page
│   └── globals.css
├── components/
│   ├── PortfolioTable.tsx    # holdings table with sector groups
│   ├── SectorSection.tsx     # individual sector rows
│   ├── SectorChart.tsx       # donut pie chart
│   └── Skeleton.tsx          # loading state
├── data/
│   └── portfolio.json        # your stock holdings
├── lib/
│   └── utils.ts              # helpers: enrichStock, groupBySector
└── types/
└── portfolio.ts          # TypeScript interfaces


---

## ⚙️ Setup

### 1. Clone the repo

```bash
git clone https://github.com/yourusername/portfolio-dashboard.git
cd portfolio-dashboard
```

### 2. Install dependencies

```bash
npm install
```

### 3. Get a free API key

Sign up at [twelvedata.com](https://twelvedata.com/register) — free tier gives 800 requests/day, enough for live updates during market hours.

### 4. Add your API key

Create `.env.local` in the project root:
TWELVE_DATA_API_KEY=your_key_here


### 5. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🔌 API Strategy

Yahoo Finance has no official public API. I initially tried the `yahoo-finance2` npm package but hit consistent rate limiting from Indian IPs. Switched to **Twelve Data** which provides a reliable free tier for Indian market data.

**Key decisions:**
- **Batching** — 26 stocks split into groups of 8 (free tier limit per request)
- **500ms delay** between batches to avoid rate limiting
- **15s server-side cache** — prevents API hammering on every client refresh
- **Per-ticker fallback** — if one stock fails, others still load correctly
- **NSE format** — `NSE:HDFCBANK`, BSE format — `BSE:532174`

---

## ⚠️ Known Limitations

- **P/E Ratio and EPS** — Twelve Data free tier doesn't include fundamentals. Currently shown as `—`. Would require a paid plan or direct NSE scraping.
- **Market hours** — prices only update during NSE/BSE trading hours (9:15 AM – 3:30 PM IST). Outside hours, last traded price is shown.
- **Free tier limits** — 800 API calls/day. At one refresh per 15 seconds, this covers ~3.3 hours of active use per day.

---

## 🗺 What I'd Add Next

- [ ] Per-stock price history chart (click to expand)
- [ ] WebSockets for true real-time updates instead of polling
- [ ] P/E and EPS via NSE website scraping
- [ ] Redis cache (survives server restarts, better for production)
- [ ] Alert when a stock crosses a target price

---

## 🚀 Deploy to Vercel

```bash
npm install -g vercel
vercel
```

Add `TWELVE_DATA_API_KEY` in your Vercel project's Environment Variables settings.

---
