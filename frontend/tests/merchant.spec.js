import { test, expect } from '@playwright/test';
import { resetProfile, loadPreset, openShop } from './helpers';

test.describe('Merchant Isles Economy Spec', () => {
  test.beforeEach(async ({ page }) => {
    await resetProfile(page);
  });

  test('should load Merchant Hub preset, open shop, and test ESC closing', async ({ page }) => {
    // Load Merchant Hub preset directly (spawns on Merchant Isles with coins and ship)
    await loadPreset(page, 'Merchant Hub');
    
    // We should be in Town Hub with Quincy's Cargo Exchange visible
    await expect(page.locator('text=Quincy\'s Cargo Exchange')).toBeVisible();
    
    // Open Shop
    await openShop(page);
    
    // Shop modal should appear
    const shopModal = page.locator('h2:has-text("Quincy\'s Cargo Exchange")');
    await expect(shopModal).toBeVisible();
    
    // Press Escape to close shop modal
    await page.keyboard.press('Escape');
    await expect(shopModal).not.toBeVisible();
  });
});
