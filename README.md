# NIVARAN — Full-Stack Educational Investment Simulation Platform

> **"Invest with a plan. Understand every decision. Track your progress."**

NIVARAN is an educational, full-stack, rule-based investment simulation and portfolio management web application designed for live college and university evaluations. It demonstrates how user preference ingestion, quantitative risk profiling, deterministic allocation algorithms, simulated cash ledgers, and portfolio analytics function together within a modern software architecture.

---

## 1. Academic & University Evaluation Disclaimer

**THIS PLATFORM IS STRICTLY AN EDUCATIONAL SIMULATION DESIGNED FOR ACADEMIC EVALUATION.**
- **No Real Capital:** All portfolio valuations, virtual deposits, and ledger accounts operate within a simulated ledger. Zero real deposits, bank transfers, or withdrawals are permitted or executed.
- **No Brokerage Order Routing:** No real orders are routed to the National Stock Exchange of India (NSE) or the Bombay Stock Exchange (BSE).
- **Simulated Market Dataset:** Security tickers (Reliance, TCS, HDFC Bank, Infosys, LT, etc.), financial ratios, Beta values, and historical time-series are deterministic demonstration datasets.
- **Not SEBI Registered:** NIVARAN does not provide registered investment advisory services and is not affiliated with the Securities and Exchange Board of India (SEBI).

---

## 2. Full-Stack System Architecture

NIVARAN is architected with a decoupled frontend and modular backend service architecture:

```text
┌────────────────────────────────────────────────────────┐
│               Next.js 16 (React 19 + TS)               │
│  Tailwind CSS v4 • Recharts • App Router • Lucide Icons │
└───────────────────────────┬────────────────────────────┘
                            │  HTTP / REST (JWT Bearer Auth)
                            ▼
┌────────────────────────────────────────────────────────┐
│                   FastAPI Backend                      │
│     Pydantic Schemas • Modular Services • CORS         │
├────────────────────────────────────────────────────────┤
│ • Recommendation Engine (Beta / Sector Scoring)        │
│ • Automatic Virtual Allocation Service (Atomic Tx)     │
│ • Portfolio Valuation & HHI Diversification Service   │
│ • Simulated Cash Ledger & Virtual Wallet Service       │
└───────────────────────────┬────────────────────────────┘
                            │  SQLAlchemy 2.0 ORM / Alembic
                            ▼
┌────────────────────────────────────────────────────────┐
│               Relational Database Engine               │
│  Default: SQLite (nivaran.db) for zero-config offline  │
│  Production: Supabase PostgreSQL (with RLS Policies)   │
└────────────────────────────────────────────────────────┘
```

---

## 3. Technology Stack

### Frontend
- **Framework:** Next.js 16.4.1 (App Router with Turbopack)
- **Language:** TypeScript 5
- **Library:** React 19.3.0
- **Styling:** Tailwind CSS v4 (Forest Green `#123e30`, Charcoal `#121820`, Mint `#00E599`)
- **Visualizations:** Recharts (Portfolio Area Chart, Sector Donut, Historical Stock Trends)
- **Icons:** Lucide React
- **API Client:** Centralized fetch-based client (`lib/api.ts`) with Bearer token authentication

### Backend
- **Framework:** FastAPI 0.141+
- **ASGI Server:** Uvicorn
- **Language:** Python 3.10+ (tested on Python 3.14)
- **Validation:** Pydantic v2 (Pydantic Settings & ConfigDict)
- **Database ORM:** SQLAlchemy 2.0
- **Migrations:** Alembic 1.19+
- **Security:** NIST PBKDF2-HMAC-SHA256 password hashing (100,000 rounds) + PyJWT token encoding/verification

### Database
- **Primary / Local Demo Mode:** SQLite (`nivaran.db`) for immediate offline demonstration without cloud dependency.
- **Production Mode:** Supabase PostgreSQL with comprehensive Row-Level Security (RLS) policies provided in `backend/supabase_schema.sql`.

---

## 4. Implemented Features & Endpoints

