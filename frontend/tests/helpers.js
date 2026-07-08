/**
 * Playwright E2E Test Helpers using DevTools Presets
 */

export async function resetProfile(page) {
  await loadPreset(page, 'Fresh Game');
}

export async function loadPreset(page, presetName) {
  await page.goto('/');
  // Open DevTools
  await page.click('text=🛠️ DevTools');
  // Wait for slide-in animation to finish
  await page.waitForTimeout(500);
  // Switch to Presets tab
  await page.click('button:has-text("presets")');
  if (presetName === 'Fresh Game') {
    await Promise.all([
      page.waitForNavigation(),
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
