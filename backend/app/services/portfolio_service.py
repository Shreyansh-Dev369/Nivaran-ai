"""
Portfolio Service — Holdings, Valuation, Analytics & Rebalancing

Adheres to Sections 14 & 15 of Master Specification:
- Accurate holdings valuation: sum of (shares * current_price)
- Unrealized P/L calculation: current_value - invested_value
- Dynamic weight calculation
- Herfindahl-Hirschman Index (HHI) diversification scoring
- Rebalancing drift detection and execution
"""

import uuid
from datetime import datetime, timezone
from typing import List, Dict
from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from backend.app.db.models import (
    PortfolioHolding,
    Stock,
    VirtualWallet,
    InvestmentPreference,
    SimulatedTransaction,
    Notification
)
from backend.app.schemas.portfolio import (
    HoldingResponse,
    PortfolioAnalyticsResponse,
    SectorWeight,
    RebalanceAdjustment,
    RebalanceResponse
)


def get_portfolio_analytics(db: Session, user_id: str) -> PortfolioAnalyticsResponse:
    """
    Calculate real-time portfolio analytics from stored database records and current stock prices.
    """
    # 1. Fetch wallet
    wallet = db.query(VirtualWallet).filter(VirtualWallet.user_id == user_id).first()
    cash_balance = wallet.balance if wallet else 0.0

    # 2. Fetch holdings
    holdings = db.query(PortfolioHolding).filter(PortfolioHolding.user_id == user_id).all()

    # Pre-fetch all stocks
    stock_symbols = [h.symbol for h in holdings]
    stocks_map: Dict[str, Stock] = {}
    if stock_symbols:
        stocks = db.query(Stock).filter(Stock.symbol.in_(stock_symbols)).all()
        stocks_map = {s.symbol: s for s in stocks}

    total_invested = 0.0
    total_holdings_value = 0.0
    holding_responses: List[HoldingResponse] = []
    sector_totals: Dict[str, float] = {}

    # Calculate holding metrics
    raw_holdings = []
    for h in holdings:
        stock = stocks_map.get(h.symbol)
        name = stock.name if stock else h.symbol
        sector = stock.sector if stock else "Other"
        current_price = stock.current_price if stock and stock.current_price > 0 else h.average_buy_price

        current_val = round(h.shares * current_price, 2)
        invested_val = round(h.invested_value, 2)
        pnl = round(current_val - invested_val, 2)
        pnl_pct = round((pnl / invested_val * 100.0), 2) if invested_val > 0 else 0.0

        total_invested += invested_val
        total_holdings_value += current_val

        sector_totals[sector] = sector_totals.get(sector, 0.0) + current_val

        raw_holdings.append({
            "symbol": h.symbol,
            "name": name,
            "sector": sector,
            "shares": h.shares,
            "average_buy_price": h.average_buy_price,
            "current_price": current_price,
            "invested_value": invested_val,
            "current_value": current_val,
            "unrealized_pnl": pnl,
            "unrealized_pnl_percent": pnl_pct,
            "target_weight": h.target_weight,
        })

    # Calculate actual weights
    for item in raw_holdings:
        weight = round((item["current_value"] / total_holdings_value * 100.0), 1) if total_holdings_value > 0 else 0.0
        holding_responses.append(
            HoldingResponse(
                symbol=item["symbol"],
                name=item["name"],
                sector=item["sector"],
                shares=item["shares"],
                average_buy_price=item["average_buy_price"],
                current_price=item["current_price"],
                invested_value=item["invested_value"],
                current_value=item["current_value"],
                unrealized_pnl=item["unrealized_pnl"],
                unrealized_pnl_percent=item["unrealized_pnl_percent"],
                current_weight=weight,
                target_weight=item["target_weight"]
            )
        )

    # Sort holdings descending by value
    holding_responses.sort(key=lambda x: x.current_value, reverse=True)

    # Sector distribution
    sector_weights: List[SectorWeight] = []
    for sec, val in sector_totals.items():
        pct = round((val / total_holdings_value * 100.0), 1) if total_holdings_value > 0 else 0.0
        sector_weights.append(SectorWeight(sector=sec, value=round(val, 2), percentage=pct))
    sector_weights.sort(key=lambda x: x.value, reverse=True)

    # Herfindahl-Hirschman Index (HHI) for diversification
    # HHI = sum of (weight_percent ^ 2). Lower is more diversified. Max 10,000 (monopoly).
    # Scaled to 0-100 score: 100 - (HHI / 100)
    if holding_responses and total_holdings_value > 0:
        hhi = sum((h.current_weight) ** 2 for h in holding_responses)
        # Ideal equal weight across 5 stocks is 5 * 20^2 = 2000 => score ~ 80
        score = max(0, min(100, int(100 - (hhi / 100))))
    else:
        score = 0

    if score >= 75:
        label = "Excellent Diversification"
    elif score >= 50:
        label = "Moderate Diversification"
    else:
        label = "Concentrated Holdings"

    total_portfolio_value = round(total_holdings_value + cash_balance, 2)
    total_unrealized_pnl = round(total_holdings_value - total_invested, 2)
    total_pnl_percent = round((total_unrealized_pnl / total_invested * 100.0), 2) if total_invested > 0 else 0.0

    return PortfolioAnalyticsResponse(
        cash_balance=round(cash_balance, 2),
        total_invested=round(total_invested, 2),
        total_holdings_value=round(total_holdings_value, 2),
        total_portfolio_value=total_portfolio_value,
        total_unrealized_pnl=total_unrealized_pnl,
        total_unrealized_pnl_percent=total_pnl_percent,
        holdings_count=len(holding_responses),
        sector_distribution=sector_weights,
        diversification_score=score,
        diversification_label=label,
        holdings=holding_responses
    )


