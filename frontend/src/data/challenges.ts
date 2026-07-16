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
    id: "merchant_01",
    title: "The Merchant Ledger",
    chapter: 2,
    islandId: "merchant_isles",
    npcId: "quincy",
    story: "Quincy needs to review the trading manifest of galleons visiting the docks. Find all galleon ship names to understand our harbor traffic.\n\nObjective: Retrieve the name of all vessels from the ships table where the type is 'Galleon'.",
    description: "Quincy needs to review the trading manifest of galleons visiting the docks. Find all galleon ship names to understand our harbor traffic.\n\nObjective: Retrieve the name of all vessels from the ships table where the type is 'Galleon'.",
    difficulty: "Easy",
    validation: {
      type: 'EXACT',
      expected: "SELECT name FROM ships WHERE type = 'Galleon';"
    },
    starterCode: "SELECT ",
    referenceQuery: "SELECT name FROM ships WHERE type = 'Galleon';",
    hints: ["Filter the rows using WHERE type = 'Galleon'.", "Select only the 'name' column."],
    rewards: {
      xp: 100,
      coins: 20
    },
    nextChallengeId: "merchant_00"
  },

  {
    id: "merchant_00",
    title: "The Missing Traders",
    chapter: 2,
    islandId: "merchant_isles",
    npcId: "quincy",
    story: "Retrieve all columns from employees where the salary is greater than 50000.",
    description: "Retrieve all columns from employees where the salary is greater than 50000.",
    difficulty: "Medium",
    validation: {
      type: 'CONTAINS',
      expected: "WHERE salary > 50000"
    },
    starterCode: "SELECT * FROM employees\nWHERE ",
    referenceQuery: "SELECT * FROM employees WHERE salary > 50000;",
    hints: ["Use the WHERE clause to filter rows.", "The comparison operator for greater than is '>'. Check against 50000 without commas."],
    rewards: {
      xp: 150,
      coins: 45,
      gems: 5
    },
    nextChallengeId: "merchant_02"
  },

  {
    id: "merchant_02",
    title: "Expensive Cargo",
    chapter: 2,
    islandId: "merchant_isles",
    npcId: "quincy",
    story: "Quincy suspects tax evasion on high-value vessels. Identify the name and price of ships valued over 30,000 gold.\n\nObjective: Retrieve the name and price of ships where price is greater than 30000.",
    description: "Quincy suspects tax evasion on high-value vessels. Identify the name and price of ships valued over 30,000 gold.\n\nObjective: Retrieve the name and price of ships where price is greater than 30000.",
    difficulty: "Easy",
    validation: {
      type: 'EXACT',
      expected: "SELECT name, price FROM ships WHERE price > 30000;"
    },
    starterCode: "SELECT ",
    referenceQuery: "SELECT name, price FROM ships WHERE price > 30000;",
    hints: ["Use WHERE price > 30000 to filter by price.", "Select both 'name' and 'price' columns."],
    rewards: {
      xp: 110,
      coins: 25,
      gems: 1,
      badge: "Master Merchant"
    },
    nextChallengeId: "merchant_03"
  },

  {
    id: "merchant_03",
    title: "Contraband Check",
    chapter: 2,
    islandId: "merchant_isles",
    npcId: "quincy",
    story: "A tip-off indicates a ship in the harbor is secretly holding illegal goods. List all details of ships marked with 'contraband' status.\n\nObjective: Select all columns from the ships table where status is 'contraband'.",
    description: "A tip-off indicates a ship in the harbor is secretly holding illegal goods. List all details of ships marked with 'contraband' status.\n\nObjective: Select all columns from the ships table where status is 'contraband'.",
    difficulty: "Easy",
    validation: {
      type: 'EXACT',
      expected: "SELECT * FROM ships WHERE status = 'contraband';"
    },
    starterCode: "SELECT ",
    referenceQuery: "SELECT * FROM ships WHERE status = 'contraband';",
    hints: ["Use SELECT * to retrieve all columns.", "Filter using status = 'contraband'."],
    rewards: {
      xp: 120,
      coins: 30
    },
    nextChallengeId: "merchant_04"
  },

  {
    id: "merchant_04",
    title: "Abandoned Sloops",
    chapter: 2,
    islandId: "merchant_isles",
    npcId: "quincy",
    story: "The port authority wants to claim and reuse abandoned sloops left in the harbor. Find their names and status where price is zero.\n\nObjective: Select name and status from ships where price is 0.",
    description: "The port authority wants to claim and reuse abandoned sloops left in the harbor. Find their names and status where price is zero.\n\nObjective: Select name and status from ships where price is 0.",
    difficulty: "Easy",
    validation: {
      type: 'EXACT',
      expected: "SELECT name, status FROM ships WHERE price = 0;"
    },
    starterCode: "SELECT ",
    referenceQuery: "SELECT name, status FROM ships WHERE price = 0;",
    hints: ["Filter using price = 0.", "Make sure to output 'name' and 'status' columns."],
    rewards: {
      xp: 130,
      coins: 35,
      gems: 2
    },
    nextChallengeId: "merchant_05"
  },

  {
    id: "merchant_05",
    title: "High-Earners Crew",
    chapter: 2,
    islandId: "merchant_isles",
    npcId: "quincy",
    story: "To prevent bribery, the captain needs to audit the crew members who make a high salary.\n\nObjective: Select the name of employees where salary is greater than 60000.",
    description: "To prevent bribery, the captain needs to audit the crew members who make a high salary.\n\nObjective: Select the name of employees where salary is greater than 60000.",
    difficulty: "Easy",
    validation: {
      type: 'EXACT',
      expected: "SELECT name FROM employees WHERE salary > 60000;"
    },
    starterCode: "SELECT ",
    referenceQuery: "SELECT name FROM employees WHERE salary > 60000;",
    hints: ["Query the employees table.", "Use WHERE salary > 60000."],
    rewards: {
      xp: 140,
      coins: 40,
      gems: 1
    },
    nextChallengeId: "merchant_06"
  },

  {
    id: "merchant_06",
    title: "Quarterdeck Officers",
    chapter: 2,
    islandId: "merchant_isles",
    npcId: "quincy",
    story: "Identify all employees assigned to the Command & Navigation department (department_id = 1).\n\nObjective: Select name and role from employees where department_id is 1.",
    description: "Identify all employees assigned to the Command & Navigation department (department_id = 1).\n\nObjective: Select name and role from employees where department_id is 1.",
    difficulty: "Easy",
    validation: {
      type: 'EXACT',
      expected: "SELECT name, role FROM employees WHERE department_id = 1;"
    },
    starterCode: "SELECT ",
    referenceQuery: "SELECT name, role FROM employees WHERE department_id = 1;",
    hints: ["Filter by department_id = 1.", "Select name and role columns."],
    rewards: {
      xp: 100,
      coins: 20
    },
    nextChallengeId: "merchant_07"
  },

  {
    id: "merchant_07",
    title: "The Smuggler Station",
    chapter: 2,
    islandId: "merchant_isles",
    npcId: "quincy",
    story: "Some employees were assigned to work at Smuggler's Cove. Find their names.\n\nObjective: Select the name of employees where island is 'Smuggler Cove'.",
    description: "Some employees were assigned to work at Smuggler's Cove. Find their names.\n\nObjective: Select the name of employees where island is 'Smuggler Cove'.",
    difficulty: "Easy",
    validation: {
      type: 'EXACT',
      expected: "SELECT name FROM employees WHERE island = 'Smuggler Cove';"
    },
    starterCode: "SELECT ",
    referenceQuery: "SELECT name FROM employees WHERE island = 'Smuggler Cove';",
    hints: ["Check the spelling of the island name: 'Smuggler Cove'.", "Query the employees table."],
    rewards: {
      xp: 110,
      coins: 25,
      gems: 1
    },
    nextChallengeId: "merchant_08"
  },

  {
    id: "merchant_08",
    title: "Master Gunners",
    chapter: 2,
    islandId: "merchant_isles",
    npcId: "quincy",
    story: "Find all cannons experts aboard. Query employees acting as Master Gunners.\n\nObjective: Select the name and salary of employees where role is 'Master Gunner'.",
    description: "Find all cannons experts aboard. Query employees acting as Master Gunners.\n\nObjective: Select the name and salary of employees where role is 'Master Gunner'.",
    difficulty: "Easy",
    validation: {
      type: 'EXACT',
      expected: "SELECT name, salary FROM employees WHERE role = 'Master Gunner';"
    },
    starterCode: "SELECT ",
    referenceQuery: "SELECT name, salary FROM employees WHERE role = 'Master Gunner';",
    hints: ["Filter using role = 'Master Gunner'.", "Retrieve the name and salary columns."],
    rewards: {
      xp: 120,
      coins: 30
    },
    nextChallengeId: "merchant_09"
  },

  {
    id: "merchant_09",
    title: "Active Registers",
    chapter: 2,
    islandId: "merchant_isles",
    npcId: "quincy",
    story: "Only active ships are allowed to leave port. Fetch the names, types, and prices of active ships.\n\nObjective: Select name, type, and price from ships where status is 'active'.",
    description: "Only active ships are allowed to leave port. Fetch the names, types, and prices of active ships.\n\nObjective: Select name, type, and price from ships where status is 'active'.",
    difficulty: "Easy",
    validation: {
      type: 'EXACT',
      expected: "SELECT name, type, price FROM ships WHERE status = 'active';"
    },
    starterCode: "SELECT ",
    referenceQuery: "SELECT name, type, price FROM ships WHERE status = 'active';",
    hints: ["Use status = 'active'.", "Select name, type, and price columns."],
    rewards: {
      xp: 130,
      coins: 35,
      gems: 1
    },
    nextChallengeId: "merchant_10"
  },

  {
    id: "merchant_10",
    title: "Gun Deck Crew",
    chapter: 2,
    islandId: "merchant_isles",
    npcId: "quincy",
    story: "Audit the Gun Deck officers' payroll by listing details for department 2.\n\nObjective: Select name and salary from employees where department_id is 2.",
    description: "Audit the Gun Deck officers' payroll by listing details for department 2.\n\nObjective: Select name and salary from employees where department_id is 2.",
    difficulty: "Easy",
    validation: {
      type: 'EXACT',
      expected: "SELECT name, salary FROM employees WHERE department_id = 2;"
    },
    starterCode: "SELECT ",
    referenceQuery: "SELECT name, salary FROM employees WHERE department_id = 2;",
    hints: ["Use WHERE department_id = 2.", "Select name and salary."],
    rewards: {
      xp: 140,
      coins: 40,
      gems: 2
    },
    nextChallengeId: "merchant_11"
  },

  {
    id: "merchant_11",
    title: "Active Galleons",
    chapter: 2,
    islandId: "merchant_isles",
    npcId: "quincy",
    story: "Quincy wants to inspect active galleons. Filter ships for both conditions.\n\nObjective: Select name and price from ships where type is 'Galleon' and status is 'active'.",
    description: "Quincy wants to inspect active galleons. Filter ships for both conditions.\n\nObjective: Select name and price from ships where type is 'Galleon' and status is 'active'.",
    difficulty: "Medium",
    validation: {
      type: 'EXACT',
      expected: "SELECT name, price FROM ships WHERE type = 'Galleon' AND status = 'active';"
    },
    starterCode: "SELECT ",
    referenceQuery: "SELECT name, price FROM ships WHERE type = 'Galleon' AND status = 'active';",
    hints: ["Combine conditions using the AND keyword.", "Verify spelling of 'Galleon' and 'active'."],
    rewards: {
      xp: 180,
      coins: 45,
      gems: 3
    },
    nextChallengeId: "merchant_12"
  },

  {
    id: "merchant_12",
    title: "Cargo Pricing Order",
    chapter: 2,
    islandId: "merchant_isles",
    npcId: "quincy",
    story: "Sort all commercial ships by price to find the cheapest options.\n\nObjective: Select name, type, and price from ships where price greater than 10000 sorted by price in ascending order.",
    description: "Sort all commercial ships by price to find the cheapest options.\n\nObjective: Select name, type, and price from ships where price greater than 10000 sorted by price in ascending order.",
    difficulty: "Medium",
    validation: {
      type: 'EXACT',
      expected: "SELECT name, type, price FROM ships WHERE price > 10000 ORDER BY price ASC;"
    },
    starterCode: "SELECT ",
    referenceQuery: "SELECT name, type, price FROM ships WHERE price > 10000 ORDER BY price ASC;",
    hints: ["Use ORDER BY price ASC at the end of the query.", "Filter using price > 10000 first."],
    rewards: {
      xp: 190,
      coins: 50,
      gems: 2
    },
    nextChallengeId: "merchant_13"
  },

  {
    id: "merchant_13",
    title: "Fleet Value Check",
    chapter: 2,
    islandId: "merchant_isles",
    npcId: "quincy",
    story: "Compare galleons and sloops. Find their names and prices ordered by value.\n\nObjective: Select name and price from ships where type is 'Galleon' or type is 'Sloop' ordered by price in descending order.",
    description: "Compare galleons and sloops. Find their names and prices ordered by value.\n\nObjective: Select name and price from ships where type is 'Galleon' or type is 'Sloop' ordered by price in descending order.",
    difficulty: "Medium",
    validation: {
      type: 'EXACT',
      expected: "SELECT name, price FROM ships WHERE type = 'Galleon' OR type = 'Sloop' ORDER BY price DESC;"
    },
    starterCode: "SELECT ",
    referenceQuery: "SELECT name, price FROM ships WHERE type = 'Galleon' OR type = 'Sloop' ORDER BY price DESC;",
    hints: ["Use OR to combine type checks. Use ORDER BY price DESC.", "Select name and price columns only."],
    rewards: {
      xp: 200,
      coins: 55,
      gems: 3
    },
    nextChallengeId: "merchant_14"
  },

  {
    id: "merchant_14",
    title: "Middle-Tier Pay",
    chapter: 2,
    islandId: "merchant_isles",
    npcId: "quincy",
    story: "Identify mid-level crew salaries for tax brackets.\n\nObjective: Select name and salary from employees where salary is between 50000 and 80000.",
    description: "Identify mid-level crew salaries for tax brackets.\n\nObjective: Select name and salary from employees where salary is between 50000 and 80000.",
    difficulty: "Medium",
    validation: {
      type: 'EXACT',
      expected: "SELECT name, salary FROM employees WHERE salary >= 50000 AND salary <= 80000;"
    },
    starterCode: "SELECT ",
    referenceQuery: "SELECT name, salary FROM employees WHERE salary >= 50000 AND salary <= 80000;",
    hints: ["Use >= 50000 AND <= 80000 to construct the range filter.", "Query the employees table."],
    rewards: {
      xp: 210,
      coins: 60,
      gems: 4
    },
    nextChallengeId: "merchant_15"
  },

  {
    id: "merchant_15",
    title: "Logistics Officers",
    chapter: 2,
    islandId: "merchant_isles",
    npcId: "quincy",
    story: "Sort officers in the logistics department (department_id = 3) by income.\n\nObjective: Select name and role from employees where department_id is 3 ordered by salary in descending order.",
    description: "Sort officers in the logistics department (department_id = 3) by income.\n\nObjective: Select name and role from employees where department_id is 3 ordered by salary in descending order.",
    difficulty: "Medium",
    validation: {
      type: 'EXACT',
      expected: "SELECT name, role FROM employees WHERE department_id = 3 ORDER BY salary DESC;"
    },
    starterCode: "SELECT ",
    referenceQuery: "SELECT name, role FROM employees WHERE department_id = 3 ORDER BY salary DESC;",
    hints: ["Filter by department_id = 3 first, then ORDER BY salary DESC.", "Only select name and role columns."],
    rewards: {
      xp: 220,
      coins: 65,
      gems: 2
    },
    nextChallengeId: "merchant_16"
  },

  {
    id: "merchant_16",
    title: "Suspicious Vessels",
    chapter: 2,
    islandId: "merchant_isles",
    npcId: "quincy",
    story: "Audit either contraband ships or highly-priced ships that look suspicious.\n\nObjective: Select name and type from ships where status is 'contraband' or price is greater than 40000.",
    description: "Audit either contraband ships or highly-priced ships that look suspicious.\n\nObjective: Select name and type from ships where status is 'contraband' or price is greater than 40000.",
    difficulty: "Medium",
    validation: {
      type: 'EXACT',
      expected: "SELECT name, type FROM ships WHERE status = 'contraband' OR price > 40000;"
    },
    starterCode: "SELECT ",
    referenceQuery: "SELECT name, type FROM ships WHERE status = 'contraband' OR price > 40000;",
    hints: ["Use status = 'contraband' OR price > 40000.", "Select name and type columns."],
    rewards: {
      xp: 230,
      coins: 70,
      gems: 5
    },
    nextChallengeId: "merchant_17"
  },

  {
    id: "merchant_17",
    title: "Harbor Patrol Wages",
    chapter: 2,
    islandId: "merchant_isles",
    npcId: "quincy",
    story: "Query employees stationed at Tutorial Harbor earning decent wages.\n\nObjective: Select the name of employees where island is 'Tutorial Harbor' and salary is greater than 50000.",
    description: "Query employees stationed at Tutorial Harbor earning decent wages.\n\nObjective: Select the name of employees where island is 'Tutorial Harbor' and salary is greater than 50000.",
    difficulty: "Medium",
    validation: {
      type: 'EXACT',
      expected: "SELECT name FROM employees WHERE island = 'Tutorial Harbor' AND salary > 50000;"
    },
    starterCode: "SELECT ",
    referenceQuery: "SELECT name FROM employees WHERE island = 'Tutorial Harbor' AND salary > 50000;",
    hints: ["Filter using island = 'Tutorial Harbor' AND salary > 50000.", "Retrieve only the name column."],
    rewards: {
      xp: 240,
      coins: 50,
      gems: 3
    },
    nextChallengeId: "merchant_18"
  },

  {
    id: "merchant_18",
    title: "Alphabetical Fleet",
    chapter: 2,
    islandId: "merchant_isles",
    npcId: "quincy",
    story: "Sort all commercial vessels alphabetically to print a directory map.\n\nObjective: Select all columns from ships where price is greater than 0 ordered by name in ascending order.",
    description: "Sort all commercial vessels alphabetically to print a directory map.\n\nObjective: Select all columns from ships where price is greater than 0 ordered by name in ascending order.",
    difficulty: "Medium",
    validation: {
      type: 'EXACT',
      expected: "SELECT * FROM ships WHERE price > 0 ORDER BY name ASC;"
    },
    starterCode: "SELECT ",
    referenceQuery: "SELECT * FROM ships WHERE price > 0 ORDER BY name ASC;",
    hints: ["Use WHERE price > 0.", "Use ORDER BY name ASC at the end."],
    rewards: {
      xp: 250,
      coins: 60,
      gems: 2
    },
    nextChallengeId: "merchant_19"
  },

  {
    id: "merchant_19",
    title: "The Premium Fleet",
    chapter: 2,
    islandId: "merchant_isles",
    npcId: "quincy",
    story: "The Admiral wants to buy two high-value active or contraband ships.\n\nObjective: Select name and price from ships where status is active or contraband, price is greater than 30000, sorted by price descending, limit to 2.",
    description: "The Admiral wants to buy two high-value active or contraband ships.\n\nObjective: Select name and price from ships where status is active or contraband, price is greater than 30000, sorted by price descending, limit to 2.",
    difficulty: "Hard",
    validation: {
      type: 'EXACT',
      expected: "SELECT name, price FROM ships WHERE (status = 'active' OR status = 'contraband') AND price > 30000 ORDER BY price DESC LIMIT 2;"
    },
    starterCode: "",
    referenceQuery: "SELECT name, price FROM ships WHERE (status = 'active' OR status = 'contraband') AND price > 30000 ORDER BY price DESC LIMIT 2;",
    hints: ["Remember to use parentheses for the OR condition: (status = 'active' OR status = 'contraband').", "Append LIMIT 2 at the end of the query."],
    rewards: {
      xp: 300,
      coins: 80,
      gems: 5
    },
    nextChallengeId: "merchant_20"
  },

  {
    id: "merchant_20",
    title: "The Elite Defenders",
    chapter: 2,
    islandId: "merchant_isles",
    npcId: "quincy",
    story: "Find the top three lowest-paid commanding or defense officers who earn over 60k.\n\nObjective: Select name and salary from employees where department_id is 1 or 2, salary is greater than 60000, sorted by salary ascending, limit to 3.",
    description: "Find the top three lowest-paid commanding or defense officers who earn over 60k.\n\nObjective: Select name and salary from employees where department_id is 1 or 2, salary is greater than 60000, sorted by salary ascending, limit to 3.",
    difficulty: "Hard",
    validation: {
      type: 'EXACT',
      expected: "SELECT name, salary FROM employees WHERE (department_id = 1 OR department_id = 2) AND salary > 60000 ORDER BY salary ASC LIMIT 3;"
    },
    starterCode: "",
    referenceQuery: "SELECT name, salary FROM employees WHERE (department_id = 1 OR department_id = 2) AND salary > 60000 ORDER BY salary ASC LIMIT 3;",
    hints: ["Filter using (department_id = 1 OR department_id = 2) and salary > 60000.", "Use ORDER BY salary ASC LIMIT 3."],
    rewards: {
      xp: 320,
      coins: 90,
      gems: 6
    },
    nextChallengeId: "merchant_21"
  },

  {
    id: "merchant_21",
    title: "Top Smuggler Target",
    chapter: 2,
    islandId: "merchant_isles",
    npcId: "quincy",
    story: "Find the single most expensive contraband ship to plan a harbor raid.\n\nObjective: Select name, type, and price from ships where status is contraband, price is greater than 10000, sorted by price descending, limit to 1.",
    description: "Find the single most expensive contraband ship to plan a harbor raid.\n\nObjective: Select name, type, and price from ships where status is contraband, price is greater than 10000, sorted by price descending, limit to 1.",
    difficulty: "Hard",
    validation: {
      type: 'EXACT',
      expected: "SELECT name, type, price FROM ships WHERE status = 'contraband' AND price > 10000 ORDER BY price DESC LIMIT 1;"
    },
    starterCode: "",
    referenceQuery: "SELECT name, type, price FROM ships WHERE status = 'contraband' AND price > 10000 ORDER BY price DESC LIMIT 1;",
    hints: ["Order by price DESC and append LIMIT 1.", "Use status = 'contraband' and price > 10000."],
    rewards: {
      xp: 350,
      coins: 100,
      gems: 7
    },
    nextChallengeId: "merchant_22"
  },

  {
    id: "merchant_22",
    title: "Strategic Plunder Crew",
    chapter: 2,
    islandId: "merchant_isles",
    npcId: "quincy",
    story: "Get 5 highest-paid crew members stationed at Smuggler Cove or Tutorial Harbor earning over 45k.\n\nObjective: Select name, role, and salary from employees where salary is greater than 45000 and island is Smuggler Cove or Tutorial Harbor, ordered by salary descending, limit to 5.",
    description: "Get 5 highest-paid crew members stationed at Smuggler Cove or Tutorial Harbor earning over 45k.\n\nObjective: Select name, role, and salary from employees where salary is greater than 45000 and island is Smuggler Cove or Tutorial Harbor, ordered by salary descending, limit to 5.",
    difficulty: "Hard",
    validation: {
      type: 'EXACT',
      expected: "SELECT name, role, salary FROM employees WHERE salary > 45000 AND (island = 'Smuggler Cove' OR island = 'Tutorial Harbor') ORDER BY salary DESC LIMIT 5;"
    },
    starterCode: "",
    referenceQuery: "SELECT name, role, salary FROM employees WHERE salary > 45000 AND (island = 'Smuggler Cove' OR island = 'Tutorial Harbor') ORDER BY salary DESC LIMIT 5;",
    hints: ["Use AND (island = 'Smuggler Cove' OR island = 'Tutorial Harbor').", "Order by salary DESC and limit to 5."],
    rewards: {
      xp: 380,
      coins: 110,
      gems: 8
    },
    nextChallengeId: "merchant_23"
  },

  {
    id: "merchant_23",
    title: "Commercial Bargains",
    chapter: 2,
    islandId: "merchant_isles",
    npcId: "quincy",
    story: "Find two cheapest active ships in the middle price bracket.\n\nObjective: Select name from ships where price is greater than 20000 and less than 80000 and status is active, ordered by price ascending, limit to 2.",
    description: "Find two cheapest active ships in the middle price bracket.\n\nObjective: Select name from ships where price is greater than 20000 and less than 80000 and status is active, ordered by price ascending, limit to 2.",
    difficulty: "Hard",
    validation: {
      type: 'EXACT',
      expected: "SELECT name FROM ships WHERE price > 20000 AND price < 80000 AND status = 'active' ORDER BY price ASC LIMIT 2;"
    },
    starterCode: "",
    referenceQuery: "SELECT name FROM ships WHERE price > 20000 AND price < 80000 AND status = 'active' ORDER BY price ASC LIMIT 2;",
    hints: ["Use price > 20000 AND price < 80000 AND status = 'active'.", "ORDER BY price ASC LIMIT 2."],
    rewards: {
      xp: 400,
      coins: 120,
      gems: 9
    },
    nextChallengeId: "merchant_24"
  },

  {
    id: "merchant_24",
    title: "High-Value Officers",
    chapter: 2,
    islandId: "merchant_isles",
    npcId: "quincy",
    story: "List the top 3 highest-ranking command roles (Navigator, Tactician, Fleet Admiral) earning over 50k, sorted alphabetically.\n\nObjective: Select name, role from employees where role is Navigator, Tactician, or Fleet Admiral, and salary is greater than 50000, ordered by name descending, limit to 3.",
    description: "List the top 3 highest-ranking command roles (Navigator, Tactician, Fleet Admiral) earning over 50k, sorted alphabetically.\n\nObjective: Select name, role from employees where role is Navigator, Tactician, or Fleet Admiral, and salary is greater than 50000, ordered by name descending, limit to 3.",
    difficulty: "Hard",
    validation: {
      type: 'EXACT',
      expected: "SELECT name, role FROM employees WHERE (role = 'Navigator' OR role = 'Tactician' OR role = 'Fleet Admiral') AND salary > 50000 ORDER BY name DESC LIMIT 3;"
    },
    starterCode: "",
    referenceQuery: "SELECT name, role FROM employees WHERE (role = 'Navigator' OR role = 'Tactician' OR role = 'Fleet Admiral') AND salary > 50000 ORDER BY name DESC LIMIT 3;",
    hints: ["Filter using OR for roles: (role = 'Navigator' OR role = 'Tactician' OR role = 'Fleet Admiral').", "Order by name DESC and limit to 3."],
    rewards: {
      xp: 450,
      coins: 130,
      gems: 8
    },
    nextChallengeId: "merchant_25"
  },

  {
    id: "merchant_25",
    title: "The Merchant Sovereign",
    chapter: 2,
    islandId: "merchant_isles",
    npcId: "quincy",
    story: "The merchant guild needs a list of the top 3 most valuable active or highly-priced ships to establish their flagship fleet.\n\nObjective: Select all details of ships where status is active or price is at least 20000, ordered by price descending, limit to 3.",
    description: "The merchant guild needs a list of the top 3 most valuable active or highly-priced ships to establish their flagship fleet.\n\nObjective: Select all details of ships where status is active or price is at least 20000, ordered by price descending, limit to 3.",
    difficulty: "Hard",
    validation: {
      type: 'EXACT',
      expected: "SELECT * FROM ships WHERE status = 'active' OR price >= 20000 ORDER BY price DESC LIMIT 3;"
    },
    starterCode: "",
    referenceQuery: "SELECT * FROM ships WHERE status = 'active' OR price >= 20000 ORDER BY price DESC LIMIT 3;",
    hints: ["Filter using status = 'active' OR price >= 20000.", "ORDER BY price DESC LIMIT 3."],
    rewards: {
      xp: 500,
      coins: 150,
      gems: 10,
      badge: "Merchant Sovereign"
    },
    nextChallengeId: null
  },

  {
    id: "smugglers_01",
    title: "Unique Vessel Types",
    chapter: 3,
    islandId: "smugglers_cove",
    npcId: "admiral_morgan",
    story: "Admiral Morgan wants to know the distinct categories of vessels docked in the Cove to assess their speeds.\n\nObjective: Select distinct type from ships.",
    description: "Admiral Morgan wants to know the distinct categories of vessels docked in the Cove to assess their speeds.\n\nObjective: Select distinct type from ships.",
    difficulty: "Easy",
    validation: {
      type: 'EXACT',
      expected: "SELECT DISTINCT type FROM ships;"
    },
    starterCode: "SELECT ",
    referenceQuery: "SELECT DISTINCT type FROM ships;",
    hints: ["Use the DISTINCT keyword before the column name.", "Query the type column from the ships table."],
    rewards: {
      xp: 100,
      coins: 20
    },
    nextChallengeId: "smugglers_02"
  },

  {
    id: "smugglers_02",
    title: "Unique Ship Statuses",
    chapter: 3,
    islandId: "smugglers_cove",
    npcId: "admiral_morgan",
    story: "Identify all distinct statuses ships can have to filter out inactive vessels.\n\nObjective: Select distinct status from ships.",
    description: "Identify all distinct statuses ships can have to filter out inactive vessels.\n\nObjective: Select distinct status from ships.",
    difficulty: "Easy",
    validation: {
      type: 'EXACT',
      expected: "SELECT DISTINCT status FROM ships;"
    },
    starterCode: "SELECT ",
    referenceQuery: "SELECT DISTINCT status FROM ships;",
    hints: ["Use SELECT DISTINCT status.", "Query the ships table."],
    rewards: {
      xp: 110,
      coins: 25,
      gems: 1
    },
    nextChallengeId: "smugglers_03"
  },

  {
    id: "smugglers_03",
    title: "Cove Ledger Alias",
    chapter: 3,
    islandId: "smugglers_cove",
    npcId: "admiral_morgan",
    story: "Clean up the ledger output by aliasing columns for the harbor guards.\n\nObjective: Select name as vessel_name, price as cost from ships.",
    description: "Clean up the ledger output by aliasing columns for the harbor guards.\n\nObjective: Select name as vessel_name, price as cost from ships.",
    difficulty: "Easy",
    validation: {
      type: 'EXACT',
      expected: "SELECT name AS vessel_name, price AS cost FROM ships;"
    },
    starterCode: "SELECT ",
    referenceQuery: "SELECT name AS vessel_name, price AS cost FROM ships;",
    hints: ["Use the AS keyword to rename columns: name AS vessel_name.", "Alias price to cost."],
    rewards: {
      xp: 120,
      coins: 30,
      item: "admiral_hat",
      badge: "Savior of the Seas"
    },
    nextChallengeId: "smugglers_04"
  },

  {
    id: "smugglers_04",
    title: "Warrant Shouting",
    chapter: 3,
    islandId: "smugglers_cove",
    npcId: "admiral_morgan",
    story: "The Navy warrants require all employee suspect names to be printed in uppercase.\n\nObjective: Select UPPER(name) from employees.",
    description: "The Navy warrants require all employee suspect names to be printed in uppercase.\n\nObjective: Select UPPER(name) from employees.",
    difficulty: "Easy",
    validation: {
      type: 'EXACT',
      expected: "SELECT UPPER(name) FROM employees;"
    },
    starterCode: "SELECT ",
    referenceQuery: "SELECT UPPER(name) FROM employees;",
    hints: ["Use the UPPER() function around the name column.", "Query the employees table."],
    rewards: {
      xp: 130,
      coins: 35,
      gems: 2
    },
    nextChallengeId: "smugglers_05"
  },

  {
    id: "smugglers_05",
    title: "Lower-Case Roles",
    chapter: 3,
    islandId: "smugglers_cove",
    npcId: "admiral_morgan",
    story: "Format all employee roles in lowercase for the ship's log indexing system.\n\nObjective: Select LOWER(role) from employees.",
    description: "Format all employee roles in lowercase for the ship's log indexing system.\n\nObjective: Select LOWER(role) from employees.",
    difficulty: "Easy",
    validation: {
      type: 'EXACT',
      expected: "SELECT LOWER(role) FROM employees;"
    },
    starterCode: "SELECT ",
    referenceQuery: "SELECT LOWER(role) FROM employees;",
    hints: ["Use LOWER(role) to format values.", "Query the employees table."],
    rewards: {
      xp: 140,
      coins: 40,
      gems: 1
    },
    nextChallengeId: "smugglers_06"
  },

  {
    id: "smugglers_06",
    title: "Gem Registry",
    chapter: 3,
    islandId: "smugglers_cove",
    npcId: "admiral_morgan",
    story: "Find all distinct types of gems mined in the Crystal Caverns.\n\nObjective: Select distinct gem_type from gems.",
    description: "Find all distinct types of gems mined in the Crystal Caverns.\n\nObjective: Select distinct gem_type from gems.",
    difficulty: "Easy",
    validation: {
      type: 'EXACT',
      expected: "SELECT DISTINCT gem_type FROM gems;"
    },
    starterCode: "SELECT ",
    referenceQuery: "SELECT DISTINCT gem_type FROM gems;",
    hints: ["Query the gems table.", "Use DISTINCT gem_type."],
    rewards: {
      xp: 100,
      coins: 20
    },
    nextChallengeId: "smugglers_07"
  },

  {
    id: "smugglers_07",
    title: "Artifact Valuation",
    chapter: 3,
    islandId: "smugglers_cove",
    npcId: "admiral_morgan",
    story: "Rename the artifact name column to relic_name to differentiate it from ship names.\n\nObjective: Select name as relic_name, danger_level from artifacts.",
    description: "Rename the artifact name column to relic_name to differentiate it from ship names.\n\nObjective: Select name as relic_name, danger_level from artifacts.",
    difficulty: "Easy",
    validation: {
      type: 'EXACT',
      expected: "SELECT name AS relic_name, danger_level FROM artifacts;"
    },
    starterCode: "SELECT ",
    referenceQuery: "SELECT name AS relic_name, danger_level FROM artifacts;",
    hints: ["Alias name as relic_name.", "Query the artifacts table."],
    rewards: {
      xp: 110,
      coins: 25,
      gems: 1
    },
    nextChallengeId: "smugglers_08"
  },

  {
    id: "smugglers_08",
    title: "Active Miners",
    chapter: 3,
    islandId: "smugglers_cove",
    npcId: "admiral_morgan",
    story: "Find the unique names of miners who have registered gem deposits.\n\nObjective: Select distinct miner_name from gems.",
    description: "Find the unique names of miners who have registered gem deposits.\n\nObjective: Select distinct miner_name from gems.",
    difficulty: "Easy",
    validation: {
      type: 'EXACT',
      expected: "SELECT DISTINCT miner_name FROM gems;"
    },
    starterCode: "SELECT ",
    referenceQuery: "SELECT DISTINCT miner_name FROM gems;",
    hints: ["Use SELECT DISTINCT miner_name.", "Query the gems table."],
    rewards: {
      xp: 120,
      coins: 30
    },
    nextChallengeId: "smugglers_09"
  },

  {
    id: "smugglers_09",
    title: "Measuring Ship Signatures",
    chapter: 3,
    islandId: "smugglers_cove",
    npcId: "admiral_morgan",
    story: "Decryption patterns require checking the character lengths of ship names.\n\nObjective: Select name, LENGTH(name) as name_length from ships.",
    description: "Decryption patterns require checking the character lengths of ship names.\n\nObjective: Select name, LENGTH(name) as name_length from ships.",
    difficulty: "Medium",
    validation: {
      type: 'EXACT',
      expected: "SELECT name, LENGTH(name) AS name_length FROM ships;"
    },
    starterCode: "SELECT ",
    referenceQuery: "SELECT name, LENGTH(name) AS name_length FROM ships;",
    hints: ["Use LENGTH(name) AS name_length to count the characters.", "Query the ships table."],
    rewards: {
      xp: 180,
      coins: 45,
      gems: 3
    },
    nextChallengeId: "smugglers_10"
  },

  {
    id: "smugglers_10",
    title: "Officer Signature Length",
    chapter: 3,
    islandId: "smugglers_cove",
    npcId: "admiral_morgan",
    story: "Calculate the length of roles for high-earning crew members to generate passcodes.\n\nObjective: Select name, LENGTH(role) as role_length from employees where salary is greater than 50000.",
    description: "Calculate the length of roles for high-earning crew members to generate passcodes.\n\nObjective: Select name, LENGTH(role) as role_length from employees where salary is greater than 50000.",
    difficulty: "Medium",
    validation: {
      type: 'EXACT',
      expected: "SELECT name, LENGTH(role) AS role_length FROM employees WHERE salary > 50000;"
    },
    starterCode: "SELECT ",
    referenceQuery: "SELECT name, LENGTH(role) AS role_length FROM employees WHERE salary > 50000;",
    hints: ["Use LENGTH(role) AS role_length and filter with salary > 50000.", "Query the employees table."],
    rewards: {
      xp: 190,
      coins: 50,
      gems: 2
    },
    nextChallengeId: "smugglers_11"
  },

  {
    id: "smugglers_11",
    title: "Upper-Case Cove Officers",
    chapter: 3,
    islandId: "smugglers_cove",
    npcId: "admiral_morgan",
    story: "Uppercase the names of officers located at Smuggler Cove to prepare official warrants.\n\nObjective: Select UPPER(name) as upper_name, role from employees where island is 'Smuggler Cove'.",
    description: "Uppercase the names of officers located at Smuggler Cove to prepare official warrants.\n\nObjective: Select UPPER(name) as upper_name, role from employees where island is 'Smuggler Cove'.",
    difficulty: "Medium",
    validation: {
      type: 'EXACT',
      expected: "SELECT UPPER(name) AS upper_name, role FROM employees WHERE island = 'Smuggler Cove';"
    },
    starterCode: "SELECT ",
    referenceQuery: "SELECT UPPER(name) AS upper_name, role FROM employees WHERE island = 'Smuggler Cove';",
    hints: ["Use UPPER(name) AS upper_name.", "Filter using island = 'Smuggler Cove'."],
    rewards: {
      xp: 200,
      coins: 55,
      gems: 3
    },
    nextChallengeId: "smugglers_12"
  },

  {
    id: "smugglers_12",
    title: "Gem Sorting Registry",
    chapter: 3,
    islandId: "smugglers_cove",
    npcId: "admiral_morgan",
    story: "Find all unique gem types sorted alphabetically to print catalog labels.\n\nObjective: Select distinct gem_type from gems ordered by gem_type ascending.",
    description: "Find all unique gem types sorted alphabetically to print catalog labels.\n\nObjective: Select distinct gem_type from gems ordered by gem_type ascending.",
    difficulty: "Medium",
    validation: {
      type: 'EXACT',
      expected: "SELECT DISTINCT gem_type FROM gems ORDER BY gem_type ASC;"
    },
    starterCode: "SELECT ",
    referenceQuery: "SELECT DISTINCT gem_type FROM gems ORDER BY gem_type ASC;",
    hints: ["Combine DISTINCT with ORDER BY.", "Query the gems table."],
    rewards: {
      xp: 210,
      coins: 60,
      gems: 4
    },
    nextChallengeId: "smugglers_13"
  },

  {
    id: "smugglers_13",
    title: "Pricing in Thousands",
    chapter: 3,
    islandId: "smugglers_cove",
    npcId: "admiral_morgan",
    story: "Convert ship prices to thousands and round them to 1 decimal place.\n\nObjective: Select name, ROUND(price / 1000.0, 1) as price_in_k from ships.",
    description: "Convert ship prices to thousands and round them to 1 decimal place.\n\nObjective: Select name, ROUND(price / 1000.0, 1) as price_in_k from ships.",
    difficulty: "Medium",
    validation: {
      type: 'EXACT',
      expected: "SELECT name, ROUND(price / 1000.0, 1) AS price_in_k FROM ships;"
    },
    starterCode: "SELECT ",
    referenceQuery: "SELECT name, ROUND(price / 1000.0, 1) AS price_in_k FROM ships;",
    hints: ["Use ROUND(price / 1000.0, 1).", "Alias the output as price_in_k."],
    rewards: {
      xp: 220,
      coins: 65,
      gems: 2
    },
    nextChallengeId: "smugglers_14"
  },

  {
    id: "smugglers_14",
    title: "Crew Description Concatenation",
    chapter: 3,
    islandId: "smugglers_cove",
    npcId: "admiral_morgan",
    story: "Concatenate names and roles into a single sentence description for ID badges.\n\nObjective: Select name || ' the ' || role as crew_description from employees.",
    description: "Concatenate names and roles into a single sentence description for ID badges.\n\nObjective: Select name || ' the ' || role as crew_description from employees.",
    difficulty: "Medium",
    validation: {
      type: 'EXACT',
      expected: "SELECT name || ' the ' || role AS crew_description FROM employees;"
    },
    starterCode: "SELECT ",
    referenceQuery: "SELECT name || ' the ' || role AS crew_description FROM employees;",
    hints: ["In SQLite, use the || operator to concatenate strings.", "The format is name || ' the ' || role."],
    rewards: {
      xp: 230,
      coins: 70,
      gems: 5
    },
    nextChallengeId: "smugglers_15"
  },

  {
    id: "smugglers_15",
    title: "Bounty Tax Adjustment",
    chapter: 3,
    islandId: "smugglers_cove",
    npcId: "admiral_morgan",
    story: "smugglers are taxed 10% on their bounties. Round the adjusted bounty (bounty * 1.1) to 0 decimal places.\n\nObjective: Select target_name, ROUND(bounty_amount * 1.1, 0) as adjusted_bounty from bounties.",
    description: "smugglers are taxed 10% on their bounties. Round the adjusted bounty (bounty * 1.1) to 0 decimal places.\n\nObjective: Select target_name, ROUND(bounty_amount * 1.1, 0) as adjusted_bounty from bounties.",
    difficulty: "Medium",
    validation: {
      type: 'EXACT',
      expected: "SELECT target_name, ROUND(bounty_amount * 1.1, 0) AS adjusted_bounty FROM bounties;"
    },
    starterCode: "SELECT ",
    referenceQuery: "SELECT target_name, ROUND(bounty_amount * 1.1, 0) AS adjusted_bounty FROM bounties;",
    hints: ["Use ROUND(bounty_amount * 1.1, 0) AS adjusted_bounty.", "Query the bounties table."],
    rewards: {
      xp: 240,
      coins: 50,
      gems: 3
    },
    nextChallengeId: "smugglers_16"
  },

  {
    id: "smugglers_16",
    title: "Artifact Name Lengths",
    chapter: 3,
    islandId: "smugglers_cove",
    npcId: "admiral_morgan",
    story: "Sort our mystical items by the length of their names to find the longest names.\n\nObjective: Select name, LENGTH(name) as len from artifacts ordered by len desc.",
    description: "Sort our mystical items by the length of their names to find the longest names.\n\nObjective: Select name, LENGTH(name) as len from artifacts ordered by len desc.",
    difficulty: "Medium",
    validation: {
      type: 'EXACT',
      expected: "SELECT name, LENGTH(name) AS len FROM artifacts ORDER BY len DESC;"
    },
    starterCode: "SELECT ",
    referenceQuery: "SELECT name, LENGTH(name) AS len FROM artifacts ORDER BY len DESC;",
    hints: ["Use LENGTH(name) AS len, and ORDER BY len DESC.", "Query the artifacts table."],
    rewards: {
      xp: 250,
      coins: 60,
      gems: 2
    },
    nextChallengeId: "smugglers_17"
  },

  {
    id: "smugglers_17",
    title: "Heavy Gem Shippers",
    chapter: 3,
    islandId: "smugglers_cove",
    npcId: "admiral_morgan",
    story: "Uppercase the names of miners shipping heavy gems (weight > 10).\n\nObjective: Select UPPER(miner_name) as miner, weight from gems where weight is greater than 10.",
    description: "Uppercase the names of miners shipping heavy gems (weight > 10).\n\nObjective: Select UPPER(miner_name) as miner, weight from gems where weight is greater than 10.",
    difficulty: "Medium",
    validation: {
      type: 'EXACT',
      expected: "SELECT UPPER(miner_name) AS miner, weight FROM gems WHERE weight > 10;"
    },
    starterCode: "SELECT ",
    referenceQuery: "SELECT UPPER(miner_name) AS miner, weight FROM gems WHERE weight > 10;",
    hints: ["Use UPPER(miner_name) AS miner, and filter with weight > 10.", "Query the gems table."],
    rewards: {
      xp: 180,
      coins: 45,
      gems: 1
    },
    nextChallengeId: "smugglers_18"
  },

  {
    id: "smugglers_18",
    title: "Vessel Codename Generator",
    chapter: 3,
    islandId: "smugglers_cove",
    npcId: "admiral_morgan",
    story: "Combine ship name and type into a codename bracket (e.g. 'Morgans Revenge (Galleon)'), and order by name length descending.\n\nObjective: Select name || ' (' || type || ')' as ship_details, LENGTH(name) as name_len from ships where price is greater than 20000 ordered by name_len desc.",
    description: "Combine ship name and type into a codename bracket (e.g. 'Morgans Revenge (Galleon)'), and order by name length descending.\n\nObjective: Select name || ' (' || type || ')' as ship_details, LENGTH(name) as name_len from ships where price is greater than 20000 ordered by name_len desc.",
    difficulty: "Hard",
    validation: {
      type: 'EXACT',
      expected: "SELECT name || ' (' || type || ')' AS ship_details, LENGTH(name) AS name_len FROM ships WHERE price > 20000 ORDER BY name_len DESC;"
    },
    starterCode: "",
    referenceQuery: "SELECT name || ' (' || type || ')' AS ship_details, LENGTH(name) AS name_len FROM ships WHERE price > 20000 ORDER BY name_len DESC;",
    hints: ["Use name || ' (' || type || ')' AS ship_details.", "ORDER BY name_len DESC."],
    rewards: {
      xp: 300,
      coins: 80,
      gems: 5
    },
    nextChallengeId: "smugglers_19"
  },

  {
    id: "smugglers_19",
    title: "Gimli's Gem Valuation",
    chapter: 3,
    islandId: "smugglers_cove",
    npcId: "admiral_morgan",
    story: "Gimli wants to convert gem weights to pounds (1 stone = 2.2 lbs) and round the result to 1 decimal place.\n\nObjective: Select distinct gem_type, ROUND(weight * 2.2, 1) as weight_lbs from gems where miner_name is 'Gimli' ordered by weight_lbs desc.",
    description: "Gimli wants to convert gem weights to pounds (1 stone = 2.2 lbs) and round the result to 1 decimal place.\n\nObjective: Select distinct gem_type, ROUND(weight * 2.2, 1) as weight_lbs from gems where miner_name is 'Gimli' ordered by weight_lbs desc.",
    difficulty: "Hard",
    validation: {
      type: 'EXACT',
      expected: "SELECT DISTINCT gem_type, ROUND(weight * 2.2, 1) AS weight_lbs FROM gems WHERE miner_name = 'Gimli' ORDER BY weight_lbs DESC;"
    },
    starterCode: "",
    referenceQuery: "SELECT DISTINCT gem_type, ROUND(weight * 2.2, 1) AS weight_lbs FROM gems WHERE miner_name = 'Gimli' ORDER BY weight_lbs DESC;",
    hints: ["Use DISTINCT gem_type, and ROUND(weight * 2.2, 1) AS weight_lbs.", "Filter using miner_name = 'Gimli' and ORDER BY weight_lbs DESC."],
    rewards: {
      xp: 320,
      coins: 90,
      gems: 6
    },
    nextChallengeId: "smugglers_20"
  },

  {
    id: "smugglers_20",
    title: "Navigation Officer IDs",
    chapter: 3,
    islandId: "smugglers_cove",
    npcId: "admiral_morgan",
    story: "Generate official ID records for department 1 officers. Fetch uppercase name, salary, and name length, sorted by length.\n\nObjective: Select UPPER(name) as official_name, salary, LENGTH(name) as name_len from employees where department_id is 1 and salary is greater than 50000 ordered by name_len asc;",
    description: "Generate official ID records for department 1 officers. Fetch uppercase name, salary, and name length, sorted by length.\n\nObjective: Select UPPER(name) as official_name, salary, LENGTH(name) as name_len from employees where department_id is 1 and salary is greater than 50000 ordered by name_len asc;",
    difficulty: "Hard",
    validation: {
      type: 'EXACT',
      expected: "SELECT UPPER(name) AS official_name, salary, LENGTH(name) AS name_len FROM employees WHERE department_id = 1 AND salary > 50000 ORDER BY name_len ASC;"
    },
    starterCode: "",
    referenceQuery: "SELECT UPPER(name) AS official_name, salary, LENGTH(name) AS name_len FROM employees WHERE department_id = 1 AND salary > 50000 ORDER BY name_len ASC;",
    hints: ["Use UPPER(name) AS official_name, salary, and LENGTH(name) AS name_len.", "Use department_id = 1 AND salary > 50000. Order by name_len ASC."],
    rewards: {
      xp: 350,
      coins: 100,
      gems: 7
    },
    nextChallengeId: "smugglers_21"
  },

  {
    id: "smugglers_21",
    title: "Vessel Status Dictionary",
    chapter: 3,
    islandId: "smugglers_cove",
    npcId: "admiral_morgan",
    story: "Generate a unique status index map for all ship types, with status in uppercase.\n\nObjective: Select distinct type, UPPER(status) as ship_status from ships ordered by type asc;",
    description: "Generate a unique status index map for all ship types, with status in uppercase.\n\nObjective: Select distinct type, UPPER(status) as ship_status from ships ordered by type asc;",
    difficulty: "Hard",
    validation: {
      type: 'EXACT',
      expected: "SELECT DISTINCT type, UPPER(status) AS ship_status FROM ships ORDER BY type ASC;"
    },
    starterCode: "",
    referenceQuery: "SELECT DISTINCT type, UPPER(status) AS ship_status FROM ships ORDER BY type ASC;",
    hints: ["Use DISTINCT type, UPPER(status) AS ship_status.", "ORDER BY type ASC."],
    rewards: {
      xp: 380,
      coins: 110,
      gems: 8
    },
    nextChallengeId: "smugglers_22"
  },

  {
    id: "smugglers_22",
    title: "Bounty Ledger Conversion",
    chapter: 3,
    islandId: "smugglers_cove",
    npcId: "admiral_morgan",
    story: "Convert large bounties to thousands (bounty / 1000.0) rounded to 2 decimals.\n\nObjective: Select target_name as outlaw, ROUND(bounty_amount / 1000.0, 2) as bounty_k from bounties where bounty_amount is greater than 50000 ordered by bounty_amount desc;",
    description: "Convert large bounties to thousands (bounty / 1000.0) rounded to 2 decimals.\n\nObjective: Select target_name as outlaw, ROUND(bounty_amount / 1000.0, 2) as bounty_k from bounties where bounty_amount is greater than 50000 ordered by bounty_amount desc;",
    difficulty: "Hard",
    validation: {
      type: 'EXACT',
      expected: "SELECT target_name AS outlaw, ROUND(bounty_amount / 1000.0, 2) AS bounty_k FROM bounties WHERE bounty_amount > 50000 ORDER BY bounty_amount DESC;"
    },
    starterCode: "",
    referenceQuery: "SELECT target_name AS outlaw, ROUND(bounty_amount / 1000.0, 2) AS bounty_k FROM bounties WHERE bounty_amount > 50000 ORDER BY bounty_amount DESC;",
    hints: ["Use target_name AS outlaw, and ROUND(bounty_amount / 1000.0, 2) AS bounty_k.", "Filter by bounty_amount > 50000 and order by bounty_amount DESC."],
    rewards: {
      xp: 400,
      coins: 120,
      gems: 9
    },
    nextChallengeId: "smugglers_23"
  },

  {
    id: "smugglers_23",
    title: "Artifact Danger Alerts",
    chapter: 3,
    islandId: "smugglers_cove",
    npcId: "admiral_morgan",
    story: "Concatenate artifact name and danger level into warning labels (e.g. 'Cursed Amulet (Danger: 9)'), sorted by danger level.\n\nObjective: Select name || ' (Danger: ' || danger_level || ')' as dangerous_relic from artifacts where danger_level is greater than 5 ordered by danger_level desc;",
    description: "Concatenate artifact name and danger level into warning labels (e.g. 'Cursed Amulet (Danger: 9)'), sorted by danger level.\n\nObjective: Select name || ' (Danger: ' || danger_level || ')' as dangerous_relic from artifacts where danger_level is greater than 5 ordered by danger_level desc;",
    difficulty: "Hard",
    validation: {
      type: 'EXACT',
      expected: "SELECT name || ' (Danger: ' || danger_level || ')' AS dangerous_relic FROM artifacts WHERE danger_level > 5 ORDER BY danger_level DESC;"
    },
    starterCode: "",
    referenceQuery: "SELECT name || ' (Danger: ' || danger_level || ')' AS dangerous_relic FROM artifacts WHERE danger_level > 5 ORDER BY danger_level DESC;",
    hints: ["Concatenate using name || ' (Danger: ' || danger_level || ')'.", "Filter danger_level > 5 and ORDER BY danger_level DESC."],
    rewards: {
      xp: 450,
      coins: 130,
      gems: 8
    },
    nextChallengeId: "smugglers_24"
  },

  {
    id: "smugglers_24",
    title: "Tutorial Harbor Registry Names",
    chapter: 3,
    islandId: "smugglers_cove",
    npcId: "admiral_morgan",
    story: "Get the top 3 roles on Tutorial Harbor, showing lowercase name and length of role, sorted by length.\n\nObjective: Select LOWER(name) as lower_name, LENGTH(role) as role_len from employees where island is 'Tutorial Harbor' ordered by role_len desc limit 3;",
    description: "Get the top 3 roles on Tutorial Harbor, showing lowercase name and length of role, sorted by length.\n\nObjective: Select LOWER(name) as lower_name, LENGTH(role) as role_len from employees where island is 'Tutorial Harbor' ordered by role_len desc limit 3;",
    difficulty: "Hard",
    validation: {
      type: 'EXACT',
      expected: "SELECT LOWER(name) AS lower_name, LENGTH(role) AS role_len FROM employees WHERE island = 'Tutorial Harbor' ORDER BY role_len DESC LIMIT 3;"
    },
    starterCode: "",
    referenceQuery: "SELECT LOWER(name) AS lower_name, LENGTH(role) AS role_len FROM employees WHERE island = 'Tutorial Harbor' ORDER BY role_len DESC LIMIT 3;",
    hints: ["Use LOWER(name) AS lower_name, LENGTH(role) AS role_len.", "Filter using island = 'Tutorial Harbor' and ORDER BY role_len DESC LIMIT 3."],
    rewards: {
      xp: 480,
      coins: 140,
      gems: 9
    },
    nextChallengeId: "smugglers_25"
  },

  {
    id: "smugglers_25",
    title: "The Smuggler Sovereign",
    chapter: 3,
    islandId: "smugglers_cove",
    npcId: "admiral_morgan",
    story: "Admiral Morgan wants to summarize Gimli, Balin, Thorin, and Dori's gem weights boosted by 50% (weight * 1.5 rounded to 0 decimals).\n\nObjective: Select distinct gem_type, miner_name, ROUND(weight * 1.5, 0) as boosted_weight from gems ordered by gem_type desc, miner_name asc limit 4;",
    description: "Admiral Morgan wants to summarize Gimli, Balin, Thorin, and Dori's gem weights boosted by 50% (weight * 1.5 rounded to 0 decimals).\n\nObjective: Select distinct gem_type, miner_name, ROUND(weight * 1.5, 0) as boosted_weight from gems ordered by gem_type desc, miner_name asc limit 4;",
    difficulty: "Hard",
    validation: {
      type: 'EXACT',
      expected: "SELECT DISTINCT gem_type, miner_name, ROUND(weight * 1.5, 0) AS boosted_weight FROM gems ORDER BY gem_type DESC, miner_name ASC LIMIT 4;"
    },
    starterCode: "",
    referenceQuery: "SELECT DISTINCT gem_type, miner_name, ROUND(weight * 1.5, 0) AS boosted_weight FROM gems ORDER BY gem_type DESC, miner_name ASC LIMIT 4;",
    hints: ["Use DISTINCT gem_type, miner_name, and ROUND(weight * 1.5, 0) AS boosted_weight.", "ORDER BY gem_type DESC, miner_name ASC LIMIT 4."],
    rewards: {
      xp: 500,
      coins: 150,
      gems: 10,
      badge: "Smuggler Sovereign"
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
