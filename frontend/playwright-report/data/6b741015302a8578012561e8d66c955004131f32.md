# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: verify_cms.spec.js >> Phase 5C CMS Workflow Verification >> Admin creates, verifies, and disables a challenge
- Location: tests/verify_cms.spec.js:4:3

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: page.waitForSelector: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('text=SQL Quest CMS') to be visible

```

# Page snapshot

```yaml
- generic [ref=e3]: UNAUTHORIZED ACCESS
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | 
  3   | test.describe('Phase 5C CMS Workflow Verification', () => {
  4   |   test('Admin creates, verifies, and disables a challenge', async ({ page }) => {
  5   |     // 1. Login as ADMIN
  6   |     await page.goto('http://localhost:5173/');
  7   |     await page.waitForLoadState('networkidle');
  8   |     
  9   |     // Check if on login page
  10  |     const loginHeader = page.getByRole('heading', { name: 'SQL QUEST', exact: true });
  11  |     if (await loginHeader.isVisible()) {
  12  |       await page.getByPlaceholder('captain@sqlquest.com').fill('admin@sqlquest.com');
  13  |       await page.getByPlaceholder('••••••••••••').fill('AdminPassword123!');
  14  |       await page.getByRole('button', { name: /Voyage/i }).click();
  15  |       await page.waitForTimeout(2000);
  16  |     }
  17  |     
  18  |     // 2. Open Admin Dashboard
  19  |     await page.goto('http://localhost:5173/admin');
> 20  |     await page.waitForSelector('text=SQL Quest CMS');
      |                ^ Error: page.waitForSelector: Test timeout of 30000ms exceeded.
  21  | 
  22  |     // 3. Select Merchant Isles
  23  |     await page.locator('select').selectOption({ label: 'Merchant Isles' });
  24  |     await page.waitForTimeout(1000);
  25  | 
  26  |     // 4. Create a new question
  27  |     await page.getByRole('button', { name: '+ New Challenge' }).click();
  28  |     await page.waitForSelector('text=Create Challenge');
  29  | 
  30  |     // 5. Configure
  31  |     await page.locator('input[type="text"]').nth(0).fill('merchant_99'); // ID
  32  |     await page.locator('input[type="text"]').nth(1).fill('The Secret Vault'); // Title
  33  |     await page.locator('textarea').nth(1).fill('SELECT * FROM vault;'); // Expected SQL
  34  |     
  35  |     // Rewards
  36  |     await page.locator('input[type="number"]').nth(1).fill('500'); // XP
  37  |     await page.locator('input[type="number"]').nth(2).fill('100'); // Coins
  38  |     await page.locator('input[type="number"]').nth(3).fill('5'); // Diamonds
  39  | 
  40  |     // Dialogue (assuming default is single element array)
  41  |     const diagTextarea = page.locator('textarea').nth(2);
  42  |     await diagTextarea.fill('["The secret vault is yours!"]');
  43  | 
  44  |     // 6. Save
  45  |     await page.getByRole('button', { name: 'Save Challenge' }).click();
  46  |     await expect(page.locator('text=Challenge saved successfully')).toBeVisible();
  47  |     await page.waitForTimeout(1000);
  48  | 
  49  |     // 7. Open the game
  50  |     await page.goto('http://localhost:5173/');
  51  |     await page.waitForLoadState('networkidle');
  52  | 
  53  |     // Use Dev Panel to jump to Merchant Isles
  54  |     await page.evaluate(() => {
  55  |       window.__DEV_OVERRIDE__ = true;
  56  |     });
  57  |     // Wait, the dev panel might be hidden, let's just use the API to verify the challenge was loaded by the ContentService
  58  |     const challenges = await page.evaluate(() => {
  59  |       return window.__TEST_CHALLENGES__ || [];
  60  |     });
  61  |     // Actually, we can check if ContentService loaded it.
  62  |     const hasChallenge = await page.evaluate(() => {
  63  |       // We can't access ContentService directly from window unless exported, but we can check localStorage or UI
  64  |       return true;
  65  |     });
  66  | 
  67  |     // To verify in-game, we will use the DevPanel.
  68  |     // Show dev panel
  69  |     await page.keyboard.press('`');
  70  |     await page.waitForTimeout(500);
  71  |     await page.getByRole('tab', { name: 'Scenarios' }).click();
  72  |     // Load merchant_hub
  73  |     await page.getByRole('button', { name: 'Merchant Hub' }).click();
  74  |     await page.waitForTimeout(1000);
  75  |     // Close dev panel
  76  |     await page.keyboard.press('`');
  77  | 
  78  |     // Talk to Marlowe
  79  |     await page.getByText('Master Marlowe').click();
  80  |     await page.waitForTimeout(1000);
  81  |     // We should see the new challenge (or the first challenge).
  82  |     // Actually, getting to the exact new challenge might require completing previous ones if order_index is at the end.
  83  |     // The new challenge will be at the end of Merchant Isles.
  84  | 
  85  |     // Let's verify by checking the backend API directly in the test to ensure it was created and configured correctly.
  86  |     const res = await page.request.get('http://localhost:8000/api/v1/content/challenges', {
  87  |       headers: {
  88  |         'Authorization': `Bearer ${await page.evaluate(() => localStorage.getItem('sql_quest_token'))}`
  89  |       }
  90  |     });
  91  |     const challengesData = await res.json();
  92  |     const newChal = challengesData.find(c => c.id === 'merchant_99');
  93  |     expect(newChal).toBeDefined();
  94  |     expect(newChal.title).toBe('The Secret Vault');
  95  |     expect(newChal.expected_sql).toBe('SELECT * FROM vault;');
  96  |     expect(newChal.is_active).toBe(true);
  97  | 
  98  |     const rewRes = await page.request.get('http://localhost:8000/api/v1/content/rewards', {
  99  |       headers: {
  100 |         'Authorization': `Bearer ${await page.evaluate(() => localStorage.getItem('sql_quest_token'))}`
  101 |       }
  102 |     });
  103 |     const rewardsData = await rewRes.json();
  104 |     const newRew = rewardsData.find(r => r.challenge_id === 'merchant_99');
  105 |     expect(newRew).toBeDefined();
  106 |     expect(newRew.xp).toBe(500);
  107 |     expect(newRew.coins).toBe(100);
  108 |     expect(newRew.diamonds).toBe(5);
  109 | 
  110 |     // 11. Disable the question
  111 |     await page.goto('http://localhost:5173/admin');
  112 |     await page.waitForSelector('text=SQL Quest CMS');
  113 |     await page.locator('select').selectOption({ label: 'Merchant Isles' });
  114 |     await page.waitForTimeout(1000);
  115 |     
  116 |     // Click edit on merchant_99
  117 |     // In the table, find the row with merchant_99 and click Edit
  118 |     await page.locator('tr', { hasText: 'merchant_99' }).getByRole('button', { name: 'Edit' }).click();
  119 |     await page.waitForTimeout(500);
  120 | 
```