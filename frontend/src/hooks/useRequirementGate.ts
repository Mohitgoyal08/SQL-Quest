// ===== Sprint 9.8 Requirement Gate Engine START =====
import { useCallback } from 'react';
import { PlayerProgressState } from './useChallengeProgress';
import { WorldManager } from '../systems/WorldManager';
import { WorldRequirement } from '../types/WorldTypes';
import { SQLChallenge } from '../data/challenges';

/**
 * Reusable engine that evaluates data-driven accessibility gates 
 * for Islands, NPCs, Locations, and Challenges based on current inventory and progress.
 */
export const useRequirementGate = (progress: PlayerProgressState) => {

  const isIslandAccessible = useCallback((requirements?: WorldRequirement) => {
    return WorldManager.isIslandAccessible(requirements, progress);
  }, [progress]);

  const isNPCAccessible = useCallback((requirements?: WorldRequirement) => {
    return WorldManager.isNPCAccessible(requirements, progress);
  }, [progress]);

  const isLocationUnlocked = useCallback((requirements?: WorldRequirement) => {
    return WorldManager.isLocationUnlocked(requirements, progress);
  }, [progress]);

  const isChallengeAccessible = useCallback((challenge: SQLChallenge) => {
    return WorldManager.isChallengeAccessible(
      challenge.requirements,
      challenge.requiredItem,
      progress
    );
  }, [progress]);

  console.log(
  isChallengeAccessible({
    id: "test",
    requirements: {
      requiredItem: "fake_item"
    }
  } as SQLChallenge)
);

  return {
    isIslandAccessible,
    isNPCAccessible,
    isLocationUnlocked,
    isChallengeAccessible
  };
};
// ===== Sprint 9.8 Requirement Gate Engine END =====