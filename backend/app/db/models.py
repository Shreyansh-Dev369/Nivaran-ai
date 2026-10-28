import uuid
from datetime import datetime, timezone
from sqlalchemy import (
    Column,
    String,
    Float,
    Integer,
    Boolean,
    DateTime,
    ForeignKey,
    Text,
    Numeric
)
from sqlalchemy.orm import relationship
from backend.app.db.database import Base


def generate_uuid() -> str:
    return str(uuid.uuid4())


def utc_now() -> datetime:
    return datetime.now(timezone.utc)


class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=generate_uuid)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), default=utc_now)
    updated_at = Column(DateTime(timezone=True), default=utc_now, onupdate=utc_now)

    # Relationships
    profile = relationship("Profile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    preferences = relationship("InvestmentPreference", back_populates="user", uselist=False, cascade="all, delete-orphan")
    wallet = relationship("VirtualWallet", back_populates="user", uselist=False, cascade="all, delete-orphan")
    holdings = relationship("PortfolioHolding", back_populates="user", cascade="all, delete-orphan")
    transactions = relationship("SimulatedTransaction", back_populates="user", cascade="all, delete-orphan")
    allocations = relationship("AllocationRun", back_populates="user", cascade="all, delete-orphan")
    goals = relationship("Goal", back_populates="user", cascade="all, delete-orphan")
    notifications = relationship("Notification", back_populates="user", cascade="all, delete-orphan")


class Profile(Base):
    __tablename__ = "profiles"

    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    full_name = Column(String, default="Demo Investor")
    phone = Column(String, default="+91 98765 43210")
    investor_tier = Column(String, default="Tier 1 Verified (Demo)")
    pan_masked = Column(String, default="ABCDE****F")
    bio = Column(Text, default="Simulated Equity Investor exploring rules-based allocation.")
    updated_at = Column(DateTime(timezone=True), default=utc_now, onupdate=utc_now)

    user = relationship("User", back_populates="profile")


class InvestmentPreference(Base):
    __tablename__ = "investment_preferences"

    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    risk_tolerance = Column(String, default="BALANCED")  # CONSERVATIVE, BALANCED, GROWTH
    investment_horizon = Column(String, default="LONG")  # SHORT, MEDIUM, LONG
    preferred_sectors = Column(Text, default='["Technology", "Banking & Finance", "Energy & Utilities"]')
    excluded_sectors = Column(Text, default='[]')
    max_single_stock_cap = Column(Float, default=25.0)  # percentage
    rebalance_threshold = Column(Float, default=5.0)    # percentage
    simulated_amount = Column(Float, default=25000.0)
    frequency = Column(String, default="MONTHLY")        # MONTHLY, WEEKLY, ONE_TIME
    plan_name = Column(String, default="Core Indian Growth Plan")
    plan_status = Column(String, default="ACTIVE")       # ACTIVE, PAUSED, STOPPED
    updated_at = Column(DateTime(timezone=True), default=utc_now, onupdate=utc_now)

    user = relationship("User", back_populates="preferences")


class Stock(Base):
    __tablename__ = "stocks"

    symbol = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    exchange = Column(String, default="NSE")
    sector = Column(String, index=True, nullable=False)
    current_price = Column(Float, nullable=False)
    previous_close = Column(Float, nullable=False)
    change = Column(Float, default=0.0)
    change_percent = Column(Float, default=0.0)
    market_cap_cr = Column(Float, default=0.0)
    pe_ratio = Column(Float, default=0.0)
    pb_ratio = Column(Float, default=0.0)
    div_yield = Column(Float, default=0.0)
    fifty_two_week_high = Column(Float, default=0.0)
    fifty_two_week_low = Column(Float, default=0.0)
    beta = Column(Float, default=1.0)
    risk_level = Column(String, default="BALANCED")
    description = Column(Text, default="")
    selection_rationale = Column(Text, default="")
    key_risks = Column(Text, default="[]")
    history = Column(Text, default="[]")
    is_eligible = Column(Boolean, default=True)
    updated_at = Column(DateTime(timezone=True), default=utc_now, onupdate=utc_now)


class VirtualWallet(Base):
    __tablename__ = "virtual_wallets"

    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    balance = Column(Float, default=50000.0)
    currency = Column(String, default="INR")
    total_deposited = Column(Float, default=150000.0)
    updated_at = Column(DateTime(timezone=True), default=utc_now, onupdate=utc_now)

    user = relationship("User", back_populates="wallet")
    deposits = relationship("VirtualDeposit", back_populates="wallet", cascade="all, delete-orphan")


class VirtualDeposit(Base):
    __tablename__ = "virtual_deposits"

    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    wallet_id = Column(String, ForeignKey("virtual_wallets.id", ondelete="CASCADE"), nullable=False)
    amount = Column(Float, nullable=False)
    reference_id = Column(String, nullable=False)
    description = Column(Text, default="")
    status = Column(String, default="COMPLETED")
    created_at = Column(DateTime(timezone=True), default=utc_now)

    wallet = relationship("VirtualWallet", back_populates="deposits")


class AllocationRun(Base):
    __tablename__ = "allocation_runs"

    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    plan_name = Column(String, default="Automated Allocation Plan")
    deployed_amount = Column(Float, nullable=False)
    remaining_balance = Column(Float, nullable=False)
    reference_id = Column(String, nullable=False)
    allocations_json = Column(Text, default="[]")
    status = Column(String, default="COMPLETED")
    created_at = Column(DateTime(timezone=True), default=utc_now)

    user = relationship("User", back_populates="allocations")


class PortfolioHolding(Base):
    __tablename__ = "portfolio_holdings"

    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    symbol = Column(String, ForeignKey("stocks.symbol"), nullable=False)
    shares = Column(Integer, default=0, nullable=False)
    average_buy_price = Column(Float, nullable=False)
    invested_value = Column(Float, nullable=False)
    target_weight = Column(Float, default=0.0)
    created_at = Column(DateTime(timezone=True), default=utc_now)
    updated_at = Column(DateTime(timezone=True), default=utc_now, onupdate=utc_now)

    user = relationship("User", back_populates="holdings")
    stock = relationship("Stock")


class SimulatedTransaction(Base):
    __tablename__ = "simulated_transactions"

    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    type = Column(String, nullable=False)  # DEPOSIT, INVESTMENT, REBALANCE_BUY, REBALANCE_SELL, WITHDRAWAL, PLAN_TRIGGER
    amount = Column(Float, nullable=False)
    symbol = Column(String, nullable=True)
    shares = Column(Integer, nullable=True)
    price = Column(Float, nullable=True)
    description = Column(Text, nullable=False)
    status = Column(String, default="COMPLETED")
    reference_id = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), default=utc_now)

    user = relationship("User", back_populates="transactions")


class Goal(Base):
    __tablename__ = "goals"

    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    name = Column(String, nullable=False)
    target_amount = Column(Float, nullable=False)
    current_amount = Column(Float, default=0.0)
    monthly_contribution = Column(Float, default=0.0)
    target_date = Column(String, nullable=False)
    category = Column(String, default="WEALTH")
    created_at = Column(DateTime(timezone=True), default=utc_now)

    user = relationship("User", back_populates="goals")


class Notification(Base):
    __tablename__ = "notifications"

    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    title = Column(String, nullable=False)
    message = Column(Text, nullable=False)
    read = Column(Boolean, default=False)
    type = Column(String, default="SYSTEM")
    created_at = Column(DateTime(timezone=True), default=utc_now)

    user = relationship("User", back_populates="notifications")
