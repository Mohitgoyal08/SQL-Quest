import React from 'react';
import TutorialIsland from './TutorialIsland';
import IslandPlaceholder from './IslandPlaceholder';
import { WORLD_LOCATIONS, WORLD_ROUTE } from '../../../config/worldLocations';

export default function WorldMap({ islandStates = {}, onSelectIsland }) {
  // Map ordered route IDs to static metadata objects
  const orderedIslands = WORLD_ROUTE.map((id) => WORLD_LOCATIONS[id]);

  // Generate SVG quadratic Bézier path connecting island centers in explicit design order
  const generateRoutePath = () => {
    return orderedIslands.reduce((path, island, index) => {
      if (index === 0) return `M ${island.center.x} ${island.center.y}`;
      const prev = orderedIslands[index - 1];
      const ctrlX = (prev.center.x + island.center.x) / 2;
      const ctrlY = (prev.center.y + island.center.y) / 2 + (index % 2 === 0 ? 65 : -65);
      return `${path} Q ${ctrlX} ${ctrlY} ${island.center.x} ${island.center.y}`;
    }, '');
  };

  return (
    <div className="relative w-[2400px] h-[1400px] select-none pointer-events-auto">
      {/* 1. Animated Old Pirate-Map Sailing Route */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
        <path
          d={generateRoutePath()}
          fill="none"
          stroke="rgba(11, 43, 64, 0.45)"
          strokeWidth="8"
          strokeDasharray="16 16"
          strokeLinecap="round"
        />
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

      <style>{`
        @keyframes dash {
          to {
            stroke-dashoffset: -32;
          }
        }
      `}</style>

      {/* 2. Render Island Nodes Merging Static Geometry with Runtime Progress */}
      {orderedIslands.map((island) => {
        const state = islandStates[island.id] || { isLocked: true, isCurrent: false, isCompleted: false };

        return (
          <div
            key={island.id}
            className="absolute -translate-x-1/2 -translate-y-1/2 z-10"
            style={{ left: `${island.center.x}px`, top: `${island.center.y}px` }}
          >
            {island.type === 'tutorial' ? (
              <TutorialIsland
                isLocked={state.isLocked}
                isCurrent={state.isCurrent}
                isCompleted={state.isCompleted}
                onSelect={() => onSelectIsland?.(island.id)}
              />
            ) : (
              <IslandPlaceholder
                id={island.id}
                name={island.name}
                icon={island.icon}
                type={island.type}
                isLocked={state.isLocked}
                onSelect={onSelectIsland}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}