import { test, expect } from '@playwright/test';
import { resetProfile, loadPreset } from './helpers';

test.describe('Captain Promotion Spec', () => {
  test.beforeEach(async ({ page }) => {
    await resetProfile(page);
  });

  test('should show ship naming modal and save custom ship name', async ({ page }) => {
    // Load Captain Promotion preset directly
    await loadPreset(page, 'Captain Promotion');
    
    // Naming modal should appear after clicking through cinematic
    await page.click('button:has-text("Step Forward ➔")');
    await page.click('button:has-text("Claim the Deed")');

    const namingInput = page.locator('input[placeholder="The SELECT Sloop"]');
    await expect(namingInput).toBeVisible();
    
    // Fill new ship name
    await namingInput.fill('Dev Sloop');
    await page.click('button:has-text("Inscribe the Name")');
    
    // Naming modal should close
    await expect(namingInput).not.toBeVisible();
  });
});
