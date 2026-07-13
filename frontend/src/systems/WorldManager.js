import { ContentService } from '../services/ContentService';

export class WorldManager {
  /**
   * Resolves the current world context strictly derived from player progress state.
   */
  static getWorldState(progress) {
    const activeChallenge =
      ContentService.getChallenge(progress.currentChallengeId) ||
      ContentService.getChallenges()[0];

    return {
      currentIsland: activeChallenge.islandId || 'Tutorial Harbor',
      currentNPC: activeChallenge.npcId || 'Captain Blackbeard',
      currentChapter: activeChallenge.chapter || 1,
      currentQuestId: activeChallenge.id,
      unlockedIslands: ['Tutorial Harbor']
    };
  }

  /**
   * Evaluates if the player has completed their current island and should be at Sea.
   */
  static isBetweenIslands(progress) {
    if (!progress.unlocks?.ship) return false;
    const activeChallenge = ContentService.getChallenge(progress.currentChallengeId) || ContentService.getChallenges()[0];
    
    // Aggregate data for islands
    const islandChallenges = ContentService.getChallenges().filter(c => c.islandId === activeChallenge.islandId);
    const lastChallenge = islandChallenges[islandChallenges.length - 1];
    
    return progress.completedIds.includes(lastChallenge.id);
  }

  /**
   * Evaluates if an island is accessible.
   */
  static isIslandAccessible(
    islandRequirements,
    progress
  ) {
    return this.checkRequirements(
      islandRequirements,
      progress
    );
  }

  /**
   * Evaluates if an NPC is interactable.
   */
  static isNPCAccessible(
    npcRequirements,
    progress
  ) {
    return this.checkRequirements(
      npcRequirements,
      progress
    );
  }

  /**
   * Evaluates if a location is unlocked.
   */
  static isLocationUnlocked(
    locationRequirements,
    progress
  ) {
    return this.checkRequirements(
      locationRequirements,
      progress
    );
  }

  /**
   * Shared requirement checker.
   * If no requirements exist, access is granted.
   */
  static checkRequirements(
    requirements,
    progress
  ) {
    if (!requirements) return true;

    if (
      requirements.requiresShip &&
      !progress?.unlocks?.ship
    ) {
      return false;
    }

    if (
      requirements.requiredItem &&
      !progress?.inventory?.includes(requirements.requiredItem)
    ) {
      return false;
    }

    if (
      requirements.requiredChallengeId &&
      !progress?.completedIds?.includes(requirements.requiredChallengeId)
    ) {
      return false;
    }

    return true;
  }

  /**
   * Centralizes compatibility between legacy and new requirement formats.
   */
  static normalizeRequirements(

    requirements,

    legacyRequiredItem

  ) {

    // New API always wins.

    if (requirements) {

      return requirements;

    }

    const normalized = {};

    // Legacy Sprint 9.7 compatibility

    if (legacyRequiredItem) {

      normalized.requiredItem = legacyRequiredItem;

    }

    return Object.keys(normalized).length > 0

      ? normalized

      : undefined;

  }

  /**
   * Evaluates whether a challenge is accessible.
   */
  static isChallengeAccessible(
    challengeRequirements,
    legacyRequiredItem,
    progress
  ) {
    const normalizedReqs = this.normalizeRequirements(
      challengeRequirements,
      legacyRequiredItem
    );

    return this.checkRequirements(
      normalizedReqs,
      progress
    );
  }
} 