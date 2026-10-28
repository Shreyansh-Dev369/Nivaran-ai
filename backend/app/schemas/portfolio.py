from pydantic import BaseModel
from typing import List, Dict, Optional


class HoldingResponse(BaseModel):
    symbol: str
    name: str
    sector: str
    shares: int
    average_buy_price: float
    current_price: float
    invested_value: float
    current_value: float
    unrealized_pnl: float
    unrealized_pnl_percent: float
    current_weight: float
    target_weight: float


class SectorWeight(BaseModel):
    sector: str
    value: float
    percentage: float


class PortfolioAnalyticsResponse(BaseModel):
    cash_balance: float
    total_invested: float
    total_holdings_value: float
    total_portfolio_value: float
    total_unrealized_pnl: float
    total_unrealized_pnl_percent: float
    holdings_count: int
    sector_distribution: List[SectorWeight]
    diversification_score: int
    diversification_label: str
    holdings: List[HoldingResponse]


class RebalanceAdjustment(BaseModel):
    symbol: str
    name: str
    action: str  # BUY, SELL, HOLD
    current_weight: float
    target_weight: float
    shares_delta: int
    amount_delta: float


class RebalanceResponse(BaseModel):
    success: bool
    message: str
    trades_count: int
    adjustments: List[RebalanceAdjustment]
