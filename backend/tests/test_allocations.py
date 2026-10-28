def test_successful_virtual_allocation(client, auth_headers):
    # Ensure sufficient balance by depositing 50,000
    client.post("/api/wallet/deposits", headers=auth_headers, json={"amount": 50000.0})

    wallet_before = client.get("/api/wallet", headers=auth_headers).json()["balance"]

    deploy_amount = 25000.0
    res = client.post(
        "/api/allocations",
        headers=auth_headers,
        json={"amount": deploy_amount, "plan_name": "Core Indian Growth Plan"}
    )
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "COMPLETED"
    assert data["deployed_amount"] == deploy_amount
    assert "reference_id" in data
    assert len(data["allocations"]) > 0

    # Verify wallet was deducted exactly
    wallet_after = client.get("/api/wallet", headers=auth_headers).json()["balance"]
    assert round(wallet_before - deploy_amount, 2) == round(wallet_after, 2)

    # Verify holdings exist
    portfolio_res = client.get("/api/portfolio", headers=auth_headers)
    assert portfolio_res.status_code == 200
    holdings = portfolio_res.json()["holdings"]
    assert len(holdings) > 0


def test_allocation_insufficient_funds_rejected(client, auth_headers):
    # Attempting to allocate far more than available virtual cash
    wallet_bal = client.get("/api/wallet", headers=auth_headers).json()["balance"]
    excessive_amount = wallet_bal + 500000.0

    res = client.post(
        "/api/allocations",
        headers=auth_headers,
        json={"amount": excessive_amount}
    )
    assert res.status_code == 400
    assert "Insufficient virtual balance" in res.json()["detail"]


def test_allocation_history_retrieval(client, auth_headers):
    res = client.get("/api/allocations", headers=auth_headers)
    assert res.status_code == 200
    assert isinstance(res.json(), list)
