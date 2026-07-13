/**
 * ScenarioLibrary - Predefined game states for dev panel quick loading
 */
import { ContentService } from '../services/ContentService';

const INITIAL_STATE = {
  level: 1,
  xp: 0,
  coins: 0,
  gems: 0,
  currentIsland: 'tutorial_island',
  currentNPC: 'captain_blackbeard',
  inventory: [],
  badges: [],
  completedIds: [],
  unlockedIds: ['chal_01'],
  currentChallengeId: 'chal_01',
  unlocks: {
    seaChart: false,
    seaChartSeen: false,
    ship: false,
    merchantIslesVoyaged: false,
  },
  fleet: {
    activeShipId: null,
    ownedShipIds: [],
    ships: {},
  },
};

export const SCENARIO_PRESETS = {
  fresh_game: {
    name: 'Fresh Game',
    description: 'Initial onboarding state with zero save data.',
    gameState: 'LANDING',
    state: { ...INITIAL_STATE }
  },

  tutorial_start: {
    name: 'Tutorial Start',
    description: 'First dialogue with Captain Blackbeard.',
    gameState: 'DIALOGUE',
    state: { ...INITIAL_STATE }
  },

  challenge_1: {
    name: 'Challenge 1',
    description: 'Active coding on the SELECT all challenge.',
    gameState: 'CHALLENGE',
    state: { ...INITIAL_STATE }
  },

  challenge_2: {
    name: 'Challenge 2',
    description: 'Active coding on the SELECT columns challenge.',
    gameState: 'CHALLENGE',
    state: {
      ...INITIAL_STATE,
      level: 1,
      xp: 100,
      coins: 20,
      completedIds: ['chal_01'],
      unlockedIds: ['chal_01', 'chal_02'],
      currentChallengeId: 'chal_02',
    }
  },

  challenge_3: {
    name: 'Challenge 3',
    description: 'Active coding on the WHERE filter challenge.',
    gameState: 'CHALLENGE',
    state: {
      ...INITIAL_STATE,
      level: 1,
      xp: 225,
      coins: 50,
      completedIds: ['chal_01', 'chal_02'],
      unlockedIds: ['chal_01', 'chal_02', 'chal_03'],
      currentChallengeId: 'chal_03',
    }
  },

  challenge_4: {
    name: 'Challenge 4',
    description: 'Active coding on the ORDER BY challenge (Smuggler\'s Cove context).',
    gameState: 'CHALLENGE',
    state: {
      ...INITIAL_STATE,
      level: 2,
      xp: 375,
      coins: 95,
      badges: ['coin_counter'],
      completedIds: ['chal_01', 'chal_02', 'chal_03'],
      unlockedIds: ['chal_01', 'chal_02', 'chal_03', 'chal_04'],
      currentChallengeId: 'chal_04',
      currentIsland: 'smugglers_cove',
      currentNPC: 'admiral_morgan',
    }
  },

  challenge_5: {
    name: 'Challenge 5',
    description: 'Active coding on the LIMIT filter challenge.',
    gameState: 'CHALLENGE',
    state: {
      ...INITIAL_STATE,
      level: 2,
      xp: 550,
      coins: 150,
      badges: ['coin_counter'],
      completedIds: ['chal_01', 'chal_02', 'chal_03', 'chal_04'],
      unlockedIds: ['chal_01', 'chal_02', 'chal_03', 'chal_04', 'chal_05'],
      currentChallengeId: 'chal_05',
      currentIsland: 'smugglers_cove',
      currentNPC: 'admiral_morgan',
    }
  },

  challenge_6: {
    name: 'Challenge 6',
    description: 'Vessel verification ledger challenge at Tutorial Harbor.',
    gameState: 'CHALLENGE',
    state: {
      ...INITIAL_STATE,
      level: 3,
      xp: 800,
      coins: 250,
      badges: ['coin_counter', 'Fleet Master'],
      inventory: ['spyglass_truth'],
      completedIds: ['chal_01', 'chal_02', 'chal_03', 'chal_04', 'chal_05'],
      unlockedIds: ['chal_01', 'chal_02', 'chal_03', 'chal_04', 'chal_05', 'chal_06'],
      currentChallengeId: 'chal_06',
    }
  },

  captain_promotion: {
    name: 'Captain Promotion',
    description: 'Reward claim screen for Challenge 6 triggering promotion.',
    gameState: 'REWARD',
    isShipRevealActive: true,
    state: {
      ...INITIAL_STATE,
      level: 3,
      xp: 1100,
      coins: 350,
      badges: ['coin_counter', 'Fleet Master'],
      inventory: ['spyglass_truth'],
      completedIds: ['chal_01', 'chal_02', 'chal_03', 'chal_04', 'chal_05', 'chal_06'],
      unlockedIds: ['chal_01', 'chal_02', 'chal_03', 'chal_04', 'chal_05', 'chal_06', 'merchant_01'],
      currentChallengeId: 'merchant_01',
    }
  },

  ship_naming: {
    name: 'Ship Naming',
    description: 'Custom ship naming overlay prompts.',
    gameState: 'REWARD',
    isShipRevealActive: true, // Forces cinematic wrapper which prompts the naming form
    state: {
      ...INITIAL_STATE,
      level: 3,
      xp: 1100,
      coins: 350,
      badges: ['coin_counter', 'Fleet Master'],
      inventory: ['spyglass_truth'],
      completedIds: ['chal_01', 'chal_02', 'chal_03', 'chal_04', 'chal_05', 'chal_06'],
      unlockedIds: ['chal_01', 'chal_02', 'chal_03', 'chal_04', 'chal_05', 'chal_06', 'merchant_01'],
      currentChallengeId: 'merchant_01',
    }
  },

  ready_to_sail: {
    name: 'Ready To Sail',
    description: 'Sloop unlocked, chart ready, Barnaby departure warning active.',
    gameState: 'DIALOGUE',
    state: {
      ...INITIAL_STATE,
      level: 3,
      xp: 1100,
      coins: 350,
      badges: ['coin_counter', 'Fleet Master'],
      inventory: ['spyglass_truth'],
      completedIds: ['chal_01', 'chal_02', 'chal_03', 'chal_04', 'chal_05', 'chal_06'],
      unlockedIds: ['chal_01', 'chal_02', 'chal_03', 'chal_04', 'chal_05', 'chal_06', 'merchant_01'],
      currentChallengeId: 'merchant_01',
      unlocks: {
        seaChart: true,
        seaChartSeen: true,
        ship: true,
        merchantIslesVoyaged: false,
      },
      fleet: {
        activeShipId: 'sloop_abandoned',
        ownedShipIds: ['sloop_abandoned'],
        ships: {
          sloop_abandoned: {
            name: 'Salty Vagabond',
            stats: { speed: 5, capacity: 20 },
            cosmetics: { activeSkin: 'default' }
          }
        }
      }
    }
  },

  merchant_voyage: {
    name: 'Merchant Voyage',
    description: 'Parallax travel transition active.',
    gameState: 'DIALOGUE',
    isVoyageActive: true,
    state: {
      ...INITIAL_STATE,
      level: 3,
      xp: 1100,
      coins: 350,
      badges: ['coin_counter', 'Fleet Master'],
      inventory: ['spyglass_truth'],
      completedIds: ['chal_01', 'chal_02', 'chal_03', 'chal_04', 'chal_05', 'chal_06'],
      unlockedIds: ['chal_01', 'chal_02', 'chal_03', 'chal_04', 'chal_05', 'chal_06', 'merchant_01'],
      currentChallengeId: 'merchant_01',
      unlocks: {
        seaChart: true,
        seaChartSeen: true,
        ship: true,
        merchantIslesVoyaged: false,
      },
      fleet: {
        activeShipId: 'sloop_abandoned',
        ownedShipIds: ['sloop_abandoned'],
        ships: {
          sloop_abandoned: {
            name: 'Salty Voyage',
            stats: { speed: 5, capacity: 20 },
            cosmetics: { activeSkin: 'default' }
          }
        }
      }
    }
  },

  merchant_arrival: {
    name: 'Merchant Arrival',
    description: 'Arriving at Merchant Isles port hub screen.',
    gameState: 'TOWN_HUB',
    state: {
      ...INITIAL_STATE,
      level: 3,
      xp: 1100,
      coins: 350,
      badges: ['coin_counter', 'Fleet Master'],
      inventory: ['spyglass_truth'],
      completedIds: ['chal_01', 'chal_02', 'chal_03', 'chal_04', 'chal_05', 'chal_06'],
      unlockedIds: ['chal_01', 'chal_02', 'chal_03', 'chal_04', 'chal_05', 'chal_06', 'merchant_01'],
      currentChallengeId: 'merchant_01',
      currentIsland: 'merchant_isles',
      currentNPC: 'merchant_marlowe',
      unlocks: {
        seaChart: true,
        seaChartSeen: true,
        ship: true,
        merchantIslesVoyaged: true,
      },
      fleet: {
        activeShipId: 'sloop_abandoned',
        ownedShipIds: ['sloop_abandoned'],
        ships: {
          sloop_abandoned: {
            name: 'The Relational',
            stats: { speed: 5, capacity: 20 },
            cosmetics: { activeSkin: 'default' }
          }
        }
      }
    }
  },

  merchant_hub: {
    name: 'Merchant Hub',
    description: 'Free exploration in Merchant Isles town center.',
    gameState: 'TOWN_HUB',
    state: {
      ...INITIAL_STATE,
      level: 3,
      xp: 1100,
      coins: 350,
      badges: ['coin_counter', 'Fleet Master'],
      inventory: ['spyglass_truth'],
      completedIds: ['chal_01', 'chal_02', 'chal_03', 'chal_04', 'chal_05', 'chal_06'],
      unlockedIds: ['chal_01', 'chal_02', 'chal_03', 'chal_04', 'chal_05', 'chal_06', 'merchant_01'],
      currentChallengeId: 'merchant_01',
      currentIsland: 'merchant_isles',
      currentNPC: 'merchant_marlowe',
      unlocks: {
        seaChart: true,
        seaChartSeen: true,
        ship: true,
        merchantIslesVoyaged: true,
      },
      fleet: {
        activeShipId: 'sloop_abandoned',
        ownedShipIds: ['sloop_abandoned'],
        ships: {
          sloop_abandoned: {
            name: 'The SQLite',
            stats: { speed: 5, capacity: 20 },
            cosmetics: { activeSkin: 'default' }
          }
        }
      }
    }
  },

  merchant_quest_1: {
    name: 'Merchant Quest 1',
    description: 'Marlowe\'s Cargo Ledger query active.',
    gameState: 'CHALLENGE',
    state: {
      ...INITIAL_STATE,
      level: 3,
      xp: 1100,
      coins: 350,
      badges: ['coin_counter', 'Fleet Master'],
      inventory: ['spyglass_truth'],
      completedIds: ['chal_01', 'chal_02', 'chal_03', 'chal_04', 'chal_05', 'chal_06'],
      unlockedIds: ['chal_01', 'chal_02', 'chal_03', 'chal_04', 'chal_05', 'chal_06', 'merchant_01'],
      currentChallengeId: 'merchant_01',
      currentIsland: 'merchant_isles',
      currentNPC: 'merchant_marlowe',
      unlocks: {
        seaChart: true,
        seaChartSeen: true,
        ship: true,
        merchantIslesVoyaged: true,
      },
      fleet: {
        activeShipId: 'sloop_abandoned',
        ownedShipIds: ['sloop_abandoned'],
        ships: {
          sloop_abandoned: {
            name: 'Dev Vessel',
            stats: { speed: 5, capacity: 20 },
            cosmetics: { activeSkin: 'default' }
          }
        }
      }
    }
  },

  merchant_quest_2: {
    name: 'Merchant Quest 2',
    description: 'Marlowe\'s Tax Exemption Limit query active.',
    gameState: 'CHALLENGE',
    state: {
      ...INITIAL_STATE,
      level: 4,
      xp: 1300,
      coins: 425,
      badges: ['coin_counter', 'Fleet Master'],
      inventory: ['spyglass_truth'],
      completedIds: ['chal_01', 'chal_02', 'chal_03', 'chal_04', 'chal_05', 'chal_06', 'merchant_01'],
      unlockedIds: ['chal_01', 'chal_02', 'chal_03', 'chal_04', 'chal_05', 'chal_06', 'merchant_01', 'merchant_02'],
      currentChallengeId: 'merchant_02',
      currentIsland: 'merchant_isles',
      currentNPC: 'merchant_marlowe',
      unlocks: {
        seaChart: true,
        seaChartSeen: true,
        ship: true,
        merchantIslesVoyaged: true,
      },
      fleet: {
        activeShipId: 'sloop_abandoned',
        ownedShipIds: ['sloop_abandoned'],
        ships: {
          sloop_abandoned: {
            name: 'Dev Vessel',
            stats: { speed: 5, capacity: 20 },
            cosmetics: { activeSkin: 'default' }
          }
        }
      }
    }
  },

  merchant_shop: {
    name: 'Merchant Shop',
    description: 'Quincy\'s Cargo Exchange store active.',
    gameState: 'TOWN_HUB',
    isShopOpen: true,
    state: {
      ...INITIAL_STATE,
      level: 3,
      xp: 1100,
      coins: 1500, // Spawn with coins to purchase items
      badges: ['coin_counter', 'Fleet Master'],
      inventory: ['spyglass_truth'],
      completedIds: ['chal_01', 'chal_02', 'chal_03', 'chal_04', 'chal_05', 'chal_06'],
      unlockedIds: ['chal_01', 'chal_02', 'chal_03', 'chal_04', 'chal_05', 'chal_06', 'merchant_01'],
      currentChallengeId: 'merchant_01',
      currentIsland: 'merchant_isles',
      currentNPC: 'merchant_marlowe',
      unlocks: {
        seaChart: true,
        seaChartSeen: true,
        ship: true,
        merchantIslesVoyaged: true,
      },
      fleet: {
        activeShipId: 'sloop_abandoned',
        ownedShipIds: ['sloop_abandoned'],
        ships: {
          sloop_abandoned: {
            name: 'Dev Trader',
            stats: { speed: 5, capacity: 20 },
            cosmetics: { activeSkin: 'default' }
          }
        }
      }
    }
  },

  chapter_2_complete: {
    name: 'Chapter 2 Complete',
    description: 'All Merchant Isles challenges solved.',
    gameState: 'TOWN_HUB',
    state: {
      ...INITIAL_STATE,
      level: 4,
      xp: 1550,
      coins: 525,
      badges: ['coin_counter', 'Fleet Master', 'Master Merchant'],
      inventory: ['spyglass_truth'],
      completedIds: ['chal_01', 'chal_02', 'chal_03', 'chal_04', 'chal_05', 'chal_06', 'merchant_01', 'merchant_02'],
      unlockedIds: ['chal_01', 'chal_02', 'chal_03', 'chal_04', 'chal_05', 'chal_06', 'merchant_01', 'merchant_02'],
      currentChallengeId: 'merchant_02', // last challenge completed
      currentIsland: 'merchant_isles',
      currentNPC: 'merchant_marlowe',
      unlocks: {
        seaChart: true,
        seaChartSeen: true,
        ship: true,
        merchantIslesVoyaged: true,
      },
      fleet: {
        activeShipId: 'sloop_abandoned',
        ownedShipIds: ['sloop_abandoned'],
        ships: {
          sloop_abandoned: {
            name: 'Relational Explorer',
            stats: { speed: 5, capacity: 20 },
            cosmetics: { activeSkin: 'default' }
          }
        }
      }
    }
  }
};
