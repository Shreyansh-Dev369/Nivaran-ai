import uuid


def test_user_registration(client):
    unique_email = f"evaluator_{uuid.uuid4().hex[:6]}@college.edu.in"
    payload = {
        "name": "Professor Sharma",
        "email": unique_email,
        "password": "strongPassword123"
    }
    response = client.post("/api/auth/register", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["user"]["email"] == unique_email
    assert data["user"]["name"] == "Professor Sharma"

    # Duplicate registration should be rejected
    dup_resp = client.post("/api/auth/register", json=payload)
    assert dup_resp.status_code == 400
    assert "already exists" in dup_resp.json()["detail"]


def test_user_login(client):
    # Test with demo credentials
    response = client.post("/api/auth/login", json={
        "email": "arjun.sharma@example.com",
        "password": "demo1234"
    })
    assert response.status_code == 200
    assert "access_token" in response.json()

    # Test with invalid password
    bad_resp = client.post("/api/auth/login", json={
        "email": "arjun.sharma@example.com",
        "password": "wrongPassword!"
    })
    assert bad_resp.status_code == 401


def test_quick_demo_login(client):
    response = client.post("/api/auth/demo-login")
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["user"]["name"] == "Arjun Sharma"


def test_get_and_update_profile(client, auth_headers):
    # Fetch profile
    get_res = client.get("/api/profile", headers=auth_headers)
    assert get_res.status_code == 200
    assert get_res.json()["full_name"] == "Arjun Sharma"

    # Update profile
    put_res = client.put(
        "/api/profile",
        headers=auth_headers,
        json={"full_name": "Arjun Sharma (Verified)", "bio": "Updated bio"}
    )
    assert put_res.status_code == 200
    assert put_res.json()["full_name"] == "Arjun Sharma (Verified)"


def test_preferences_lifecycle(client, auth_headers):
    # Get current preferences
    res = client.get("/api/preferences", headers=auth_headers)
    assert res.status_code == 200
    assert res.json()["risk_tolerance"] in ["CONSERVATIVE", "BALANCED", "GROWTH"]

    # Update preferences
    update_res = client.put(
        "/api/preferences",
        headers=auth_headers,
        json={
            "risk_tolerance": "GROWTH",
            "simulated_amount": 35000.0,
            "max_single_stock_cap": 20.0
        }
    )
    assert update_res.status_code == 200
    data = update_res.json()
    assert data["risk_tolerance"] == "GROWTH"
    assert data["simulated_amount"] == 35000.0
    assert data["max_single_stock_cap"] == 20.0
