from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from backend.app.db.database import get_db
from backend.app.db.models import User, Profile, InvestmentPreference, VirtualWallet, Notification
from backend.app.core.security import get_password_hash, verify_password, create_access_token
from backend.app.schemas.auth import (
    UserRegisterRequest,
    UserLoginRequest,
    TokenResponse,
    UserResponse
)
from backend.app.api.deps import get_current_user

router = APIRouter()


@router.post("/register", response_model=TokenResponse)
def register(req: UserRegisterRequest, db: Session = Depends(get_db)):
    """Register a new user account with initial wallet and profile."""
    existing = db.query(User).filter(User.email == req.email.lower()).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email address already exists."
        )

    hashed_pw = get_password_hash(req.password)
    user = User(
        email=req.email.lower(),
        hashed_password=hashed_pw,
        created_at=datetime.now(timezone.utc)
    )
    db.add(user)
    db.flush()

    # Create associated profile
    profile = Profile(
        user_id=user.id,
        full_name=req.name,
        investor_tier="Tier 1 Verified (Demo)",
        pan_masked="ABCDE****F"
    )
    db.add(profile)

    # Create associated investment preferences
    prefs = InvestmentPreference(
        user_id=user.id,
        risk_tolerance="BALANCED",
        investment_horizon="LONG",
        simulated_amount=25000.0
    )
    db.add(prefs)

    # Create virtual wallet with 0 initial funds (user will add funds or start fresh)
    wallet = VirtualWallet(
        user_id=user.id,
        balance=0.0,
        currency="INR",
        total_deposited=0.0
    )
    db.add(wallet)

    # Welcome notification
    notif = Notification(
        user_id=user.id,
        title="Welcome to NIVARAN",
        message="Your simulated investor account is ready. Add demo funds and configure preferences to begin.",
        type="SYSTEM",
        read=False
    )
    db.add(notif)

    db.commit()
    db.refresh(user)
    db.refresh(profile)

    token = create_access_token(subject=user.id, extra_data={"email": user.email})
    return TokenResponse(
        access_token=token,
        token_type="bearer",
        user=UserResponse(
            id=user.id,
            email=user.email,
            name=profile.full_name,
            phone=profile.phone,
            investor_tier=profile.investor_tier,
            pan_masked=profile.pan_masked,
            created_at=user.created_at
        )
    )


@router.post("/login", response_model=TokenResponse)
def login(req: UserLoginRequest, db: Session = Depends(get_db)):
    """Authenticate user with email and password."""
    user = db.query(User).filter(User.email == req.email.lower()).first()
    if not user or not verify_password(req.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password."
        )

    profile = db.query(Profile).filter(Profile.user_id == user.id).first()
    full_name = profile.full_name if profile else "Investor"
    phone = profile.phone if profile else None
    tier = profile.investor_tier if profile else "Tier 1 Verified (Demo)"
    pan = profile.pan_masked if profile else "ABCDE****F"

    token = create_access_token(subject=user.id, extra_data={"email": user.email})
    return TokenResponse(
        access_token=token,
        token_type="bearer",
        user=UserResponse(
            id=user.id,
            email=user.email,
            name=full_name,
            phone=phone,
            investor_tier=tier,
            pan_masked=pan,
            created_at=user.created_at
        )
    )


@router.post("/demo-login", response_model=TokenResponse)
def quick_demo_login(db: Session = Depends(get_db)):
    """
    Instant evaluator login for demonstration.
    Logs into pre-seeded Arjun Sharma profile or creates it if not yet present.
    """
    demo_email = "arjun.sharma@example.com"
    user = db.query(User).filter(User.email == demo_email).first()

    if not user:
        from backend.app.db.seed import seed_demo_investor
        seed_demo_investor(db)
        user = db.query(User).filter(User.email == demo_email).first()

    profile = db.query(Profile).filter(Profile.user_id == user.id).first()
    token = create_access_token(subject=user.id, extra_data={"email": user.email})

    return TokenResponse(
        access_token=token,
        token_type="bearer",
        user=UserResponse(
            id=user.id,
            email=user.email,
            name=profile.full_name if profile else "Arjun Sharma",
            phone=profile.phone if profile else "+91 98765 43210",
            investor_tier=profile.investor_tier if profile else "Tier 1 Verified (Demo)",
            pan_masked=profile.pan_masked if profile else "ABCDE****F",
            created_at=user.created_at
        )
    )


@router.get("/me", response_model=UserResponse)
def get_current_user_profile(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Retrieve details for the current authenticated user."""
    profile = db.query(Profile).filter(Profile.user_id == user.id).first()
    return UserResponse(
        id=user.id,
        email=user.email,
        name=profile.full_name if profile else "Investor",
        phone=profile.phone if profile else None,
        investor_tier=profile.investor_tier if profile else "Tier 1 Verified (Demo)",
        pan_masked=profile.pan_masked if profile else "ABCDE****F",
        created_at=user.created_at
    )
