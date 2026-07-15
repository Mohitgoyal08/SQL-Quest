async function test() {
    const BASE_URL = "http://localhost:8000/api/v1";
    const loginRes = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ username: 'admin@sqlquest.com', password: 'AdminPassword123!' })
    });
    const { access_token } = await loginRes.json();
    const headers = { 'Authorization': `Bearer ${access_token}`, 'Content-Type': 'application/json' };

    const res = await fetch(`${BASE_URL}/content/challenges`, { headers });
    const challenges = await res.json();
    const chal_01 = challenges.find(c => c.id === "chal_01");
    
    chal_01.title = "Muster the Crew";
    await fetch(`${BASE_URL}/admin/challenges/chal_01`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(chal_01)
    });
}
test().catch(console.error);
