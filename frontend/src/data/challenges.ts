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
  difficulty: 'Novice' | 'Intermediate' | 'Advanced';
  validation: ChallengeValidation;
  starterCode: string;
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
    difficulty: "Novice",
    validation: {
      type: 'EXACT',
      expected: "SELECT * FROM employees"
    },
    starterCode: "SELECT ",
    hints: [
      "Use the asterisk (*) symbol to select all columns.",
      "Don't forget the FROM clause specifying the 'employees' table."
    ],
    rewards: { xp: 100, coins: 25, item: "Beginner's Compass" },
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
    difficulty: "Novice",
    validation: {
      type: 'KEYWORD_MATCH',
      expected: "SELECT name FROM employees",
      requiredKeywords: ["select", "name", "from", "employees"]
    },
    starterCode: "SELECT * FROM employees;",
    hints: [
      "Replace the wildcard asterisk (*) with the specific column name 'name'.",
      "Ensure the table name remains 'employees'."
    ],
    rewards: { xp: 125, coins: 30, gems: 5 },
    nextChallengeId: "chal_03"
  },
  {
    id: "chal_03",
    title: "High Earners",
    chapter: 1,
    islandId: "tutorial_island",
    npcId: "quartermaster_flint",
    story: "Mutiny brews among the underpaid! Identify the officers taking home the heaviest loot chests.",
    description: "Retrieve all columns from employees where the salary is greater than 50000.",
    difficulty: "Intermediate",
    validation: {
      type: 'CONTAINS',
      expected: "WHERE salary > 50000"
    },
    starterCode: "SELECT * FROM employees\nWHERE ",
    hints: [
      "Use the WHERE clause to filter rows.",
      "The comparison operator for greater than is '>'. Check against 50000 without commas."
    ],
    rewards: { xp: 150, coins: 45, badge: "Coin Counter" },
    nextChallengeId: "chal_04"
  },
  {
    id: "chal_04",
    title: "Rank by Wealth",
    chapter: 2,
    islandId: "smugglers_cove",
    npcId: "admiral_morgan",
    story: "Arrange the ledger so the richest privateers sit at the top of the manifest.",
    description: "Retrieve all employees ordered by their salary from highest to lowest.",
    difficulty: "Intermediate",
    validation: {
      type: 'EXACT',
      expected: "SELECT * FROM employees ORDER BY salary DESC"
    },
    starterCode: "SELECT * FROM employees\nORDER BY ",
    hints: [
      "Use ORDER BY followed by the column name 'salary'.",
      "Append DESC at the end of your clause to sort in descending order."
    ],
    rewards: { xp: 175, coins: 55, gems: 10 },
    nextChallengeId: "chal_05"
  },
  {
    id: "chal_05",
    title: "The Elite Vanguard",
    chapter: 2,
    islandId: "smugglers_cove",
    npcId: "admiral_morgan",
    story: "The Admiral demands an audience with only the top five highest-paid officers in the fleet.",
    description: "Retrieve the top 5 highest earning employees.",
    difficulty: "Advanced",
    validation: {
      type: 'REGEX',
      expected: "^select\\s+\\*\\s+from\\s+employees\\s+order\\s+by\\s+salary\\s+desc\\s+limit\\s+5$"
    },
    starterCode: "SELECT * FROM employees\nORDER BY salary DESC\nLIMIT ",
    hints: [
      "Combine ORDER BY salary DESC with the LIMIT keyword.",
      "Provide the number 5 right after LIMIT."
    ],
    rewards: { xp: 250, coins: 100, gems: 25, badge: "Fleet Master", item: "Spyglass of Truth" },
    nextChallengeId: null
  }
];