def rebalance_user_portfolio(db: Session, user_id: str) -> RebalanceResponse:
    """
    Detect allocation drift against target weights and execute simulated rebalance trades.
    """
    holdings = db.query(PortfolioHolding).filter(PortfolioHolding.user_id == user_id).all()
    if not holdings:
        return RebalanceResponse(
            success=False,
            message="No active holdings found in portfolio to rebalance.",
            trades_count=0,
            adjustments=[]
        )

    prefs = db.query(InvestmentPreference).filter(InvestmentPreference.user_id == user_id).first()
    drift_threshold = prefs.rebalance_threshold if prefs else 5.0

    analytics = get_portfolio_analytics(db, user_id)
    total_val = analytics.total_holdings_value

    if total_val <= 0:
        return RebalanceResponse(
            success=False,
            message="Portfolio value is zero.",
            trades_count=0,
            adjustments=[]
        )

    adjustments: List[RebalanceAdjustment] = []
    actionable_count = 0

    for h_resp in analytics.holdings:
        drift = h_resp.current_weight - h_resp.target_weight
        target_amt = (total_val * h_resp.target_weight) / 100.0
        amt_delta = target_amt - h_resp.current_value
        price = h_resp.current_price if h_resp.current_price > 0 else 1000.0
        shares_delta = int(round(amt_delta / price))

        action = "HOLD"
        if abs(drift) >= drift_threshold and shares_delta != 0:
            action = "BUY" if drift < 0 else "SELL"
            actionable_count += 1

        adjustments.append(
            RebalanceAdjustment(
                symbol=h_resp.symbol,
                name=h_resp.name,
                action=action,
                current_weight=h_resp.current_weight,
                target_weight=h_resp.target_weight,
                shares_delta=shares_delta,
                amount_delta=round(amt_delta, 2)
            )
        )

    if actionable_count == 0:
        return RebalanceResponse(
            success=True,
            message=f"All positions are within allowable ±{int(drift_threshold)}% drift threshold. No rebalancing needed.",
            trades_count=0,
            adjustments=adjustments
        )

    # Execute adjustments
    try:
        for adj in adjustments:
            if adj.action != "HOLD":
                holding = db.query(PortfolioHolding).filter(
                    PortfolioHolding.user_id == user_id,
                    PortfolioHolding.symbol == adj.symbol
                ).first()
                if holding:
                    new_shares = max(1, holding.shares + adj.shares_delta)
                    holding.shares = new_shares
                    holding.invested_value = round(new_shares * holding.average_buy_price, 2)
                    holding.updated_at = datetime.now(timezone.utc)

        # Audit transaction
        ref_id = f"NVR-REB-{uuid.uuid4().hex[:8].upper()}"
        tx = SimulatedTransaction(
            user_id=user_id,
            type="REBALANCE_BUY",
            amount=total_val,
            description=f"Portfolio Rebalancing ({actionable_count} securities adjusted to eliminate drift)",
            status="COMPLETED",
            reference_id=ref_id,
            created_at=datetime.now(timezone.utc)
        )
        db.add(tx)

        # Notification
        notif = Notification(
            user_id=user_id,
            title="Portfolio Rebalance Executed",
            message=f"Successfully rebalanced {actionable_count} positions to restore target weights.",
            type="REBALANCE",
            read=False,
            created_at=datetime.now(timezone.utc)
        )
        db.add(notif)

        db.commit()

        return RebalanceResponse(
            success=True,
            message=f"Successfully executed simulated rebalance across {actionable_count} positions.",
            trades_count=actionable_count,
            adjustments=adjustments
        )

    except Exception as exc:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Rebalance execution failed: {str(exc)}"
        )
