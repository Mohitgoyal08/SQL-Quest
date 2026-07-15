import { apiClient } from './api';

class ContentServiceImpl {
  constructor() {
    this.challenges = [];
    this.rewards = [];
    this.dialogues = [];
    this.islands = [];
    this.isLoaded = false;
  }

  async fetchContent() {
    if (this.isLoaded) return;
    try {
      const [chalRes, rewRes, diagRes, islRes] = await Promise.all([
        apiClient.get('/content/challenges'),
        apiClient.get('/content/rewards'),
        apiClient.get('/content/dialogues'),
        apiClient.get('/content/islands')
      ]);

      if (chalRes.data) {
        // Only active challenges for gameplay
        const activeChallenges = chalRes.data.filter(c => c.is_active);
        
        this.challenges = activeChallenges.map(backendChallenge => {
          // Map backend schema to frontend SQLChallenge schema
          const challengeRewards = (rewRes.data || []).filter(r => r.challenge_id === backendChallenge.id);
          const mappedRewards = {};
          if (challengeRewards.length > 0) {
            const primaryReward = challengeRewards[0];
            mappedRewards.xp = primaryReward.xp;
            mappedRewards.coins = primaryReward.coins;
            if (primaryReward.diamonds) mappedRewards.gems = primaryReward.diamonds;
            if (primaryReward.achievement) mappedRewards.badge = primaryReward.achievement;
            if (primaryReward.items && primaryReward.items.reward_item) {
                mappedRewards.item = primaryReward.items.reward_item;
            } else if (primaryReward.unlock_cosmetic) {
                mappedRewards.item = primaryReward.unlock_cosmetic;
            }
          }

          // Handle hints array mapping
          const hints = [];
          if (backendChallenge.hint) hints.push(backendChallenge.hint);
          if (backendChallenge.hint_2) hints.push(backendChallenge.hint_2);

          return {
            id: backendChallenge.id,
            title: backendChallenge.title,
            chapter: this._determineChapter(backendChallenge.island_id),
            islandId: backendChallenge.island_id,
            npcId: backendChallenge.npc,
            description: backendChallenge.description || '',
            story: '', // Optional fallback story text
            difficulty: backendChallenge.difficulty || 'Medium',
            validation: {
              type: backendChallenge.validation_type === 'EXACT_MATCH' ? 'EXACT' : (backendChallenge.validation_type || 'EXACT'),
              expected: backendChallenge.expected_sql
            },
            starterCode: backendChallenge.seed_data?.starter_code || 'SELECT * FROM ',
            referenceQuery: backendChallenge.solution || backendChallenge.expected_sql,
            hints: hints,
            rewards: mappedRewards,
            nextChallengeId: null // We will calculate this based on order_index later
          };
        });
        
        // Wire up nextChallengeId based on order_index mapping within same island
        this.challenges.forEach(challenge => {
            const islandChallenges = this.challenges.filter(c => c.islandId === challenge.islandId);
            // Re-find the original backend objects to get order_index for sorting
            const originalIslandChallenges = activeChallenges.filter(c => c.island_id === challenge.islandId);
            originalIslandChallenges.sort((a, b) => a.order_index - b.order_index);
            
            const idx = originalIslandChallenges.findIndex(c => c.id === challenge.id);
            if (idx >= 0 && idx < originalIslandChallenges.length - 1) {
                challenge.nextChallengeId = originalIslandChallenges[idx + 1].id;
            }
        });
      }

      if (diagRes.data) {
        this.dialogues = diagRes.data;
      }
      if (islRes.data) {
        this.islands = islRes.data.sort((a, b) => a.order_index - b.order_index);
      }
      this.isLoaded = true;
    } catch (e) {
      console.error("Failed to fetch CMS content. Game cannot start properly.", e);
      // DB is the only source of truth. Game should fail to load correctly or show empty.
      this.isLoaded = true;
    }
  }

  _determineChapter(islandId) {
    const map = {
      'tutorial_island': 1,
      'merchant_isles': 2,
      'smugglers_cove': 3,
      'jungle_queries': 4,
      'crystal_caverns': 5,
      'volcano_island': 6,
      'lost_sea': 7,
      'pirate_kings_ship': 8
    };
    return map[islandId] || 1;
  }

  getChallenges() {
    return this.challenges;
  }
  
  getChallenge(id) {
    return this.challenges.find(c => c.id === id) || null;
  }

  getIslands() {
    return this.islands;
  }

  getIsland(id) {
    return this.islands.find(i => i.id === id) || null;
  }

  getDialogue(npcId, challengeId, progress) {
    // Check if backend has dialogues for this challenge/npc
    const backendDiags = this.dialogues.filter(d => d.challenge_id === challengeId && d.npc_id === npcId);
    if (backendDiags.length > 0) {
      return backendDiags[0].dialogue_text.map((text, idx) => ({
        id: `${challengeId}_${idx}`,
        speaker: npcId.replace(/_/g, ' '),
        avatar: '💬',
        text: text
      }));
    }
    
    // No fallback anymore. If it's not in DB, it doesn't exist.
    return [{
        id: 'error_node',
        speaker: 'System',
        avatar: '⚠️',
        text: '...'
    }];
  }
}

export const ContentService = new ContentServiceImpl();
