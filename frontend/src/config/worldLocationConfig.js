export const WORLD_LOCATION_CONFIG = {
  merchant_isles: {
    islandName: 'Merchant Isles',
    backgroundStyle: {
      backgroundImage: 'linear-gradient(to bottom, #d4a373, #faedcd)',
      backgroundColor: '#fefae0',
    },
    nodes: [
      {
        id: 'dockyard',
        name: 'The Dockyard',
        x: '15%',
        y: '70%',
        type: 'PORTAL',
        icon: '⛵',
        description: 'Board your sloop and view the Sea Chart.'
      },
      {
        id: 'merchant_guild',
        name: 'Merchant Guild',
        x: '50%',
        y: '25%',
        type: 'BUILDING',
        icon: '🏛️',
        description: 'The administrative heart of the island\'s trading guilds.'
      },
      {
        id: 'warehouse',
        name: 'Harbor Warehouse',
        x: '80%',
        y: '65%',
        type: 'BUILDING',
        icon: '📦',
        description: 'Locked. Master Marlowe has restricted trading access.'
      },
      {
        id: 'tavern',
        name: 'The Rusty Anchor Tavern',
        x: '80%',
        y: '25%',
        type: 'BUILDING',
        icon: '🍻',
        description: 'Locked. The tavern is closed until port ledgers are sorted.'
      },
      {
        id: 'marlowe',
        name: 'Master Marlowe',
        x: '48%',
        y: '55%',
        type: 'NPC',
        icon: '🪙',
        description: 'Merchant Guildmaster looking stressed with a ledger.'
      },
      {
        id: 'crier',
        name: 'Town Crier',
        x: '30%',
        y: '45%',
        type: 'NPC',
        icon: '📢',
        description: 'Shouting news about the harbor ledgers.'
      },
      {
        id: 'quincy',
        name: 'Quartermaster Quincy',
        x: '68%',
        y: '60%',
        type: 'NPC',
        icon: '👨‍✈️',
        description: 'Quartermaster Quincy manages the harbor warehouse inventory.'
      }
    ]
  },
  smugglers_cove: {
    islandName: "Smuggler's Cove",
    backgroundStyle: {
      backgroundImage: 'linear-gradient(to bottom, #2b2b2b, #4a4a4a)',
      backgroundColor: '#1a1a1a',
    },
    nodes: [
      {
        id: 'dockyard',
        name: 'Hidden Dockyard',
        x: '15%',
        y: '70%',
        type: 'PORTAL',
        icon: '⛵',
        description: 'Board your sloop and view the Sea Chart.'
      },
      {
        id: 'admiral_morgan',
        name: 'Admiral Morgan',
        x: '45%',
        y: '50%',
        type: 'NPC',
        icon: '🎖️',
        description: 'Admiral Morgan is investigating the smuggler ring.'
      },
      {
        id: 'shady_informant',
        name: 'Shady Informant',
        x: '75%',
        y: '60%',
        type: 'NPC',
        icon: '🕵️',
        description: 'A shadowy figure with information for the right price.'
      },
      {
        id: 'smuggler_boss',
        name: 'Smuggler Boss',
        x: '80%',
        y: '30%',
        type: 'NPC',
        icon: '🦹',
        description: 'The mastermind behind the illegal trade.'
      }
    ]
  }
};
