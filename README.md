# NIVARA — Automated Indian Stock Investing Platform

> **"Invest with a plan. Understand every decision. Track your progress."**

NIVARA is a premium, preference-based automated stock-investing web application built for ordinary people in India who want to build long-term wealth in equities (NSE/BSE) without the complexity, stress, and noise of manual day-trading.

---

## 1. Academic & College Demonstration Disclaimer

**THIS PLATFORM IS AN EDUCATIONAL DEMONSTRATION BUILT FOR ACADEMIC EVALUATION.**
- **No Real Capital:** All portfolio values, cash balances, and investment amounts operate within a local, simulated ledger. Zero real deposits, bank transfers, or withdrawals are accepted.
- **No Brokerage Execution:** No real stock purchase or sale orders are placed or routed to the National Stock Exchange of India (NSE) or the Bombay Stock Exchange (BSE).
- **Illustrative Market Data:** Stock symbols (Reliance, TCS, HDFC Bank, Infosys, LT, etc.), prices, and fundamentals are realistic sample approximations.
- **Not SEBI Registered:** NIVARA does not provide certified financial advice and is not registered with the Securities and Exchange Board of India (SEBI).

---

## 2. Implemented Features & Capabilities

### Public Experience
- **Brand Identity & Landing Page (`/`):** Conversion-focused homepage detailing the product promise, problem with investing alone, 3-step workflow, interactive sample allocation preview, explainable investing pillars, FAQs, and demo disclosures.
- **How It Works (`/how-it-works`):** Comprehensive breakdown of preference ingestion, deterministic MPT-based allocation, simulated automated contributions, and rebalancing drift control.
- **Investment Philosophy (`/investment-approach`):** Four pillars of the NIVARA engine (single-stock caps, sector diversification, beta/volatility scoring, threshold rebalancing) and beginner glossary.
- **Safety & Disclosures (`/safety`):** Transparent explanation of demo boundaries, privacy, and non-negotiable simulation rules.
- **Authentication Flows (`/login`, `/signup`, `/forgot-password`):** Complete demo authentication with validation, password reveal toggles, and a **"Quick Demo Evaluation Login"** button for instant evaluation without typing.

### Authenticated Application
- **Guided Onboarding Questionnaire (`/onboarding`):** Multi-step questionnaire collecting financial goals, time horizon, risk profile, preferred Indian sectors, contribution amount, and simulated frequency. Displays instant allocation proposal before dashboard transition.
- **Executive Investor Dashboard (`/dashboard`):** 
  - Real-time simulated portfolio value, total invested, cash balance, and percentage returns.
  - Interactive Recharts area chart with timeframe toggles (1M, 3M, 6M, 1Y, ALL).
  - Active investment plan card with one-click **"Run Demo Contribution"** and Pause/Resume controls.
  - Asset & sector breakdown donut chart.
  - Holdings table, ledger activity stream, and goal tracking preview.
- **Deep Portfolio & Holdings (`/portfolio`):** Full holdings breakdown with actual vs target weighting, individual share quantities, average buy prices, live P&L, sector filter chips, and concentration alerts.
- **Indian Equities Market Discovery (`/markets`):** Explore 20+ realistic Indian equities across 7 sectors (Technology, Banking & Finance, Energy & Utilities, Healthcare, Consumer Goods, Industrials, Automobile) with live search, NSE/BSE exchange toggle, sector filters, sorting, and one-click watchlist stars.
- **Stock Detail Pages (`/stocks/[symbol]`):** Dedicated deep-dive for every security featuring historical price charts, sample valuation multiples (P/E, P/B, Dividend Yield, Beta, 52W High/Low), algorithmic selection rationale, and identified risk factors.
- **Investment Plan Manager (`/investment-plan`):** Inspect active plan parameters, execute automated recurring contributions, simulate one-click rebalancing, pause/resume, or stop plan.
- **Interactive Plan Creator (`/investment-plan/create`):** Real-time deterministic allocation generator enforcing single-stock concentration caps (&le;25%), sector exclusions, and rebalancing thresholds, guaranteed to sum to exactly 100%.
- **Simulated Cash Ledger & Funding Modal:** Instant top-up flow with preset quick-picks (₹10,000 to ₹1,00,000), simulated NetBanking/UPI confirmation, and transaction receipts.
- **Activity & Audit Trail (`/activity`):** Chronological ledger recording all simulated deposits, automated SIPs, rebalance adjustments, and plan events with filterable receipt dialogs.
- **Portfolio Health & Insights (`/insights`):** Herfindahl-Hirschman Index (HHI) diversification scoring, single-stock and sector exposure checks, plain-language decision explanations, and interactive macroeconomic scenario stress testing.
- **Financial Goals Tracker (`/goals`):** Goal progress visualizer (Wealth Creation, Retirement Corpus, Emergency Buffer) with monthly contribution projections.
- **Notifications Center (`/notifications`):** Real-time alerts for plan executions, drift warnings, and market recaps with read/unread filters.
- **Investor Profile (`/profile`):** Personal details, Tier 1 Demo Verified KYC status, and masked PAN simulation.
- **Settings & Reset (`/settings`):** Indian currency notation preferences, notification triggers, and a **"Reset All Demo Data"** button to restore initial evaluation state.

---

## 3. Technology Stack

