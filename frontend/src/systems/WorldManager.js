import { ContentService } from '../services/ContentService';

export class WorldManager {
  /**
   * Resolves the current world context strictly derived from player progress state.
   */
  static getWorldState(progress) {
    const activeChallenge =
      ContentService.getChallenge(progress.currentChallengeId) ||
      ContentService.getChallenges()[0];

    if (!activeChallenge) {
      return {
        currentIsland: 'Tutorial Harbor',
        currentNPC: 'Captain Blackbeard',
        currentChapter: 1,
        currentQuestId: 'chal_01',
        unlockedIslands: ['Tutorial Harbor']
      };
    }

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
    if (!activeChallenge) return false;
    
    return this.isIslandCompleted(activeChallenge.islandId, progress);
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

  static isIslandCompleted(islandId, progress) {
    const challenges = ContentService.getChallenges().filter(c => c.islandId === islandId);
    if (challenges.length === 0) return false;
    return challenges.every(c => progress.completedIds.includes(c.id));
  }

  static isIslandUnlocked(islandId, progress) {
    const islands = ContentService.getIslands();
    if (!Array.isArray(islands) || islands.length === 0) return true;

    const firstIsland = islands[0];
    if (islandId === firstIsland.id) return true;

    // If the island is the player's current island, it is unlocked
    if (progress.currentIsland === islandId) return true;

    const currentIdx = islands.findIndex(i => i.id === progress.currentIsland);
    const idx = islands.findIndex(i => i.id === islandId);
    if (idx < 0) return false;

    // If the player is currently on a subsequent island in the chain, preceding islands must be unlocked
    if (currentIdx >= idx) return true;

    // Otherwise evaluate completion of preceding islands
    for (let i = 0; i < idx; i++) {
      if (!this.isIslandCompleted(islands[i].id, progress)) {
        return false;
      }
    }

    const targetIsland = islands[idx];
    if (targetIsland.unlock_requirements) {
      const reqs = typeof targetIsland.unlock_requirements === 'string'
        ? JSON.parse(targetIsland.unlock_requirements)
        : targetIsland.unlock_requirements;
      return this.evaluateCustomRequirements(reqs, progress);
    }

    return true;
  }

  static evaluateCustomRequirements(requirements, progress) {
    if (!requirements) return true;

    if (requirements.requires_ship && !progress?.unlocks?.ship) {
      return false;
    }

    if (requirements.required_item && !progress?.inventory?.includes(requirements.required_item)) {
      return false;
    }

    if (requirements.required_challenge_id && !progress?.completedIds?.includes(requirements.required_challenge_id)) {
      return false;
    }

    return true;
  }
} 