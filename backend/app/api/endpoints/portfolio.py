from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from backend.app.db.database import get_db
from backend.app.db.models import User
from backend.app.schemas.portfolio import PortfolioAnalyticsResponse, RebalanceResponse
from backend.app.services.portfolio_service import get_portfolio_analytics, rebalance_user_portfolio
from backend.app.api.deps import get_current_user

router = APIRouter()


@router.get("", response_model=PortfolioAnalyticsResponse)
def get_portfolio(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """
    Retrieve live simulated portfolio analytics, holdings valuation, P&L,
    sector diversification, and Herfindahl-Hirschman Index (HHI) concentration score.
    """
    return get_portfolio_analytics(db, user.id)


@router.post("/rebalance", response_model=RebalanceResponse)
def trigger_rebalance(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """
    Evaluate allocation drift across active holdings against target policy weights,
    and execute simulated rebalancing trades where drift exceeds the threshold.
    """
    return rebalance_user_portfolio(db, user.id)
