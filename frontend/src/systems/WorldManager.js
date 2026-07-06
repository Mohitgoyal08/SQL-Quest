import { SQL_CHALLENGES } from '../data/challenges';

export class WorldManager {
  /**
   * Resolves the current world context strictly derived from player progress state.
   */
  static getWorldState(progress) {
    const activeChallenge = SQL_CHALLENGES.find(c => c.id === progress.currentChallengeId) || SQL_CHALLENGES[0];

    return {
      currentIsland: activeChallenge.islandId || 'Tutorial Harbor',
      currentNPC: activeChallenge.npcId || 'Captain Blackbeard',
      currentChapter: activeChallenge.chapter || 1,
      currentQuestId: activeChallenge.id,
      unlockedIslands: ['Tutorial Harbor']
    };
  }
}