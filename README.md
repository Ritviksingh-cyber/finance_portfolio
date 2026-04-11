# 📈 Portfolio Dashboard — Real-Time Indian Stock Tracker

A **production-oriented, full-stack portfolio tracking system** for Indian markets (NSE/BSE), designed to handle **real-world API constraints, rate limits, and failure scenarios** while delivering near real-time insights.

---

## 🚀 Live Demo

[http://finance-portfolio-toq4.vercel.app/]

---

## 🧠 Overview

Managing portfolios across NSE and BSE is fragmented and often locked behind paid tools. This project solves that by providing a **unified, real-time dashboard** with sector insights, portfolio analytics, and resilient data fetching.

> Designed with a **backend-first mindset**, focusing on reliability, batching, caching, and graceful degradation when working with third-party financial APIs.

---

## ✨ Core Features

### 📊 Portfolio Intelligence

* Real-time stock prices (CMP) via Twelve Data API
* Investment, present value, and gain/loss calculations
* Portfolio allocation (%) with sector-level aggregation

### 🔄 Live Updates

* Auto-refresh every 15 seconds
* Visual countdown timer for next update
* Controlled polling to avoid API overuse

### 🧩 Sector-Level Insights

* Grouped by sectors (Financial, Tech, Consumer, Power, etc.)
* Sector-wise investment, value, and returns
* Donut chart for allocation visualization

### 🟢 Resilient UI/UX

* Gain/Loss color coding (green/red)
* Skeleton loaders for smooth UX
* Fully responsive (mobile + desktop)

### 🛡 Failure Handling

* Per-stock fallback (partial failures don’t break UI)
* System-wide fallback (dashboard still renders on API failure)
* Error visibility without crashing the application

### 📤 Data Export

* Export portfolio to CSV for offline analysis

---

## ⚙️ System Architecture

```
Client (Next.js UI)
        ↓
Backend Layer (Next.js API Routes)
        ↓
External Data Source (Twelve Data API)
```

### Key Responsibilities

**Frontend**

* Rendering portfolio + charts
* Managing polling lifecycle
* UI state + memoization

**Backend Layer**

* Batching API requests
* Rate limiting protection
* Response normalization
* Server-side caching

**External API**

* Real-time market data (CMP)

---

## 🔌 Data Fetching Strategy

### Why Twelve Data?

* Yahoo Finance → unreliable for Indian IPs
* Google Finance → no stable API

👉 Twelve Data provides a **consistent and rate-limited free tier**

---

### ⚡ Optimization Techniques

* **Batching**

  * 26 stocks split into groups of 8 (API limit)

* **Throttling**

  * 500ms delay between batches to avoid rate limits

* **Caching**

  * 15-second server-side cache (TTL-based)
  * Prevents redundant API calls across client refreshes

* **Fallback Strategy**

  * Per-ticker error isolation
  * Last known value used when API fails

---

## 📊 Data Processing

Raw API data is transformed into:

* Investment = Price × Quantity
* Present Value = CMP × Quantity
* Gain/Loss = Present Value − Investment
* Portfolio Weight (%)
* Sector-wise aggregation

---

## 📁 Project Structure

```
portfolio-dashboard/
├── app/
│   ├── api/quotes/route.ts   # Backend: batching, caching, API orchestration
│   ├── page.tsx              # Main dashboard
│   └── globals.css
├── components/
│   ├── PortfolioTable.tsx
│   ├── SectorSection.tsx
│   ├── SectorChart.tsx
│   └── Skeleton.tsx
├── data/
│   └── portfolio.json        # Static portfolio (replaceable with DB)
├── lib/
│   └── utils.ts              # Data transformation logic
└── types/
    └── portfolio.ts
```

---

## 🛠 Tech Stack

| Layer     | Technology              |
| --------- | ----------------------- |
| Framework | Next.js 14 (App Router) |
| Language  | TypeScript              |
| Styling   | Tailwind CSS            |
| Tables    | @tanstack/react-table   |
| Charts    | Recharts                |
| Data API  | Twelve Data             |

---

## ⚡ Performance Optimizations

* Parallel API calls using batching
* Memoization to prevent unnecessary re-renders
* Server-side caching (TTL-based)
* Controlled polling (15s interval)
* Avoided recalculation during render cycles

---

## 🛡 Reliability & Fault Tolerance

* Graceful degradation on API failures
* Partial data rendering (no full UI crash)
* Backend-controlled data fetching (no client exposure)

> System is designed to **fail gracefully, not catastrophically**

---

## ⚠️ Known Limitations

* **No P/E Ratio / EPS**

  * Not available in Twelve Data free tier

* **Market Hours Dependency**

  * Updates only during NSE/BSE trading hours

* **API Rate Limits**

  * Free tier allows ~800 requests/day (~3.3 hours active usage)

---

## 🗺 Future Improvements

* Redis-based distributed caching (production scale)
* WebSocket streaming for low-latency updates
* Historical portfolio tracking (time-series DB)
* Alerting system (price thresholds, signals)
* Multi-user authentication & portfolio management
* Fundamentals data via NSE scraping or paid APIs

---

## ⚙️ Setup

### 1. Clone Repository

```bash
git clone https://github.com/yourusername/portfolio-dashboard.git
cd portfolio-dashboard
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Add API Key

Create `.env.local`:

```env
TWELVE_DATA_API_KEY=your_api_key_here
```

### 4. Run Locally

```bash
npm run dev
```

---

## 🚀 Deployment

```bash
npm install -g vercel
vercel
```

Add environment variable in Vercel:

```
TWELVE_DATA_API_KEY
```

---

## 🧠 Engineering Highlights

* Designed for **real-world API instability**
* Optimized for **rate-limited environments**
* Focused on **failure resilience over ideal conditions**
* Built with a **scalable backend mindset**, not just UI rendering

---

## 📌 Final Note

This project is not just a dashboard—it is a **resilient financial data system** that demonstrates:

* API orchestration
* Fault tolerance
* Performance optimization
* Production-oriented thinking

---

## ⭐ If you found this useful, consider starring the repo!
