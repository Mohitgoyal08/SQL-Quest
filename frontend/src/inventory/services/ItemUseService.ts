// ===== Sprint 10.2 Interactive Inventory Foundation =====

export type ItemEffect = 'NONE' | 'MARK_USED';

export interface ItemUseResult {
  success: boolean;
  message: string;
  effect: ItemEffect;
}

/**
 * Single source of truth for item usage behavior.
 * Maps inventory items to their interactive gameplay results.
 * Strictly separated from InventoryService to preserve Single Responsibility.
 */
export class ItemUseService {
  static useItem(itemId: string): ItemUseResult {
    switch (itemId) {
      case 'beginners_compass':
        return {
          success: true,
          message: 'The compass spins wildly and locks North. You have marked your bearings.',
          effect: 'MARK_USED',
        };
      default:
        return {
          success: false,
          message: 'This item cannot be used right now or has no immediate effect.',
          effect: 'NONE',
        };
    }
  }
}