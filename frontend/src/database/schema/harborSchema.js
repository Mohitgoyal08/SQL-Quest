/**
 * Canonical relational schema for Tutorial Harbor and Smuggler's Cove.
 * Designed with foreign keys to seamlessly support future INNER JOIN / LEFT JOIN challenges.
 */
export const HARBOR_SCHEMA = {
  id: 'harbor_dataset_v1',
  name: 'Tutorial Harbor & Smuggler Cove Ledger',
  description: 'Core pirate manifest and departmental assignment registry.',
  
  // DDL (Data Definition Language) - Schema Creation
  ddl: [
    `CREATE TABLE IF NOT EXISTS departments (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL UNIQUE,
      location TEXT NOT NULL,
      budget INTEGER NOT NULL
    );`,
    `CREATE TABLE IF NOT EXISTS employees (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      role TEXT NOT NULL,
      salary INTEGER NOT NULL,
      department_id INTEGER,
      island TEXT DEFAULT 'Tutorial Harbor',
      FOREIGN KEY (department_id) REFERENCES departments(id)
    );`,
    `CREATE TABLE IF NOT EXISTS ships (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      type TEXT NOT NULL,
      status TEXT NOT NULL,
      price INTEGER NOT NULL
    );`
  ],

  // DML (Data Manipulation Language) - Seed Data
  seedData: [
    // Populate Departments
    `INSERT INTO departments (id, name, location, budget) VALUES 
      (1, 'Command & Navigation', 'Quarterdeck', 250000),
      (2, 'Artillery & Defense', 'Gun Deck', 180000),
      (3, 'Logistics & Plunder', 'Cargo Hold', 120000),
      (4, 'Culinary & Rations', 'Galley', 45000);`,

    // Populate Employees (Pirate Crew Manifest)
    `INSERT INTO employees (id, name, role, salary, department_id, island) VALUES 
      (101, 'Captain Blackbeard', 'Fleet Admiral', 95000, 1, 'Tutorial Harbor'),
      (102, 'Quartermaster Flint', 'Chief Inspector', 75000, 3, 'Tutorial Harbor'),
      (103, 'Anne Bonny', 'Master Gunner', 62000, 2, 'Smuggler Cove'),
      (104, 'Long John Silver', 'Head Cook', 42000, 4, 'Tutorial Harbor'),
      (105, 'Calico Jack', 'Navigator', 58000, 1, 'Smuggler Cove'),
      (106, 'Mary Read', 'Cannoneer', 51000, 2, 'Tutorial Harbor'),
      (107, 'Israel Hands', 'Boatswain', 48000, 3, 'Tutorial Harbor'),
      (108, 'Bartholomew Roberts', 'Tactician', 82000, 1, 'Smuggler Cove');`,

    // Populate Ships (Vessels in the Harbor)
    `INSERT INTO ships (id, name, type, status, price) VALUES 
      ('sloop_01', 'The SELECT Sloop', 'Sloop', 'abandoned', 0),
      ('galleon_01', 'Morgans Revenge', 'Galleon', 'active', 50000),
      ('brigantine_01', 'Plunder Wind', 'Brigantine', 'active', 20000);`
  ]
};