from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from backend.app.db.database import get_db
from backend.app.db.seed import seed_all_stocks, seed_demo_investor
from backend.app.api.deps import get_current_user
from backend.app.db.models import (
    User,
    PortfolioHolding,
    SimulatedTransaction,
    AllocationRun,
    VirtualWallet,
    Notification
)

router = APIRouter()


@router.post("/reset")
def reset_demo_state(db: Session = Depends(get_db)):
    """
    Restore baseline demonstration data:
    - Ensures stock catalogue is fully populated with 20 Indian equities
    - Restores Arjun Sharma demo investor with default holdings (₹1.84L) and cash (₹50k)
    """
    seed_all_stocks(db)
    seed_demo_investor(db)
    return {
        "success": True,
        "message": "Demo sandbox state successfully restored to baseline evaluation configuration."
    }


@router.post("/reset-user")
def reset_current_user(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """
    Reset the authenticated user's portfolio to a clean state with ₹1,00,000 virtual cash and zero holdings.
    """
    # Delete holdings, allocation runs, transactions
    db.query(PortfolioHolding).filter(PortfolioHolding.user_id == user.id).delete()
    db.query(AllocationRun).filter(AllocationRun.user_id == user.id).delete()
    db.query(SimulatedTransaction).filter(SimulatedTransaction.user_id == user.id).delete()

    # Reset wallet
    wallet = db.query(VirtualWallet).filter(VirtualWallet.user_id == user.id).first()
    if wallet:
        wallet.balance = 100000.0
        wallet.total_deposited = 100000.0
    else:
        wallet = VirtualWallet(user_id=user.id, balance=100000.0, total_deposited=100000.0)
        db.add(wallet)

    # Initial transaction
    tx = SimulatedTransaction(
        user_id=user.id,
        type="DEPOSIT",
        amount=100000.0,
        description="Fresh Demo Sandbox Capital (₹1,00,000)",
        status="COMPLETED",
        reference_id="NVR-INIT-FRESH"
    )
    db.add(tx)

    db.commit()
    return {
        "success": True,
        "message": "Account reset to fresh sandbox with ₹1,00,000 virtual cash and 0 holdings."
    }
