import React, { createContext, useState, useCallback, ReactNode } from 'react';
import { InventoryItem } from '../models/InventoryItem';
import { InventoryService } from '../services/InventoryService';

export interface InventoryContextType {
  items: InventoryItem[];
  addItem: (itemId: string, quantity?: number) => void;
  removeItem: (itemId: string, quantity?: number) => void;
  clearInventory: () => void;
  hasItem: (itemId: string) => boolean;
// ===== Sprint 9.4B Phase 1 Cleanup START =====
  getItem: (itemId: string) => InventoryItem | undefined;
  getItems: () => InventoryItem[];
// ===== Sprint 9.4B Phase 1 Cleanup END =====
}

export const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

interface InventoryProviderProps {
  children: ReactNode;
  initialItems?: InventoryItem[];
}

export const InventoryProvider: React.FC<InventoryProviderProps> = ({ 
  children, 
  initialItems = [] 
}) => {
  const [items, setItems] = useState<InventoryItem[]>(initialItems);

  const addItem = useCallback((itemId: string, quantity: number = 1) => {
    setItems(prevItems => InventoryService.addItem(prevItems, itemId, quantity));
  }, []);

  const removeItem = useCallback((itemId: string, quantity: number = 1) => {
    setItems(prevItems => InventoryService.removeItem(prevItems, itemId, quantity));
  }, []);

  const clearInventory = useCallback(() => {
    setItems(InventoryService.clearInventory());
  }, []);

  const hasItem = useCallback((itemId: string) => {
    return InventoryService.hasItem(items, itemId);
  }, [items]);

// ===== Sprint 9.4B Phase 1 Cleanup START =====
  const getItem = useCallback((itemId: string) => {
    return InventoryService.getItem(items, itemId);
  }, [items]);

  const getItems = useCallback(() => {
    return InventoryService.getItems(items);
  }, [items]);
// ===== Sprint 9.4B Phase 1 Cleanup END =====

  const value: InventoryContextType = {
    items,
    addItem,
    removeItem,
    clearInventory,
    hasItem,
// ===== Sprint 9.4B Phase 1 Cleanup START =====
    getItem,
    getItems
// ===== Sprint 9.4B Phase 1 Cleanup END =====
  };

  return (
    <InventoryContext.Provider value={value}>
      {children}
    </InventoryContext.Provider>
  );
};