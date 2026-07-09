import { test, expect } from '@playwright/test';
import { resetProfile, loadPreset } from './helpers';

test.describe('Merchant Isles Flow Spec', () => {
  test.beforeEach(async ({ page }) => {
    await resetProfile(page);
  });

  test('should load Merchant Hub preset and enter linear island flow', async ({ page }) => {
    await loadPreset(page, 'Merchant Hub');
    
    // We should be in IslandFlow Orchestrator starting with Title Card (if not arrival)
    // Wait for the story event or dialogue
    const dialogBox = page.locator('.fixed.inset-0.z-50');
    await expect(dialogBox).toBeVisible({ timeout: 10000 });
  });
});

