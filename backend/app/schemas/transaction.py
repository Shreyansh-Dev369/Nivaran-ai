from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime


class TransactionResponse(BaseModel):
    id: str
    type: str
    amount: float
    symbol: Optional[str] = None
    shares: Optional[int] = None
    price: Optional[float] = None
    description: str
    status: str
    reference_id: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
