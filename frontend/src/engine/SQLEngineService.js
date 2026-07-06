import initSqlJs from 'sql.js';
import wasmUrl from 'sql.js/dist/sql-wasm.wasm?url';

/**
 * Standardized execution return contract for all query modes.
 */
export class SQLEngineService {
  static instance = null;
  static db = null;
  static isInitializing = false;
  static initPromise = null;

  /**
   * Initializes the WASM SQLite runtime and boots an in-memory relational database.
   * Uses Vite bundled asset loader for the WASM binary to guarantee offline/local browser compatibility.
   */
  static async initialize() {
    if (this.db) return this.db;
    if (this.initPromise) return this.initPromise;

    this.isInitializing = true;
    this.initPromise = (async () => {
      try {
        const SQL = await initSqlJs({
          locateFile: () => wasmUrl,
        });

        this.db = new SQL.Database();
        // Enable foreign key enforcement standard in SQLite
        this.db.run('PRAGMA foreign_keys = ON;');
        this.isInitializing = false;
        return this.db;
      } catch (error) {
        this.isInitializing = false;
        this.initPromise = null;
        console.error('SQLEngineService: Fatal WASM Initialization Error:', error);
        throw error;
      }
    })();

    return this.initPromise;
  }

  /**
   * Hydrates the in-memory SQLite instance with a structured schema dataset.
   *
   * @param {Object} schemaPayload - Object containing ddl[] and seedData[] array commands
   */
  static async seedDatabase(schemaPayload) {
    const database = await this.initialize();

    try {
      // Execute DDL commands (Table creations)
      if (Array.isArray(schemaPayload?.ddl)) {
        for (const statement of schemaPayload.ddl) {
          database.run(statement);
        }
      }

      // Execute DML commands (Row insertions)
      if (Array.isArray(schemaPayload?.seedData)) {
        for (const statement of schemaPayload.seedData) {
          database.run(statement);
        }
      }
      return true;
    } catch (error) {
      console.error('SQLEngineService: Database Seeding Failed:', error);
      throw error;
    }
  }

  /**
   * Executes an arbitrary SQL query against the active in-memory database.
   *
   * @param {string} sqlString - Raw SQL statement submitted by player or system
   * @returns {Promise<Object>} Formatted query execution payload
   */
  static async executeQuery(sqlString) {
    const startTime = performance.now();
    
    if (!sqlString || typeof sqlString !== 'string' || !sqlString.trim()) {
      return {
        success: false,
        columns: [],
        rows: [],
        error: 'Query string cannot be empty.',
        executionTimeMs: 0
      };
    }

    try {
      const database = await this.initialize();
      const results = database.exec(sqlString);
      const endTime = performance.now();
      const executionTimeMs = Number((endTime - startTime).toFixed(2));

      // sql.js exec() returns [] for queries without tabular return sets (e.g., UPDATE/INSERT)
      if (!results || results.length === 0) {
        const rowsModified = database.getRowsModified();
        return {
          success: true,
          columns: ['Affected Rows'],
          rows: [[rowsModified]],
          rowsAffected: rowsModified,
          executionTimeMs
        };
      }

      const firstResult = results[0];
      return {
        success: true,
        columns: firstResult.columns || [],
        rows: firstResult.values || [],
        executionTimeMs
      };
    } catch (error) {
      const endTime = performance.now();
      return {
        success: false,
        columns: [],
        rows: [],
        error: error.message || 'Unknown SQL syntax exception.',
        executionTimeMs: Number((endTime - startTime).toFixed(2))
      };
    }
  }

  /**
   * Completely wipes and reinitializes the in-memory SQLite database.
   * Critical for Sandbox resets or transitioning between distinct island datasets.
   */
  static async resetDatabase(schemaPayload = null) {
    if (this.db) {
      try {
        this.db.close();
      } catch (e) {
        // Silently catch close errors during teardown
      }
      this.db = null;
      this.initPromise = null;
    }

    await this.initialize();
    if (schemaPayload) {
      await this.seedDatabase(schemaPayload);
    }
    return true;
  }
}