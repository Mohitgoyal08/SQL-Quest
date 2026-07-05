/**
 * RUNTIME GAME STATE TEMPLATE
 * Represents mutable player progression across all world islands.
 * Decoupled from static level design metadata (WORLD_LOCATIONS).
 */
export const INITIAL_GAME_STATE = {
  tutorial: { 
    isLocked: false, 
    isCurrent: true, 
    isCompleted: false 
  },
  forgotten_village: { 
    isLocked: true, 
    isCurrent: false, 
    isCompleted: false 
  },
  jungle_island: { 
    isLocked: true, 
    isCurrent: false, 
    isCompleted: false 
  },
  pirate_port: { 
    isLocked: true, 
    isCurrent: false, 
    isCompleted: false 
  },
  royal_fortress: { 
    isLocked: true, 
    isCurrent: false, 
    isCompleted: false 
  },
  lost_sea: { 
    isLocked: true, 
    isCurrent: false, 
    isCompleted: false 
  },
  volcano_island: { 
    isLocked: true, 
    isCurrent: false, 
    isCompleted: false 
  },
  pirate_king: { 
    isLocked: true, 
    isCurrent: false, 
    isCompleted: false 
  },
};