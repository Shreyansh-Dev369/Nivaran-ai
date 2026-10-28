from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime, timezone

from backend.app.db.database import get_db
from backend.app.db.models import User, Profile
from backend.app.schemas.profile import ProfileResponse, ProfileUpdateRequest
from backend.app.api.deps import get_current_user

router = APIRouter()


@router.get("", response_model=ProfileResponse)
def get_profile(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Retrieve profile of the authenticated user."""
    profile = db.query(Profile).filter(Profile.user_id == user.id).first()
    if not profile:
        profile = Profile(user_id=user.id, full_name="Demo Investor")
        db.add(profile)
        db.commit()
        db.refresh(profile)

    return ProfileResponse(
        id=profile.id,
        user_id=profile.user_id,
        full_name=profile.full_name,
        phone=profile.phone,
        investor_tier=profile.investor_tier,
        pan_masked=profile.pan_masked,
        bio=profile.bio
    )


@router.put("", response_model=ProfileResponse)
def update_profile(
    req: ProfileUpdateRequest,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update profile information of the authenticated user."""
    profile = db.query(Profile).filter(Profile.user_id == user.id).first()
    if not profile:
        profile = Profile(user_id=user.id)
        db.add(profile)

    if req.full_name is not None:
        profile.full_name = req.full_name
    if req.phone is not None:
        profile.phone = req.phone
    if req.bio is not None:
        profile.bio = req.bio

    profile.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(profile)

    return ProfileResponse(
        id=profile.id,
        user_id=profile.user_id,
        full_name=profile.full_name,
        phone=profile.phone,
        investor_tier=profile.investor_tier,
        pan_masked=profile.pan_masked,
        bio=profile.bio
    )
