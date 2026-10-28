from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional


class PreferenceResponse(BaseModel):
    risk_tolerance: str = "BALANCED"
    investment_horizon: str = "LONG"
    preferred_sectors: List[str] = ["Technology", "Banking & Finance", "Energy & Utilities"]
    excluded_sectors: List[str] = []
    max_single_stock_cap: float = 25.0
    rebalance_threshold: float = 5.0
    simulated_amount: float = 25000.0
    frequency: str = "MONTHLY"
    plan_name: str = "Core Indian Growth Plan"
    plan_status: str = "ACTIVE"

    model_config = ConfigDict(from_attributes=True)


class PreferenceUpdateRequest(BaseModel):
    risk_tolerance: Optional[str] = Field(None, pattern="^(CONSERVATIVE|BALANCED|GROWTH)$")
    investment_horizon: Optional[str] = Field(None, pattern="^(SHORT|MEDIUM|LONG)$")
    preferred_sectors: Optional[List[str]] = None
    excluded_sectors: Optional[List[str]] = None
    max_single_stock_cap: Optional[float] = Field(None, ge=10.0, le=50.0)
    rebalance_threshold: Optional[float] = Field(None, ge=1.0, le=20.0)
    simulated_amount: Optional[float] = Field(None, ge=1000.0, le=10000000.0)
    frequency: Optional[str] = Field(None, pattern="^(MONTHLY|WEEKLY|ONE_TIME)$")
    plan_name: Optional[str] = Field(None, max_length=120)
    plan_status: Optional[str] = Field(None, pattern="^(ACTIVE|PAUSED|STOPPED)$")
