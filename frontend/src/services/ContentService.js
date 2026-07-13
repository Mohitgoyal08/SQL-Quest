import { apiClient } from './api';
import { SQL_CHALLENGES } from '../data/challenges';
import { DialogueRepository } from '../data/repositories/DialogueRepository';

class ContentServiceImpl {
  constructor() {
    this.challenges = [...SQL_CHALLENGES];
    this.rewards = [];
    this.dialogues = [];
    this.isLoaded = false;
  }

  async fetchContent() {
    if (this.isLoaded) return;
    try {
      const [chalRes, rewRes, diagRes] = await Promise.all([
        apiClient.get('/content/challenges'),
        apiClient.get('/content/rewards'),
        apiClient.get('/content/dialogues')
      ]);

      if (chalRes.data && chalRes.data.length > 0) {
        this.challenges = chalRes.data.map(backendChallenge => {
          // Map backend schema to frontend SQLChallenge schema
          const challengeRewards = rewRes.data.filter(r => r.challenge_id === backendChallenge.id);
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
            difficulty: backendChallenge.difficulty,
            validation: {
              type: backendChallenge.validation_type === 'EXACT_MATCH' ? 'EXACT' : backendChallenge.validation_type,
              expected: backendChallenge.expected_sql
            },
            starterCode: backendChallenge.seed_data?.starter_code || 'SELECT * FROM ',
            referenceQuery: backendChallenge.expected_sql,
            hints: hints,
            rewards: mappedRewards,
            nextChallengeId: null // We will calculate this based on order_index later
          };
        });
        
        // Wire up nextChallengeId based on order_index mapping within same island
        this.challenges.forEach(challenge => {
            const islandChallenges = this.challenges.filter(c => c.islandId === challenge.islandId);
            const sorted = islandChallenges.sort((a, b) => a.order_index - b.order_index);
            const idx = sorted.findIndex(c => c.id === challenge.id);
            if (idx >= 0 && idx < sorted.length - 1) {
                challenge.nextChallengeId = sorted[idx + 1].id;
            }
        });
      }

      if (diagRes.data && diagRes.data.length > 0) {
        this.dialogues = diagRes.data;
      }
      this.isLoaded = true;
    } catch (e) {
      console.warn("Failed to fetch CMS content. Falling back to static assets.", e);
      // Keep static arrays
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
    
    // Fallback to legacy static dialogue repository
    return DialogueRepository.getDialogue(npcId, challengeId, progress);
  }
}

export const ContentService = new ContentServiceImpl();
