import { InventoryItem } from '../models/InventoryItem';
import { ItemCategory, ItemRarity } from '../models/ItemTypes';

export const ITEM_CATALOG: Record<string, Omit<InventoryItem, 'quantity'>> = {
  beginners_compass: {
    id: 'beginners_compass',
    name: "Beginner's Compass",
    description: 'A brass navigational tool pointing steadily toward foundational SQL syntax.',
    icon: '🧭',
    category: ItemCategory.TOOL,
    rarity: ItemRarity.COMMON,
    stackable: false,
    maxStack: 1,
    usable: false,
    tradable: false,
    questItem: false
  },
  coin_counter: {
    id: 'coin_counter',
    name: 'Coin Counter',
    description: 'An abacus used by quartermasters to audit crew salaries and numeric ranges.',
    icon: '🧮',
    category: ItemCategory.TOOL,
    rarity: ItemRarity.COMMON,
    stackable: false,
    maxStack: 1,
    usable: false,
    tradable: false,
    questItem: false
  },
  rusty_key: {
    id: 'rusty_key',
    name: 'Rusty Key',
    description: "Unlocks the iron grate leading to the Smuggler's Cove archives.",
    icon: '🗝️',
    category: ItemCategory.KEY,
    rarity: ItemRarity.COMMON,
    stackable: false,
    maxStack: 1,
    usable: true,
    tradable: false,
    questItem: true
  },
  harbor_map: {
    id: 'harbor_map',
    name: 'Harbor Map',
    description: 'A weathered chart detailing all relational tables in Tutorial Harbor.',
    icon: '🗺️',
    category: ItemCategory.QUEST_ITEM,
    rarity: ItemRarity.RARE,
    stackable: false,
    maxStack: 1,
    usable: false,
    tradable: false,
    questItem: true
  },
  sql_scroll: {
    id: 'sql_scroll',
    name: 'SQL Scroll',
    description: 'An ancient parchment inscribed with advanced ORDER BY and LIMIT incantations.',
    icon: '📜',
    category: ItemCategory.ARTIFACT,
    rarity: ItemRarity.EPIC,
    stackable: false,
    maxStack: 1,
    usable: true,
    tradable: false,
    questItem: false
  }
};