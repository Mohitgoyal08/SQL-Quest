/**
 * SINGLE SOURCE OF TRUTH: Static World Spatial Metadata
 * Strictly level design geometry. Contains NO runtime gameplay state (e.g., isLocked).
 */
export const WORLD_LOCATIONS = {
  tutorial: {
    id: 'tutorial',
    name: 'Tutorial Island',
    icon: '🏝️',
    type: 'tutorial',
    center: { x: 480, y: 980 },
    dock: { x: 550, y: 1140 },
    shipStart: { x: 300, y: 1220 },
    npcAnchor: { x: 420, y: 1060 },
    cameraFocus: { x: 510, y: 1060 },
  },
  forgotten_village: {
    id: 'forgotten_village',
    name: 'Forgotten Village',
    icon: '🏚️',
    type: 'village',
    center: { x: 780, y: 760 },
    dock: { x: 840, y: 880 },
    shipStart: { x: 660, y: 860 },
    npcAnchor: { x: 740, y: 800 },
    cameraFocus: { x: 800, y: 810 },
  },
  jungle_island: {
    id: 'jungle_island',
    name: 'Jungle Island',
    icon: '🌴',
    type: 'jungle',
    center: { x: 1120, y: 980 },
    dock: { x: 1180, y: 1100 },
    shipStart: { x: 980, y: 1000 },
    npcAnchor: { x: 1080, y: 1020 },
    cameraFocus: { x: 1140, y: 1030 },
  },
  pirate_port: {
    id: 'pirate_port',
    name: 'Pirate Port',
    icon: '⚓',
    type: 'port',
    center: { x: 1420, y: 720 },
    dock: { x: 1480, y: 840 },
    shipStart: { x: 1300, y: 800 },
    npcAnchor: { x: 1380, y: 760 },
    cameraFocus: { x: 1440, y: 770 },
  },
  royal_fortress: {
    id: 'royal_fortress',
    name: 'Royal Fortress',
    icon: '🏰',
    type: 'fortress',
    center: { x: 1720, y: 920 },
    dock: { x: 1780, y: 1040 },
    shipStart: { x: 1580, y: 940 },
    npcAnchor: { x: 1680, y: 960 },
    cameraFocus: { x: 1740, y: 970 },
  },
  lost_sea: {
    id: 'lost_sea',
    name: 'The Lost Sea',
    icon: '🌀',
    type: 'whirlpool',
    center: { x: 1620, y: 380 },
    dock: { x: 1680, y: 480 },
    shipStart: { x: 1500, y: 460 },
    npcAnchor: { x: 1580, y: 420 },
    cameraFocus: { x: 1640, y: 430 },
  },
  volcano_island: {
    id: 'volcano_island',
    name: 'Volcano Island',
    icon: '🌋',
    type: 'volcano',
    center: { x: 1960, y: 640 },
    dock: { x: 2020, y: 760 },
    shipStart: { x: 1840, y: 740 },
    npcAnchor: { x: 1920, y: 680 },
    cameraFocus: { x: 1980, y: 690 },
  },
  pirate_king: {
    id: 'pirate_king',
    name: "Pirate King's Ship",
    icon: '🏴‍☠️',
    type: 'galleon',
    center: { x: 2060, y: 260 },
    dock: { x: 2120, y: 380 },
    shipStart: { x: 1940, y: 360 },
    npcAnchor: { x: 2020, y: 300 },
    cameraFocus: { x: 2080, y: 310 },
  },
};

/**
 * EXPLICIT NAVIGATION SEQUENCE
 * Decouples rendering and routing from object key ordering.
 * Supports future non-linear routes, DLC islands, or branching paths.
 */
export const WORLD_ROUTE = [
  'tutorial',
  'forgotten_village',
  'jungle_island',
  'pirate_port',
  'royal_fortress',
  'lost_sea',
  'volcano_island',
  'pirate_king',
];