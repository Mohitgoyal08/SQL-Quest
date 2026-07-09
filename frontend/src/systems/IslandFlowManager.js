import { ISLAND_FLOWS } from '../config/islandFlows';

export class IslandFlowManager {
  /**
   * Calculates the current stage index for a given island based on progress.
   */
  static getInitialStageIndex(islandId, progress) {
    const flow = ISLAND_FLOWS[islandId];
    if (!flow) return 0;

    // Find the last completed challenge in this island's flow
    let lastCompletedStageIndex = -1;
    let highestChallengeIndex = -1;
    
    for (let i = 0; i < flow.stages.length; i++) {
      const stage = flow.stages[i];
      if (stage.type === 'CHALLENGE') {
        highestChallengeIndex = i;
        if (progress.completedIds.includes(stage.id)) {
          lastCompletedStageIndex = i;
        }
      }
    }

    // If the very last challenge of this island is completed, it's a REPLAY! Start from beginning.
    if (lastCompletedStageIndex === highestChallengeIndex && highestChallengeIndex !== -1) {
      return 0;
    }

    // If we've completed some challenges, resume from the stage after the last completed challenge
    if (lastCompletedStageIndex !== -1) {
      return Math.min(lastCompletedStageIndex + 1, flow.stages.length - 1);
    }

    return 0; // Start from the beginning if no challenges completed
  }

  static getStage(islandId, stageIndex) {
    const flow = ISLAND_FLOWS[islandId];
    if (!flow || stageIndex < 0 || stageIndex >= flow.stages.length) return null;
    return flow.stages[stageIndex];
  }

  static getIslandFlow(islandId) {
    return ISLAND_FLOWS[islandId];
  }
}
