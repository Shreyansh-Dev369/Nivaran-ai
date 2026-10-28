from typing import List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from backend.app.db.database import get_db
from backend.app.db.models import User, SimulatedTransaction
from backend.app.schemas.transaction import TransactionResponse
from backend.app.api.deps import get_current_user

router = APIRouter()


@router.get("", response_model=List[TransactionResponse])
def get_transaction_history(
    tx_type: Optional[str] = Query(None, description="Filter by transaction type"),
    limit: int = Query(50, ge=1, le=200),
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Retrieve persistent chronological transaction and audit history for the authenticated user.
    Includes simulated deposits, automated allocation runs, and rebalancing adjustments.
    """
    query = db.query(SimulatedTransaction).filter(SimulatedTransaction.user_id == user.id)
    if tx_type and tx_type.upper() != "ALL":
        query = query.filter(SimulatedTransaction.type == tx_type.upper())

    records = query.order_by(SimulatedTransaction.created_at.desc()).limit(limit).all()
    return records
