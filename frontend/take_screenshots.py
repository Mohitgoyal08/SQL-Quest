import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context()
        page = await context.new_page()
        
        # Login
        await page.goto("http://localhost:5173/")
        await page.wait_for_load_state("networkidle")
        if await page.locator("text=SQL QUEST").is_visible():
            await page.fill('input[placeholder="captain@sqlquest.com"]', "admin@sqlquest.com")
            await page.fill('input[placeholder="••••••••••••"]', "AdminPassword123!")
            await page.click('button:has-text("Voyage")')
            await page.wait_for_timeout(2000)
            
        # 1. Dashboard
        await page.goto("http://localhost:5173/admin")
        await page.wait_for_timeout(1000)
        await page.screenshot(path="/Users/mohitgoyal/.gemini/antigravity/brain/6557b90d-ecf6-44e5-a87b-4b36ebdae377/screenshot_dashboard.jpg")
        
        # 2. Challenge Editor / Reward Editor / Dialogue Editor
        await page.select_option("select", label="Merchant Isles")
        await page.wait_for_timeout(500)
        await page.click("text=+ New Challenge")
        await page.wait_for_timeout(1000)
        await page.screenshot(path="/Users/mohitgoyal/.gemini/antigravity/brain/6557b90d-ecf6-44e5-a87b-4b36ebdae377/screenshot_challenge_editor.jpg")
        
        # 3. Game
        await page.goto("http://localhost:5173/")
        await page.wait_for_timeout(2000)
        await page.screenshot(path="/Users/mohitgoyal/.gemini/antigravity/brain/6557b90d-ecf6-44e5-a87b-4b36ebdae377/screenshot_game.jpg")
        
        await browser.close()

asyncio.run(main())
