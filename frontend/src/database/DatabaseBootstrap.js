import { SQLEngineService } from '../engine/SQLEngineService';
import { HARBOR_SCHEMA } from './schema/harborSchema';

export class DatabaseBootstrap {
  static isSeeded = false;
  static bootstrapPromise = null;

  /**
   * Initializes the WASM SQLite engine and seeds HARBOR_SCHEMA exactly once.
   * Safe to call repeatedly across components without re-executing DDL/DML.
   */
  static async initialize() {
    if (this.isSeeded && SQLEngineService.db) {
      return SQLEngineService.db;
    }

    if (this.bootstrapPromise) {
      return this.bootstrapPromise;
    }

    this.bootstrapPromise = (async () => {
      try {
        await SQLEngineService.initialize();
        await SQLEngineService.seedDatabase(HARBOR_SCHEMA);
        this.isSeeded = true;
        return SQLEngineService.db;
      } catch (error) {
        this.isSeeded = false;
        this.bootstrapPromise = null;
        console.error('DatabaseBootstrap: Initialization Failed:', error);
        throw error;
      }
    })();

    return this.bootstrapPromise;
  }

  /**
   * Forces a complete database teardown and re-seeding.
   * Essential for Sandbox Mode resets or future admin panel scene testing.
   */
  static async reset() {
    this.isSeeded = false;
    this.bootstrapPromise = null;
    await SQLEngineService.resetDatabase(HARBOR_SCHEMA);
    this.isSeeded = true;
    return SQLEngineService.db;
  }
}