### Core Features
1. **Authentication & Identity:** User registration, password verification, secure token issuance, and one-click quick demo login.
2. **Preference Profiling:** Captures risk tolerance tier (`CONSERVATIVE`, `BALANCED`, `GROWTH`), investment horizon, sector preferences, single-stock caps, and rebalance thresholds.
3. **Stock Catalogue:** 20 Indian blue-chip equities across 7 sectors with live search, sector filtering, exchange filtering, and risk indicators.
4. **Deterministic Recommendation Engine:** Rule-based candidate scoring based on Beta volatility, dividend yield, market capitalization, and user sector affinity; normalizes weights to sum to exactly 100%.
5. **Automatic Virtual Allocation:** Atomic database transaction deducting virtual funds, allocating whole-share quantities, recording cost basis, and logging audit entries.
6. **Portfolio Holdings & Valuation:** Real-time valuation (`shares × current_price`), cost basis accounting, unrealized P&L, sector weights, and Herfindahl-Hirschman Index (HHI) concentration scoring.
7. **Simulated Cash Ledger:** Decimal-safe virtual deposits, balance tracking, and immutable transaction history.
8. **Portfolio Rebalancing:** Evaluates allocation drift against policy thresholds (±5%) and simulates rebalance adjustments.

### Backend API Contract

| Method | Endpoint | Description | Protected |
| :--- | :--- | :--- | :---: |
| `GET` | `/health` | System health & database connectivity check | No |
| `POST` | `/api/auth/register` | Register new evaluator profile | No |
| `POST` | `/api/auth/login` | Authenticate with email & password | No |
| `POST` | `/api/auth/demo-login` | Instant evaluator one-click login | No |
| `GET` | `/api/auth/me` | Retrieve active authenticated session | Yes |
| `GET` | `/api/profile` | Retrieve user profile information | Yes |
| `PUT` | `/api/profile` | Update user profile | Yes |
| `GET` | `/api/preferences` | Retrieve user investment mandate | Yes |
| `PUT` | `/api/preferences` | Update user investment mandate | Yes |
| `GET` | `/api/stocks` | Query stock catalogue with filters | No |
| `GET` | `/api/stocks/{symbol}` | Query single security metrics and history | No |
| `GET` | `/api/recommendations`| Generate deterministic allocation proposal | Yes |
| `POST`| `/api/allocations` | Execute automatic virtual funds allocation | Yes |
| `GET` | `/api/allocations` | Retrieve allocation run audit history | Yes |
| `GET` | `/api/wallet` | Fetch authoritative virtual wallet balance | Yes |
| `POST`| `/api/wallet/deposits` | Deposit virtual funds with validation | Yes |
| `GET` | `/api/portfolio` | Real-time holdings valuation & analytics | Yes |
| `POST`| `/api/portfolio/rebalance` | Execute simulated drift rebalance | Yes |
| `GET` | `/api/transactions` | Query chronological transaction ledger | Yes |
| `POST`| `/api/demo/reset` | Restore baseline demonstration portfolio | No |
| `POST`| `/api/demo/reset-user` | Reset current user to ₹1,00,000 fresh cash | Yes |

---

## 5. Repository Structure

