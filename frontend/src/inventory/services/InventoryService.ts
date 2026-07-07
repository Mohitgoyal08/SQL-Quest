import { InventoryItem } from '../models/InventoryItem';
import { ITEM_CATALOG } from '../data/ItemCatalog';

export class InventoryService {
  /**
   * Evaluates if an item can be added based on stack limits and unique quest item rules.
   */
  static canAddItem(currentItems: InventoryItem[], itemId: string, quantityToAdd: number = 1): boolean {
    const catalogEntry = ITEM_CATALOG[itemId];
    if (!catalogEntry) return false;

    const existingItem = currentItems.find(i => i.id === itemId);

    // Prevent duplicate unique or quest items
    if (existingItem && (!catalogEntry.stackable || catalogEntry.questItem)) {
      return false;
    }

    // Check stack overflow limits
    if (existingItem && catalogEntry.stackable) {
      return (existingItem.quantity + quantityToAdd) <= catalogEntry.maxStack;
    }

    return true;
  }

  /**
   * Adds an item or increments stack count. Returns immutable new inventory state.
   */
  static addItem(currentItems: InventoryItem[], itemId: string, quantityToAdd: number = 1): InventoryItem[] {
    const catalogEntry = ITEM_CATALOG[itemId];
    if (!catalogEntry) {
      console.warn(`InventoryService: Attempted to add unknown item ID "${itemId}".`);
      return currentItems;
    }

    const existingIndex = currentItems.findIndex(i => i.id === itemId);

    // Handle existing item found in inventory
    if (existingIndex !== -1) {
      const existingItem = currentItems[existingIndex];

      // Enforce unique quest item deduplication
      if (!catalogEntry.stackable || catalogEntry.questItem) {
        return currentItems;
      }

      const updatedQuantity = Math.min(
        existingItem.quantity + quantityToAdd,
        catalogEntry.maxStack
      );

      const updatedItems = [...currentItems];
      updatedItems[existingIndex] = {
        ...existingItem,
        quantity: updatedQuantity
      };

      return updatedItems;
    }

    // Item does not exist; append new item entry
    const initialQuantity = catalogEntry.stackable
      ? Math.min(quantityToAdd, catalogEntry.maxStack)
      : 1;

    const newItem: InventoryItem = {
      ...catalogEntry,
      quantity: initialQuantity
    };

    return [...currentItems, newItem];
  }

  /**
   * Decrements quantity or removes item entirely if quantity reaches zero.
   */
  static removeItem(currentItems: InventoryItem[], itemId: string, quantityToRemove: number = 1): InventoryItem[] {
    const existingIndex = currentItems.findIndex(i => i.id === itemId);
    if (existingIndex === -1) return currentItems;

    const existingItem = currentItems[existingIndex];

    if (existingItem.stackable && existingItem.quantity > quantityToRemove) {
      const updatedItems = [...currentItems];
      updatedItems[existingIndex] = {
        ...existingItem,
        quantity: existingItem.quantity - quantityToRemove
      };
      return updatedItems;
    }

    // Remove completely if non-stackable or quantity <= 0
    return currentItems.filter(i => i.id !== itemId);
  }

  static hasItem(currentItems: InventoryItem[], itemId: string): boolean {
    return currentItems.some(i => i.id === itemId && i.quantity > 0);
  }

  static getItem(currentItems: InventoryItem[], itemId: string): InventoryItem | undefined {
    return currentItems.find(i => i.id === itemId);
  }

  static getItems(currentItems: InventoryItem[]): InventoryItem[] {
    return [...currentItems];
  }

  static clearInventory(): InventoryItem[] {
    return [];
  }
}