import { DialogueRepository } from '../data/repositories/DialogueRepository';
import { MissionRepository } from '../data/repositories/MissionRepository';
import { SQL_CHALLENGES } from '../data/challenges';
import { WorldManager } from './WorldManager';

export class QuestManager {
  /**
   * Delegates dialogue lookup directly to the scalable DialogueRepository.
   * Evaluates requirements if the dialogue uses the reactive branch schema.
   */
  static getDialogueForNPC(npcId, challengeId, progress) {
    const rawDialogue = DialogueRepository.getDialogue(npcId, challengeId);
    
    // Check if this is the new reactive branched schema
    if (Array.isArray(rawDialogue) && rawDialogue.length > 0 && rawDialogue[0].dialogue) {
      for (const branch of rawDialogue) {
        if (WorldManager.checkRequirements(branch.requirements, progress)) {
          return branch.dialogue;
        }
      }
      // Fallback if no branches match (should ideally have a default branch)
      return [];
    }

    // Legacy unbranched schema
    return rawDialogue;
  }

  static getMissionForChallenge(challengeId) {
    const baseMission = MissionRepository.getMission(challengeId) || {};
    const challenge = this.getActiveChallenge(challengeId) || SQL_CHALLENGES[0] || {};

    return {
      ...baseMission,
      id: challenge.id || 'unknown_challenge',
      title: challenge.title || 'Untitled Mission',
      npc: challenge.npcId || baseMission.npc || 'Unknown NPC',
      description: challenge.story || 'No story details available.',
      difficultyKey: (challenge.difficulty || 'Novice').toUpperCase(),
      objectives: [
        {
          id: `${challenge.id || 'default'}_objective`,
          title: 'Execute SQL Requirement',
          description: challenge.description || 'Complete the SQL objective.',
        },
      ],
      rewards: challenge.rewards || { xp: 0, coins: 0 },
    };
  }

  static getActiveChallenge(challengeId) {
    if (!challengeId || !Array.isArray(SQL_CHALLENGES) || SQL_CHALLENGES.length === 0) {
      return SQL_CHALLENGES?.[0] || null;
    }
    return SQL_CHALLENGES.find((c) => c.id === challengeId) || SQL_CHALLENGES[0] || null;
  }

  static getAllChallenges() {
    return Array.isArray(SQL_CHALLENGES) ? SQL_CHALLENGES : [];
  }

  static getNextQuest(currentChallengeId) {
    if (!Array.isArray(SQL_CHALLENGES)) return null;
    
    const current = SQL_CHALLENGES.find(c => c.id === currentChallengeId);
    if (current && current.nextChallengeId) {
      return SQL_CHALLENGES.find(c => c.id === current.nextChallengeId) || null;
    }
    return null;
  }
}