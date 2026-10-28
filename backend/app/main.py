"""
Nivaran Full-Stack Investment Simulation Platform
FastAPI Application Entry Point
"""

from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.app.core.config import settings
from backend.app.db.database import init_db, SessionLocal
from backend.app.db.seed import seed_all_stocks, seed_demo_investor

# Router imports
from backend.app.api.endpoints import (
    health,
    auth,
    profile,
    preferences,
    stocks,
    recommendations,
    allocations,
    wallet,
    portfolio,
    transactions,
    demo
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: initialize database tables and seed sample records
    init_db()
    db = SessionLocal()
    try:
        seed_all_stocks(db)
        seed_demo_investor(db)
    finally:
        db.close()
    yield
    # Shutdown clean up if any


app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Educational, rule-based investment simulation and portfolio management web application for college demonstration.",
    lifespan=lifespan
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For convenient college demonstration across local IPs/ports
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register endpoints
app.include_router(health.router, tags=["Health"])
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(profile.router, prefix="/api/profile", tags=["Profile"])
app.include_router(preferences.router, prefix="/api/preferences", tags=["Preferences"])
app.include_router(stocks.router, prefix="/api/stocks", tags=["Stocks Catalogue"])
app.include_router(recommendations.router, prefix="/api/recommendations", tags=["Recommendation Engine"])
app.include_router(allocations.router, prefix="/api/allocations", tags=["Automatic Allocation"])
app.include_router(wallet.router, prefix="/api/wallet", tags=["Virtual Wallet"])
app.include_router(portfolio.router, prefix="/api/portfolio", tags=["Portfolio & Valuation"])
app.include_router(transactions.router, prefix="/api/transactions", tags=["Activity & Transactions"])
app.include_router(demo.router, prefix="/api/demo", tags=["Demo Management"])


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.app.main:app", host="127.0.0.1", port=8000, reload=True)
