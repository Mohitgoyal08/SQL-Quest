import React, { useState, useEffect, useCallback, useRef } from 'react';
import WorldBackground from './WorldBackground';
import Ocean from './Ocean';
import WorldCamera from './WorldCamera';
import WorldMap from './WorldMap';
import PlayerShip from './PlayerShip';
import DockingPrompt from './DockingPrompt';

// Docking Route Coordinates for Tutorial Island
const START_POS = { x: 260, y: 1180 };
const DOCK_POS = { x: 540, y: 1040 };
const VOYAGE_DURATION = 3.5; // in seconds

export default function WorldViewport() {
  const [shipPos, setShipPos] = useState(START_POS);
  const [showPrompt, setShowPrompt] = useState(false);
  const voyageTimeoutRef = useRef(null);

  /**
   * Dedicated Docking Completion Handler
   * Triggered explicitly when our deterministic voyage timer resolves.
   */
  const handleDockReached = useCallback(() => {
    // Wait 400ms for camera damping and ship idle physics to naturally settle
    setTimeout(() => {
      setShowPrompt(true);
    }, 400);
  }, []);

  /**
   * Reusable Docking Trigger
   * Explicitly manages voyage duration and triggers gameplay events deterministically.
   */
  const startDocking = useCallback((targetCoords, durationSec = VOYAGE_DURATION) => {
    if (voyageTimeoutRef.current) {
      clearTimeout(voyageTimeoutRef.current);
    }

    setShowPrompt(false);
    setShipPos(targetCoords);

    // Schedule exact gameplay completion event independent of rendering/animation callbacks
    voyageTimeoutRef.current = setTimeout(() => {
      handleDockReached();
    }, durationSec * 1000);
  }, [handleDockReached]);

  // Auto-trigger initial docking sequence after viewport mount
  useEffect(() => {
    const initialVoyageTimer = setTimeout(() => {
      startDocking(DOCK_POS);
    }, 800);

    return () => {
      clearTimeout(initialVoyageTimer);
      if (voyageTimeoutRef.current) {
        clearTimeout(voyageTimeoutRef.current);
      }
    };
  }, [startDocking]);

  const handleConfirmDock = () => {
    console.log('Beginning Adventure at Tutorial Island!');
  };

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-ocean-deep select-none">
      <WorldBackground />
      <Ocean />
      
      {/* Camera smoothly tracks the active ship coordinates */}
      <WorldCamera target={shipPos} duration={VOYAGE_DURATION}>
        <WorldMap />

        {/* Player Ship Entity (z-30) */}
        <PlayerShip
          position={shipPos}
          duration={VOYAGE_DURATION}
        />

        {/* Docking Prompt Wrapper (Elevated to z-50 to overcome transform stacking context trapping) */}
        <div 
          className="absolute z-[100] -translate-x-1/2 -translate-y-full"
          style={{ left: `${DOCK_POS.x}px`, top: `${DOCK_POS.y - 95}px` }}
        >
          <DockingPrompt
            isVisible={showPrompt}
            islandName="Tutorial Island"
            onConfirm={handleConfirmDock}
          />
        </div>
      </WorldCamera>
    </main>
  );
}