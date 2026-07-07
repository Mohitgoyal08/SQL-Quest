import { ItemCategory, ItemRarity } from './ItemTypes';

export interface InventoryItem {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: ItemCategory;
  rarity: ItemRarity;
  stackable: boolean;
  maxStack: number;
  quantity: number;
  usable: boolean;
  tradable: boolean;
  questItem: boolean;
}