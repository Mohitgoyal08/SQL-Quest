import { test, expect } from '@playwright/test';
import { resetProfile, loadPreset } from './helpers';

test.describe('Tutorial Harbor Spec', () => {
  test.beforeEach(async ({ page }) => {
    await resetProfile(page);
  });

  test('should register profile name and start tutorial dialogue', async ({ page }) => {
    // Already loaded Fresh Game via resetProfile
    
    // Start game
    await page.click('button:has-text("Start Adventure")');
    
    // Select Hero
    await page.locator('[role="radio"]').first().click();
    await page.click('button:has-text("Begin Adventure")');
    
    // Check if dialogue box appears
    const dialogBox = page.locator('.fixed.inset-0.z-50');
    await expect(dialogBox).toBeVisible();
    
    // Verify guide name in dialogue
    await expect(page.locator('text=Captain Blackbeard')).toBeVisible();
  });
});
