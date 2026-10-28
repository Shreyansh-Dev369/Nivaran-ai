"""
Database Seed Script for Nivaran Investment Simulation

Seeds:
1. 20 Indian Blue-Chip Equities across 7 sectors (NSE/BSE) with metrics, P/E, Beta, and history.
2. Default Evaluation Investor 'Arjun Sharma' (₹1.84L holdings, ₹50k demo cash, 5 securities).
"""

import json
import os
from pathlib import Path
from datetime import datetime, timezone
from sqlalchemy.orm import Session

from backend.app.db.models import (
    Stock,
    User,
    Profile,
    InvestmentPreference,
    VirtualWallet,
    PortfolioHolding,
    SimulatedTransaction,
    Notification
)
from backend.app.core.security import get_password_hash


def seed_all_stocks(db: Session):
    """Seed the 20 Indian equities into the database."""
    # Try reading from stocks.json if available
    stocks_path = Path(__file__).resolve().parent.parent.parent.parent / "lib" / "data" / "stocks.json"
    stocks_data = []

    if stocks_path.exists():
        try:
            with open(stocks_path, "r", encoding="utf-8") as f:
                stocks_data = json.load(f)
        except Exception as e:
            print(f"Error reading stocks.json: {e}")

    if not stocks_data:
        # Fallback inline basic 5 blue-chips if file not found
        stocks_data = [
            {
                "symbol": "RELIANCE",
                "name": "Reliance Industries Ltd",
                "exchange": "NSE",
                "sector": "Energy & Utilities",
                "currentPrice": 2945.60,
                "previousClose": 2918.20,
                "change": 27.40,
                "changePercent": 0.94,
                "marketCapCr": 1993450,
                "peRatio": 26.8,
                "pbRatio": 2.15,
                "divYield": 0.34,
                "fiftyTwoWeekHigh": 3024.90,
                "fiftyTwoWeekLow": 2220.30,
                "beta": 0.88,
                "riskLevel": "CONSERVATIVE",
                "description": "India's largest conglomerate across energy, retail, and digital telecom services.",
                "selectionRationale": "Core defensive anchor combining cash-generating petrochemicals with fast-growing retail and 5G.",
                "keyRisks": ["Global refining margin cyclicality", "Telecom capex"],
                "history": []
            },
            {
                "symbol": "TCS",
                "name": "Tata Consultancy Services Ltd",
                "exchange": "NSE",
                "sector": "Technology",
                "currentPrice": 3892.40,
                "previousClose": 3915.00,
                "change": -22.60,
                "changePercent": -0.58,
                "marketCapCr": 1408200,
                "peRatio": 29.4,
                "pbRatio": 12.8,
                "divYield": 1.45,
                "fiftyTwoWeekHigh": 4254.75,
                "fiftyTwoWeekLow": 3313.00,
                "beta": 0.72,
                "riskLevel": "CONSERVATIVE",
                "description": "Global IT services and digital business transformation leader.",
                "selectionRationale": "High Return on Equity (>45%) and fortress balance sheet with regular shareholder cash returns.",
                "keyRisks": ["Discretionary tech budget softness", "Currency headwind"],
                "history": []
            },
            {
                "symbol": "HDFCBANK",
                "name": "HDFC Bank Ltd",
                "exchange": "NSE",
                "sector": "Banking & Finance",
                "currentPrice": 1682.15,
                "previousClose": 1668.50,
                "change": 13.65,
                "changePercent": 0.82,
                "marketCapCr": 1280650,
                "peRatio": 19.2,
                "pbRatio": 2.7,
                "divYield": 1.16,
                "fiftyTwoWeekHigh": 1794.00,
                "fiftyTwoWeekLow": 1363.55,
                "beta": 1.05,
                "riskLevel": "CONSERVATIVE",
                "description": "India's premier private banking institution with low-cost CASA deposit franchise.",
                "selectionRationale": "Systemically important lender with low non-performing assets and extensive branch distribution.",
                "keyRisks": ["Loan-deposit ratio normalization"],
                "history": []
            },
            {
                "symbol": "INFOSYS",
                "name": "Infosys Ltd",
                "exchange": "NSE",
                "sector": "Technology",
                "currentPrice": 1545.80,
                "previousClose": 1530.00,
                "change": 15.80,
                "changePercent": 1.03,
                "marketCapCr": 642000,
                "peRatio": 25.1,
                "pbRatio": 7.4,
                "divYield": 2.30,
                "fiftyTwoWeekHigh": 1620.00,
                "fiftyTwoWeekLow": 1358.35,
                "beta": 0.82,
                "riskLevel": "BALANCED",
                "description": "Next-generation digital services, cloud transformation, and enterprise consulting leader.",
                "selectionRationale": "Attractive dividend yield and continuous generative AI enterprise contract wins.",
                "keyRisks": ["BFSI IT spending pauses in Europe and US"],
                "history": []
            },
            {
                "symbol": "LT",
                "name": "Larsen & Toubro Ltd",
                "exchange": "NSE",
                "sector": "Industrials",
                "currentPrice": 3640.75,
                "previousClose": 3600.00,
                "change": 40.75,
                "changePercent": 1.13,
                "marketCapCr": 500500,
                "peRatio": 33.2,
                "pbRatio": 4.8,
                "divYield": 0.85,
                "fiftyTwoWeekHigh": 3919.90,
                "fiftyTwoWeekLow": 2862.00,
                "beta": 1.02,
                "riskLevel": "BALANCED",
                "description": "India's engineering, procurement, and heavy construction champion driving national infrastructure.",
                "selectionRationale": "Record domestic order book pipeline backed by government infrastructure capital allocation.",
                "keyRisks": ["Commodity input costs and supply chain execution"],
                "history": []
            }
        ]

    for item in stocks_data:
        sym = item.get("symbol")
        existing = db.query(Stock).filter(Stock.symbol == sym).first()
        if not existing:
            new_stock = Stock(
                symbol=sym,
                name=item.get("name", sym),
                exchange=item.get("exchange", "NSE"),
                sector=item.get("sector", "Technology"),
                current_price=float(item.get("currentPrice", 1000.0)),
                previous_close=float(item.get("previousClose", 1000.0)),
                change=float(item.get("change", 0.0)),
                change_percent=float(item.get("changePercent", 0.0)),
                market_cap_cr=float(item.get("marketCapCr", 50000.0)),
                pe_ratio=float(item.get("peRatio", 20.0)),
                pb_ratio=float(item.get("pbRatio", 3.0)),
                div_yield=float(item.get("divYield", 1.0)),
                fifty_two_week_high=float(item.get("fiftyTwoWeekHigh", 1200.0)),
                fifty_two_week_low=float(item.get("fiftyTwoWeekLow", 800.0)),
                beta=float(item.get("beta", 1.0)),
                risk_level=item.get("riskLevel", "BALANCED"),
                description=item.get("description", ""),
                selection_rationale=item.get("selectionRationale", ""),
                key_risks=json.dumps(item.get("keyRisks", [])),
                history=json.dumps(item.get("history", [])),
                is_eligible=True
            )
            db.add(new_stock)
        else:
            # Update latest price and fields
            existing.current_price = float(item.get("currentPrice", existing.current_price))
            existing.previous_close = float(item.get("previousClose", existing.previous_close))
            existing.change = float(item.get("change", existing.change))
            existing.change_percent = float(item.get("changePercent", existing.change_percent))

    db.commit()
    print(f"Stock database seeded with {len(stocks_data)} Indian securities.")


