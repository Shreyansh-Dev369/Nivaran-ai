def test_portfolio_valuation_and_analytics(client, auth_headers):
    res = client.get("/api/portfolio", headers=auth_headers)
    assert res.status_code == 200
    data = res.json()

    assert "total_portfolio_value" in data
    assert "total_invested" in data
    assert "total_holdings_value" in data
    assert "total_unrealized_pnl" in data
    assert "diversification_score" in data
    assert "sector_distribution" in data

    # Arithmetic checks
    calculated_portfolio_value = round(data["total_holdings_value"] + data["cash_balance"], 2)
    assert round(data["total_portfolio_value"], 2) == calculated_portfolio_value

    calculated_pnl = round(data["total_holdings_value"] - data["total_invested"], 2)
    assert round(data["total_unrealized_pnl"], 2) == calculated_pnl


def test_rebalance_execution(client, auth_headers):
    res = client.post("/api/portfolio/rebalance", headers=auth_headers)
    assert res.status_code == 200
    data = res.json()
    assert "success" in data
    assert "message" in data
    assert "trades_count" in data


def test_transaction_history_retrieval(client, auth_headers):
    res = client.get("/api/transactions", headers=auth_headers)
    assert res.status_code == 200
    txs = res.json()
    assert isinstance(txs, list)
    if txs:
        assert "type" in txs[0]
        assert "reference_id" in txs[0]
