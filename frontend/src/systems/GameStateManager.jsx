import React, { useState, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { GAME_STATES } from '../config/gameStates';
import { QuestManager } from './QuestManager';
import { WorldManager } from './WorldManager';
import { PlayerProfileService } from '../services/PlayerProfileService';
import RewardPopup from '../components/mission/RewardPopup';
import { useInventory } from '../inventory/hooks/useInventory';
import { InventoryButton } from '../components/inventory/InventoryButton';
import { InventoryPanel } from '../components/inventory/InventoryPanel';
import toast from 'react-hot-toast';

import LandingPage from '../pages/LandingPage';
import OpeningStory from '../components/cinematics/OpeningStory';
import WorldReveal from '../components/cinematics/WorldReveal';
import DialogueScene from '../components/dialogue/DialogueScene';
import MissionScene from '../components/mission/MissionScene';
import { ChallengeSidebar } from '../components/challenge/ChallengeSidebar';
import { ChallengePanel } from '../components/challenge/ChallengePanel';
import SeaChartModal from '../components/map/SeaChartModal';
import SeaChartCinematic from '../components/map/SeaChartCinematic';
import ShipRevealCinematic from '../components/transition/ShipRevealCinematic';
import VoyageCinematic from '../components/transition/VoyageCinematic';
import EndingCinematic from '../components/transition/EndingCinematic';
import TownHub from '../components/game/world/TownHub';
import SeaWorld from '../components/game/world/SeaWorld';
import IslandFlowOrchestrator from '../components/game/world/IslandFlowOrchestrator';
import Shop from '../components/shop/Shop';
import DevPanel from '../dev/DevPanel';
import { FEATURES } from '../config/features';

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
  const [isEndingCinematicActive, setIsEndingCinematicActive] = useState(false);
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [lastEarnedRewards, setLastEarnedRewards] = useState(null);
  const [interactingNpc, setInteractingNpc] = useState(null);
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
      if (WorldManager.isBetweenIslands(progress)) {
        setGameState(GAME_STATES.SEA);
      } else {
        setGameState(GAME_STATES.ISLAND_FLOW);
      }
    } else {
      setGameState(GAME_STATES.OPENING_CINEMATIC);
    }
  }, [progress.currentChallengeId, progress.unlocks?.merchantIslesVoyaged]);

  const handleDialogueComplete = useCallback(() => {
    // Removed legacy dialogue handling
  }, []);

  const handleOpeningCinematicComplete = useCallback(() => {
    setGameState(GAME_STATES.WORLD_REVEAL);
  }, []);

  const handleWorldRevealComplete = useCallback(() => {
    setGameState(GAME_STATES.ISLAND_FLOW);
  }, []);

  const handleShipRevealComplete = useCallback((name) => {
    renameShip('sloop_abandoned', name);
    setIsShipCinematicActive(false);
    setGameState(GAME_STATES.SEA);
  }, [renameShip]);

  const handleFlowComplete = useCallback(() => {
    if (worldState.currentIsland === 'tutorial_island' && !progress.unlocks?.ship) {
      setIsShipCinematicActive(true);
    } else if (worldState.currentIsland === 'pirate_kings_ship') {
      setIsEndingCinematicActive(true);
    } else {
      setGameState(GAME_STATES.SEA);
    }
  }, [worldState.currentIsland, progress.unlocks?.ship]);

  const handleTravelTo = useCallback((islandId) => {
    onCloseMap();
    const firstChallenge = QuestManager.getAllChallenges().find(c => c.islandId === islandId);
    if (firstChallenge) {
      setIsVoyageCinematicActive(islandId);
    }
  }, [onCloseMap]);

  const handleVoyageComplete = useCallback((islandId) => {
    setIsVoyageCinematicActive(false);
    const firstChallenge = QuestManager.getAllChallenges().find(c => c.islandId === islandId);
    if (firstChallenge && devApplyState) {
      devApplyState({ currentChallengeId: firstChallenge.id });
    }
    setGameState(GAME_STATES.ISLAND_FLOW);
  }, [devApplyState]);

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

      <AnimatePresence>
        {isEndingCinematicActive && (
          <EndingCinematic 
            onComplete={() => {
              setIsEndingCinematicActive(false);
              setGameState(GAME_STATES.LANDING);
            }} 
            playerName={progress?.name || "Privateer"}
          />
        )}
      </AnimatePresence>

      {gameState === GAME_STATES.TOWN_HUB && FEATURES.ENABLE_TOWN_HUB && (
        <TownHub 
          islandId={worldState.currentIsland} 
          progress={progress} 
          onOpenMap={onOpenMap} 
          onStartQuest={(npcId) => {
            setInteractingNpc(npcId);
            setGameState(GAME_STATES.DIALOGUE);
          }}
          onOpenShop={() => setIsShopOpen(true)}
        />
      )}

      {gameState === GAME_STATES.ISLAND_FLOW && (
        <IslandFlowOrchestrator
          key={worldState.currentIsland}
          islandId={worldState.currentIsland}
          progress={progress}
          completeChallenge={completeChallenge}
          selectChallenge={selectChallenge}
          onOpenMap={onOpenMap}
          updateUnlock={updateUnlock}
          addItem={addItem}
          onFlowComplete={handleFlowComplete}
          onProfileChange={onProfileChange}
          onTriggerCinematic={(type) => {
            if (type === 'ship') setIsShipCinematicActive(true);
          }}
        />
      )}

      {gameState === GAME_STATES.OPENING_CINEMATIC && (
        <OpeningStory onComplete={handleOpeningCinematicComplete} />
      )}

      {gameState === GAME_STATES.WORLD_REVEAL && (
        <WorldReveal onComplete={handleWorldRevealComplete} />
      )}

      {gameState === GAME_STATES.SEA && (
        <SeaWorld progress={progress} onTravelTo={handleTravelTo} />
      )}

{gameState !== GAME_STATES.LANDING && (

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
    <SeaChartModal onClose={onCloseMap} progress={progress} />
  )
)}

{isShipCinematicActive && (
  <ShipRevealCinematic onComplete={handleShipRevealComplete} />
)}

      {isVoyageCinematicActive && (
        <VoyageCinematic 
          onComplete={() => handleVoyageComplete(isVoyageCinematicActive)} 
          progress={progress} 
          originId={worldState.currentIsland}
          destinationId={isVoyageCinematicActive}
        />
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