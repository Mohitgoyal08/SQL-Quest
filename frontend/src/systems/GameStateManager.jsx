import React, { useState, useCallback } from 'react';
import { GAME_STATES } from '../config/gameStates';
import { QuestManager } from './QuestManager';
import { PlayerProfileService } from '../services/PlayerProfileService';
import RewardPopup from '../components/mission/RewardPopup';
import { useInventory } from '../inventory/hooks/useInventory';
import { InventoryButton } from '../components/inventory/InventoryButton';
import { InventoryPanel } from '../components/inventory/InventoryPanel';

import LandingPage from '../pages/LandingPage';
import CharacterSelectionPage from '../pages/CharacterSelectionPage';
import DialogueScene from '../components/dialogue/DialogueScene';
import MissionScene from '../components/mission/MissionScene';
import { ChallengeSidebar } from '../components/challenge/ChallengeSidebar';
import { ChallengePanel } from '../components/challenge/ChallengePanel';
//import MissionRewardPanel from '../components/mission/RewardPopup';

export default function GameStateManager({ 
  progress, 
  completeChallenge, 
  selectChallenge, 
  worldState, 
  onProfileChange 
}) {
  const [gameState, setGameState] = useState(GAME_STATES.LANDING);
  const [lastEarnedRewards, setLastEarnedRewards] = useState(null);
  const { items, addItem } = useInventory();

const [inventoryOpen, setInventoryOpen] = useState(false);
const totalItemCount = items.reduce(
  (total, item) => total + item.quantity,
  0
);

  const currentChallenge = QuestManager.getActiveChallenge(progress.currentChallengeId);
  const isChallengeCompleted = progress.completedIds.includes(currentChallenge.id);

  const handleLandingStart = useCallback(() => {
    setGameState(GAME_STATES.CHARACTER_SELECTION);
  }, []);

  const handleCharacterCreated = useCallback((profile) => {
    PlayerProfileService.saveProfile(profile);
    if (typeof onProfileChange === 'function') {
      onProfileChange(profile);
    }
    setGameState(GAME_STATES.DIALOGUE);
  }, [onProfileChange]);

  const handleDialogueComplete = useCallback(() => {
    setGameState(GAME_STATES.MISSION);
  }, []);

  const handleMissionAccepted = useCallback(() => {
    setGameState(GAME_STATES.CHALLENGE);
  }, []);

  const handleMissionDeclined = useCallback(() => {
    setGameState(GAME_STATES.DIALOGUE);
  }, []);

  const handleChallengeSuccess = useCallback((challengeId, rewards, nextId) => {

  console.log("MISSION REWARDS:", rewards);

  if (rewards?.item) {
    console.log("ADDING ITEM:", rewards.item);
    addItem(rewards.item);
  }

  completeChallenge(challengeId, rewards, nextId);
  setLastEarnedRewards(rewards);
  setGameState(GAME_STATES.REWARD);

}, [completeChallenge, addItem]);
  const handleRewardClaimed = useCallback(() => {
    setGameState(GAME_STATES.DIALOGUE);
  }, []);

  return (
    <div className="flex-1 flex flex-col relative overflow-hidden">
      {/* FIXED: Render LandingPage instead of LandingTransition */}
      {gameState === GAME_STATES.LANDING && (
        <LandingPage onStart={handleLandingStart} />
      )}

      {gameState === GAME_STATES.CHARACTER_SELECTION && (
        <CharacterSelectionPage onComplete={handleCharacterCreated} />
      )}

      {gameState === GAME_STATES.DIALOGUE && (
        <DialogueScene
          dialogue={QuestManager.getDialogueForNPC(worldState.currentNPC, progress.currentChallengeId, progress)}
          onComplete={handleDialogueComplete}
        />
      )}

      {gameState === GAME_STATES.MISSION && (
        <MissionScene
          mission={QuestManager.getMissionForChallenge(progress.currentChallengeId)}
          onAccept={handleMissionAccepted}
          onDecline={handleMissionDeclined}
        />
      )}

      {gameState === GAME_STATES.CHALLENGE && (
        <div className="flex-1 flex flex-col md:flex-row gap-6 p-4 md:p-6 overflow-hidden max-w-7xl w-full mx-auto">
          <ChallengeSidebar
            challenges={QuestManager.getAllChallenges()}
            progress={progress}
            onSelect={selectChallenge}
          />

          <ChallengePanel
            challenge={currentChallenge}
            onSuccess={handleChallengeSuccess}
            isAlreadyCompleted={isChallengeCompleted}
          />
        </div>
      )}

     {gameState === GAME_STATES.REWARD && (

  <RewardPopup

    rewards={lastEarnedRewards || currentChallenge.rewards}

    onClaim={handleRewardClaimed}

  />

)}
{gameState !== GAME_STATES.LANDING &&

 gameState !== GAME_STATES.CHARACTER_SELECTION &&
  gameState !== GAME_STATES.REWARD &&  (

  <>

    <InventoryButton

      itemCount={totalItemCount}

      onClick={() => setInventoryOpen(true)}

    />

    <InventoryPanel

      isOpen={inventoryOpen}

      onClose={() => setInventoryOpen(false)}

    />

  </>

)}
    </div>
  );
}