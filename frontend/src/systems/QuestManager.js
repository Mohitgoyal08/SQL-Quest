import { ContentService } from '../services/ContentService';
import { WorldManager } from './WorldManager';

export class QuestManager {
  /**
   * Delegates dialogue lookup directly to the scalable ContentService.
   * Evaluates requirements if the dialogue uses the reactive branch schema.
   */
  static getDialogueForNPC(npcId, challengeId, progress) {
    const rawDialogue = ContentService.getDialogue(npcId, challengeId, progress);
    
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
    const challenge = this.getActiveChallenge(challengeId) || ContentService.getChallenges()[0] || {};

    return {
      id: challenge.id || 'unknown_challenge',
      title: challenge.title || 'Untitled Mission',
      npc: challenge.npcId || 'Unknown NPC',
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
    const challenges = ContentService.getChallenges();
    if (!challengeId || !Array.isArray(challenges) || challenges.length === 0) {
      return challenges?.[0] || null;
    }
    return ContentService.getChallenge(challengeId) || challenges[0] || null;
  }

  static getAllChallenges() {
    return ContentService.getChallenges();
  }

  static getNextQuest(currentChallengeId) {
    const challenges = ContentService.getChallenges();
    if (!Array.isArray(challenges)) return null;
    
    const current = ContentService.getChallenge(currentChallengeId);
    if (current && current.nextChallengeId) {
      return ContentService.getChallenge(current.nextChallengeId) || null;
    }
    return null;
  }
}