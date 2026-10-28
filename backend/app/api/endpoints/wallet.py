from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from backend.app.db.database import get_db
from backend.app.db.models import User
from backend.app.schemas.wallet import WalletResponse, DepositRequest, DepositResponse
from backend.app.services.wallet_service import get_user_wallet, deposit_virtual_funds
from backend.app.api.deps import get_current_user

router = APIRouter()


@router.get("", response_model=WalletResponse)
def get_wallet(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """
    Retrieve current authoritative virtual wallet balance and deposited totals.
    Note: Virtual funds only. No real money is deposited, held, or transferred.
    """
    return get_user_wallet(db, user.id)


@router.post("/deposits", response_model=DepositResponse)
def add_virtual_funds(
    req: DepositRequest,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Simulated virtual capital top-up.
    Validates amount (>0), updates virtual wallet balance atomically, and records audit entry.
    """
    return deposit_virtual_funds(db, user.id, req.amount, req.note)