def seed_demo_investor(db: Session):
    """Seed or restore the Arjun Sharma demo investor."""
    demo_email = "arjun.sharma@example.com"
    user = db.query(User).filter(User.email == demo_email).first()

    if not user:
        user = User(
            email=demo_email,
            hashed_password=get_password_hash("demo1234"),
            created_at=datetime.now(timezone.utc)
        )
        db.add(user)
        db.flush()

    # Profile
    profile = db.query(Profile).filter(Profile.user_id == user.id).first()
    if not profile:
        profile = Profile(
            user_id=user.id,
            full_name="Arjun Sharma",
            phone="+91 98765 43210",
            investor_tier="Tier 1 Verified (Demo)",
            pan_masked="ABCDE****F",
            bio="Simulated Equity Investor exploring rules-based allocation."
        )
        db.add(profile)

    # Preferences
    prefs = db.query(InvestmentPreference).filter(InvestmentPreference.user_id == user.id).first()
    if not prefs:
        prefs = InvestmentPreference(
            user_id=user.id,
            risk_tolerance="BALANCED",
            investment_horizon="LONG",
            preferred_sectors=json.dumps(["Technology", "Banking & Finance", "Energy & Utilities", "Industrials"]),
            excluded_sectors=json.dumps([]),
            max_single_stock_cap=25.0,
            rebalance_threshold=5.0,
            simulated_amount=25000.0,
            frequency="MONTHLY",
            plan_name="Core Indian Growth Plan",
            plan_status="ACTIVE"
        )
        db.add(prefs)

    # Wallet
    wallet = db.query(VirtualWallet).filter(VirtualWallet.user_id == user.id).first()
    if not wallet:
        wallet = VirtualWallet(
            user_id=user.id,
            balance=50000.0,
            currency="INR",
            total_deposited=150000.0
        )
        db.add(wallet)
    else:
        wallet.balance = 50000.0
        wallet.total_deposited = 150000.0

    # Clean existing holdings for Arjun to reset to baseline
    db.query(PortfolioHolding).filter(PortfolioHolding.user_id == user.id).delete()

    # Seed 5 standard blue-chip holdings
    seed_holdings = [
        {"symbol": "RELIANCE", "shares": 12, "avg_price": 2810.00, "invested": 33720.00, "target_weight": 25.0},
        {"symbol": "TCS", "shares": 8, "avg_price": 3720.00, "invested": 29760.00, "target_weight": 22.0},
        {"symbol": "HDFCBANK", "shares": 18, "avg_price": 1610.50, "invested": 28989.00, "target_weight": 20.0},
        {"symbol": "INFOSYS", "shares": 15, "avg_price": 1480.00, "invested": 22200.00, "target_weight": 18.0},
        {"symbol": "LT", "shares": 4, "avg_price": 3450.00, "invested": 13800.00, "target_weight": 15.0},
    ]

    for h in seed_holdings:
        holding = PortfolioHolding(
            user_id=user.id,
            symbol=h["symbol"],
            shares=h["shares"],
            average_buy_price=h["avg_price"],
            invested_value=h["invested"],
            target_weight=h["target_weight"]
        )
        db.add(holding)

    # Transactions
    db.query(SimulatedTransaction).filter(SimulatedTransaction.user_id == user.id).delete()
    tx1 = SimulatedTransaction(
        user_id=user.id,
        type="DEPOSIT",
        amount=150000.0,
        description="Initial Demo Capital Allocation",
        status="COMPLETED",
        reference_id="NVR-DEMO-9912"
    )
    tx2 = SimulatedTransaction(
        user_id=user.id,
        type="INVESTMENT",
        amount=128469.0,
        description="Automated Portfolio Initial Allocation (5 Securities)",
        status="COMPLETED",
        reference_id="NVR-ALLOC-7721"
    )
    tx3 = SimulatedTransaction(
        user_id=user.id,
        type="PLAN_TRIGGER",
        amount=25000.0,
        description="Scheduled Monthly Automated Contribution",
        status="COMPLETED",
        reference_id="NVR-SIP-8831"
    )
    db.add_all([tx1, tx2, tx3])

    db.commit()
    print("Demo investor Arjun Sharma successfully seeded.")
