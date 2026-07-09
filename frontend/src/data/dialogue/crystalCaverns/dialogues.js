export const CRYSTAL_DIALOGUES = {
  crystal_01: [
    {
      id: "c1",
      speaker: "Dwarf Foreman",
      avatar: "⛏️",
      text: "Welcome to the Crystal Caverns. We've been digging all day but lost count of our haul."
    },
    {
      id: "c2",
      speaker: "Dwarf Foreman",
      avatar: "⛏️",
      text: "Run a COUNT(*) on the gems table so I know how many we've extracted."
    }
  ],
  crystal_02: [
    {
      id: "c3",
      speaker: "Dwarf Appraiser",
      avatar: "🔍",
      text: "Quantity is nice, but quality is what matters. Are these gems even worth our time?"
    },
    {
      id: "c4",
      speaker: "Dwarf Appraiser",
      avatar: "🔍",
      text: "Use the AVG() function on the weight column to find the average weight of our gems."
    }
  ],
  crystal_03: [
    {
      id: "c5",
      speaker: "Gem Dragon",
      avatar: "🐉",
      text: "WHO DARES DISTURB MY SLUMBER? YOU PLUNDER MY DOMAIN?"
    },
    {
      id: "c6",
      speaker: "Gem Dragon",
      avatar: "🐉",
      text: "I demand to know the names of the miners who stole more than 20 weight from me! Group by their name and use HAVING SUM(weight) > 20!"
    }
  ]
};