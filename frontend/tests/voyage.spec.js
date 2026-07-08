import { test, expect } from '@playwright/test';
import { resetProfile, loadPreset } from './helpers';

test.describe('Voyage & Navigation Spec', () => {
  test.beforeEach(async ({ page }) => {
    await resetProfile(page);
  });

  test('should toggle map and test ESC close actions', async ({ page }) => {
    // Load Ready To Sail preset directly
    await loadPreset(page, 'Ready To Sail');
    
    // Open Map from HUD button
    await page.click('button[title="Open Sea Chart"]');
    
    // Map overlay should be visible
    const mapModal = page.locator('div[role="dialog"]');
    await expect(mapModal).toBeVisible();
    
    // Press Escape to close Sea Chart modal
    await page.keyboard.press('Escape');
    await expect(mapModal).not.toBeVisible();
  });
});
