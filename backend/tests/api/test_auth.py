from fastapi.testclient import TestClient
from app.core.config import settings

def test_register(client: TestClient) -> None:
    data = {
        "email": "test@example.com",
        "password": "testpassword",
        "display_name": "Test User",
        "avatar_id": "pirate-boy"
    }
    r = client.post(f"{settings.API_V1_STR}/auth/register", json=data)
    assert r.status_code == 200
    created_user = r.json()
    assert created_user["email"] == data["email"]
    assert created_user["display_name"] == data["display_name"]
    assert "id" in created_user
    assert "role" in created_user

def test_register_duplicate(client: TestClient) -> None:
    data = {
        "email": "dup@example.com",
        "password": "testpassword",
        "display_name": "Dup User",
        "avatar_id": "wizard"
    }
    r = client.post(f"{settings.API_V1_STR}/auth/register", json=data)
    assert r.status_code == 200
    
    # Try again
    r2 = client.post(f"{settings.API_V1_STR}/auth/register", json=data)
    assert r2.status_code == 400
    assert "already exists" in r2.json()["detail"]

def test_login_success(client: TestClient) -> None:
    # First register
    data = {
        "email": "login@example.com",
        "password": "testpassword",
        "display_name": "Login User"
    }
    client.post(f"{settings.API_V1_STR}/auth/register", json=data)
    
    # Then login (OAuth2 expects form data, not json)
    login_data = {
        "username": "login@example.com",
        "password": "testpassword"
    }
    r = client.post(f"{settings.API_V1_STR}/auth/login", data=login_data)
    assert r.status_code == 200
    tokens = r.json()
    assert "access_token" in tokens
    assert tokens["token_type"] == "bearer"
    assert "refresh_token" in r.cookies

def test_login_failure(client: TestClient) -> None:
    login_data = {
        "username": "nonexistent@example.com",
        "password": "wrongpassword"
    }
    r = client.post(f"{settings.API_V1_STR}/auth/login", data=login_data)
    assert r.status_code == 400
    assert r.json()["detail"] == "Incorrect email or password"

def test_protected_route(client: TestClient) -> None:
    # First register
    data = {
        "email": "protected@example.com",
        "password": "testpassword",
        "display_name": "Protected User"
    }
    client.post(f"{settings.API_V1_STR}/auth/register", json=data)
    
    login_data = {
        "username": "protected@example.com",
        "password": "testpassword"
    }
    r_login = client.post(f"{settings.API_V1_STR}/auth/login", data=login_data)
    token = r_login.json()["access_token"]
    
    # Access protected route
    r = client.get(
        f"{settings.API_V1_STR}/player/me",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert r.status_code == 200
    user_me = r.json()
    assert user_me["email"] == data["email"]
    assert user_me["display_name"] == data["display_name"]

def test_invalid_token(client: TestClient) -> None:
    r = client.get(
        f"{settings.API_V1_STR}/player/me",
        headers={"Authorization": "Bearer invalid_token_xyz"}
    )
    assert r.status_code == 403

def test_refresh_token(client: TestClient) -> None:
    # First register and login
    data = {
        "email": "refresh@example.com",
        "password": "testpassword",
        "display_name": "Refresh User"
    }
    client.post(f"{settings.API_V1_STR}/auth/register", json=data)
    
    login_data = {
        "username": "refresh@example.com",
        "password": "testpassword"
    }
    r_login = client.post(f"{settings.API_V1_STR}/auth/login", data=login_data)
    old_access_token = r_login.json()["access_token"]
    
    # We should have the refresh_token cookie set
    r_refresh = client.post(f"{settings.API_V1_STR}/auth/refresh")
    assert r_refresh.status_code == 200
    new_tokens = r_refresh.json()
    assert "access_token" in new_tokens
    assert new_tokens["token_type"] == "bearer"
