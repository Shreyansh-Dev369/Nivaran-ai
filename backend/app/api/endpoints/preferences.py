import json
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from backend.app.db.database import get_db
from backend.app.db.models import User, InvestmentPreference
from backend.app.schemas.preference import PreferenceResponse, PreferenceUpdateRequest
from backend.app.api.deps import get_current_user

router = APIRouter()


@router.get("", response_model=PreferenceResponse)
def get_preferences(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Retrieve saved investment preferences for the authenticated user."""
    prefs = db.query(InvestmentPreference).filter(InvestmentPreference.user_id == user.id).first()
    if not prefs:
        prefs = InvestmentPreference(user_id=user.id)
        db.add(prefs)
        db.commit()
        db.refresh(prefs)

    try:
        pref_sectors = json.loads(prefs.preferred_sectors) if prefs.preferred_sectors else []
    except Exception:
        pref_sectors = ["Technology", "Banking & Finance", "Energy & Utilities"]

    try:
        exc_sectors = json.loads(prefs.excluded_sectors) if prefs.excluded_sectors else []
    except Exception:
        exc_sectors = []

    return PreferenceResponse(
        risk_tolerance=prefs.risk_tolerance,
        investment_horizon=prefs.investment_horizon,
        preferred_sectors=pref_sectors,
        excluded_sectors=exc_sectors,
        max_single_stock_cap=prefs.max_single_stock_cap,
        rebalance_threshold=prefs.rebalance_threshold,
        simulated_amount=prefs.simulated_amount,
        frequency=prefs.frequency,
        plan_name=prefs.plan_name,
        plan_status=prefs.plan_status
    )


@router.put("", response_model=PreferenceResponse)
def update_preferences(
    req: PreferenceUpdateRequest,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update saved investment preferences for the authenticated user."""
    prefs = db.query(InvestmentPreference).filter(InvestmentPreference.user_id == user.id).first()
    if not prefs:
        prefs = InvestmentPreference(user_id=user.id)
        db.add(prefs)

    if req.risk_tolerance is not None:
        prefs.risk_tolerance = req.risk_tolerance
    if req.investment_horizon is not None:
        prefs.investment_horizon = req.investment_horizon
    if req.preferred_sectors is not None:
        prefs.preferred_sectors = json.dumps(req.preferred_sectors)
    if req.excluded_sectors is not None:
        prefs.excluded_sectors = json.dumps(req.excluded_sectors)
    if req.max_single_stock_cap is not None:
        prefs.max_single_stock_cap = req.max_single_stock_cap
    if req.rebalance_threshold is not None:
        prefs.rebalance_threshold = req.rebalance_threshold
    if req.simulated_amount is not None:
        prefs.simulated_amount = req.simulated_amount
    if req.frequency is not None:
        prefs.frequency = req.frequency
    if req.plan_name is not None:
        prefs.plan_name = req.plan_name
    if req.plan_status is not None:
        prefs.plan_status = req.plan_status

    prefs.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(prefs)

    try:
        pref_sectors = json.loads(prefs.preferred_sectors) if prefs.preferred_sectors else []
    except Exception:
        pref_sectors = []

    try:
        exc_sectors = json.loads(prefs.excluded_sectors) if prefs.excluded_sectors else []
    except Exception:
        exc_sectors = []

    return PreferenceResponse(
        risk_tolerance=prefs.risk_tolerance,
        investment_horizon=prefs.investment_horizon,
        preferred_sectors=pref_sectors,
        excluded_sectors=exc_sectors,
        max_single_stock_cap=prefs.max_single_stock_cap,
        rebalance_threshold=prefs.rebalance_threshold,
        simulated_amount=prefs.simulated_amount,
        frequency=prefs.frequency,
        plan_name=prefs.plan_name,
        plan_status=prefs.plan_status
    )
