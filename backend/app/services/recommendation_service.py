"""
Recommendation Service — Rule-Based Recommendation Engine

Adheres to Section 11 of Master Specification:
- Deterministic, explainable scoring
- Filters candidate universe based on eligibility and sector preferences/exclusions
- Scores securities using volatility (Beta), dividend yield, market capitalization, and risk tier alignment
- Enforces concentration caps and normalizes weights to sum to exactly 100.0%
- Provides educational rationale and identified risk factors
"""

import json
from typing import List, Dict, Any, Tuple
from sqlalchemy.orm import Session
from backend.app.db.models import Stock, InvestmentPreference
from backend.app.schemas.recommendation import RecommendationItem, RecommendationResponse


def get_recommendations_for_user(
    db: Session,
    prefs: InvestmentPreference,
    custom_amount: float = None
) -> RecommendationResponse:
    """
    Generate deterministic rule-based stock recommendations based on user preferences.
    """
    amount = custom_amount if custom_amount and custom_amount > 0 else prefs.simulated_amount
    risk_tolerance = prefs.risk_tolerance or "BALANCED"
    max_cap = prefs.max_single_stock_cap or 25.0

    # Parse preferred and excluded sectors
    try:
        preferred_sectors = json.loads(prefs.preferred_sectors) if prefs.preferred_sectors else []
    except Exception:
        preferred_sectors = ["Technology", "Banking & Finance", "Energy & Utilities"]

    try:
        excluded_sectors = json.loads(prefs.excluded_sectors) if prefs.excluded_sectors else []
    except Exception:
        excluded_sectors = []

    # 1. Fetch eligible stocks
    all_stocks = db.query(Stock).filter(Stock.is_eligible == True).all()  # noqa
    if not all_stocks:
        return RecommendationResponse(
            plan_name=prefs.plan_name,
            risk_tolerance=risk_tolerance,
            candidates_evaluated=0,
            allocations=[],
            total_percentage=0.0,
            explanation="No eligible securities found in catalogue."
        )

    excluded_set = set(excluded_sectors)
    preferred_set = set(preferred_sectors)

    # 2. Filter candidate universe
    candidates = [s for s in all_stocks if s.sector not in excluded_set]
    if preferred_set:
        preferred_candidates = [s for s in candidates if s.sector in preferred_set]
        if len(preferred_candidates) >= 3:
            candidates = preferred_candidates

    if len(candidates) < 3:
        # Fallback to general universe if too few match
        candidates = [s for s in all_stocks if s.sector not in excluded_set]
    if not candidates:
        candidates = all_stocks[:5]

    # 3. Deterministic scoring
    # Formula:
    # Base: 10
    # Risk match: +20
    # Beta suitability: +15
    # Quality / Size / Dividend: +10-15
    # User sector preference boost: +15
    scored: List[Tuple[Stock, float]] = []
    for s in candidates:
        score = 10.0

        if risk_tolerance == "CONSERVATIVE":
            if s.risk_level == "CONSERVATIVE":
                score += 20.0
            elif s.risk_level == "BALANCED":
                score += 10.0
            if s.beta <= 0.85:
                score += 15.0
            if s.div_yield >= 1.0:
                score += 10.0
            score += min(10.0, s.market_cap_cr / 150000.0)

        elif risk_tolerance == "BALANCED":
            if s.risk_level == "BALANCED":
                score += 20.0
            elif s.risk_level == "CONSERVATIVE":
                score += 12.0
            elif s.risk_level == "GROWTH":
                score += 8.0
            if 0.70 <= s.beta <= 1.20:
                score += 15.0
            score += min(10.0, s.market_cap_cr / 200000.0)

        else:  # GROWTH
            if s.risk_level == "GROWTH":
                score += 25.0
            elif s.risk_level == "BALANCED":
                score += 15.0
            if s.beta >= 1.0:
                score += 15.0
            if s.sector in ["Technology", "Automobile", "Consumer Goods"]:
                score += 10.0

        if s.sector in preferred_set:
            score += 15.0

        scored.append((s, round(score, 2)))

    # Sort descending by score, tiebreak by market_cap_cr
    scored.sort(key=lambda x: (x[1], x[0].market_cap_cr), reverse=True)

    # Pick top 5 securities (or up to 7)
    selected_count = min(5, len(scored))
    top_candidates = scored[:selected_count]

    # 4. Weight calculation & Concentration Capping
    # Raw weight = score / total_score
    total_score = sum(item[1] for item in top_candidates)
    raw_weights = [(item[0], item[1], (item[1] / total_score) * 100.0) for item in top_candidates]

    # Apply max single stock cap (e.g. 25%)
    capped_weights: List[Dict[str, Any]] = []
    excess = 0.0

    for stock, score, w in raw_weights:
        if w > max_cap:
            excess += (w - max_cap)
            capped_weights.append({"stock": stock, "score": score, "weight": max_cap, "capped": True})
        else:
            capped_weights.append({"stock": stock, "score": score, "weight": w, "capped": False})

    # Redistribute excess proportionally to uncapped
    uncapped = [item for item in capped_weights if not item["capped"]]
    if excess > 0 and uncapped:
        uncapped_sum = sum(item["weight"] for item in uncapped)
        for item in uncapped:
            share = (item["weight"] / uncapped_sum) * excess
            item["weight"] = min(max_cap, item["weight"] + share)

    # Normalize to exactly 100% with whole percentage integer rounding
    total_rounded = 0
    final_items: List[RecommendationItem] = []

    for idx, item in enumerate(capped_weights):
        stock: Stock = item["stock"]
        pct = round(item["weight"])
        total_rounded += pct

    diff = 100 - total_rounded
    if capped_weights:
        capped_weights[0]["weight"] += diff

    for item in capped_weights:
        stock = item["stock"]
        pct = round(item["weight"])
        target_amt = round((amount * pct) / 100.0, 2)
        price = stock.current_price if stock.current_price > 0 else 1000.0
        shares = max(1, int(round(target_amt / price)))

        # Key risk string
        risk_str = "Market volatility"
        try:
            risks = json.loads(stock.key_risks) if stock.key_risks else []
            if risks and isinstance(risks, list):
                risk_str = risks[0]
        except Exception:
            pass

        final_items.append(
            RecommendationItem(
                symbol=stock.symbol,
                name=stock.name,
                sector=stock.sector,
                percentage=float(pct),
                target_amount=target_amt,
                estimated_shares=shares,
                rationale=stock.selection_rationale or f"Top-ranked in {stock.sector} for {risk_tolerance.lower()} mandate.",
                risk_factor=risk_str,
                score=item["score"]
            )
        )

    total_pct = sum(i.percentage for i in final_items)

    explanation = (
        f"Evaluated {len(all_stocks)} Indian blue-chip stocks against your {risk_tolerance.lower()} mandate. "
        f"Selected top {len(final_items)} securities with single-stock concentration capped at {int(max_cap)}% "
        f"and total allocation summing to exactly {int(total_pct)}%."
    )

    return RecommendationResponse(
        plan_name=prefs.plan_name or "Core Indian Growth Plan",
        risk_tolerance=risk_tolerance,
        candidates_evaluated=len(all_stocks),
        allocations=final_items,
        total_percentage=total_pct,
        methodology="Deterministic Rule-Based Scoring Engine",
        explanation=explanation
    )