- **Framework:** Next.js 16.4.1 (App Router with Turbopack)
- **Language:** TypeScript 5
- **Library:** React 19.3.0
- **Styling:** Tailwind CSS v4 (with sophisticated color system: Forest Green `#123e30`, Near-black Charcoal `#121820`, Soft Mint `#ecfdf5`, Warm Canvas `#fbfbfd`)
- **Icons:** Lucide React
- **Data Visualization:** Recharts
- **State Layer:** Centralized React Context with persistent `localStorage` synchronization and integer paise / decimal-safe money arithmetic
- **Testing:** Native Node.js test assertions via `tsx`

---

## 4. Project Structure

```text
nivaran-ai/
├── app/
│   ├── layout.tsx                     # Root HTML & AppProvider wrapper
│   ├── globals.css                    # Design tokens & Tailwind v4 theme
│   ├── page.tsx                       # Public conversion homepage
│   ├── how-it-works/page.tsx          # 4-Step workflow & comparison
│   ├── investment-approach/page.tsx   # Risk pillars & MPT philosophy
│   ├── safety/page.tsx                # Demo boundaries & safety disclaimers
│   ├── login/page.tsx                 # Sign-in with Quick Demo shortcut
│   ├── signup/page.tsx                # Registration & terms acknowledgement
│   ├── forgot-password/page.tsx       # Simulated password recovery
│   ├── onboarding/page.tsx            # Multi-step investor questionnaire
│   ├── dashboard/page.tsx             # Executive portfolio dashboard
│   ├── portfolio/page.tsx             # In-depth holdings & weight analysis
│   ├── markets/page.tsx               # Indian equity explorer (NSE/BSE)
│   ├── stocks/[symbol]/               # Dynamic stock detail pages
│   │   ├── page.tsx                   # Static pre-rendering server component
│   │   └── StockDetailClient.tsx      # Interactive client view
│   ├── investment-plan/page.tsx       # Plan controls & execution
│   ├── investment-plan/create/page.tsx# Deterministic plan generator
│   ├── activity/page.tsx              # Transaction ledger & audit receipts
│   ├── insights/page.tsx              # HHI diversification & stress tests
│   ├── goals/page.tsx                 # Financial goal progress tracking
│   ├── notifications/page.tsx         # Alert center
│   ├── profile/page.tsx               # Investor tier & profile info
│   └── settings/page.tsx              # Preferences & demo data reset
├── components/
│   ├── layout/
│   │   ├── AppNavbar.tsx              # Search bar, demo funding, notifications
│   │   ├── AppSidebar.tsx             # Desktop sidebar with cash ledger card
│   │   ├── AppShell.tsx               # Authenticated layout & auth guard
│   │   ├── MobileBottomNav.tsx        # Thumb-friendly mobile navigation
│   │   ├── PublicHeader.tsx           # Public header with responsive nav
│   │   └── PublicFooter.tsx           # Public footer with SEBI disclaimers
│   ├── charts/
│   │   ├── PortfolioAreaChart.tsx     # Recharts portfolio value trend
│   │   ├── AllocationDonutChart.tsx   # Sector/stock distribution donut
│   │   └── StockHistoryChart.tsx      # Individual stock price history chart
│   ├── modals/
│   │   ├── AddFundsModal.tsx          # Simulated cash ledger funding
│   │   └── RebalanceModal.tsx         # Portfolio drift & rebalance executor
│   └── ui/
│       └── DemoBadge.tsx              # Persistent demo indicator & modal
├── context/
│   └── AppContext.tsx                 # Centralized state & ledger engine
├── lib/
│   ├── types.ts                       # Domain TypeScript interfaces
│   ├── data/stocks.ts                 # 20+ Indian blue-chip equities
│   └── utils/
│       ├── formatters.ts              # INR (₹), percentage, and paise math
│       └── simulation-engine.ts       # Deterministic MPT allocation & HHI
└── tests/
    └── verify-engine.ts               # Automated unit test suite
```

---

## 5. How to Run the Application

### Prerequisites
- Node.js version 20+ (Node.js 24 is installed and verified)
- npm version 10+

### Installation & Execution
```bash
# 1. Install dependencies
npm install

# 2. Run automated test suite
npm test

# 3. Build production bundle (verified 0 errors)
npm run build

# 4. Start production server
npm run start

# Alternatively, run development mode:
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your web browser.

---

## 6. Evaluation & Sign-In Instructions

For evaluation panels, teachers, and reviewers:
1. Navigate to `/login`.
2. Click the **"Quick Demo Evaluation Login"** card.
3. This instantly loads the pre-configured investor profile:
   - **Name:** Arjun Sharma
   - **Simulated Portfolio Value:** ~₹1,84,515 (+4.8% return)
   - **Available Demo Cash:** ₹50,000
   - **Active Plan:** Core Indian Growth Plan (₹25,000 Monthly SIP)
   - **Holdings:** 5 Blue-Chips (Reliance, TCS, HDFC Bank, Infosys, Larsen & Toubro)
4. To test automated investing, click **"Run Demo Contribution"** on the Dashboard or Investment Plan page.
5. To test funding, click **"Add Demo Funds"** in the top navigation or sidebar.
6. To restore the pristine baseline at any time, go to **Settings & Reset** (`/settings`) and click **"Reset All Demo Data"**.
