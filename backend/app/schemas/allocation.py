from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime


class AllocationItemResult(BaseModel):
    symbol: str
    name: str
    sector: str
    percentage: float
    allocated_amount: float
    shares: int
    price: float
    rationale: str


class AllocationExecuteRequest(BaseModel):
    amount: Optional[float] = Field(None, gt=0, le=10000000)
    plan_name: Optional[str] = None


class AllocationResponse(BaseModel):
    id: str
    reference_id: str
    plan_name: str
    deployed_amount: float
    remaining_balance: float
    status: str
    allocations: List[AllocationItemResult]
    created_at: datetime
