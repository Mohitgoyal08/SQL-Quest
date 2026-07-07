import { SQL_CHALLENGES } from '../data/challenges';

export class WorldManager {
  /**
   * Resolves the current world context strictly derived from player progress state.
   */
  static getWorldState(progress) {
    const activeChallenge =
      SQL_CHALLENGES.find(c => c.id === progress.currentChallengeId) ||
      SQL_CHALLENGES[0];

    return {
      currentIsland: activeChallenge.islandId || 'Tutorial Harbor',
      currentNPC: activeChallenge.npcId || 'Captain Blackbeard',
      currentChapter: activeChallenge.chapter || 1,
      currentQuestId: activeChallenge.id,
      unlockedIslands: ['Tutorial Harbor']
    };
  }

  /**
   * Evaluates if an island is accessible.
   */
  static isIslandAccessible(
    islandRequirements,
    completedChallengeIds,
    hasItem
  ) {
    return this.checkRequirements(
      islandRequirements,
      completedChallengeIds,
      hasItem
    );
  }

  /**
   * Evaluates if an NPC is interactable.
   */
  static isNPCAccessible(
    npcRequirements,
    completedChallengeIds,
    hasItem
  ) {
    return this.checkRequirements(
      npcRequirements,
      completedChallengeIds,
      hasItem
    );
  }

  /**
   * Evaluates if a location is unlocked.
   */
  static isLocationUnlocked(
    locationRequirements,
    completedChallengeIds,
    hasItem
  ) {
    return this.checkRequirements(
      locationRequirements,
      completedChallengeIds,
      hasItem
    );
  }

  /**
   * Shared requirement checker.
   * If no requirements exist, access is granted.
   */
  static checkRequirements(
    requirements,
    completedChallengeIds,
    hasItem
  ) {
    if (!requirements) return true;

    if (
      requirements.requiredItem &&
      !hasItem(requirements.requiredItem)
    ) {
      return false;
    }

    if (
      requirements.requiredChallengeId &&
      !completedChallengeIds.includes(
        requirements.requiredChallengeId
      )
    ) {
      return false;
    }

    return true;
  }
}