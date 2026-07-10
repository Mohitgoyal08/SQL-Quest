export const ISLAND_FLOWS = {
  tutorial_island: {
    islandId: 'tutorial_island',
    title: 'Tutorial Harbor',
    npcId: 'captain_blackbeard',
    stages: [
      { type: 'ARRIVAL' },
      { type: 'TITLE', title: 'Tutorial Harbor' },
      { type: 'STORY_EVENT', content: 'Captain Flint introduces the shattered Codex.' },
      { type: 'CHARACTER_SELECTION' },
      { type: 'DIALOGUE', id: 'chal_01' },
      { type: 'CHALLENGE', id: 'chal_01' },
      { type: 'DIALOGUE', id: 'chal_02' },
      { type: 'CHALLENGE', id: 'chal_02' },
      { type: 'DIALOGUE', id: 'chal_03' },
      { type: 'CHALLENGE', id: 'chal_03' },
      { type: 'STORY_EVENT', content: 'Flint senses a Codex Fragment nearby.' },
      { type: 'CHALLENGE', id: 'chal_06' }, // Get ship
      { type: 'REWARD', rewards: { codexFragment: 'frag_tutorial', key: 'key_merchant' } },
      { type: 'DEPARTURE' }
    ]
  },
  merchant_isles: {
    islandId: 'merchant_isles',
    title: 'Merchant Isles',
    npcId: 'quincy',
    stages: [
      { type: 'ARRIVAL' },
      { type: 'TITLE', title: 'Merchant Isles' },
      { type: 'DIALOGUE', id: 'merchant_00' },
      { type: 'CHALLENGE', id: 'merchant_00' },
      { type: 'DIALOGUE', id: 'merchant_01' },
      { type: 'CHALLENGE', id: 'merchant_01' },
      { type: 'STORY_EVENT', content: 'Quincy looks worried as he hands over the manifest...' },
      { type: 'DIALOGUE', id: 'merchant_02' },
      { type: 'CHALLENGE', id: 'merchant_02' },
      { type: 'REWARD', rewards: { codexFragment: 'frag_merchant', key: 'key_smugglers' } },
      { type: 'DEPARTURE' }
    ]
  },
  smugglers_cove: {
    islandId: 'smugglers_cove',
    title: "Smuggler's Cove",
    npcId: 'admiral_morgan',
    stages: [
      { type: 'ARRIVAL' },
      { type: 'TITLE', title: "Smuggler's Cove" },
      { type: 'DIALOGUE', id: 'smugglers_01' },
      { type: 'CHALLENGE', id: 'smugglers_01' },
      { type: 'DIALOGUE', id: 'smugglers_02' },
      { type: 'CHALLENGE', id: 'smugglers_02' },
      { type: 'DIALOGUE', id: 'smugglers_03' },
      { type: 'CHALLENGE', id: 'smugglers_03' },
      { type: 'REWARD', rewards: { codexFragment: 'frag_smugglers', key: 'key_jungle' } },
      { type: 'DEPARTURE' }
    ]
  },
  jungle_queries: {
    islandId: 'jungle_queries',
    title: 'Jungle of Queries',
    npcId: 'explorer_drake',
    stages: [
      { type: 'TITLE', title: 'Jungle of Queries' },
      { type: 'DIALOGUE', id: 'jungle_01' },
      { type: 'CHALLENGE', id: 'jungle_01' },
      { type: 'DIALOGUE', id: 'jungle_02' },
      { type: 'CHALLENGE', id: 'jungle_02' },
      { type: 'DIALOGUE', id: 'jungle_03' },
      { type: 'CHALLENGE', id: 'jungle_03' },
      { type: 'REWARD', rewards: { codexFragment: 'frag_jungle', key: 'key_crystal' } },
      { type: 'DEPARTURE' }
    ]
  },
  crystal_caverns: {
    islandId: 'crystal_caverns',
    title: 'Crystal Caverns',
    npcId: 'dwarf_foreman',
    stages: [
      { type: 'TITLE', title: 'Crystal Caverns' },
      { type: 'DIALOGUE', id: 'crystal_01' },
      { type: 'CHALLENGE', id: 'crystal_01' },
      { type: 'DIALOGUE', id: 'crystal_02' },
      { type: 'CHALLENGE', id: 'crystal_02' },
      { type: 'DIALOGUE', id: 'crystal_03' },
      { type: 'CHALLENGE', id: 'crystal_03' },
      { type: 'REWARD', rewards: { codexFragment: 'frag_crystal', key: 'key_volcano' } },
      { type: 'DEPARTURE' }
    ]
  },
  volcano_island: {
    islandId: 'volcano_island',
    title: 'Volcano Island',
    npcId: 'blacksmith_ignis',
    stages: [
      { type: 'TITLE', title: 'Volcano Island' },
      { type: 'DIALOGUE', id: 'volcano_01' },
      { type: 'CHALLENGE', id: 'volcano_01' },
      { type: 'DIALOGUE', id: 'volcano_02' },
      { type: 'CHALLENGE', id: 'volcano_02' },
      { type: 'REWARD', rewards: { codexFragment: 'frag_volcano', key: 'key_lost_sea' } },
      { type: 'DEPARTURE' }
    ]
  },
  lost_sea: {
    islandId: 'lost_sea',
    title: 'Lost Sea',
    npcId: 'ghost_captain',
    stages: [
      { type: 'TITLE', title: 'Lost Sea' },
      { type: 'DIALOGUE', id: 'lost_sea_01' },
      { type: 'CHALLENGE', id: 'lost_sea_01' },
      { type: 'DIALOGUE', id: 'lost_sea_02' },
      { type: 'CHALLENGE', id: 'lost_sea_02' },
      { type: 'REWARD', rewards: { codexFragment: 'frag_lost_sea', key: 'key_pirate_king' } },
      { type: 'DEPARTURE' }
    ]
  },
  pirate_kings_ship: {
    islandId: 'pirate_kings_ship',
    title: "Pirate King's Ship",
    npcId: 'pirate_king',
    stages: [
      { type: 'TITLE', title: "Pirate King's Ship" },
      { type: 'DIALOGUE', id: 'pirate_kings_ship_01' },
      { type: 'CHALLENGE', id: 'pirate_kings_ship_01' },
      { type: 'STORY_EVENT', content: 'You have defeated the Pirate King and obtained the final Codex fragment!' },
      { type: 'REWARD', rewards: { codexFragment: 'frag_pirate_king' } },
      { type: 'DEPARTURE' }
    ]
  }
};
