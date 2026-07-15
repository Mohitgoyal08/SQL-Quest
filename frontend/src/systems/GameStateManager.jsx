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
import SeaWorld from '../components/game/world/SeaWorld';
import IslandFlowOrchestrator from '../components/game/world/IslandFlowOrchestrator';
import DevPanel from '../dev/DevPanel';
import { FEATURES } from '../config/features';

export default function GameStateManager({ 
  progress, 
  completeChallenge, 
  selectChallenge, 
  resumeChallenge,
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
  const { items, addItem, clearInventory } = useInventory();

const [inventoryOpen, setInventoryOpen] = useState(false);
const [showExitConfirm, setShowExitConfirm] = useState(false);
const totalItemCount = items.reduce(
  (total, item) => total + item.quantity,
  0
);

  const currentChallenge = QuestManager.getActiveChallenge(progress.currentChallengeId);
  const isChallengeCompleted = progress.completedIds.includes(currentChallenge.id);

  const handleLandingStart = useCallback(() => {
    // If this is a fresh game (level 1, tutorial), show the cinematic
    if (progress.level === 1 && !progress.completedIds.length) {
      setGameState(GAME_STATES.OPENING_CINEMATIC);
    } else {
      if (WorldManager.isBetweenIslands(progress)) {
        setGameState(GAME_STATES.SEA);
      } else {
        setGameState(GAME_STATES.ISLAND_FLOW);
      }
    }
  }, [progress, progress.currentChallengeId, progress.unlocks?.merchantIslesVoyaged]);

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
    if (worldState.currentIsland === 'tutorial_island') {
      // Tutorial Harbor explicitly flows into Ship Reveal Cinematic.
      // The transition to SEA is handled by handleShipRevealComplete.
      setIsShipCinematicActive(true);
    } else if (worldState.currentIsland === 'pirate_kings_ship') {
      setIsEndingCinematicActive(true);
    } else {
      setGameState(GAME_STATES.SEA);
    }
  }, [worldState.currentIsland]);

  const handleReturnToSea = useCallback(() => {
    setIsShipCinematicActive(false);
    setIsVoyageCinematicActive(false);
    setIsEndingCinematicActive(false);
    setInventoryOpen(false);
    setGameState(GAME_STATES.SEA);
  }, []);

  const handleTravelTo = useCallback((islandId) => {
    onCloseMap();
    
    // If re-entering current island, skip cinematic and go straight inside
    if (islandId === progress.currentIsland) {
      const islandChallenges = QuestManager.getAllChallenges().filter(c => c.islandId === islandId);
      const unfinished = islandChallenges.find(c => !progress.completedIds.includes(c.id));
      const targetChallenge = unfinished || islandChallenges[0];
      
      if (targetChallenge && resumeChallenge) {
        resumeChallenge(targetChallenge.id);
      }
      setGameState(GAME_STATES.ISLAND_FLOW);
      return;
    }

    const firstChallenge = QuestManager.getAllChallenges().find(c => c.islandId === islandId);
    if (firstChallenge) {
      setIsVoyageCinematicActive(islandId);
    }
  }, [onCloseMap, progress.currentIsland, progress.completedIds, resumeChallenge]);

  const handleVoyageComplete = useCallback((islandId) => {
    setIsVoyageCinematicActive(false);
    
    const islandChallenges = QuestManager.getAllChallenges().filter(c => c.islandId === islandId);
    const unfinished = islandChallenges.find(c => !progress.completedIds.includes(c.id));
    const targetChallenge = unfinished || islandChallenges[0];
    
    if (targetChallenge && resumeChallenge) {
      resumeChallenge(targetChallenge.id);
    }
    setGameState(GAME_STATES.ISLAND_FLOW);
  }, [progress.completedIds, resumeChallenge]);

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
          onReturnToSea={() => setShowExitConfirm(true)}
          onTriggerCinematic={(type) => {
            if (type === 'ship') setIsShipCinematicActive(true);
          }}
        />
      )}

      {showExitConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border-2 border-[#8c6b3e]/60 rounded-xl p-6 max-w-sm w-full mx-4 text-center text-[#ebd9b4] shadow-2xl relative">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#d4af37] to-transparent opacity-60" />
            
            <h3 className="text-xl font-black font-serif mb-2 tracking-wider text-amber-500">Return to Sea?</h3>
            <p className="text-sm text-gray-300 mb-4">Your progress has already been saved.</p>
            
            <div className="bg-slate-950/50 rounded-lg p-3 border border-[#8c6b3e]/20 mb-6 text-sm">
              <div className="font-bold text-amber-400">Completed:</div>
              <div className="text-lg font-serif font-black">
                {QuestManager.getAllChallenges().filter(c => c.islandId === worldState.currentIsland && progress.completedIds.includes(c.id)).length} / {QuestManager.getAllChallenges().filter(c => c.islandId === worldState.currentIsland).length} Challenges
              </div>
            </div>
            
            <p className="text-xs text-gray-400 mb-6 italic">You can continue this island later.</p>
            
            <div className="flex gap-4">
              <button 
                onClick={() => setShowExitConfirm(false)}
                className="flex-1 py-2.5 bg-slate-800 border border-[#8c6b3e]/40 hover:border-[#ebd9b4] rounded-lg text-xs font-bold transition-all cursor-pointer"
              >
                Continue Playing
              </button>
              <button 
                onClick={() => {
                  setShowExitConfirm(false);
                  handleReturnToSea();
                }}
                className="flex-1 py-2.5 bg-[#8c1c1c] hover:bg-red-700 border border-[#8c1c1c] hover:border-red-600 rounded-lg text-xs font-bold text-white transition-all cursor-pointer shadow-md"
              >
                Return to Sea
              </button>
            </div>
          </div>
        </div>
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