```text
Nivaran-ai-main/
├── app/                               # Next.js App Router Pages
│   ├── layout.tsx                     # Root Layout & AppProvider wrapper
│   ├── page.tsx                       # Public Landing Page & Pitch
│   ├── dashboard/page.tsx             # Investor Dashboard & Portfolio Chart
│   ├── portfolio/page.tsx             # Holdings Table & Concentration Breakdown
│   ├── markets/page.tsx               # Indian Equities Explorer (NSE/BSE)
│   ├── stocks/[symbol]/page.tsx       # Dynamic Stock Deep-Dive
│   ├── investment-plan/page.tsx       # Active Plan Controls & Allocation View
│   ├── investment-plan/create/page.tsx# Deterministic Allocation Generator
│   ├── activity/page.tsx              # Transaction Ledger & Audit Receipts
│   ├── insights/page.tsx              # HHI Diversification & Scenario Tests
│   ├── onboarding/page.tsx            # Multi-Step Investor Questionnaire
│   ├── login/page.tsx                 # Sign-In with One-Click Demo Button
│   ├── signup/page.tsx                # User Registration
│   ├── settings/page.tsx              # Preferences & Demo Data Reset
│   └── safety/page.tsx                # Simulation Boundaries & Disclosures
├── components/                        # Reusable UI & Layout Components
│   ├── layout/                        # AppShell, AppNavbar, AppSidebar
│   ├── charts/                        # Area Chart, Donut Chart, History Chart
│   ├── modals/                        # AddFundsModal, RebalanceModal
│   └── ui/                            # BrandLogo, Toast, CommandPalette
├── context/                           # Centralized State & Backend Sync Layer
│   └── AppContext.tsx                 # AppProvider, Reactive State, Sync Logic
├── lib/
│   ├── api.ts                         # Centralized Backend REST API Client
│   ├── types.ts                       # Domain TypeScript Interfaces
│   ├── data/stocks.ts                 # 20 Indian Blue-Chip Equities
│   └── utils/formatters.ts            # INR (₹), Paise Math & Formatters
├── backend/                           # Python FastAPI Application
│   ├── alembic/                       # Alembic Database Migrations
│   │   └── versions/                  # Schema Version Scripts
│   ├── alembic.ini                    # Alembic Configuration
│   ├── supabase_schema.sql            # Supabase PostgreSQL DDL & RLS Policies
│   ├── requirements.txt               # Backend Python Dependencies
│   ├── app/
│   │   ├── main.py                    # FastAPI Entry Point & Lifespan
│   │   ├── core/                      # Settings & Security (JWT, Hash)
│   │   ├── db/                        # Database Engine, Models, Seed
│   │   ├── schemas/                   # Pydantic v2 Request/Response Models
│   │   ├── services/                  # Recommendation, Allocation, Wallet, Portfolio
│   │   └── api/                       # API Endpoints & Auth Dependencies
│   └── tests/                         # Pytest Automated Test Suite
│       ├── test_health.py             # Health Endpoint Tests
│       ├── test_auth.py               # Auth & Profile Tests
│       ├── test_wallet.py             # Virtual Deposit Tests
│       ├── test_recommendations.py    # Recommendation Scoring Tests
│       ├── test_allocations.py        # Automatic Allocation Tests
│       ├── test_portfolio.py          # Portfolio Valuation Tests
│       └── test_security.py           # Cross-User Data Isolation Tests
└── tests/
    └── verify-engine.ts               # Frontend Simulation Engine Tests
```

---

## 6. Setup & Execution Instructions

### Prerequisites
- **Node.js:** v20+ (Node.js 24 verified)
- **Python:** v3.10+ (Python 3.14 verified)
- **npm:** v10+

### Step 1: Install Dependencies
```bash
# Install frontend npm dependencies
npm install

# Install backend python dependencies
pip install -r backend/requirements.txt
```

### Step 2: Seed the Database
```bash
npm run seed
```
*This initializes `nivaran.db` and populates the 20 Indian equities and default evaluation investor.*

### Step 3: Run the Backend Server
```bash
npm run backend
# Or: python -m uvicorn backend.app.main:app --port 8000 --reload
```
The FastAPI backend will start at `http://127.0.0.1:8000`. You can inspect the interactive OpenAPI documentation at `http://127.0.0.1:8000/docs`.

### Step 4: Run the Frontend Application
In a second terminal window:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your web browser.

---

## 7. Automated Testing Suite

NIVARAN includes full test coverage across both frontend math modules and backend API/database services:

```bash
# Run both Frontend & Backend test suites simultaneously:
npm run test:all

# Or run separately:
npm test           # TypeScript engine tests (6/6 tests)
npm run test:backend # Python pytest suite (21/21 tests)
```

### Test Coverage Highlights:
- **Backend Unit Tests:** Decimal-safe arithmetic, deposit validation, single-stock cap enforcement, whole-share calculations, and rounding behavior.
- **Backend Integration Tests:** Database persistence for allocations, transaction ledger updates, and preference updates.
- **Security Tests:** Missing and expired Bearer token rejection, malformed payloads, attempted virtual overspending, and strict cross-user data isolation.
- **Build Checks:** `npm run build` runs clean type-checking across 48 static/hybrid routes with 0 errors.

