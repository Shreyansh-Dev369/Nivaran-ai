def test_wallet_retrieval(client, auth_headers):
    res = client.get("/api/wallet", headers=auth_headers)
    assert res.status_code == 200
    data = res.json()
    assert "balance" in data
    assert data["balance"] >= 0
    assert data["currency"] == "INR"


def test_virtual_deposit_success(client, auth_headers):
    # Initial balance
    init_res = client.get("/api/wallet", headers=auth_headers)
    initial_balance = init_res.json()["balance"]

    deposit_amount = 25000.0
    res = client.post(
        "/api/wallet/deposits",
        headers=auth_headers,
        json={"amount": deposit_amount, "note": "Unit Test Virtual Deposit"}
    )
    assert res.status_code == 200
    data = res.json()
    assert data["amount"] == deposit_amount
    assert data["status"] == "COMPLETED"
    assert data["new_balance"] == initial_balance + deposit_amount
    assert "reference_id" in data


def test_deposit_validation_failures(client, auth_headers):
    # Zero deposit rejected
    zero_res = client.post(
        "/api/wallet/deposits",
        headers=auth_headers,
        json={"amount": 0}
    )
    assert zero_res.status_code == 422 or zero_res.status_code == 400

    # Negative deposit rejected
    neg_res = client.post(
        "/api/wallet/deposits",
        headers=auth_headers,
        json={"amount": -5000}
    )
    assert neg_res.status_code == 422 or neg_res.status_code == 400

    # Exorbitant deposit rejected (> 1 Crore)
    huge_res = client.post(
        "/api/wallet/deposits",
        headers=auth_headers,
        json={"amount": 999999999}
    )
    assert huge_res.status_code == 422 or huge_res.status_code == 400
