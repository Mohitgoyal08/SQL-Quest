import React, { useState, useEffect, useCallback, useRef } from 'react';
import WorldBackground from './WorldBackground';
import Ocean from './Ocean';
import WorldCamera from './WorldCamera';
import WorldMap from './WorldMap';
import PlayerShip from './PlayerShip';
import DockingPrompt from './DockingPrompt';
import LandingTransition from '../../transition/LandingTransition';
import { WORLD_LOCATIONS } from '../../../config/worldLocations';
// 1. Correct relative path to state directory
import { INITIAL_GAME_STATE } from '../state/initialGameState';

const VOYAGE_DURATION = 3.5; // in seconds
const LANDING_TRANSITION_DURATION = 1.35; // in seconds

export default function WorldViewport() {
  const tutorialMeta = WORLD_LOCATIONS.tutorial;

  // Runtime Progression State
  const [gameState] = useState(INITIAL_GAME_STATE);
  const [shipPos, setShipPos] = useState(tutorialMeta.shipStart);
  
  // Camera frames the island using authored focus points for cinematic composition
  const [cameraTarget, setCameraTarget] = useState(tutorialMeta.cameraFocus);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  const voyageTimeoutRef = useRef(null);
  const transitionTimeoutRef = useRef(null);

  /**
   * Dedicated Docking Completion Handler
   */
  const handleDockReached = useCallback(() => {
    setTimeout(() => {
      setShowPrompt(true);
    }, 400);
  }, []);

  /**
   * Reusable Docking Trigger
   * Explicitly manages voyage duration and triggers arrival events deterministically.
   */
  const startDocking = useCallback((targetCoords, focusCoords, durationSec = VOYAGE_DURATION) => {
    if (voyageTimeoutRef.current) {
      clearTimeout(voyageTimeoutRef.current);
    }

    setShowPrompt(false);
    setShipPos(targetCoords);
    setCameraTarget(focusCoords);

    voyageTimeoutRef.current = setTimeout(() => {
      handleDockReached();
    }, durationSec * 1000);
  }, [handleDockReached]);

  // Auto-trigger voyage toward authored dock coordinate upon viewport mount
  useEffect(() => {
    const initialVoyageTimer = setTimeout(() => {
      startDocking(tutorialMeta.dock, tutorialMeta.cameraFocus);
    }, 800);

    return () => {
      clearTimeout(initialVoyageTimer);
      if (voyageTimeoutRef.current) clearTimeout(voyageTimeoutRef.current);
      if (transitionTimeoutRef.current) clearTimeout(transitionTimeoutRef.current);
    };
  }, [startDocking, tutorialMeta]);

  const handleConfirmDock = () => {
    setShowPrompt(false);
    setIsTransitioning(true);

    if (transitionTimeoutRef.current) {
      clearTimeout(transitionTimeoutRef.current);
    }

    transitionTimeoutRef.current = setTimeout(() => {
      console.log("Landing transition complete");
      // State transfer to the Mission Intro Story (Next Sprint) mounts here
    }, LANDING_TRANSITION_DURATION * 1000);
  };

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-ocean-deep select-none">
      <WorldBackground />
      <Ocean />
      
      {/* 2. Explicitly elevate WorldCamera space to z-20 above the Ocean layer */}
      <div className="absolute inset-0 z-20 pointer-events-auto">
        <WorldCamera target={cameraTarget} duration={VOYAGE_DURATION}>
          <WorldMap islandStates={gameState} />

          {/* 3. Player Ship Entity (Make sure PlayerShip internally has z-40 class) */}
          <PlayerShip
            position={shipPos}
            duration={VOYAGE_DURATION}
          />

          {/* Docking Prompt Wrapper (z-50) */}
          <div 
            className="absolute z-50 -translate-x-1/2 -translate-y-full"
            style={{ left: `${tutorialMeta.dock.x}px`, top: `${tutorialMeta.dock.y - 45}px` }}
          >
            <DockingPrompt
              isVisible={showPrompt}
              islandName={tutorialMeta.name}
              onConfirm={handleConfirmDock}
            />
          </div>
        </WorldCamera>
      </div>

      {/* Purely Visual Fullscreen Landing Transition Overlay (z-[100]) */}
      <LandingTransition
        isActive={isTransitioning}
        duration={LANDING_TRANSITION_DURATION}
      />
    </main>
  );
}