---

## 8. College & Teacher Demonstration Walkthrough

Follow this step-by-step path to present the complete full-stack workflow to an examiner or teacher:

1. **Landing Page (`/`):**
   - Showcase the NIVARAN branding, three-step simulated workflow, and explicit academic simulation notices.
2. **Registration / Quick Demo Login (`/login`):**
   - Click **"Quick Evaluator Login"** to instantly sign into the pre-seeded investor profile (**Arjun Sharma**).
   - Alternatively, click **Sign Up** (`/signup`) to register a new user profile with real database persistence.
3. **Investor Onboarding & Preferences (`/onboarding`):**
   - Select Risk Tolerance (e.g. *Growth*), Time Horizon, and preferred sectors (e.g. *Technology*, *Banking*, *Consumer Goods*).
   - Review the instant deterministic allocation proposal before transitioning to the Dashboard.
4. **Investor Dashboard (`/dashboard`):**
   - Point out the top context bar displaying `FastAPI + PostgreSQL / SQLite Persistent`.
   - Inspect portfolio metrics: Simulated Portfolio Value, Total Invested, Available Cash, and Percentage Returns calculated dynamically from holdings.
5. **Adding Virtual Funds (`/activity` or Header modal):**
   - Click **"+ Add Demo Funds"** in the top navigation or sidebar.
   - Select ₹25,000 or ₹50,000 and confirm the simulated top-up.
   - Verify that the available cash updates immediately and a `DEPOSIT` record appears in the activity ledger.
6. **Market Discovery & Stock Catalogue (`/markets`):**
   - Explore the 20 Indian equities across 7 sectors.
   - Filter by sector (e.g. *Technology*) or search for "Reliance" or "TCS".
   - Click a stock card to open its dedicated deep-dive page (`/stocks/[symbol]`) featuring 30-day historical charts and valuation multiples.
7. **Generating Recommendations & Executing Allocation (`/investment-plan/create`):**
   - Walk through the interactive Plan Creator.
   - Set an allocation amount (e.g. ₹25,000) and observe the deterministic scoring algorithm rank the candidates.
   - Enforce concentration caps (&le;25%) and notice how weights sum to exactly 100%.
   - Click **"Confirm & Deploy Simulated Allocation"**.
   - Review the generated transaction voucher receipt with unique reference ID.
8. **Inspecting Portfolio Holdings (`/portfolio`):**
   - Navigate to the Portfolio page.
   - Inspect the holdings table showing actual vs. target weights, share counts, average buy prices, and live P&L.
9. **Portfolio Health & Stress Testing (`/insights`):**
   - Review the Herfindahl-Hirschman Index (HHI) concentration score and sector allocation distribution.
   - Test macroeconomic stress-testing scenarios (e.g. *RBI Interest Rate Hike*, *Tech Capex Acceleration*).
10. **Data Persistence Verification:**
    - Refresh the browser (`F5`) to confirm that all balances, holdings, and transactions persist from the database.
    - Sign out (`/settings`) and sign back in to verify persistent session storage.
11. **Demonstration Reset:**
    - Navigate to **Settings** (`/settings`) and click **"Reset All Demo Data"** to restore the evaluation baseline.

---

## 9. Security & Isolation Notes

- **Cryptographic User Isolation:** Every private resource (`/api/wallet`, `/api/portfolio`, `/api/allocations`, `/api/transactions`) derives identity exclusively from verified JWT tokens. Client-supplied IDs are never trusted as proof of identity.
- **Strict Server-Side Validation:** All virtual deposits and allocation amounts are validated server-side. Attempts to allocate more virtual funds than are available in the authoritative database wallet are rejected with HTTP 400 Bad Request.
- **Transactional Atomicity:** Wallet balance deductions and holding creations execute within a database transaction block that rolls back completely if any sub-operation fails.
- **Credential Hygiene:** Privileged database credentials and server secret keys remain strictly server-side. No API keys or credentials are leaked to the client bundle.
