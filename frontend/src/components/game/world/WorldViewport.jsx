import React from 'react';
import WorldBackground from './WorldBackground';
import Ocean from './Ocean';
import WorldCamera from './WorldCamera';
import WorldMap from './WorldMap';
import PlayerShip from './PlayerShip';

export default function WorldViewport() {
  const handleIslandClick = (islandId) => {
    console.log('Island Selected:', islandId);
  };

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-ocean-deep select-none">
      <WorldBackground />
      <Ocean />
      <WorldCamera>
        <div className="relative">
          {/* Mount Full 2800x1600 World Map */}
          <WorldMap onSelectIsland={handleIslandClick} />

          {/* Temporary Static Anchor for Player Ship beside Tutorial Island Dock (x: 280, y: 1150) */}
          <div className="absolute z-30" style={{ left: '360px', top: '1220px' }}>
            <PlayerShip />
          </div>
        </div>
      </WorldCamera>
    </main>
  );
}