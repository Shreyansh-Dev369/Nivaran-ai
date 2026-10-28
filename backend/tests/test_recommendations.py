def test_stock_catalogue(client):
    res = client.get("/api/stocks")
    assert res.status_code == 200
    stocks = res.json()
    assert len(stocks) >= 5
    assert any(s["symbol"] == "RELIANCE" for s in stocks)

    # Search filter
    search_res = client.get("/api/stocks?search=TCS")
    assert search_res.status_code == 200
    assert any(s["symbol"] == "TCS" for s in search_res.json())

    # Sector filter
    sec_res = client.get("/api/stocks?sector=Technology")
    assert sec_res.status_code == 200
    assert all(s["sector"] == "Technology" for s in sec_res.json())


def test_recommendation_engine_conservative(client, auth_headers):
    # Set conservative
    client.put("/api/preferences", headers=auth_headers, json={"risk_tolerance": "CONSERVATIVE"})

    res = client.get("/api/recommendations", headers=auth_headers)
    assert res.status_code == 200
    data = res.json()
    assert data["risk_tolerance"] == "CONSERVATIVE"
    assert len(data["allocations"]) > 0

    # Total percentage must equal exactly 100%
    total_pct = sum(item["percentage"] for item in data["allocations"])
    assert total_pct == 100.0

    # Max single stock cap enforced (<= 25%)
    assert all(item["percentage"] <= 25.0 for item in data["allocations"])

    # Ensure every recommendation provides an educational rationale & risk factor
    for item in data["allocations"]:
        assert len(item["rationale"]) > 5
        assert len(item["risk_factor"]) > 2


def test_recommendation_engine_growth(client, auth_headers):
    # Set growth
    client.put(
        "/api/preferences",
        headers=auth_headers,
        json={
            "risk_tolerance": "GROWTH",
            "preferred_sectors": ["Technology", "Automobile", "Consumer Goods"],
            "max_single_stock_cap": 25.0
        }
    )

    res = client.get("/api/recommendations", headers=auth_headers)
    assert res.status_code == 200
    data = res.json()
    assert data["risk_tolerance"] == "GROWTH"
    total_pct = sum(item["percentage"] for item in data["allocations"])
    assert total_pct == 100.0
