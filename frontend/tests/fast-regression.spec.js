import { test, expect } from '@playwright/test';
import { loadPreset } from './helpers';
import { SQL_CHALLENGES } from '../src/data/challenges';

// Fast Regression strictly requires serial execution to maintain game state across tests
test.describe.serial('Fast Regression Suite (Developer Mode)', () => {
  let page;
  test.setTimeout(120000); // 2 minutes

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    
    // Inject script to fast-track all long timeouts
    await page.addInitScript(() => {
      const originalSetTimeout = window.setTimeout;
      window.setTimeout = function(cb, ms) {
        if (ms >= 1000) {
          return originalSetTimeout(cb, 50); // fast track everything over 1s
        }
        return originalSetTimeout(cb, ms);
      };
    });

    await loadPreset(page, 'Fresh Game');
  });

  test.afterAll(async () => {
    await page.close();
  });

  async function advanceDialogue() {
    // Wait until either 'Continue' appears (dialogue finished typing), 'Accept' appears (mission scene), or textarea appears (challenge panel)
    while (true) {
      try {
        // Fast-forward typing by clicking the dialogue text area if it exists
        if (await page.locator('div.font-serif.text-xl').isVisible()) {
          await page.locator('div.font-serif.text-xl').first().click();
        }
        
        // Wait up to 1 second for any of the next stage indicators
        const nextAction = await Promise.race([
          page.waitForSelector('button:has-text("Continue")', { timeout: 1000 }).then(() => 'continue'),
          page.waitForSelector('button:has-text("Accept")', { timeout: 1000 }).then(() => 'accept'),
          page.waitForSelector('textarea', { timeout: 1000 }).then(() => 'textarea'),
        ]).catch(() => null);

        if (nextAction === 'continue') {
          await page.click('button:has-text("Continue")');
          await page.waitForTimeout(200); // Wait for the next dialogue text to start mounting
        } else if (nextAction === 'accept' || nextAction === 'textarea') {
          // Dialogue is completely finished
          break;
        }
      } catch (e) {
        // Safe catch for detached elements
      }
    }
  }

  async function solveChallenge(challengeId) {
    const challenge = SQL_CHALLENGES.find(c => c.id === challengeId);
    if (!challenge) throw new Error(`Challenge ${challengeId} not found!`);

    // Verify mission card appears
    await expect(page.locator(`text=${challenge.title}`).first()).toBeVisible({ timeout: 10000 });
    if (await page.locator('button:has-text("Accept")').isVisible()) {
      await page.click('button:has-text("Accept")');
    }

    // Type solution into textarea
    await page.fill('textarea[placeholder="Enter your SQL query here..."]', challenge.referenceQuery);
    await page.click('button:has-text("Run Query")');

    // Wait for fake execution delay
    await page.waitForSelector('text=Executing Query', { state: 'hidden', timeout: 5000 });
    
    // Continue from success/reward
    await page.waitForSelector('button:has-text("Continue")', { timeout: 5000 });
    await page.click('button:has-text("Continue")');
    
  }

  test('Splash Screen and Intro', async () => {
    await page.click('button:has-text("Story Mode")');

    await page.waitForSelector('button:has-text("Begin the Journey")');
    await page.click('button:has-text("Begin the Journey")');

    // Wait for the Story Event that precedes Character Selection
    await page.waitForSelector('button:has-text("Continue")');
    await page.click('button:has-text("Continue")');

    await page.waitForSelector('text=Choose Your Hero');
    
    await page.locator('[role="radio"]').first().click();
    await page.click('button:has-text("Begin Adventure")');
  });

  test('Tutorial Harbor', async () => {
    // Challenges
    await advanceDialogue();
    await solveChallenge('chal_01');
    
    await advanceDialogue();
    await solveChallenge('chal_02');
    
    await advanceDialogue();
    await solveChallenge('chal_03');

    // Story Event and transition to chal_06
    await advanceDialogue();

    // Remaining challenges
    await solveChallenge('chal_06'); // unlocks ship

    // Reward for completing island
    await page.waitForSelector('button:has-text("Continue Journey")');
    await page.click('button:has-text("Continue Journey")');

    // Ship Reveal Cinematic
    await page.waitForSelector('button:has-text("Step Forward ➔")');
    await page.click('button:has-text("Step Forward ➔")');
    await page.waitForSelector('button:has-text("Inspect the Vessel")');
    await page.click('button:has-text("Inspect the Vessel")');
    await page.click('button:has-text("Claim the Deed")');
    await page.fill('input[placeholder="The SELECT Sloop"]', 'E2E Test Sloop');
    await page.click('button:has-text("Inscribe the Name")');
    
    await page.waitForSelector('button:has-text("Set Sail")');
    await page.click('button:has-text("Set Sail")');
  });

  test('Sea World and Merchant Isles', async () => {
    await expect(page.locator('text=Merchant Isles')).toBeVisible();
    await page.click('text=Merchant Isles');
    
    await expect(page.locator('text=Merchant Isles')).toBeVisible();
    
    await advanceDialogue();
    await solveChallenge('merchant_00');
    
    await advanceDialogue();
    await solveChallenge('merchant_01');

    await advanceDialogue(); // Handles Story event and transitions to merchant_02
    await solveChallenge('merchant_02');

    await page.waitForSelector('button:has-text("Continue Journey")');
    await page.click('button:has-text("Continue Journey")');
  });

  test('Smugglers Cove', async () => {
    await expect(page.locator("text=Smuggler's Cove")).toBeVisible();
    await page.click("text=Smuggler's Cove");

    await advanceDialogue();
    await solveChallenge('smugglers_01');
    await advanceDialogue();
    await solveChallenge('smugglers_02');
    await advanceDialogue();
    await solveChallenge('smugglers_03');

    await page.waitForSelector('button:has-text("Continue Journey")');
    await page.click('button:has-text("Continue Journey")');
  });

  test('Jungle of Queries', async () => {
    await expect(page.locator("text=Jungle of Queries")).toBeVisible();
    await page.click("text=Jungle of Queries");

    await advanceDialogue();
    await solveChallenge('jungle_01');
    await advanceDialogue();
    await solveChallenge('jungle_02');
    await advanceDialogue();
    await solveChallenge('jungle_03');

    await page.waitForSelector('button:has-text("Continue Journey")');
    await page.click('button:has-text("Continue Journey")');
  });

  test('Crystal Caverns', async () => {
    await expect(page.locator("text=Crystal Caverns")).toBeVisible();
    await page.click("text=Crystal Caverns");

    await advanceDialogue();
    await solveChallenge('crystal_01');
    await advanceDialogue();
    await solveChallenge('crystal_02');
    await advanceDialogue();
    await solveChallenge('crystal_03');

    await page.waitForSelector('button:has-text("Continue Journey")');
    await page.click('button:has-text("Continue Journey")');
  });

  test('Volcano Island', async () => {
    await expect(page.locator("text=Volcano Island")).toBeVisible();
    await page.click("text=Volcano Island");

    await advanceDialogue();
    await solveChallenge('volcano_01');
    await advanceDialogue();
    await solveChallenge('volcano_02');

    await page.waitForSelector('button:has-text("Continue Journey")');
    await page.click('button:has-text("Continue Journey")');
  });

  test('Lost Sea', async () => {
    await expect(page.locator("text=Lost Sea")).toBeVisible();
    await page.click("text=Lost Sea");

    await advanceDialogue();
    await solveChallenge('lost_sea_01');
    await advanceDialogue();
    await solveChallenge('lost_sea_02');

    await page.waitForSelector('button:has-text("Continue Journey")');
    await page.click('button:has-text("Continue Journey")');
  });

  test('Pirate Kings Ship and Ending', async () => {
    await expect(page.locator("text=Pirate King's Ship")).toBeVisible();
    await page.click("text=Pirate King's Ship");

    await advanceDialogue();
    await solveChallenge('pirate_kings_ship_01');

    await page.waitForSelector('button:has-text("Continue")'); // story event
    await page.click('button:has-text("Continue")');

    await page.waitForSelector('button:has-text("Continue Journey")');
    await page.click('button:has-text("Continue Journey")');

    // Ending Cinematic triggers
    await page.waitForSelector('button:has-text("Return to Main Menu")', { timeout: 15000 });
    await page.click('button:has-text("Return to Main Menu")');

    // Verify we are back on splash
    await expect(page.locator('button:has-text("Story Mode")')).toBeVisible();
  });
});
