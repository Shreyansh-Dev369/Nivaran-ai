from pydantic import BaseModel, ConfigDict
from typing import List, Optional, Any


class StockHistoryPoint(BaseModel):
    date: str
    price: float


class StockResponse(BaseModel):
    symbol: str
    name: str
    exchange: str = "NSE"
    sector: str
    current_price: float
    previous_close: float
    change: float
    change_percent: float
    market_cap_cr: float
    pe_ratio: float
    pb_ratio: float
    div_yield: float
    fifty_two_week_high: float
    fifty_two_week_low: float
    beta: float
    risk_level: str
    description: str
    selection_rationale: str
    key_risks: List[str] = []
    history: List[StockHistoryPoint] = []
    is_eligible: bool = True

    model_config = ConfigDict(from_attributes=True)
