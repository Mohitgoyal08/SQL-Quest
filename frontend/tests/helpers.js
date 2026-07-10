/**
 * Playwright E2E Test Helpers using DevTools Presets
 */

export async function resetProfile(page) {
  await loadPreset(page, 'Fresh Game');
}

export async function loginTestUser(page) {
  // Switch to Register
  await page.click('text=Enlist in the Guild');
  
  // Fill random email to ensure fresh backend state
  const randomId = Math.random().toString(36).substring(7);
  await page.fill('input[type="email"]', `test-${randomId}@example.com`);
  await page.fill('input[id="displayName"]', `TestCaptain-${randomId}`);
  await page.fill('input[type="password"]', 'password123');
  
  await page.click('button[type="submit"]');
  
  // Wait for login to complete and main game to load
  await page.waitForSelector('text=🛠️ DevTools', { timeout: 15000 });
}

export async function loadPreset(page, presetName) {
  await page.goto('/');
  
  // Wait for either the Login screen or the main game (DevTools) to mount
  await Promise.race([
    page.waitForSelector('text=Welcome Back, Captain!', { timeout: 15000 }),
    page.waitForSelector('text=🛠️ DevTools', { timeout: 15000 })
  ]);
  
  // If we are on the login screen, login first
  const isLoginScreen = await page.isVisible('text=Welcome Back, Captain!');
  if (isLoginScreen) {
    await loginTestUser(page);
  }

  // Open DevTools
  await page.click('text=🛠️ DevTools');
  // Wait for slide-in animation to finish
  await page.waitForTimeout(500);
  // Switch to Presets tab
  await page.click('button:has-text("presets")');
  if (presetName === 'Fresh Game') {
    await Promise.all([
      page.waitForNavigation({ timeout: 10000 }), // Wait for the 800ms delayed reload in DevService.js
      page.click(`button:has-text("${presetName}")`)
    ]);
    return;
  }

  await page.click(`button:has-text("${presetName}")`);
  
  // Close dev panel
  await page.click('button:has-text("✕")');
}

export async function openShop(page) {
  // Click Quincy node in town hub
  await page.click('text=👨‍✈️'); // Quincy's avatar
  await page.click('text=Browse Cargo Exchange');
}

export async function giveGold(page, amount) {
  await page.click('text=🛠️ DevTools');
  // Wait for slide-in animation to finish
  await page.waitForTimeout(500);
  await page.click('button:has-text("sandbox")');
  if (amount === 1000) {
    await page.click('text=+1000 Gold');
  } else {
    await page.click('text=+100 Gold');
  }
  await page.click('button:has-text("✕")');
}
