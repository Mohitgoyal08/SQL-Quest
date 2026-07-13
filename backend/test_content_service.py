import requests

token_res = requests.post("http://localhost:8000/api/v1/auth/login", data={"username": "admin@sqlquest.com", "password": "AdminPassword123!"})
token = token_res.json()["access_token"]
headers = {"Authorization": f"Bearer {token}"}

chal_res = requests.get("http://localhost:8000/api/v1/content/challenges", headers=headers)
print("Challenges:", len(chal_res.json()))
