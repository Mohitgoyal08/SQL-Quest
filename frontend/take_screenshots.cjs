const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  // Login
  await page.goto("http://localhost:5173/");
  await page.waitForLoadState("networkidle");
  const loginHeader = page.locator("text=SQL QUEST");
  if (await loginHeader.isVisible()) {
      await page.fill('input[placeholder="captain@sqlquest.com"]', "admin@sqlquest.com");
      await page.fill('input[placeholder="••••••••••••"]', "AdminPassword123!");
      await page.click('button:has-text("Voyage")');
      await page.waitForTimeout(2000);
  }

  // 1. Dashboard
  await page.goto("http://localhost:5173/admin");
  await page.waitForTimeout(1000);
  await page.screenshot({ path: "/Users/mohitgoyal/.gemini/antigravity/brain/6557b90d-ecf6-44e5-a87b-4b36ebdae377/screenshot_dashboard.jpg" });

  // 2. Challenge Editor / Reward Editor / Dialogue Editor
  await page.selectOption("select", { label: "Merchant Isles" });
  await page.waitForTimeout(500);
  await page.click("text=+ New Challenge");
  await page.waitForTimeout(1000);
  await page.screenshot({ path: "/Users/mohitgoyal/.gemini/antigravity/brain/6557b90d-ecf6-44e5-a87b-4b36ebdae377/screenshot_challenge_editor.jpg" });

  // 3. Game
  await page.goto("http://localhost:5173/");
  await page.waitForTimeout(2000);
  await page.screenshot({ path: "/Users/mohitgoyal/.gemini/antigravity/brain/6557b90d-ecf6-44e5-a87b-4b36ebdae377/screenshot_game.jpg" });

  await browser.close();
})();
