import { SQL_CHALLENGES } from '../src/data/challenges';
import { TUTORIAL_DIALOGUES } from '../src/data/dialogue/tutorialHarbor/dialogues';
import { SMUGGLERS_DIALOGUES } from '../src/data/dialogue/smugglersCove/dialogues';
import { JUNGLE_DIALOGUES } from '../src/data/dialogue/jungleOfQueries/dialogues';
import { CRYSTAL_DIALOGUES } from '../src/data/dialogue/crystalCaverns/dialogues';
import { MERCHANT_DIALOGUES } from '../src/data/dialogue/merchantIsles/dialogues';
import { VOLCANO_DIALOGUES } from '../src/data/dialogue/volcanoIsland/dialogues';
import { LOST_SEA_DIALOGUES } from '../src/data/dialogue/lostSea/dialogues';
import { PIRATE_KINGS_DIALOGUES } from '../src/data/dialogue/pirateKingsShip/dialogues';

const MASTER_DIALOGUE_REGISTRY = {
  ...TUTORIAL_DIALOGUES,
  ...SMUGGLERS_DIALOGUES,
  ...JUNGLE_DIALOGUES,
  ...CRYSTAL_DIALOGUES,
  ...MERCHANT_DIALOGUES,
  ...VOLCANO_DIALOGUES,
  ...LOST_SEA_DIALOGUES,
  ...PIRATE_KINGS_DIALOGUES,
};

const BASE_URL = 'http://localhost:8000/api/v1';

async function migrate() {
    console.log("Authenticating as admin...");
    
    // Login
    const loginRes = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
            username: 'admin@sqlquest.com',
            password: 'AdminPassword123!'
        })
    });
    
    if (!loginRes.ok) {
        console.error("Failed to login", await loginRes.text());
        return;
    }
    
    const { access_token } = await loginRes.json();
    const headers = {
        'Authorization': `Bearer ${access_token}`,
        'Content-Type': 'application/json'
    };

    console.log(`Found ${SQL_CHALLENGES.length} challenges to migrate...`);

    let orderIndex = 10; // start order index

    for (const chal of SQL_CHALLENGES) {
        console.log(`Migrating ${chal.id}...`);
        
        const payload = {
            id: chal.id,
            island_id: chal.islandId,
            npc: chal.npcId,
            title: chal.title,
            description: chal.description,
            difficulty: chal.difficulty,
            expected_sql: chal.validation.expected,
            validation_type: chal.validation.type === 'EXACT' ? 'EXACT_MATCH' : chal.validation.type,
            hint: chal.hints && chal.hints.length > 0 ? chal.hints[0] : null,
            hint_2: chal.hints && chal.hints.length > 1 ? chal.hints[1] : null,
            solution: chal.referenceQuery,
            is_active: true,
            order_index: orderIndex++,
            seed_data: { starter_code: chal.starterCode }
        };

        // Create or Update Challenge
        let chalRes = await fetch(`${BASE_URL}/admin/challenges`, {
            method: 'POST',
            headers,
            body: JSON.stringify(payload)
        });

        if (!chalRes.ok) {
            const errText = await chalRes.text();
            if (errText.includes("already exists") || chalRes.status === 400) {
                console.log(`Challenge ${chal.id} already exists, updating...`);
                let updateRes = await fetch(`${BASE_URL}/admin/challenges/${chal.id}`, {
                    method: 'PUT',
                    headers,
                    body: JSON.stringify(payload)
                });
                if (!updateRes.ok) {
                    console.error(`Failed to update challenge ${chal.id}`, await updateRes.text());
                    continue;
                }
            } else {
                console.error(`Failed to create challenge ${chal.id}`, errText);
                continue;
            }
        }

        // Create Rewards
        if (chal.rewards) {
            const rewardPayload = {
                challenge_id: chal.id,
                xp: chal.rewards.xp || 0,
                coins: chal.rewards.coins || 0,
                diamonds: chal.rewards.gems || 0,
                achievement: chal.rewards.badge || null,
                items: chal.rewards.item ? { reward_item: chal.rewards.item } : null
            };
            
            let rewRes = await fetch(`${BASE_URL}/admin/rewards`, {
                method: 'POST',
                headers,
                body: JSON.stringify(rewardPayload)
            });
            
            if (!rewRes.ok) {
                console.error(`Failed to create rewards for ${chal.id}`, await rewRes.text());
            }
        }

        // Create Dialogue
        let dialogueArray = MASTER_DIALOGUE_REGISTRY[chal.id];
        
        // Some challenges have complex conditional dialogue arrays (like chal_02 with requirements).
        // For simplicity in V2 CMS, if it's an array of objects that have a "dialogue" property (conditional),
        // we'll just extract the first fallback dialogue for now, or the primary one.
        // If it's a simple array of nodes (has 'text' and 'speaker'), we use it directly.
        let rawNodes = [];
        if (dialogueArray && dialogueArray.length > 0) {
            if (dialogueArray[0].dialogue) {
                // It's a conditional dialogue array. We'll take the first condition's dialogue, or the fallback.
                rawNodes = dialogueArray[dialogueArray.length - 1].dialogue || dialogueArray[0].dialogue;
            } else if (dialogueArray[0].text) {
                // It's a simple dialogue array
                rawNodes = dialogueArray;
            }
        }

        if (rawNodes.length > 0) {
            const textArray = rawNodes.map(n => n.text);
            const diagPayload = {
                challenge_id: chal.id,
                npc_id: chal.npcId,
                dialogue_text: textArray
            };
            
            let diagRes = await fetch(`${BASE_URL}/admin/dialogues`, {
                method: 'POST',
                headers,
                body: JSON.stringify(diagPayload)
            });
            
            if (!diagRes.ok) {
                console.error(`Failed to create dialogue for ${chal.id}`, await diagRes.text());
            }
        }
    }
    
    console.log("Migration complete!");
}

migrate().catch(console.error);
