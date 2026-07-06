export const tutorialMission = {
  id: "tutorial_01",
  title: "The First Query",
  npc: "Captain Blackbeard",
  portrait: "captain",
  music: "harbor_theme",
  description: "Before you set sail across the treacherous seas, you must prove you can read the ancient ledger. Retrieve the names of all legendary ships anchored in the harbor bay.",
  difficultyKey: "EASY",
  estimatedTime: "5 mins",
  unlockRequirement: "COMPLETED_TUTORIAL_ISLAND",
  canRetry: true,
  objectives: [
    {
      id: "obj_1",
      title: "Inspect the Harbor Ledger",
      description: "Understand the structure of the 'ships' table."
    },
    {
      id: "obj_2",
      title: "Draft your First SQL Query",
      description: "Use the SELECT statement to fetch the required records."
    }
  ],
  rewards: {
    xp: 150,
    coins: 50,
    items: ["Beginner's Compass"],
    stars: 1,
    badges: []
  },
  nextScene: "SQL_CHALLENGE_TUTORIAL"
};