# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: fast-regression.spec.js >> Fast Regression Suite (Developer Mode) >> Tutorial Harbor
- Location: tests/fast-regression.spec.js:99:3

# Error details

```
Test timeout of 120000ms exceeded.
```

```
Error: page.waitForSelector: Target page, context or browser has been closed
Call log:
  - waiting for locator('button:has-text("Continue Journey")') to be visible

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e3]:
    - banner [ref=e4]:
      - generic [ref=e6]:
        - generic [ref=e7]:
          - generic [ref=e9]: 🏴‍☠️
          - generic [ref=e10]:
            - heading "Pirate Boy" [level=1] [ref=e11]
            - generic [ref=e12]:
              - text: ⛵ tutorial_island
              - generic [ref=e13]: "| The Weathered Sloop"
              - generic [ref=e14]: "| 💬 captain_blackbeard"
        - generic [ref=e15]:
          - button "🗺️ Map" [ref=e16] [cursor=pointer]
          - button "📖 Journal" [ref=e17]
          - button "🎒 Bag" [ref=e18]
      - generic [ref=e21]: Lvl3
    - main [ref=e25]:
      - generic [ref=e26]:
        - generic [ref=e28]:
          - img
          - generic [ref=e30]:
            - generic [ref=e31] [cursor=pointer]:
              - text: ⚓
              - generic [ref=e32]: ⛵
            - generic [ref=e33]: Tutorial Harbor
          - generic [ref=e34]:
            - generic [ref=e35] [cursor=pointer]: 🪙
            - generic [ref=e36]: Merchant Isles
          - generic [ref=e37]:
            - generic [ref=e38]:
              - text: ☠️
              - generic [ref=e40]: 🔒
            - generic [ref=e41]: Smuggler's Cove
          - generic [ref=e42]:
            - generic [ref=e43]:
              - text: 🌴
              - generic [ref=e45]: 🔒
            - generic [ref=e46]: Jungle of Queries
          - generic [ref=e47]:
            - generic [ref=e48]:
              - text: 🔮
              - generic [ref=e50]: 🔒
            - generic [ref=e51]: Crystal Caverns
          - generic [ref=e52]:
            - generic [ref=e53]:
              - text: 🌋
              - generic [ref=e55]: 🔒
            - generic [ref=e56]: Volcano Island
          - generic [ref=e57]:
            - generic [ref=e58]:
              - text: 🌊
              - generic [ref=e60]: 🔒
            - generic [ref=e61]: Lost Sea
          - generic [ref=e62]:
            - generic [ref=e63]:
              - text: 👑
              - generic [ref=e65]: 🔒
            - generic [ref=e66]: Pirate King's Ship
        - button "Open Inventory (1 items)" [ref=e67] [cursor=pointer]:
          - generic [ref=e68]: 🎒
          - generic [ref=e69]: Satchel
          - generic [ref=e70]: "1"
        - generic [ref=e72]:
          - generic [ref=e73]: ⚓
          - heading "YOU ARE NOW A CAPTAIN" [level=1] [ref=e74]
          - paragraph [ref=e75]: Your deeds at Tutorial Harbor have cleared the docks and earned you a command.
          - button "Step Forward ➔" [ref=e76] [cursor=pointer]
    - contentinfo [ref=e77]:
      - generic [ref=e78]: SQL Quest v1.0 Shell | Sprint 8.6 Finalized Architecture
      - generic [ref=e79]: "Engine Status: Relational SQLite Execution Readying for Sprint 9"
  - button "🛠️ DevTools" [ref=e80] [cursor=pointer]
```

# Test source

