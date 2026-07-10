import { test, expect } from '@playwright/test';

test.describe('Authentication and Cloud Save Spec', () => {
  test('should allow registration, login, and persist session', async ({ page, context }) => {
    page.on('console', msg => console.log('BROWSER LOG:', msg.text()));
    page.on('pageerror', err => console.log('BROWSER ERROR:', err.message));
    
    // 1. Go to homepage
    await page.goto('/');
    
    // 2. Expect Login Screen
    await expect(page.locator('text=Welcome Back, Captain!')).toBeVisible();
    
    // 3. Switch to Register
    await page.click('text=Enlist in the Guild');
    await expect(page.locator('text=Join the Guild!')).toBeVisible();
    
    const randomId = Math.random().toString(36).substring(7);
    const email = `auth-test-${randomId}@example.com`;
    const password = 'password123';
    
    // 4. Register
    await page.fill('input[type="email"]', email);
    await page.fill('input[id="displayName"]', `AuthTester-${randomId}`);
    await page.fill('input[type="password"]', password);
    await page.click('button[type="submit"]');
    
    // 5. Expect to be logged in and see main game UI (DevTools is visible)
    await expect(page.locator('text=🛠️ DevTools')).toBeVisible({ timeout: 15000 });
    
    // 6. Reload page to test session persistence
    await page.reload();
    await expect(page.locator('text=Loading Ship Manifest...')).toBeVisible(); // Initial loading state
    
    // 7. Should bypass login and go straight to game
    await expect(page.locator('text=🛠️ DevTools')).toBeVisible({ timeout: 10000 });
    
    // 8. Log out
    await page.click('text=Log Out');
    
    // 9. Expect to be back on login screen
    await expect(page.locator('text=Welcome Back, Captain!')).toBeVisible();
    
    // 10. Login with same credentials
    await page.fill('input[type="email"]', email);
    await page.fill('input[type="password"]', password);
    await page.click('button[type="submit"]');
    
    // 11. Expect successful login
    await expect(page.locator('text=🛠️ DevTools')).toBeVisible({ timeout: 15000 });
  });
});
