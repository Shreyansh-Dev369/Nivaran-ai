import json
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from backend.app.db.database import get_db
from backend.app.db.models import User, AllocationRun
from backend.app.schemas.allocation import (
    AllocationExecuteRequest,
    AllocationResponse,
    AllocationItemResult
)
from backend.app.services.allocation_service import execute_virtual_allocation
from backend.app.api.deps import get_current_user

router = APIRouter()


def _format_allocation_response(run: AllocationRun) -> AllocationResponse:
    try:
        raw_items = json.loads(run.allocations_json) if run.allocations_json else []
        items = [AllocationItemResult(**item) for item in raw_items]
    except Exception:
        items = []

    return AllocationResponse(
        id=run.id,
        reference_id=run.reference_id,
        plan_name=run.plan_name,
        deployed_amount=run.deployed_amount,
        remaining_balance=run.remaining_balance,
        status=run.status,
        allocations=items,
        created_at=run.created_at
    )


@router.post("", response_model=AllocationResponse)
def run_allocation(
    req: AllocationExecuteRequest,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Execute automatic virtual allocation:
    - Verifies available virtual balance
    - Distributes capital across recommended candidate stocks
    - Enforces max single stock caps and whole-share calculations
    - Atomically updates wallet balance and creates/updates persistent holdings
    """
    return execute_virtual_allocation(
        db=db,
        user_id=user.id,
        custom_amount=req.amount,
        plan_name=req.plan_name
    )


@router.get("", response_model=List[AllocationResponse])
def list_allocations(
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """List historical allocation runs for the authenticated user."""
    runs = db.query(AllocationRun).filter(
        AllocationRun.user_id == user.id
    ).order_by(AllocationRun.created_at.desc()).all()

    return [_format_allocation_response(r) for r in runs]


@router.get("/{allocation_id}", response_model=AllocationResponse)
def get_allocation_by_id(
    allocation_id: str,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Retrieve details for a specific allocation run."""
    run = db.query(AllocationRun).filter(
        AllocationRun.id == allocation_id,
        AllocationRun.user_id == user.id
    ).first()

    if not run:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Allocation run '{allocation_id}' not found."
        )

    return _format_allocation_response(run)
