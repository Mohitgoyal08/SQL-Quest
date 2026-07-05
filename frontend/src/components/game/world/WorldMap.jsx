import React from 'react';
import TutorialIsland from './TutorialIsland';
import IslandPlaceholder from './IslandPlaceholder';

// Compacted 2400x1400 World Coordinates with tighter layout and centered Tutorial anchor
const ISLAND_DATA = [
  { id: 'tutorial', name: 'Tutorial Island', icon: '🏝️', x: 480, y: 980, isTutorial: true, isLocked: false },
  { id: 'forgotten_village', name: 'Forgotten Village', icon: '🏚️', type: 'village', x: 780, y: 760, isLocked: true },
  { id: 'jungle_island', name: 'Jungle Island', icon: '🌴', type: 'jungle', x: 1120, y: 980, isLocked: true },
  { id: 'pirate_port', name: 'Pirate Port', icon: '⚓', type: 'port', x: 1420, y: 720, isLocked: true },
  { id: 'royal_fortress', name: 'Royal Fortress', icon: '🏰', type: 'fortress', x: 1720, y: 920, isLocked: true },
  { id: 'volcano_island', name: 'Volcano Island', icon: '🌋', type: 'volcano', x: 1960, y: 640, isLocked: true },
  { id: 'lost_sea', name: 'The Lost Sea', icon: '🌀', type: 'whirlpool', x: 1620, y: 380, isLocked: true },
  { id: 'pirate_king', name: "Pirate King's Ship", icon: '🏴‍☠️', type: 'galleon', x: 2060, y: 260, isLocked: true },
];

export default function WorldMap({ onSelectIsland }) {
  const generateRoutePath = () => {
    return ISLAND_DATA.reduce((path, island, index) => {
      if (index === 0) return `M ${island.x} ${island.y}`;
      const prev = ISLAND_DATA[index - 1];
      const ctrlX = (prev.x + island.x) / 2;
      const ctrlY = (prev.y + island.y) / 2 + (index % 2 === 0 ? 65 : -65);
      return `${path} Q ${ctrlX} ${ctrlY} ${island.x} ${island.y}`;
    }, '');
  };

  return (
    <div className="relative w-[2400px] h-[1400px] select-none pointer-events-auto">
      
      {/* 1. Animated Old Pirate-Map Sailing Route */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
        {/* Shadow Trail Layer */}
        <path
          d={generateRoutePath()}
          fill="none"
          stroke="rgba(11, 43, 64, 0.45)"
          strokeWidth="8"
          strokeDasharray="16 16"
          strokeLinecap="round"
        />
        {/* Animated Gold/Parchment Route Layer */}
        <path
          d={generateRoutePath()}
          fill="none"
          stroke="#F3E5C8"
          strokeWidth="5"
          strokeDasharray="16 16"
          strokeLinecap="round"
          className="animate-[dash_3s_linear_infinite]"
        />
      </svg>

      {/* Inline Keyframes for lightweight SVG dash offset animation */}
      <style>{`
        @keyframes dash {
          to {
            stroke-dashoffset: -32;
          }
        }
      `}</style>

      {/* 2. Absolute Coordinate Placement for All Islands */}
      {ISLAND_DATA.map((island) => (
        <div
          key={island.id}
          className="absolute -translate-x-1/2 -translate-y-1/2 z-10"
          style={{ left: `${island.x}px`, top: `${island.y}px` }}
        >
          {island.isTutorial ? (
            <TutorialIsland
              isLocked={island.isLocked}
              isCurrent={true}
              isCompleted={false}
              onSelect={() => onSelectIsland?.(island.id)}
            />
          ) : (
            <IslandPlaceholder
              id={island.id}
              name={island.name}
              icon={island.icon}
              type={island.type}
              isLocked={island.isLocked}
              onSelect={onSelectIsland}
            />
          )}
        </div>
      ))}
    </div>
  );
}