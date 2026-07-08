import React, { useState, useCallback } from 'react';
import { GAME_STATES } from '../config/gameStates';
import { QuestManager } from './QuestManager';
import { PlayerProfileService } from '../services/PlayerProfileService';
import RewardPopup from '../components/mission/RewardPopup';
import { useInventory } from '../inventory/hooks/useInventory';
import { InventoryButton } from '../components/inventory/InventoryButton';
import { InventoryPanel } from '../components/inventory/InventoryPanel';
import toast from 'react-hot-toast';

import LandingPage from '../pages/LandingPage';
import CharacterSelectionPage from '../pages/CharacterSelectionPage';
import DialogueScene from '../components/dialogue/DialogueScene';
import MissionScene from '../components/mission/MissionScene';
import { ChallengeSidebar } from '../components/challenge/ChallengeSidebar';
import { ChallengePanel } from '../components/challenge/ChallengePanel';
import SeaChartModal from '../components/map/SeaChartModal';
import SeaChartCinematic from '../components/map/SeaChartCinematic';
import ShipRevealCinematic from '../components/transition/ShipRevealCinematic';
import VoyageCinematic from '../components/transition/VoyageCinematic';
import TownHub from '../components/game/world/TownHub';
import Shop from '../components/shop/Shop';
import DevPanel from '../dev/DevPanel';

