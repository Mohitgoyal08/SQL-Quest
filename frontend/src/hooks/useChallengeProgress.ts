import { useState, useEffect, useCallback } from 'react';
import { ChallengeRewards } from '../data/challenges';
import { ContentService } from '../services/ContentService';
import { getStorageKey } from '../dev/DevStorage';
import { apiClient, getAccessToken } from '../services/api';

const STORAGE_KEY = getStorageKey('save', 'sql_quest_player_save_v2');

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
  unlocks: {
    seaChart: boolean;
    seaChartSeen: boolean;
    ship: boolean;
    merchantIslesVoyaged: boolean;
    [key: string]: boolean;
  };
  fleet: {
    activeShipId: string | null;
    ownedShipIds: string[];
    ships: Record<string, {
      name: string;
      stats: { speed: number; capacity: number };
      cosmetics: { activeSkin: string };
    }>;
  };
}

const INITIAL_STATE: PlayerProgressState = {
  level: 1,
  xp: 0,
  coins: 0,
  gems: 0,
  currentIsland: ContentService.getChallenges()[0]?.islandId || 'tutorial_island',
  currentNPC: ContentService.getChallenges()[0]?.npcId || 'captain_blackbeard',
  inventory: [],
  badges: [],
  completedIds: [],
  unlockedIds: [ContentService.getChallenges()[0]?.id || 'chal_01'],
  currentChallengeId: ContentService.getChallenges()[0]?.id || 'chal_01',
  unlocks: {
    seaChart: false,
    seaChartSeen: false,
    ship: false,
    merchantIslesVoyaged: false,
  },
  fleet: {
    activeShipId: null,
    ownedShipIds: [],
    ships: {},
  },
};

export function useChallengeProgress() {
  const [progress, setProgress] = useState<PlayerProgressState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const loaded = JSON.parse(saved);
        if (!loaded.fleet) {
          loaded.fleet = INITIAL_STATE.fleet;
        }
        if (!loaded.unlocks) {
          loaded.unlocks = INITIAL_STATE.unlocks;
        }
        return { ...INITIAL_STATE, ...loaded };
      }
    } catch (e) {
      console.error("Failed to parse save state:", e);
    }
    return INITIAL_STATE;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
      
      // Background Cloud Sync
      if (getAccessToken()) {
        apiClient.post('/progress/sync', {
          state: progress,
          local_timestamp: new Date().toISOString()
        }).catch(err => console.error("Cloud Sync Failed:", err));
      }
    } catch (e) {
      console.error("Failed to persist save state:", e);
    }
  }, [progress]);

  const setServerProgress = useCallback((serverState: PlayerProgressState) => {
    setProgress(serverState);
  }, []);

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

      // Do not automatically advance location/NPC if moving to a DIFFERENT island!
      // The player must use the map to travel.
      const currentMeta = ContentService.getChallenge(challengeId);
      let activeChallengeId = nextId || challengeId;
      if (nextId) {
        const nextMeta = ContentService.getChallenge(nextId);
        if (nextMeta && currentMeta && nextMeta.islandId !== currentMeta.islandId) {
          activeChallengeId = challengeId; // Stay on the current challenge/island until they manually travel!
        }
      }

      const nextChallengeMeta = ContentService.getChallenge(activeChallengeId);

      const nextUnlocks = { ...prev.unlocks };
      const nextFleet = { ...prev.fleet };

      const tutorialChallenges = ContentService.getChallenges().filter(c => c.islandId === 'tutorial_island');
      const firstTutorialChallenge = tutorialChallenges[0];
      const lastTutorialChallenge = tutorialChallenges[tutorialChallenges.length - 1];

      if (firstTutorialChallenge && challengeId === firstTutorialChallenge.id) {
        nextUnlocks.seaChart = true;
      }

      if (lastTutorialChallenge && challengeId === lastTutorialChallenge.id) {
        nextUnlocks.ship = true;
        nextFleet.activeShipId = 'sloop_abandoned';
        if (!nextFleet.ownedShipIds.includes('sloop_abandoned')) {
          nextFleet.ownedShipIds.push('sloop_abandoned');
        }
        nextFleet.ships = {
          ...nextFleet.ships,
          sloop_abandoned: {
            name: 'The Weathered Sloop',
            stats: { speed: 1.0, capacity: 10 },
            cosmetics: { activeSkin: 'default' },
          },
        };
      }

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
        currentChallengeId: activeChallengeId,
        unlocks: nextUnlocks,
        fleet: nextFleet,
      };
    });
  }, []);

  const selectChallenge = useCallback((challengeId: string) => {
    setProgress((prev) => {
      if (!prev.unlockedIds.includes(challengeId)) return prev;
      const meta = ContentService.getChallenge(challengeId);
      return {
        ...prev,
        currentChallengeId: challengeId,
        currentIsland: meta?.islandId || prev.currentIsland,
        currentNPC: meta?.npcId || prev.currentNPC,
      };
    });
  }, []);

  const updateUnlock = useCallback((featureKey: string, value: boolean) => {
    setProgress((prev) => ({
      ...prev,
      unlocks: {
        ...prev.unlocks,
        [featureKey]: value,
      },
    }));
  }, []);

  const renameShip = useCallback((shipId: string, name: string) => {
    setProgress((prev) => {
      const ships = { ...prev.fleet.ships };
      if (ships[shipId]) {
        ships[shipId] = {
          ...ships[shipId],
          name: name,
        };
      }
      return {
        ...prev,
        fleet: {
          ...prev.fleet,
          ships,
        },
      };
    });
  }, []);

  const adjustCoins = useCallback((amount: number) => {
    setProgress((prev) => ({
      ...prev,
      coins: Math.max(0, prev.coins + amount),
    }));
  }, []);

  const devApplyState = useCallback((stateUpdates: Partial<typeof progress>) => {
    setProgress((prev) => ({
      ...prev,
      ...stateUpdates,
    }));
  }, []);

  const resumeChallenge = useCallback((challengeId: string) => {
    setProgress((prev) => {
      const nextUnlocked = [...prev.unlockedIds];
      if (!nextUnlocked.includes(challengeId)) {
        nextUnlocked.push(challengeId);
      }
      const meta = ContentService.getChallenge(challengeId);
      return {
        ...prev,
        currentChallengeId: challengeId,
        currentIsland: meta?.islandId || prev.currentIsland,
        currentNPC: meta?.npcId || prev.currentNPC,
        unlockedIds: nextUnlocked,
      };
    });
  }, []);

  return { progress, completeChallenge, selectChallenge, updateUnlock, renameShip, adjustCoins, devApplyState, setServerProgress, resumeChallenge };
}