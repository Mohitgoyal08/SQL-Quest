import requests

token_res = requests.post("http://localhost:8000/api/v1/auth/login", data={"username": "admin@sqlquest.com", "password": "AdminPassword123!"})
token = token_res.json()["access_token"]
headers = {"Authorization": f"Bearer {token}"}

# 1. Fetch chal_01
res = requests.get("http://localhost:8000/api/v1/content/challenges", headers=headers)
chal_01 = next((c for c in res.json() if c["id"] == "chal_01"), None)
print(f"Original title: {chal_01['title']}")

# 2. Modify title
chal_01["title"] = "Muster the Crew (MODIFIED BY CMS)"

# 3. Update chal_01
update_res = requests.put(f"http://localhost:8000/api/v1/admin/challenges/chal_01", json=chal_01, headers=headers)
if update_res.status_code == 200:
    print(f"Updated title: {update_res.json()['title']}")
else:
    print(f"Failed to update: {update_res.text}")

# 4. Fetch via frontend API endpoint to ensure game sees it
res2 = requests.get("http://localhost:8000/api/v1/content/challenges")
chal_01_updated = next((c for c in res2.json() if c["id"] == "chal_01"), None)
print(f"Game fetches title: {chal_01_updated['title']}")