export default function GameStateManager({ 
  progress, 
  completeChallenge, 
  selectChallenge, 
  worldState, 
  onProfileChange,
  isMapOpen = false,
  onCloseMap,
  onOpenMap,
  updateUnlock,
  renameShip,
  adjustCoins,
  devApplyState
}) {
  const [gameState, setGameState] = useState(GAME_STATES.LANDING);
  const [isShipCinematicActive, setIsShipCinematicActive] = useState(false);
  const [isVoyageCinematicActive, setIsVoyageCinematicActive] = useState(false);
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [lastEarnedRewards, setLastEarnedRewards] = useState(null);
  const { items, addItem, clearInventory } = useInventory();

const [inventoryOpen, setInventoryOpen] = useState(false);
const totalItemCount = items.reduce(
  (total, item) => total + item.quantity,
  0
);

  const currentChallenge = QuestManager.getActiveChallenge(progress.currentChallengeId);
  const isChallengeCompleted = progress.completedIds.includes(currentChallenge.id);

  const handleLandingStart = useCallback(() => {
    const profile = PlayerProfileService.loadProfile();
    // Default profile has name 'Privateer'. If it's a real profile, load state.
    if (profile && profile.name !== 'Privateer') {
      // TODO ADR-0027: Challenge Progress Must Not Control Navigation (merchant_01 check couples progress and map routing)
      if (progress.currentChallengeId === 'merchant_01' && progress.unlocks?.merchantIslesVoyaged) {
        setGameState(GAME_STATES.TOWN_HUB);
      } else {
        setGameState(GAME_STATES.DIALOGUE);
      }
    } else {
      setGameState(GAME_STATES.CHARACTER_SELECTION);
    }
  }, [progress.currentChallengeId, progress.unlocks?.merchantIslesVoyaged]);

  const handleCharacterCreated = useCallback((profile) => {
    PlayerProfileService.saveProfile(profile);
    if (typeof onProfileChange === 'function') {
      onProfileChange(profile);
    }
    setGameState(GAME_STATES.DIALOGUE);
  }, [onProfileChange]);

  const handleDialogueComplete = useCallback(() => {
    // TODO ADR-0027: Challenge Progress Must Not Control Navigation (merchant_01 check couples progress and map routing)
    // TODO ADR-0029: Tutorial Harbor should migrate to the generic Town Hub architecture.
    if (progress.currentChallengeId === 'merchant_01' && !progress.unlocks?.merchantIslesVoyaged) {
      setGameState(null);
      return;
    }
    setGameState(GAME_STATES.MISSION);
  }, [progress.currentChallengeId, progress.unlocks?.merchantIslesVoyaged]);

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

  if (challengeId === 'chal_01') {
    toast.success("🗺️ Weathered Sea Chart unlocked! Check your map.");
  }

  if (challengeId === 'chal_06') {
    setIsShipCinematicActive(true);
  }

}, [completeChallenge, addItem]);

  const handleShipRevealComplete = useCallback((name) => {
    renameShip('sloop_abandoned', name);
    setIsShipCinematicActive(false);
    onOpenMap();
  }, [renameShip, onOpenMap]);

  const handleTravelTo = useCallback((islandId) => {
    onCloseMap();
    // TODO ADR-0027: Challenge Progress Must Not Control Navigation (merchant_isles string check couples navigation routes)
    if (islandId === 'merchant_isles' && !progress.unlocks?.merchantIslesVoyaged) {
      setIsVoyageCinematicActive(true);
    }
  }, [progress.unlocks?.merchantIslesVoyaged, onCloseMap]);

  const handleVoyageComplete = useCallback(() => {
    updateUnlock('merchantIslesVoyaged', true);
    setIsVoyageCinematicActive(false);
    setGameState(GAME_STATES.TOWN_HUB);
  }, [updateUnlock]);

  const handleRewardClaimed = useCallback(() => {
    if (progress.unlocks?.merchantIslesVoyaged) {
      setGameState(GAME_STATES.TOWN_HUB);
    } else {
      setGameState(GAME_STATES.DIALOGUE);
    }
  }, [progress.unlocks?.merchantIslesVoyaged]);

  const handlePurchase = useCallback((itemId, price) => {
    adjustCoins(-price);
    addItem(itemId);
  }, [adjustCoins, addItem]);

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
          dialogue={
            // TODO ADR-0027: Challenge Progress Must Not Control Navigation (merchant_01 check couples progress and map routing)
            (progress.currentChallengeId === 'merchant_01' && !progress.unlocks?.merchantIslesVoyaged)
              ? [
                  {
                    id: "ready_to_depart_node",
                    speaker: "Old Barnaby",
                    avatar: "🛠️",
                    text: "Your sloop is docked and ready to set sail, Captain. Open your Sea Chart (Map) on the HUD and select the Merchant Isles to begin your first voyage!"
                  }
                ]
              : QuestManager.getDialogueForNPC(worldState.currentNPC, progress.currentChallengeId, progress)
          }
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
      {gameState === GAME_STATES.TOWN_HUB && (
        <TownHub 
          islandId={worldState.currentIsland} 
          progress={progress} 
          onOpenMap={onOpenMap} 
          onStartQuest={() => setGameState(GAME_STATES.DIALOGUE)} 
          onOpenShop={() => setIsShopOpen(true)}
        />
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

{isMapOpen && progress.unlocks?.seaChart && (
  !progress.unlocks.seaChartSeen ? (
    <SeaChartCinematic onComplete={() => updateUnlock('seaChartSeen', true)} />
  ) : (
    <SeaChartModal onClose={onCloseMap} progress={progress} onTravelTo={handleTravelTo} />
  )
)}

{isShipCinematicActive && (
  <ShipRevealCinematic onComplete={handleShipRevealComplete} />
)}

{isVoyageCinematicActive && (
  <VoyageCinematic onComplete={handleVoyageComplete} progress={progress} />
)}

{isShopOpen && (
  <Shop 
    merchantId={worldState.currentIsland} 
    progress={progress} 
    onClose={() => setIsShopOpen(false)} 
    onPurchase={handlePurchase} 
  />
)}

{import.meta.env.DEV && (
  <DevPanel
    progress={progress}
    gameState={gameState}
    setGameState={setGameState}
    worldState={worldState}
    adjustCoins={adjustCoins}
    addItem={addItem}
    clearInventory={clearInventory}
    updateUnlock={updateUnlock}
    devApplyState={devApplyState}
    completeChallenge={completeChallenge}
    setIsShopOpen={setIsShopOpen}
    onOpenMap={onOpenMap}
    onCloseMap={onCloseMap}
    setInventoryOpen={setInventoryOpen}
    setIsVoyageCinematicActive={setIsVoyageCinematicActive}
    setIsShipCinematicActive={setIsShipCinematicActive}
  />
)}
    </div>
  );
}