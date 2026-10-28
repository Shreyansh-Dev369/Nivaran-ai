import uuid


def test_missing_auth_token_rejected(client):
    endpoints = [
        "/api/profile",
        "/api/preferences",
        "/api/wallet",
        "/api/recommendations",
        "/api/portfolio",
        "/api/transactions",
    ]
    for ep in endpoints:
        res = client.get(ep)
        assert res.status_code == 401, f"Expected 401 for unauthenticated request to {ep}"


def test_invalid_auth_token_rejected(client):
    bad_headers = {"Authorization": "Bearer invalid_malformed_token_12345"}
    res = client.get("/api/wallet", headers=bad_headers)
    assert res.status_code == 401


def test_user_data_isolation(client):
    """Verify that User A cannot see or manipulate User B's private financial records."""
    # Register User A
    user_a_email = f"user_a_{uuid.uuid4().hex[:6]}@example.com"
    res_a = client.post("/api/auth/register", json={
        "name": "User Alpha",
        "email": user_a_email,
        "password": "PasswordAlpha123"
    })
    token_a = res_a.json()["access_token"]
    headers_a = {"Authorization": f"Bearer {token_a}"}

    # Register User B
    user_b_email = f"user_b_{uuid.uuid4().hex[:6]}@example.com"
    res_b = client.post("/api/auth/register", json={
        "name": "User Beta",
        "email": user_b_email,
        "password": "PasswordBeta123"
    })
    token_b = res_b.json()["access_token"]
    headers_b = {"Authorization": f"Bearer {token_b}"}

    # User A deposits ₹50,000
    client.post("/api/wallet/deposits", headers=headers_a, json={"amount": 50000.0, "note": "Alpha Deposit"})

    # User B deposits ₹10,000
    client.post("/api/wallet/deposits", headers=headers_b, json={"amount": 10000.0, "note": "Beta Deposit"})

    # Check User A's wallet
    wallet_a = client.get("/api/wallet", headers=headers_a).json()
    assert wallet_a["balance"] == 50000.0

    # Check User B's wallet
    wallet_b = client.get("/api/wallet", headers=headers_b).json()
    assert wallet_b["balance"] == 10000.0

    # User A executes allocation of ₹25,000
    alloc_a = client.post("/api/allocations", headers=headers_a, json={"amount": 25000.0})
    assert alloc_a.status_code == 200

    # User B checks portfolio -> User B must NOT have User A's holdings
    portfolio_b = client.get("/api/portfolio", headers=headers_b).json()
    assert portfolio_b["total_invested"] == 0.0
    assert len(portfolio_b["holdings"]) == 0

    # User B checks transactions -> User B must NOT see User A's transactions
    tx_b = client.get("/api/transactions", headers=headers_b).json()
    for tx in tx_b:
        assert "Alpha" not in tx["description"]
