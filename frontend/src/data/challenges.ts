import { WorldRequirement } from '../types/WorldTypes';
export interface ChallengeRewards {
  xp: number;
  coins: number;
  gems?: number;
  badge?: string;
  item?: string;
}

export interface ChallengeValidation {
  type: 'EXACT' | 'CONTAINS' | 'KEYWORD_MATCH' | 'REGEX';
  expected: string;
  requiredKeywords?: string[];
}

export interface SQLChallenge {
  id: string;
  title: string;

  chapter: number;
  islandId: string;
  npcId: string;

  description: string;
  story: string;

  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Boss';

  validation: ChallengeValidation;

  starterCode: string;

  /**
   * Canonical executable SQL used by the SQLite engine.
   */
  referenceQuery: string;

  /**
   * Optional loading message shown while the SQL engine executes.
   */
  loadingMessage?: string;

  /**
   * @deprecated Legacy compatibility field from Sprint 9.7.
   * Use `requirements` for all new content.
   */
  requiredItem?: string;

  /**
   * Canonical requirement definition used by the Requirement Gate Engine.
   */
  requirements?: WorldRequirement;

  hints: string[];

  rewards: ChallengeRewards;

  nextChallengeId: string | null;
}

export const SQL_CHALLENGES: SQLChallenge[] = [
  {
    id: "chal_01",
    title: "Muster the Crew",
    chapter: 1,
    islandId: "tutorial_island",
    npcId: "captain_blackbeard",
    story: "Captain Blackbeard needs a full head count before setting sail. Consult the harbor registry to view every hand aboard.",
    description: "Retrieve all records and all columns from the employees table.",
    difficulty: "Easy",
    validation: {
      type: 'EXACT',
      expected: "SELECT * FROM employees"
    },
    starterCode: "SELECT ",
    referenceQuery: "SELECT * FROM employees;",
    hints: [
      "Use the asterisk (*) symbol to select all columns.",
      "Don't forget the FROM clause specifying the 'employees' table."
    ],
    rewards: {
      xp: 100,
      coins: 25,
      item: "beginners_compass"
    },
    nextChallengeId: "chal_02"
  },

  {
    id: "chal_02",
    title: "Roll Call",
    chapter: 1,
    islandId: "tutorial_island",
    npcId: "quartermaster_flint",
    story: "The quartermaster only cares for names, not titles or wages. Strip the ledger down to essentials.",
    description: "Retrieve only the 'name' column from the employees table.",
    difficulty: "Easy",
    validation: {
      type: 'KEYWORD_MATCH',
      expected: "SELECT name FROM employees",
      requiredKeywords: ["select", "name", "from", "employees"]
    },
    starterCode: "SELECT * FROM employees;",
    referenceQuery: "SELECT name FROM employees;",
    hints: [
      "Replace the wildcard asterisk (*) with the specific column name 'name'.",
      "Ensure the table name remains 'employees'."
    ],
    rewards: {
      xp: 125,
      coins: 30,
      gems: 5
    },
    nextChallengeId: "chal_03"
  },

  {
    id: "chal_03",
    title: "High Earners",
    chapter: 1,
    islandId: "tutorial_island",
    npcId: "quartermaster_flint",
    story: "Mutiny brews among the underpaid! Retrieve the name and salary columns from the employees table to see who is earning what.",
    description: "Retrieve the 'name' and 'salary' columns from the employees table.",
    difficulty: "Medium",
    validation: {
      type: 'CONTAINS',
      expected: "SELECT name, salary FROM employees"
    },
    starterCode: "SELECT  FROM employees;",
    referenceQuery: "SELECT name, salary FROM employees;",
    hints: [
      "Select multiple columns by separating them with a comma.",
      "The columns you need are 'name' and 'salary'."
    ],
    rewards: {
      xp: 150,
      coins: 45,
      badge: "coin_counter"
    },
    nextChallengeId: "chal_06"
  },

  {
    id: "chal_06",
    title: "Claiming the Abandoned Sloop",
    chapter: 1,
    islandId: "tutorial_island",
    npcId: "captain_blackbeard",
    story: "Old Barnaby has verified that the registry ledger holds the records of all ships in port. Retrieve the names and prices of all ships so we can find the cheapest abandoned one in the ledger.",
    description: "Retrieve the 'name' and 'price' columns from the ships table.",
    difficulty: "Medium",
    validation: {
      type: 'EXACT',
      expected: "SELECT name, price FROM ships"
    },
    starterCode: "SELECT  FROM ",
    referenceQuery: "SELECT name, price FROM ships;",
    hints: [
      "Select the 'name' and 'price' columns.",
      "Ensure the table is 'ships'."
    ],
    rewards: {
      xp: 300,
      coins: 150,
      gems: 10
    },
    nextChallengeId: null
  },

  {
    id: "merchant_00",
    title: "The Missing Traders",
    chapter: 2,
    islandId: "merchant_isles",
    npcId: "quincy",
    story: "Quartermaster Quincy needs to locate the elite traders. Retrieve all columns from employees where the salary is greater than 50000.",
    description: "Retrieve all columns from employees where the salary is greater than 50000.",
    difficulty: "Medium",
    validation: {
      type: 'CONTAINS',
      expected: "WHERE salary > 50000"
    },
    starterCode: "SELECT * FROM employees\nWHERE ",
    referenceQuery: "SELECT * FROM employees WHERE salary > 50000;",
    hints: [
      "Use the WHERE clause to filter rows.",
      "The comparison operator for greater than is '>'. Check against 50000 without commas."
    ],
    rewards: {
      xp: 150,
      coins: 45,
      gems: 5
    },
    nextChallengeId: "merchant_01"
  },

  {
    id: "merchant_01",
    title: "Auditing the Cargo Ledger",
    chapter: 2,
    islandId: "merchant_isles",
    npcId: "marlowe",
    story: "Master Marlowe needs the cargo manifest sorted by worker salaries so he can identify the top spenders.",
    description: "Retrieve all columns from the employees table ordered by salary from highest to lowest (descending).",
    difficulty: "Medium",
    validation: {
      type: 'EXACT',
      expected: "SELECT * FROM employees ORDER BY salary DESC"
    },
    starterCode: "SELECT * FROM employees\nORDER BY ",
    referenceQuery: "SELECT * FROM employees ORDER BY salary DESC;",
    hints: [
      "Use the ORDER BY clause followed by the column name 'salary'.",
      "Specify DESC at the end to sort in descending order."
    ],
    rewards: {
      xp: 200,
      coins: 75,
      gems: 5
    },
    nextChallengeId: "merchant_02"
  },

  {
    id: "merchant_02",
    title: "The Elite Traders",
    chapter: 2,
    islandId: "merchant_isles",
    npcId: "quincy",
    story: "Quartermaster Quincy needs to see only the top 3 highest-earning workers to file his trade audit.",
    description: "Retrieve the top 3 highest-earning employees from the employees table.",
    difficulty: "Hard",
    validation: {
      type: 'REGEX',
      expected: "^select\\s+\\*\\s+from\\s+employees\\s+order\\s+by\\s+salary\\s+desc\\s+limit\\s+3$"
    },
    starterCode: "SELECT * FROM employees\nORDER BY salary DESC\nLIMIT ",
    referenceQuery: "SELECT * FROM employees ORDER BY salary DESC LIMIT 3;",
    hints: [
      "Combine ORDER BY salary DESC with the LIMIT keyword.",
      "Specify 3 right after LIMIT."
    ],
    rewards: {
      xp: 250,
      coins: 100,
      gems: 10,
      badge: "Master Merchant"
    },
    nextChallengeId: null
  },

  {
    id: "smugglers_01",
    title: "The Smuggler's Ledger",
    chapter: 3,
    islandId: "smugglers_cove",
    npcId: "admiral_morgan",
    story: "Admiral Morgan suspects the smugglers are using fake ship types. Find all the unique ship types in the harbor.",
    description: "Retrieve all distinct 'type' values from the ships table.",
    difficulty: "Easy",
    validation: {
      type: 'REGEX',
      expected: "^select\\s+distinct\\s+type\\s+from\\s+ships$"
    },
    starterCode: "SELECT DISTINCT  FROM ships;",
    referenceQuery: "SELECT DISTINCT type FROM ships;",
    hints: [
      "Use the DISTINCT keyword.",
      "Select the 'type' column."
    ],
    rewards: {
      xp: 200,
      coins: 100,
      gems: 10
    },
    nextChallengeId: "smugglers_02"
  },

  {
    id: "smugglers_02",
    title: "Tracking the Contraband",
    chapter: 3,
    islandId: "smugglers_cove",
    npcId: "shady_informant",
    story: "The Shady Informant will give you the ledger, but wants the column names disguised.",
    description: "Retrieve the 'name' column as 'vessel' and the 'price' column as 'cost' from the ships table.",
    difficulty: "Medium",
    validation: {
      type: 'REGEX',
      expected: "^select\\s+name\\s+as\\s+vessel\\s*,\\s*price\\s+as\\s+cost\\s+from\\s+ships$"
    },
    starterCode: "SELECT name AS vessel,  FROM ships;",
    referenceQuery: "SELECT name AS vessel, price AS cost FROM ships;",
    hints: [
      "Use the AS keyword to create aliases.",
      "Alias 'price' as 'cost'."
    ],
    rewards: {
      xp: 250,
      coins: 150,
      gems: 20
    },
    nextChallengeId: "smugglers_03"
  },

  {
    id: "smugglers_03",
    title: "The Boss's Identity",
    chapter: 3,
    islandId: "smugglers_cove",
    npcId: "smuggler_boss",
    story: "The Smuggler Boss's real name is hidden in lowercase letters. Reveal it by capitalizing all employee names.",
    description: "Retrieve the 'name' column from employees and convert it to uppercase.",
    difficulty: "Boss",
    validation: {
      type: 'REGEX',
      expected: "^select\\s+upper\\s*\\(\\s*name\\s*\\)\\s+from\\s+employees$"
    },
    starterCode: "SELECT  FROM employees;",
    referenceQuery: "SELECT UPPER(name) FROM employees;",
    hints: [
      "Use the UPPER() function.",
      "Wrap the 'name' column inside UPPER(name)."
    ],
    rewards: {
      xp: 500,
      coins: 500,
      gems: 50,
      badge: "Savior of the Seas",
      item: "admiral_hat"
    },
    nextChallengeId: null
  },
  {
    id: "jungle_01",
    title: "The Lost Treasures",
    chapter: 4,
    islandId: "jungle_queries",
    npcId: "explorer_drake",
    story: "Explorer Drake is hacking through the thick vines. He only cares about items classified as treasure or relic.",
    description: "Retrieve all columns from the artifacts table where the type is IN ('treasure', 'relic').",
    difficulty: "Easy",
    validation: {
      type: 'REGEX',
      expected: "^select\\s+\\*\\s+from\\s+artifacts\\s+where\\s+type\\s+in\\s*\\(\\s*'treasure'\\s*,\\s*'relic'\\s*\\)$"
    },
    starterCode: "SELECT * FROM artifacts\nWHERE ",
    referenceQuery: "SELECT * FROM artifacts WHERE type IN ('treasure', 'relic');",
    hints: [
      "Use the IN operator.",
      "Wrap 'treasure' and 'relic' inside parentheses."
    ],
    rewards: {
      xp: 300,
      coins: 150
    },
    nextChallengeId: "jungle_02"
  },
  {
    id: "jungle_02",
    title: "Danger in the Deep",
    chapter: 4,
    islandId: "jungle_queries",
    npcId: "shaman_uru",
    story: "Shaman Uru warns of traps. You must identify artifacts that have a danger level between 3 and 7 to proceed safely.",
    description: "Retrieve all columns from artifacts where danger_level is BETWEEN 3 AND 7.",
    difficulty: "Medium",
    validation: {
      type: 'REGEX',
      expected: "^select\\s+\\*\\s+from\\s+artifacts\\s+where\\s+danger_level\\s+between\\s+3\\s+and\\s+7$"
    },
    starterCode: "SELECT * FROM artifacts\nWHERE ",
    referenceQuery: "SELECT * FROM artifacts WHERE danger_level BETWEEN 3 AND 7;",
    hints: [
      "Use the BETWEEN operator.",
      "Check that the column danger_level is BETWEEN 3 AND 7."
    ],
    rewards: {
      xp: 400,
      coins: 200,
      gems: 25
    },
    nextChallengeId: "jungle_03"
  },
  {
    id: "jungle_03",
    title: "The Golden Idol",
    chapter: 4,
    islandId: "jungle_queries",
    npcId: "temple_guardian",
    story: "The Temple Guardian blocks the exit! He demands the Golden Idol. You must find it using its name pattern.",
    description: "Retrieve all columns from artifacts where the name is LIKE '%Idol%'.",
    difficulty: "Boss",
    validation: {
      type: 'REGEX',
      expected: "^select\\s+\\*\\s+from\\s+artifacts\\s+where\\s+name\\s+like\\s+'%Idol%'$"
    },
    starterCode: "SELECT * FROM artifacts\nWHERE ",
    referenceQuery: "SELECT * FROM artifacts WHERE name LIKE '%Idol%';",
    hints: [
      "Use the LIKE operator.",
      "The % wildcard matches any sequence of characters."
    ],
    rewards: {
      xp: 600,
      coins: 500,
      gems: 100,
      badge: "Jungle Explorer",
      item: "golden_idol"
    },
    nextChallengeId: null
  },

  // ===== ISLAND 5: CRYSTAL CAVERNS (Aggregation) =====
  {
    id: "crystal_01",
    title: "The Miner's Haul",
    chapter: 5,
    islandId: "crystal_caverns",
    npcId: "dwarf_foreman",
    story: "The Dwarf Foreman needs to know exactly how many gems were extracted today.",
    description: "Retrieve the total COUNT of all gems.",
    difficulty: "Easy",
    validation: {
      type: 'REGEX',
      expected: "^select\\s+count\\s*\\(.*\\)\\s+from\\s+gems$"
    },
    starterCode: "SELECT  FROM gems;",
    referenceQuery: "SELECT COUNT(*) FROM gems;",
    hints: ["Use the COUNT() aggregate function."],
    rewards: { xp: 300, coins: 150 },
    nextChallengeId: "crystal_02"
  },
  {
    id: "crystal_02",
    title: "Weighing the Wealth",
    chapter: 5,
    islandId: "crystal_caverns",
    npcId: "dwarf_appraiser",
    story: "The Appraiser wants to know the average weight of the extracted gems.",
    description: "Retrieve the average weight of all gems.",
    difficulty: "Medium",
    validation: {
      type: 'REGEX',
      expected: "^select\\s+avg\\s*\\(\\s*weight\\s*\\)\\s+from\\s+gems$"
    },
    starterCode: "SELECT  FROM gems;",
    referenceQuery: "SELECT AVG(weight) FROM gems;",
    hints: ["Use the AVG() aggregate function on the weight column."],
    rewards: { xp: 400, coins: 200, gems: 25 },
    nextChallengeId: "crystal_03"
  },
  {
    id: "crystal_03",
    title: "The Master Miner",
    chapter: 5,
    islandId: "crystal_caverns",
    npcId: "gem_dragon",
    story: "The Gem Dragon awakens! He demands to know which miners have extracted a total weight greater than 20.",
    description: "Retrieve miner_name and the SUM of weight, grouped by miner_name, HAVING a SUM(weight) > 20.",
    difficulty: "Boss",
    validation: {
      type: 'REGEX',
      expected: "^select\\s+miner_name\\s*,\\s*sum\\s*\\(\\s*weight\\s*\\)\\s+from\\s+gems\\s+group\\s+by\\s+miner_name\\s+having\\s+sum\\s*\\(\\s*weight\\s*\\)\\s*>\\s*20$"
    },
    starterCode: "SELECT miner_name, SUM(weight) FROM gems\nGROUP BY miner_name\n",
    referenceQuery: "SELECT miner_name, SUM(weight) FROM gems GROUP BY miner_name HAVING SUM(weight) > 20;",
    hints: ["Use the HAVING clause to filter groups."],
    rewards: { xp: 600, coins: 500, gems: 100, badge: "Dragon Tamer", item: "dragon_scale" },
    nextChallengeId: null
  },

  // ===== ISLAND 6: VOLCANO ISLAND (Joins) =====
  {
    id: "volcano_01",
    title: "The Forge Logs",
    chapter: 6,
    islandId: "volcano_island",
    npcId: "blacksmith_ignis",
    story: "Blacksmith Ignis needs to know which pirates belong to which ships. He has the ships table and the employees table.",
    description: "Retrieve employee name and their assigned ship name by performing an INNER JOIN on employees and ships where employees.island = 'Smuggler Cove'.",
    difficulty: "Medium",
    validation: {
      type: 'KEYWORD_MATCH',
      expected: "SELECT name FROM employees",
      requiredKeywords: ['INNER', 'JOIN', 'ships']
    },
    starterCode: "SELECT employees.name, ships.name \nFROM employees\nINNER JOIN ships ON ",
    referenceQuery: "SELECT employees.name, ships.name FROM employees INNER JOIN ships ON employees.department_id = ships.id;",
    hints: ["Use INNER JOIN ships ON ..."],
    rewards: { xp: 400, coins: 200 },
    nextChallengeId: "volcano_02"
  },
  {
    id: "volcano_02",
    title: "The Heat of Battle",
    chapter: 6,
    islandId: "volcano_island",
    npcId: "fire_elemental",
    story: "The Volcano is erupting! The Fire Elemental blocks your path. You must write a LEFT JOIN to see all ships and any assigned employees.",
    description: "Retrieve all ships and their assigned employees using a LEFT JOIN.",
    difficulty: "Boss",
    validation: {
      type: 'KEYWORD_MATCH',
      expected: "SELECT name FROM ships",
      requiredKeywords: ['LEFT', 'JOIN', 'employees']
    },
    starterCode: "SELECT ships.name, employees.name \nFROM ships\nLEFT JOIN ",
    referenceQuery: "SELECT ships.name, employees.name FROM ships LEFT JOIN employees ON ships.id = employees.department_id;",
    hints: ["Use a LEFT JOIN from ships to employees."],
    rewards: { xp: 700, coins: 600, gems: 150, badge: "Volcano Survivor" },
    nextChallengeId: null
  },

  // ===== ISLAND 7: LOST SEA (Subqueries) =====
  {
    id: "lost_sea_01",
    title: "Into the Fog",
    chapter: 7,
    islandId: "lost_sea",
    npcId: "ghost_captain",
    story: "The Ghost Captain offers passage, but only if you can find the region with the highest fog_density using a subquery.",
    description: "Retrieve the region from weather_logs where fog_density is equal to the MAX fog_density.",
    difficulty: "Medium",
    validation: {
      type: 'KEYWORD_MATCH',
      expected: "SELECT region FROM weather_logs",
      requiredKeywords: ['SELECT', 'MAX', 'fog_density']
    },
    starterCode: "SELECT region FROM weather_logs \nWHERE fog_density = (SELECT ...);",
    referenceQuery: "SELECT region FROM weather_logs WHERE fog_density = (SELECT MAX(fog_density) FROM weather_logs);",
    hints: ["Use a subquery in the WHERE clause: (SELECT MAX(fog_density) FROM weather_logs)"],
    rewards: { xp: 500, coins: 300 },
    nextChallengeId: "lost_sea_02"
  },
  {
    id: "lost_sea_02",
    title: "The Leviathan's Riddle",
    chapter: 7,
    islandId: "lost_sea",
    npcId: "leviathan",
    story: "The Leviathan emerges! You must use the EXISTS operator to prove there is a region with a Kraken.",
    description: "Retrieve all columns from weather_logs where a sea_monster 'Kraken' EXISTS in the logs.",
    difficulty: "Boss",
    validation: {
      type: 'KEYWORD_MATCH',
      expected: "SELECT * FROM weather_logs",
      requiredKeywords: ['EXISTS', 'Kraken']
    },
    starterCode: "SELECT * FROM weather_logs \nWHERE EXISTS (SELECT 1 FROM weather_logs WHERE sea_monster = 'Kraken');",
    referenceQuery: "SELECT * FROM weather_logs WHERE EXISTS (SELECT 1 FROM weather_logs WHERE sea_monster = 'Kraken');",
    hints: ["Use the EXISTS operator."],
    rewards: { xp: 800, coins: 700, gems: 200, badge: "Abyssal Navigator" },
    nextChallengeId: null
  },

  // ===== ISLAND 8: PIRATE KING'S SHIP (Final Exam) =====
  {
    id: "pirate_kings_ship_01",
    title: "The Final Confrontation",
    chapter: 8,
    islandId: "pirate_kings_ship",
    npcId: "pirate_king",
    story: "The Pirate King sneers. 'You want the SQL Codex? Prove you can aggregate my entire bounty board!'",
    description: "Retrieve the total sum of all bounty_amount from the bounties table.",
    difficulty: "Boss",
    validation: {
      type: 'REGEX',
      expected: "^select\\s+sum\\s*\\(\\s*bounty_amount\\s*\\)\\s+from\\s+bounties$"
    },
    starterCode: "SELECT \nFROM bounties;",
    referenceQuery: "SELECT SUM(bounty_amount) FROM bounties;",
    hints: ["Use SUM(bounty_amount)."],
    rewards: { xp: 2000, coins: 5000, gems: 1000, badge: "Master of SQL", item: "sql_codex" },
    nextChallengeId: null
  }
];
