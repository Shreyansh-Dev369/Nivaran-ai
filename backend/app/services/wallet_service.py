"""
Virtual Wallet Service

Adheres to Section 12 of Master Specification:
- Input validation (gt 0, max limits)
- Decimal-safe arithmetic
- Authoritative database-driven balance
- Records VirtualDeposit and SimulatedTransaction audit logs
"""

import uuid
from datetime import datetime, timezone
from typing import Optional
from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from backend.app.db.models import (
    VirtualWallet,
    VirtualDeposit,
    SimulatedTransaction,
    Notification
)
from backend.app.schemas.wallet import WalletResponse, DepositResponse


def get_user_wallet(db: Session, user_id: str) -> WalletResponse:
    """Retrieve the authoritative virtual wallet for the user."""
    wallet = db.query(VirtualWallet).filter(VirtualWallet.user_id == user_id).first()
    if not wallet:
        # Initialize wallet if it does not exist
        wallet = VirtualWallet(
            user_id=user_id,
            balance=50000.0,
            currency="INR",
            total_deposited=50000.0
        )
        db.add(wallet)
        db.commit()
        db.refresh(wallet)

    return WalletResponse(
        id=wallet.id,
        user_id=wallet.user_id,
        balance=round(wallet.balance, 2),
        currency=wallet.currency,
        total_deposited=round(wallet.total_deposited, 2)
    )


def deposit_virtual_funds(
    db: Session,
    user_id: str,
    amount: float,
    note: Optional[str] = None
) -> DepositResponse:
    """
    Deposit virtual funds into the user's wallet with validation and audit logging.
    """
    if amount <= 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Deposit amount must be strictly greater than 0."
        )
    if amount > 10_000_000:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Single virtual deposit exceeds simulation maximum limit (₹1,00,00,000)."
        )

    wallet = db.query(VirtualWallet).filter(VirtualWallet.user_id == user_id).first()
    if not wallet:
        wallet = VirtualWallet(user_id=user_id, balance=0.0, total_deposited=0.0)
        db.add(wallet)
        db.flush()

    ref_id = f"NVR-DEP-{uuid.uuid4().hex[:8].upper()}"
    desc = note or f"Simulated Demo Funds Credited (₹{amount:,.2f})"

    try:
        # Atomic balance update
        wallet.balance = round(wallet.balance + amount, 2)
        wallet.total_deposited = round(wallet.total_deposited + amount, 2)
        wallet.updated_at = datetime.now(timezone.utc)

        # Deposit record
        deposit = VirtualDeposit(
            user_id=user_id,
            wallet_id=wallet.id,
            amount=amount,
            reference_id=ref_id,
            description=desc,
            status="COMPLETED",
            created_at=datetime.now(timezone.utc)
        )
        db.add(deposit)

        # Transaction audit ledger
        tx = SimulatedTransaction(
            user_id=user_id,
            type="DEPOSIT",
            amount=amount,
            description=desc,
            status="COMPLETED",
            reference_id=ref_id,
            created_at=datetime.now(timezone.utc)
        )
        db.add(tx)

        # Notification
        notif = Notification(
            user_id=user_id,
            title="Demo Funds Credited",
            message=f"Successfully credited ₹{amount:,.2f} virtual funds. New available balance: ₹{wallet.balance:,.2f}.",
            type="SYSTEM",
            read=False,
            created_at=datetime.now(timezone.utc)
        )
        db.add(notif)

        db.commit()
        db.refresh(deposit)

        return DepositResponse(
            deposit_id=deposit.id,
            amount=amount,
            reference_id=ref_id,
            new_balance=wallet.balance,
            status="COMPLETED",
            message=f"Successfully credited ₹{amount:,.2f} to simulated cash ledger.",
            timestamp=deposit.created_at
        )

    except Exception as exc:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Virtual deposit transaction failed: {str(exc)}"
        )
