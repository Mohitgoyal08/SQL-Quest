// ===== Sprint 10.0 Challenge Progression Service =====
import { useCallback } from 'react';
import { SQLChallenge } from '../data/challenges';
import { useRequirementGate } from './useRequirementGate';

import { PlayerProgressState } from './useChallengeProgress';

/**
 * Centralizes challenge progression decisions.
 * Consumes raw progression arrays and requirement engine data to provide
 * a clean, presentation-ready API for UI components.
 */
export const useChallengeProgression = (
  progress: PlayerProgressState
) => {
  const { isChallengeAccessible } = useRequirementGate(progress);

  const isCompleted = useCallback((challenge: SQLChallenge): boolean => {
    return progress.completedIds.includes(challenge.id);
  }, [progress.completedIds]);

  const isCurrent = useCallback((challenge: SQLChallenge): boolean => {
    return progress.currentChallengeId === challenge.id;
  }, [progress.currentChallengeId]);

  const isUnlocked = useCallback((challenge: SQLChallenge): boolean => {
    const isSequentiallyUnlocked = progress.unlockedIds.includes(challenge.id);
    const isRequirementSatisfied = isChallengeAccessible(challenge);
    
    // The single source of truth for challenge accessibility
    return isSequentiallyUnlocked && isRequirementSatisfied;
  }, [progress.unlockedIds, isChallengeAccessible]);

  return {
    isUnlocked,
    isCompleted,
    isCurrent
  };
};