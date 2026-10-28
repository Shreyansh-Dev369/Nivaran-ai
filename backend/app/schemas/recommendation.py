from pydantic import BaseModel
from typing import List, Optional


class RecommendationItem(BaseModel):
    symbol: str
    name: str
    sector: str
    percentage: float
    target_amount: float
    estimated_shares: int
    rationale: str
    risk_factor: str
    score: float


class RecommendationResponse(BaseModel):
    plan_name: str
    risk_tolerance: str
    candidates_evaluated: int
    allocations: List[RecommendationItem]
    total_percentage: float
    methodology: str = "Deterministic Rule-Based Scoring Engine"
    explanation: str
