import { TUTORIAL_DIALOGUES } from '../dialogue/tutorialHarbor/dialogues';
import { SMUGGLERS_DIALOGUES } from '../dialogue/smugglersCove/dialogues';
import { JUNGLE_DIALOGUES } from '../dialogue/jungleOfQueries/dialogues';
import { CRYSTAL_DIALOGUES } from '../dialogue/crystalCaverns/dialogues';

/**
 * Master dictionary aggregating all island dialogue registries.
 * Scalable to hundreds of challenges across all 7+ islands.
 */
const MASTER_DIALOGUE_REGISTRY = {
  ...TUTORIAL_DIALOGUES,
  ...SMUGGLERS_DIALOGUES,
  ...JUNGLE_DIALOGUES,
  ...CRYSTAL_DIALOGUES,
};

export class DialogueRepository {
  /**
   * Resolves structured dialogue nodes based on active challenge context.
   *
   * @param {string} npcId - The active NPC identifier (reserved for future side-quests/shops)
   * @param {string} challengeId - The canonical challenge ID (e.g., 'chal_02')
   * @returns {Array<Object>} Array of dialogue node objects
   */
  static getDialogue(npcId, challengeId) {
    // 1. Fallback to initial harbor tutorial if no challenge ID exists yet
    if (!challengeId) {
      return TUTORIAL_DIALOGUES.chal_01;
    }

    // 2. Primary Lookup: Exact match on active challenge ID
    const challengeDialogue = MASTER_DIALOGUE_REGISTRY[challengeId];
    if (Array.isArray(challengeDialogue) && challengeDialogue.length > 0) {
      return challengeDialogue;
    }

    // 3. Safe Fallback: Dynamic dialogue for unregistered or future challenges
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