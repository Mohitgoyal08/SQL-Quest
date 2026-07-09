import { test, expect } from '@playwright/test';
import { resetProfile, loadPreset } from './helpers';

test.describe('Tutorial Harbor Spec', () => {
  test.setTimeout(60000); // Increase timeout for cinematics

  test.beforeEach(async ({ page }) => {
    await resetProfile(page);
  });

  test('should register profile name and start tutorial dialogue', async ({ page }) => {
    // Already loaded Fresh Game via resetProfile
    
    // Start game
    await page.click('button:has-text("Story Mode")');
    
    // Wait for Opening Cinematic button (appears after 4s)
    await page.waitForSelector('button:has-text("Begin the Journey")', { state: 'visible', timeout: 6000 });
    await page.click('button:has-text("Begin the Journey")');

    // Wait for World Reveal cinematic (6s) and then Character Selection to appear
    await page.waitForSelector('text=Choose Your Hero', { state: 'visible', timeout: 10000 });

    // Select Hero
    await page.locator('[role="radio"]').first().click();
    await page.click('button:has-text("Begin Adventure")');

    // Wait for Island Flow to start (Arrival -> Title)
    // We should see the story event continue button eventually
    await page.waitForSelector('button:has-text("Continue")', { state: 'visible', timeout: 30000 });
    await page.click('button:has-text("Continue")');

    // Check if dialogue box appears
    const dialogBox = page.locator('.fixed.inset-0.z-50');
    await expect(dialogBox).toBeVisible();
    
    // Verify guide name in dialogue
    await expect(page.locator('text=Captain Blackbeard')).toBeVisible();

    // Progress through dialogue to Mission scene
    // First click: waits for node 1 typing to finish, then advances to node 2
    await page.click('button:has-text("Continue")');
    
    // Second click: waits for node 2 typing to finish, then completes dialogue
    await page.click('button:has-text("Continue")');
    
    // Verify Mission Scene appears (Accept/Decline buttons)
    await expect(page.locator('button:has-text("Accept")')).toBeVisible({ timeout: 5000 });
  });
});
