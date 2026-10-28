import json
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from backend.app.db.database import get_db
from backend.app.db.models import Stock
from backend.app.schemas.stock import StockResponse, StockHistoryPoint

router = APIRouter()


def _format_stock_response(s: Stock) -> StockResponse:
    try:
        risks = json.loads(s.key_risks) if s.key_risks else []
    except Exception:
        risks = []

    try:
        raw_history = json.loads(s.history) if s.history else []
        history = [StockHistoryPoint(**p) for p in raw_history]
    except Exception:
        history = []

    return StockResponse(
        symbol=s.symbol,
        name=s.name,
        exchange=s.exchange,
        sector=s.sector,
        current_price=s.current_price,
        previous_close=s.previous_close,
        change=s.change,
        change_percent=s.change_percent,
        market_cap_cr=s.market_cap_cr,
        pe_ratio=s.pe_ratio,
        pb_ratio=s.pb_ratio,
        div_yield=s.div_yield,
        fifty_two_week_high=s.fifty_two_week_high,
        fifty_two_week_low=s.fifty_two_week_low,
        beta=s.beta,
        risk_level=s.risk_level,
        description=s.description or "",
        selection_rationale=s.selection_rationale or "",
        key_risks=risks,
        history=history,
        is_eligible=s.is_eligible
    )


@router.get("", response_model=List[StockResponse])
def list_stocks(
    search: Optional[str] = Query(None, description="Search by symbol or company name"),
    sector: Optional[str] = Query(None, description="Filter by stock sector"),
    exchange: Optional[str] = Query(None, description="Filter by exchange (NSE/BSE)"),
    risk_level: Optional[str] = Query(None, description="Filter by risk tier (CONSERVATIVE/BALANCED/GROWTH)"),
    db: Session = Depends(get_db)
):
    """
    Retrieve stock catalogue backed by persistent stock records.
    Supports search query, sector filter, exchange filter, and risk tolerance filter.
    """
    query = db.query(Stock)

    if search:
        search_term = f"%{search.lower()}%"
        query = query.filter(
            (Stock.symbol.ilike(search_term)) | (Stock.name.ilike(search_term))
        )
    if sector and sector.upper() != "ALL":
        query = query.filter(Stock.sector == sector)
    if exchange and exchange.upper() != "ALL":
        query = query.filter(Stock.exchange == exchange.upper())
    if risk_level and risk_level.upper() != "ALL":
        query = query.filter(Stock.risk_level == risk_level.upper())

    stocks = query.order_by(Stock.market_cap_cr.desc()).all()
    return [_format_stock_response(s) for s in stocks]


@router.get("/{symbol}", response_model=StockResponse)
def get_stock_by_symbol(symbol: str, db: Session = Depends(get_db)):
    """Retrieve detailed information for a single security by its ticker symbol."""
    stock = db.query(Stock).filter(Stock.symbol == symbol.upper()).first()
    if not stock:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Security with symbol '{symbol}' was not found in the catalogue."
        )
    return _format_stock_response(stock)
