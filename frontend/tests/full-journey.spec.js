import { test, expect } from '@playwright/test';
import { loadPreset } from './helpers';
import { SQL_CHALLENGES } from '../src/data/challenges';

// Full Journey simulates a complete real player run. NO fast-forwards.
test.describe.serial('Full Player Journey Suite (Primary)', () => {
  let page;
  test.setTimeout(600000); // 10 minutes overall timeout per test

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    await loadPreset(page, 'Fresh Game');
  });

  test.afterAll(async () => {
    await page.close();
  });

  async function waitAndAdvanceDialogue() {
    let nullCount = 0;
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

        if (!nextAction) {
          nullCount++;
          if (nullCount > 5) break; // Break if we wait 5 seconds with no dialogue/challenge
          continue;
        }
        nullCount = 0; // Reset on success

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

    await expect(page.locator(`text=${challenge.title}`).first()).toBeVisible({ timeout: 15000 });
    
    // Some challenges have an Accept button if they start with a MissionScene
    if (await page.locator('button:has-text("Accept")').isVisible()) {
      await page.click('button:has-text("Accept")');
    }

    await page.fill('textarea[placeholder="Enter your SQL query here..."]', challenge.referenceQuery);
    await page.click('button:has-text("Run Query")');

    // Wait for the textarea to disappear, which means the challenge auto-advanced successfully
    await page.waitForSelector('textarea', { state: 'hidden', timeout: 15000 });
  }

  test('Complete End-to-End Game', async () => {
    // 1. Splash & Story
    await page.click('button:has-text("Story Mode")', { force: true });
    await page.waitForSelector('button:has-text("Begin the Journey")', { timeout: 10000 });
    await page.click('button:has-text("Begin the Journey")', { force: true });

    // Character Selection is now handled during V2 Authentication registration,
    // so it automatically skips this stage in the flow.

    // 3. Tutorial Harbor
    // Wait for the opening cinematics (Ship + World Reveal) to finish and the first dialogue to mount
    await page.waitForSelector('button:has-text("Continue")', { timeout: 15000 });
    await waitAndAdvanceDialogue();
    await solveChallenge('chal_01');
    await waitAndAdvanceDialogue();
    await solveChallenge('chal_02');
    await waitAndAdvanceDialogue();
    await solveChallenge('chal_03');
    // Story Event and transition to chal_06
    await waitAndAdvanceDialogue();

    // Remaining challenges
    await solveChallenge('chal_06');
    
    await page.waitForSelector('button:has-text("Continue Journey")');
    await page.click('button:has-text("Continue Journey")');

    // 4. Ship Naming Ceremony
    await page.waitForSelector('button:has-text("Step Forward ➔")');
    await page.click('button:has-text("Step Forward ➔")');
    await page.waitForSelector('button:has-text("Claim the Deed")');
    await page.click('button:has-text("Claim the Deed")');
    await page.fill('input[placeholder="The SELECT Sloop"]', 'E2E Full Sloop');
    await page.click('button:has-text("Inscribe the Name")');
    await page.waitForSelector('text=Set Sail', { timeout: 10000 });
    await page.click('text=Set Sail');

    // 5. Merchant Isles
    await expect(page.locator('text=Merchant Isles')).toBeVisible({ timeout: 15000 });
    await page.click('text=Merchant Isles');
    await expect(page.locator('text=Merchant Isles')).toBeVisible({ timeout: 20000 });
    
    await page.waitForSelector('button:has-text("Continue")', { timeout: 20000 });
    await waitAndAdvanceDialogue();
    await solveChallenge('merchant_00');
    await waitAndAdvanceDialogue();
    await solveChallenge('merchant_01');

    await waitAndAdvanceDialogue(); // Handles Story event and transitions to merchant_02
    await solveChallenge('merchant_02');
    await page.waitForSelector('button:has-text("Continue Journey")');
    await page.click('button:has-text("Continue Journey")');

    // 6. Smuggler's Cove
    await expect(page.locator("text=Smuggler's Cove")).toBeVisible({ timeout: 15000 });
    await page.click("text=Smuggler's Cove");
    await expect(page.locator("text=Smuggler's Cove")).toBeVisible({ timeout: 20000 });

    await page.waitForSelector('button:has-text("Continue")', { timeout: 20000 });
    await waitAndAdvanceDialogue();
    await solveChallenge('smugglers_01');
    await waitAndAdvanceDialogue();
    await solveChallenge('smugglers_02');
    await waitAndAdvanceDialogue();
    await solveChallenge('smugglers_03');
    await page.waitForSelector('button:has-text("Continue Journey")');
    await page.click('button:has-text("Continue Journey")');

    // 7. Jungle of Queries
    await expect(page.locator("text=Jungle of Queries")).toBeVisible({ timeout: 15000 });
    await page.click("text=Jungle of Queries");
    await expect(page.locator("text=Jungle of Queries")).toBeVisible({ timeout: 20000 });

    await page.waitForSelector('button:has-text("Continue")', { timeout: 20000 });
    await waitAndAdvanceDialogue();
    await solveChallenge('jungle_01');
    await waitAndAdvanceDialogue();
    await solveChallenge('jungle_02');
    await waitAndAdvanceDialogue();
    await solveChallenge('jungle_03');
    await page.waitForSelector('button:has-text("Continue Journey")');
    await page.click('button:has-text("Continue Journey")');

    // 8. Crystal Caverns
    await expect(page.locator("text=Crystal Caverns")).toBeVisible({ timeout: 15000 });
    await page.click("text=Crystal Caverns");
    await expect(page.locator("text=Crystal Caverns")).toBeVisible({ timeout: 20000 });

    await page.waitForSelector('button:has-text("Continue")', { timeout: 20000 });
    await waitAndAdvanceDialogue();
    await solveChallenge('crystal_01');
    await waitAndAdvanceDialogue();
    await solveChallenge('crystal_02');
    await waitAndAdvanceDialogue();
    await solveChallenge('crystal_03');
    await page.waitForSelector('button:has-text("Continue Journey")');
    await page.click('button:has-text("Continue Journey")');

    // 9. Volcano Island
    await expect(page.locator("text=Volcano Island")).toBeVisible({ timeout: 15000 });
    await page.click("text=Volcano Island");
    await expect(page.locator("text=Volcano Island")).toBeVisible({ timeout: 20000 });

    await page.waitForSelector('button:has-text("Continue")', { timeout: 20000 });
    await waitAndAdvanceDialogue();
    await solveChallenge('volcano_01');
    await waitAndAdvanceDialogue();
    await solveChallenge('volcano_02');
    await page.waitForSelector('button:has-text("Continue Journey")');
    await page.click('button:has-text("Continue Journey")');

    // 10. Lost Sea
    await expect(page.locator("text=Lost Sea")).toBeVisible({ timeout: 15000 });
    await page.click("text=Lost Sea");
    await expect(page.locator("text=Lost Sea")).toBeVisible({ timeout: 20000 });

    await page.waitForSelector('button:has-text("Continue")', { timeout: 20000 });
    await waitAndAdvanceDialogue();
    await solveChallenge('lost_sea_01');
    await waitAndAdvanceDialogue();
    await solveChallenge('lost_sea_02');
    await page.waitForSelector('button:has-text("Continue Journey")');
    await page.click('button:has-text("Continue Journey")');

    // 11. Pirate King's Ship & Ending
    await expect(page.locator("text=Pirate King's Ship")).toBeVisible({ timeout: 15000 });
    await page.click("text=Pirate King's Ship");
    await expect(page.locator("text=Pirate King's Ship")).toBeVisible({ timeout: 20000 });

    await page.waitForSelector('button:has-text("Continue")', { timeout: 20000 });
    await waitAndAdvanceDialogue();
    await solveChallenge('pirate_kings_ship_01');
    await page.waitForSelector('button:has-text("Continue")');
    await page.click('button:has-text("Continue")');
    await page.waitForSelector('button:has-text("Continue Journey")');
    await page.click('button:has-text("Continue Journey")');

    // Ending Cinematic and Return
    await page.waitForSelector('button:has-text("Return to Title")', { timeout: 30000 });
    await page.click('button:has-text("Return to Title")');
    await expect(page.locator('button:has-text("Story Mode")')).toBeVisible({ timeout: 10000 });
  });
});
