from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from datetime import datetime


class WalletResponse(BaseModel):
    id: str
    user_id: str
    balance: float
    currency: str = "INR"
    total_deposited: float

    model_config = ConfigDict(from_attributes=True)


class DepositRequest(BaseModel):
    amount: float = Field(..., gt=0, le=10000000, description="Virtual deposit amount in INR")
    note: Optional[str] = Field(None, max_length=200)


class DepositResponse(BaseModel):
    deposit_id: str
    amount: float
    reference_id: str
    new_balance: float
    status: str = "COMPLETED"
    message: str
    timestamp: datetime
