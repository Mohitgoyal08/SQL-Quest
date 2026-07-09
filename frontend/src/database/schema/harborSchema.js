/**
 * Canonical relational schema for Tutorial Harbor and Smuggler's Cove.
 * Designed with foreign keys to seamlessly support future INNER JOIN / LEFT JOIN challenges.
 */
export const HARBOR_SCHEMA = {
  id: 'world_dataset_v1',
  name: 'SQL Quest World Database',
  description: 'Unified dataset for all 8 islands.',
  
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
    );`,
    `CREATE TABLE IF NOT EXISTS artifacts (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      type TEXT NOT NULL,
      danger_level INTEGER NOT NULL
    );`,
    `CREATE TABLE IF NOT EXISTS gems (
      id INTEGER PRIMARY KEY,
      miner_name TEXT NOT NULL,
      gem_type TEXT NOT NULL,
      weight INTEGER NOT NULL
    );`,
    `CREATE TABLE IF NOT EXISTS weather_logs (
      id INTEGER PRIMARY KEY,
      region TEXT NOT NULL,
      fog_density INTEGER NOT NULL,
      sea_monster TEXT
    );`,
    `CREATE TABLE IF NOT EXISTS bounties (
      id INTEGER PRIMARY KEY,
      target_name TEXT NOT NULL,
      bounty_amount INTEGER NOT NULL
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
      ('brigantine_01', 'Plunder Wind', 'Brigantine', 'active', 20000),
      ('galleon_02', 'The Sea Queen', 'Galleon', 'contraband', 85000),
      ('schooner_01', 'Silent Whisper', 'Schooner', 'contraband', 42000);`,

    // Populate Artifacts (Jungle of Queries)
    `INSERT INTO artifacts (id, name, type, danger_level) VALUES
      (1, 'Golden Idol', 'treasure', 5),
      (2, 'Cursed Amulet', 'relic', 9),
      (3, 'Ancient Tablet', 'relic', 2),
      (4, 'Jade Monkey', 'treasure', 4),
      (5, 'Poison Dart', 'weapon', 7);`,

    // Populate Gems (Crystal Caverns)
    `INSERT INTO gems (id, miner_name, gem_type, weight) VALUES
      (1, 'Gimli', 'Ruby', 15),
      (2, 'Balin', 'Sapphire', 12),
      (3, 'Gimli', 'Emerald', 8),
      (4, 'Thorin', 'Diamond', 25),
      (5, 'Balin', 'Ruby', 10),
      (6, 'Dori', 'Sapphire', 18);`,

    // Populate Weather Logs (Lost Sea)
    `INSERT INTO weather_logs (id, region, fog_density, sea_monster) VALUES
      (1, 'North Quadrant', 80, 'Kraken'),
      (2, 'South Quadrant', 20, NULL),
      (3, 'East Quadrant', 95, 'Leviathan'),
      (4, 'West Quadrant', 40, NULL),
      (5, 'Center Maelstrom', 100, 'Sirens');`,

    // Populate Bounties (Pirate King's Ship)
    `INSERT INTO bounties (id, target_name, bounty_amount) VALUES
      (1, 'Captain Blackbeard', 100000),
      (2, 'Anne Bonny', 75000),
      (3, 'Calico Jack', 60000),
      (4, 'Mary Read', 55000);`
  ]
};