import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.db.session import SessionLocal

@pytest.fixture
def test_island_payload():
    return {
        "id": "test_island_admin",
        "name": "Test Admin Island",
        "description": "An island created via admin tests",
        "order_index": 1,
        "difficulty": "Hard"
    }

def test_admin_requires_auth(client: TestClient):
    response = client.get("/api/v1/admin/islands")
    assert response.status_code == 401

def test_admin_requires_admin_role(client: TestClient, normal_user_token_headers: dict):
    response = client.get("/api/v1/admin/islands", headers=normal_user_token_headers)
    assert response.status_code == 403

def test_admin_can_create_island(client: TestClient, admin_token_headers: dict, test_island_payload: dict):
    response = client.post("/api/v1/admin/islands", headers=admin_token_headers, json=test_island_payload)
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == test_island_payload["id"]
    assert data["name"] == test_island_payload["name"]

def test_admin_can_update_island(client: TestClient, admin_token_headers: dict, test_island_payload: dict):
    client.post("/api/v1/admin/islands", headers=admin_token_headers, json=test_island_payload)
    update_payload = {"name": "Updated Admin Island Name"}
    response = client.put(f"/api/v1/admin/islands/{test_island_payload['id']}", headers=admin_token_headers, json=update_payload)
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == update_payload["name"]
    assert data["content_version"] == 2 # Auto incremented

def test_admin_can_get_analytics(client: TestClient, admin_token_headers: dict):
    response = client.get("/api/v1/admin/analytics/summary", headers=admin_token_headers)
    assert response.status_code == 200
    data = response.json()
    assert "total_users" in data
    assert "total_completed_challenges" in data

def test_admin_can_delete_island(client: TestClient, admin_token_headers: dict, test_island_payload: dict):
    client.post("/api/v1/admin/islands", headers=admin_token_headers, json=test_island_payload)
    response = client.delete(f"/api/v1/admin/islands/{test_island_payload['id']}", headers=admin_token_headers)
    assert response.status_code == 200
    
    # Verify it's gone
    response = client.get("/api/v1/admin/islands", headers=admin_token_headers)
    assert test_island_payload["id"] not in [item["id"] for item in response.json()]