```ts
  17  |         if (ms >= 1000) {
  18  |           return originalSetTimeout(cb, 50); // fast track everything over 1s
  19  |         }
  20  |         return originalSetTimeout(cb, ms);
  21  |       };
  22  |     });
  23  | 
  24  |     await loadPreset(page, 'Fresh Game');
  25  |   });
  26  | 
  27  |   test.afterAll(async () => {
  28  |     await page.close();
  29  |   });
  30  | 
  31  |   async function advanceDialogue() {
  32  |     // Wait until either 'Continue' appears (dialogue finished typing), 'Accept' appears (mission scene), or textarea appears (challenge panel)
  33  |     while (true) {
  34  |       try {
  35  |         // Fast-forward typing by clicking the dialogue text area if it exists
  36  |         if (await page.locator('div.font-serif.text-xl').isVisible()) {
  37  |           await page.locator('div.font-serif.text-xl').first().click();
  38  |         }
  39  |         
  40  |         // Wait up to 1 second for any of the next stage indicators
  41  |         const nextAction = await Promise.race([
  42  |           page.waitForSelector('button:has-text("Continue")', { timeout: 1000 }).then(() => 'continue'),
  43  |           page.waitForSelector('button:has-text("Accept")', { timeout: 1000 }).then(() => 'accept'),
  44  |           page.waitForSelector('textarea', { timeout: 1000 }).then(() => 'textarea'),
  45  |         ]).catch(() => null);
  46  | 
  47  |         if (nextAction === 'continue') {
  48  |           await page.click('button:has-text("Continue")');
  49  |           await page.waitForTimeout(200); // Wait for the next dialogue text to start mounting
  50  |         } else if (nextAction === 'accept' || nextAction === 'textarea') {
  51  |           // Dialogue is completely finished
  52  |           break;
  53  |         }
  54  |       } catch (e) {
  55  |         // Safe catch for detached elements
  56  |       }
  57  |     }
  58  |   }
  59  | 
  60  |   async function solveChallenge(challengeId) {
  61  |     const challenge = SQL_CHALLENGES.find(c => c.id === challengeId);
  62  |     if (!challenge) throw new Error(`Challenge ${challengeId} not found!`);
  63  | 
  64  |     // Verify mission card appears
  65  |     await expect(page.locator(`text=${challenge.title}`).first()).toBeVisible({ timeout: 10000 });
  66  |     if (await page.locator('button:has-text("Accept")').isVisible()) {
  67  |       await page.click('button:has-text("Accept")');
  68  |     }
  69  | 
  70  |     // Type solution into textarea
  71  |     await page.fill('textarea[placeholder="Enter your SQL query here..."]', challenge.referenceQuery);
  72  |     await page.click('button:has-text("Run Query")');
  73  | 
  74  |     // Wait for fake execution delay
  75  |     await page.waitForSelector('text=Executing Query', { state: 'hidden', timeout: 5000 });
  76  |     
  77  |     // Continue from success/reward
  78  |     await page.waitForSelector('button:has-text("Continue")', { timeout: 5000 });
  79  |     await page.click('button:has-text("Continue")');
  80  |     
  81  |   }
  82  | 
  83  |   test('Splash Screen and Intro', async () => {
  84  |     await page.click('button:has-text("Story Mode")');
  85  | 
  86  |     await page.waitForSelector('button:has-text("Begin the Journey")');
  87  |     await page.click('button:has-text("Begin the Journey")');
  88  | 
  89  |     // Wait for the Story Event that precedes Character Selection
  90  |     await page.waitForSelector('button:has-text("Continue")');
  91  |     await page.click('button:has-text("Continue")');
  92  | 
  93  |     await page.waitForSelector('text=Choose Your Hero');
  94  |     
  95  |     await page.locator('[role="radio"]').first().click();
  96  |     await page.click('button:has-text("Begin Adventure")');
  97  |   });
  98  | 
  99  |   test('Tutorial Harbor', async () => {
  100 |     // Challenges
  101 |     await advanceDialogue();
  102 |     await solveChallenge('chal_01');
  103 |     
  104 |     await advanceDialogue();
  105 |     await solveChallenge('chal_02');
  106 |     
  107 |     await advanceDialogue();
  108 |     await solveChallenge('chal_03');
  109 | 
  110 |     // Story Event and transition to chal_06
  111 |     await advanceDialogue();
  112 | 
  113 |     // Remaining challenges
  114 |     await solveChallenge('chal_06'); // unlocks ship
  115 | 
  116 |     // Reward for completing island
> 117 |     await page.waitForSelector('button:has-text("Continue Journey")');
      |                ^ Error: page.waitForSelector: Target page, context or browser has been closed
  118 |     await page.click('button:has-text("Continue Journey")');
  119 | 
  120 |     // Ship Reveal Cinematic
  121 |     await page.waitForSelector('button:has-text("Step Forward ➔")');
  122 |     await page.click('button:has-text("Step Forward ➔")');
  123 |     await page.waitForSelector('button:has-text("Inspect the Vessel")');
  124 |     await page.click('button:has-text("Inspect the Vessel")');
  125 |     await page.click('button:has-text("Claim the Deed")');
  126 |     await page.fill('input[placeholder="The SELECT Sloop"]', 'E2E Test Sloop');
  127 |     await page.click('button:has-text("Inscribe the Name")');
  128 |     
  129 |     await page.waitForSelector('button:has-text("Set Sail")');
  130 |     await page.click('button:has-text("Set Sail")');
  131 |   });
  132 | 
  133 |   test('Sea World and Merchant Isles', async () => {
  134 |     await expect(page.locator('text=Merchant Isles')).toBeVisible();
  135 |     await page.click('text=Merchant Isles');
  136 |     
  137 |     await expect(page.locator('text=Merchant Isles')).toBeVisible();
  138 |     
  139 |     await advanceDialogue();
  140 |     await solveChallenge('merchant_00');
  141 |     
  142 |     await advanceDialogue();
  143 |     await solveChallenge('merchant_01');
  144 | 
  145 |     await advanceDialogue(); // Handles Story event and transitions to merchant_02
  146 |     await solveChallenge('merchant_02');
  147 | 
  148 |     await page.waitForSelector('button:has-text("Continue Journey")');
  149 |     await page.click('button:has-text("Continue Journey")');
  150 |   });
  151 | 
  152 |   test('Smugglers Cove', async () => {
  153 |     await expect(page.locator("text=Smuggler's Cove")).toBeVisible();
  154 |     await page.click("text=Smuggler's Cove");
  155 | 
  156 |     await advanceDialogue();
  157 |     await solveChallenge('smugglers_01');
  158 |     await advanceDialogue();
  159 |     await solveChallenge('smugglers_02');
  160 |     await advanceDialogue();
  161 |     await solveChallenge('smugglers_03');
  162 | 
  163 |     await page.waitForSelector('button:has-text("Continue Journey")');
  164 |     await page.click('button:has-text("Continue Journey")');
  165 |   });
  166 | 
  167 |   test('Jungle of Queries', async () => {
  168 |     await expect(page.locator("text=Jungle of Queries")).toBeVisible();
  169 |     await page.click("text=Jungle of Queries");
  170 | 
  171 |     await advanceDialogue();
  172 |     await solveChallenge('jungle_01');
  173 |     await advanceDialogue();
  174 |     await solveChallenge('jungle_02');
  175 |     await advanceDialogue();
  176 |     await solveChallenge('jungle_03');
  177 | 
  178 |     await page.waitForSelector('button:has-text("Continue Journey")');
  179 |     await page.click('button:has-text("Continue Journey")');
  180 |   });
  181 | 
  182 |   test('Crystal Caverns', async () => {
  183 |     await expect(page.locator("text=Crystal Caverns")).toBeVisible();
  184 |     await page.click("text=Crystal Caverns");
  185 | 
  186 |     await advanceDialogue();
  187 |     await solveChallenge('crystal_01');
  188 |     await advanceDialogue();
  189 |     await solveChallenge('crystal_02');
  190 |     await advanceDialogue();
  191 |     await solveChallenge('crystal_03');
  192 | 
  193 |     await page.waitForSelector('button:has-text("Continue Journey")');
  194 |     await page.click('button:has-text("Continue Journey")');
  195 |   });
  196 | 
  197 |   test('Volcano Island', async () => {
  198 |     await expect(page.locator("text=Volcano Island")).toBeVisible();
  199 |     await page.click("text=Volcano Island");
  200 | 
  201 |     await advanceDialogue();
  202 |     await solveChallenge('volcano_01');
  203 |     await advanceDialogue();
  204 |     await solveChallenge('volcano_02');
  205 | 
  206 |     await page.waitForSelector('button:has-text("Continue Journey")');
  207 |     await page.click('button:has-text("Continue Journey")');
  208 |   });
  209 | 
  210 |   test('Lost Sea', async () => {
  211 |     await expect(page.locator("text=Lost Sea")).toBeVisible();
  212 |     await page.click("text=Lost Sea");
  213 | 
  214 |     await advanceDialogue();
  215 |     await solveChallenge('lost_sea_01');
  216 |     await advanceDialogue();
  217 |     await solveChallenge('lost_sea_02');
```