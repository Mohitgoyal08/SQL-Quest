import { useState, useEffect, useCallback } from 'react';
import { SQL_CHALLENGES, ChallengeRewards } from '../data/challenges';

const STORAGE_KEY = 'sql_quest_player_save_v2';

export interface PlayerProgressState {
  level: number;
  xp: number;
  coins: number;
  gems: number;
  currentIsland: string;
  currentNPC: string;
  inventory: string[];
  badges: string[];
  completedIds: string[];
  unlockedIds: string[];
  currentChallengeId: string;
}

const INITIAL_STATE: PlayerProgressState = {
  level: 1,
  xp: 0,
  coins: 0,
  gems: 0,
  currentIsland: SQL_CHALLENGES[0].islandId,
  currentNPC: SQL_CHALLENGES[0].npcId,
  inventory: [],
  badges: [],
  completedIds: [],
  unlockedIds: [SQL_CHALLENGES[0].id],
  currentChallengeId: SQL_CHALLENGES[0].id,
};

export function useChallengeProgress() {
  const [progress, setProgress] = useState<PlayerProgressState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return { ...INITIAL_STATE, ...JSON.parse(saved) };
    } catch (e) {
      console.error("Failed to parse save state:", e);
    }
    return INITIAL_STATE;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch (e) {
      console.error("Failed to persist save state:", e);
    }
  }, [progress]);

  const completeChallenge = useCallback((challengeId: string, rewards: ChallengeRewards, nextId: string | null) => {
    setProgress((prev) => {
      const isAlreadyCompleted = prev.completedIds.includes(challengeId);
      const nextCompleted = isAlreadyCompleted ? prev.completedIds : [...prev.completedIds, challengeId];
      const nextUnlocked = [...prev.unlockedIds];

      if (nextId && !nextUnlocked.includes(nextId)) {
        nextUnlocked.push(nextId);
      }

      // Calculate level progression (e.g., every 300 XP = 1 Level)
      const newXp = isAlreadyCompleted ? prev.xp : prev.xp + rewards.xp;
      const newLevel = Math.floor(newXp / 300) + 1;

      // Handle item and badge unlocks
      const nextInventory = [...prev.inventory];
      if (rewards.item && !nextInventory.includes(rewards.item)) nextInventory.push(rewards.item);

      const nextBadges = [...prev.badges];
      if (rewards.badge && !nextBadges.includes(rewards.badge)) nextBadges.push(rewards.badge);

      // Advance location/NPC if moving to a new challenge
      const nextChallengeMeta = SQL_CHALLENGES.find(c => c.id === (nextId || challengeId));

      return {
        ...prev,
        level: newLevel,
        xp: newXp,
        coins: isAlreadyCompleted ? prev.coins : prev.coins + rewards.coins,
        gems: isAlreadyCompleted ? prev.gems : prev.gems + (rewards.gems || 0),
        inventory: nextInventory,
        badges: nextBadges,
        currentIsland: nextChallengeMeta?.islandId || prev.currentIsland,
        currentNPC: nextChallengeMeta?.npcId || prev.currentNPC,
        completedIds: nextCompleted,
        unlockedIds: nextUnlocked,
        currentChallengeId: nextId || challengeId,
      };
    });
  }, []);

  const selectChallenge = useCallback((challengeId: string) => {
    setProgress((prev) => {
      if (!prev.unlockedIds.includes(challengeId)) return prev;
      const meta = SQL_CHALLENGES.find(c => c.id === challengeId);
      return {
        ...prev,
        currentChallengeId: challengeId,
        currentIsland: meta?.islandId || prev.currentIsland,
        currentNPC: meta?.npcId || prev.currentNPC,
      };
    });
  }, []);

  return { progress, completeChallenge, selectChallenge };
}