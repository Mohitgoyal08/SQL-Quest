import { TUTORIAL_DIALOGUES } from '../dialogue/tutorialHarbor/dialogues';
import { SMUGGLERS_DIALOGUES } from '../dialogue/smugglersCove/dialogues';
import { JUNGLE_DIALOGUES } from '../dialogue/jungleOfQueries/dialogues';
import { CRYSTAL_DIALOGUES } from '../dialogue/crystalCaverns/dialogues';
import { MERCHANT_DIALOGUES } from '../dialogue/merchantIsles/dialogues';
import { SQL_CHALLENGES } from '../challenges';
import { VOLCANO_DIALOGUES } from '../dialogue/volcanoIsland/dialogues';
import { LOST_SEA_DIALOGUES } from '../dialogue/lostSea/dialogues';
import { PIRATE_KINGS_DIALOGUES } from '../dialogue/pirateKingsShip/dialogues';

/**
 * Master dictionary aggregating all island dialogue registries.
 * Scalable to hundreds of challenges across all 7+ islands.
 */
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

export class DialogueRepository {
  /**
   * Resolves structured dialogue nodes based on active challenge context.
   *
   * @param {string} npcId - The active NPC identifier (reserved for future side-quests/shops)
   * @param {string} challengeId - The canonical challenge ID (e.g., 'chal_02')
   * @param {Object} progress - The player's progress state
   * @returns {Array<Object>} Array of dialogue node objects
   */
  static getDialogue(npcId, challengeId, progress = {}) {
    // 0. Check for Chapter Completions
    // Pirate King / Game Complete
    if (challengeId === 'pirate_kings_ship_01' && progress?.completedIds?.includes('pirate_kings_ship_01')) {
      if (npcId === 'pirate_king') return PIRATE_KINGS_DIALOGUES.game_complete.pirate_king;
    }

    // Smuggler's Cove Complete
    if (challengeId === 'smugglers_03' && progress?.completedIds?.includes('smugglers_03')) {
      if (npcId === 'admiral_morgan') return SMUGGLERS_DIALOGUES.game_complete.admiral_morgan;
      if (npcId === 'shady_informant') return SMUGGLERS_DIALOGUES.game_complete.shady_informant;
      if (npcId === 'smuggler_boss') return SMUGGLERS_DIALOGUES.game_complete.smuggler_boss;
    }

    // Merchant Isles Complete (When starting smugglers_01, player is still at merchant isles)
    if (challengeId === 'smugglers_01' && !progress?.completedIds?.includes('smugglers_01')) {
      if (npcId === 'marlowe') return MERCHANT_DIALOGUES.chapter_complete.marlowe;
      if (npcId === 'quincy') return MERCHANT_DIALOGUES.chapter_complete.quincy;
    }

    // 1. Fallback to initial harbor tutorial if no challenge ID exists yet
    if (!challengeId) {
      return TUTORIAL_DIALOGUES.chal_01;
    }

    // 2. Primary Lookup: Exact match on active challenge ID
    const challengeDialogue = MASTER_DIALOGUE_REGISTRY[challengeId];
    if (Array.isArray(challengeDialogue) && challengeDialogue.length > 0) {
      return challengeDialogue;
    }

    // 3. Ambient / Wrong NPC Check
    // If the player is talking to an NPC that isn't the active quest giver, give them ambient dialogue
    const activeChallenge = SQL_CHALLENGES.find(c => c.id === challengeId);
    if (activeChallenge && npcId && activeChallenge.npcId !== npcId) {
      if (npcId === 'quincy') {
        return [{ id: 'q1', speaker: 'Quartermaster Quincy', avatar: '👨‍✈️', text: 'I manage the cargo exchange. If you need guild clearance, talk to Master Marlowe first.' }];
      }
      if (npcId === 'marlowe') {
        return [{ id: 'm1', speaker: 'Master Marlowe', avatar: '🪙', text: 'I am busy auditing these ledgers. Check the town board or speak to my Quartermaster.' }];
      }
      if (npcId === 'crier') {
        return [{ id: 'c1', speaker: 'Town Crier', avatar: '📢', text: 'Extra! Extra! Trade routes blocked due to ledger discrepancies!' }];
      }
      if (npcId === 'admiral_morgan') {
        return [{ id: 'am1', speaker: 'Admiral Morgan', avatar: '🎖️', text: 'Stay alert, Captain. These waters are treacherous.' }];
      }
      if (npcId === 'shady_informant') {
        return [{ id: 'si1', speaker: 'Shady Informant', avatar: '🕵️', text: 'Keep walking if you don\'t have coin.' }];
      }
      if (npcId === 'smuggler_boss') {
        return [{ id: 'sb1', speaker: 'Smuggler Boss', avatar: '🦹', text: 'You\'re poking your nose where it doesn\'t belong.' }];
      }
    }

    // 4. Safe Fallback: Dynamic dialogue for unregistered or future challenges
    const formattedNpcName = npcId
      ? npcId.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
      : 'Harbor Guide';

    return [
      {
        id: `fallback_${challengeId}`,
        speaker: formattedNpcName,
        avatar: "💬",
        text: `We have pressing matters to attend to regarding mission [${challengeId}]. Review your objectives carefully and execute your SQL query when ready!`,
      },
    ];
  }
}