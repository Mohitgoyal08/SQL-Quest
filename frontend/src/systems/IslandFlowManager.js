import { ContentService } from '../services/ContentService';

export class IslandFlowManager {
  /**
   * Calculates the current stage index for a given island based on progress.
   */
  static getInitialStageIndex(islandId, progress) {
    const flow = this.getDynamicFlow(islandId);
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
    const flow = this.getDynamicFlow(islandId);
    if (!flow || stageIndex < 0 || stageIndex >= flow.stages.length) return null;
    return flow.stages[stageIndex];
  }

  static getIslandFlow(islandId) {
    return this.getDynamicFlow(islandId);
  }

  static getDynamicFlow(islandId) {
    const activeChallenges = ContentService.getChallenges()
      .filter(c => c.islandId === islandId)
      .sort((a, b) => a.order_index - b.order_index);

    const island = ContentService.getIsland(islandId);
    const title = island ? island.name : islandId;
    
    const npcMap = {
      tutorial_island: 'captain_blackbeard',
      merchant_isles: 'quincy',
      smugglers_cove: 'admiral_morgan',
      jungle_queries: 'explorer_drake',
      crystal_caverns: 'dwarf_foreman',
      volcano_island: 'blacksmith_ignis',
      lost_sea: 'captain_morgan',
      pirate_kings_ship: 'pirate_king'
    };
    const npcId = npcMap[islandId] || 'captain_blackbeard';

    const stages = [];

    // 1. ARRIVAL & TITLE STAGES
    stages.push({ type: 'ARRIVAL' });
    stages.push({ type: 'TITLE', title });

    // 2. TUTORIAL SPECIAL INTRO STAGES
    if (islandId === 'tutorial_island') {
      stages.push({ type: 'STORY_EVENT', content: 'Captain Flint introduces the shattered Codex.' });
      stages.push({ type: 'CHARACTER_SELECTION' });
    }

    // 3. DIALOGUE & CHALLENGE STAGES LOOP
    activeChallenges.forEach((chal, idx) => {
      // Tutorial special story event between some challenges
      if (islandId === 'tutorial_island' && idx === 3 && activeChallenges.length >= 4) {
        stages.push({ type: 'STORY_EVENT', content: 'Flint senses a Codex Fragment nearby.' });
      }

      stages.push({ type: 'DIALOGUE', id: chal.id });
      stages.push({ type: 'CHALLENGE', id: chal.id });
    });

    // 4. REWARD STAGE
    const rewardFragmentMap = {
      tutorial_island: 'frag_tutorial',
      merchant_isles: 'frag_merchant',
      smugglers_cove: 'frag_smugglers',
      jungle_queries: 'frag_jungle',
      crystal_caverns: 'frag_crystal',
      volcano_island: 'frag_volcano',
      lost_sea: 'frag_lost_sea',
      pirate_kings_ship: 'frag_pirate_ship'
    };
    const nextKeyMap = {
      tutorial_island: 'key_merchant',
      merchant_isles: 'key_smugglers',
      smugglers_cove: 'key_jungle',
      jungle_queries: 'key_crystal',
      crystal_caverns: 'key_volcano',
      volcano_island: 'key_lost_sea',
      lost_sea: 'key_pirate_ship'
    };
    
    stages.push({
      type: 'REWARD',
      rewards: {
        codexFragment: rewardFragmentMap[islandId] || `frag_${islandId}`,
        key: nextKeyMap[islandId] || null
      }
    });

    // 5. DEPARTURE STAGE
    stages.push({ type: 'DEPARTURE' });

    return {
      islandId,
      title,
      npcId,
      stages
    };
  }
}
