from typing import Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from pydantic import BaseModel, Field

from backend.app.db.database import get_db
from backend.app.db.models import User, InvestmentPreference
from backend.app.schemas.recommendation import RecommendationResponse
from backend.app.services.recommendation_service import get_recommendations_for_user
from backend.app.api.deps import get_current_user

router = APIRouter()


class CustomRecommendationRequest(BaseModel):
    amount: Optional[float] = Field(None, gt=0, le=10000000)
    risk_tolerance: Optional[str] = None
    preferred_sectors: Optional[list[str]] = None


@router.get("", response_model=RecommendationResponse)
def get_recommendations(
    amount: Optional[float] = Query(None, gt=0, description="Optional custom investment amount"),
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Generate deterministic, rule-based stock recommendations for the authenticated user.
    Uses saved investment preferences, candidate eligibility, and volatility metrics.
    """
    prefs = db.query(InvestmentPreference).filter(InvestmentPreference.user_id == user.id).first()
    if not prefs:
        prefs = InvestmentPreference(user_id=user.id)
        db.add(prefs)
        db.commit()
        db.refresh(prefs)

    return get_recommendations_for_user(db, prefs, custom_amount=amount)


@router.post("", response_model=RecommendationResponse)
def generate_recommendations_custom(
    req: CustomRecommendationRequest,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Generate recommendations with optional runtime parameter overrides."""
    prefs = db.query(InvestmentPreference).filter(InvestmentPreference.user_id == user.id).first()
    if not prefs:
        prefs = InvestmentPreference(user_id=user.id)
        db.add(prefs)
        db.commit()
        db.refresh(prefs)

    return get_recommendations_for_user(db, prefs, custom_amount=req.amount)
