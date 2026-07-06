import { DialogueRepository } from '../data/repositories/DialogueRepository';
import { MissionRepository } from '../data/repositories/MissionRepository';
import { SQL_CHALLENGES } from '../data/challenges';

export class QuestManager {
  /**
   * Delegates dialogue lookup directly to the scalable DialogueRepository.
   */
  static getDialogueForNPC(npcId, challengeId) {
    return DialogueRepository.getDialogue(npcId, challengeId);
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