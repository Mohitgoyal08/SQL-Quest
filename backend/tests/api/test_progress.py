from fastapi.testclient import TestClient
from datetime import datetime, timezone
from app.core.config import settings

def test_sync_and_get_progress(client: TestClient) -> None:
    # First register and login
    data = {
        "email": "progress@example.com",
        "password": "testpassword",
        "display_name": "Progress User"
    }
    client.post(f"{settings.API_V1_STR}/auth/register", json=data)
    
    login_data = {
        "username": "progress@example.com",
        "password": "testpassword"
    }
    r_login = client.post(f"{settings.API_V1_STR}/auth/login", data=login_data)
    token = r_login.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    
    # Define a mocked PlayerProgressState
    progress_state = {
        "level": 2,
        "xp": 350,
        "coins": 150,
        "gems": 10,
        "currentIsland": "tutorial_island",
        "currentNPC": "tutorial_guide",
        "inventory": ["rusty_sword"],
        "badges": ["first_blood"],
        "completedIds": ["chal_01", "chal_02"],
        "unlockedIds": ["chal_01", "chal_02", "chal_03"],
        "currentChallengeId": "chal_03",
        "unlocks": {"seaChart": True},
        "fleet": {
            "activeShipId": "sloop_abandoned",
            "ownedShipIds": ["sloop_abandoned"],
            "ships": {
                "sloop_abandoned": {
                    "name": "The Weathered Sloop",
                    "stats": {"speed": 1.0, "capacity": 10},
                    "cosmetics": {"activeSkin": "default"}
                }
            }
        },
        "last_saved_at": None
    }
    
    sync_payload = {
        "state": progress_state,
        "local_timestamp": datetime.now(timezone.utc).isoformat()
    }
    
    # 1. Sync Progress (POST)
    r_sync = client.post(f"{settings.API_V1_STR}/progress/sync", json=sync_payload, headers=headers)
    assert r_sync.status_code == 200
    sync_response = r_sync.json()
    assert sync_response["status"] == "success"
    assert sync_response["state"]["level"] == 2
    assert sync_response["state"]["coins"] == 150
    assert "chal_01" in sync_response["state"]["completedIds"]
    
    # 2. Get Progress (GET)
    r_get = client.get(f"{settings.API_V1_STR}/progress/", headers=headers)
    assert r_get.status_code == 200
    get_response = r_get.json()
    assert get_response["xp"] == 350
    assert get_response["currentIsland"] == "tutorial_island"
    assert len(get_response["inventory"]) == 1
    assert get_response["fleet"]["activeShipId"] == "sloop_abandoned"
    
    # 3. Subsequent Sync (POST) updates completed challenges properly
    progress_state["completedIds"].append("chal_03")
    sync_payload["state"] = progress_state
    
    r_sync2 = client.post(f"{settings.API_V1_STR}/progress/sync", json=sync_payload, headers=headers)
    assert r_sync2.status_code == 200
    assert "chal_03" in r_sync2.json()["state"]["completedIds"]

def test_get_progress_unauthorized(client: TestClient) -> None:
    r = client.get(f"{settings.API_V1_STR}/progress/")
    assert r.status_code == 401
