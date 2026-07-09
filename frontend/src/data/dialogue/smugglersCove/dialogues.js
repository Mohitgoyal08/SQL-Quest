export const SMUGGLERS_DIALOGUES = {
  smugglers_01: [
    {
      id: "smug_1_1",
      speaker: "Admiral Morgan",
      avatar: "🎖️",
      text: "Captain, we've got a situation. Our intelligence indicates a massive smuggling ring operating right under our noses here in the Cove.",
    },
    {
      id: "smug_1_2",
      speaker: "Admiral Morgan",
      avatar: "🎖️",
      text: "Admiral Morgan suspects the smugglers are using fake ship types. Find all the unique ship types in the harbor so we can verify them.",
    }
  ],
  smugglers_02: [
    {
      id: "smug_2_1",
      speaker: "Shady Informant",
      avatar: "🕵️",
      text: "Psst... Admiral Morgan thinks he's got it all figured out. But if you want to find the big fish, you need to follow the gold.",
    },
    {
      id: "smug_2_2",
      speaker: "Shady Informant",
      avatar: "🕵️",
      text: "The Shady Informant will give you the ledger, but wants the column names disguised. Retrieve the 'name' column as 'vessel' and the 'price' column as 'cost'.",
    }
  ],
  smugglers_03: [
    {
      id: "smug_3_1",
      speaker: "Smuggler Boss",
      avatar: "🦹",
      text: "So, the new Captain thinks they can shut down my operation? You don't even know who is really pulling the strings here!",
    },
    {
      id: "smug_3_2",
      speaker: "Smuggler Boss",
      avatar: "🦹",
      text: "The Smuggler Boss's real name is hidden in lowercase letters. Reveal it by retrieving the 'name' column and capitalizing all employee names with the UPPER function!",
    }
  ],
  game_complete: {
    admiral_morgan: [
      {
        id: "gc_1",
        speaker: "Admiral Morgan",
        avatar: "🎖️",
        text: "You actually did it! You identified the corrupt official and dismantled the smuggling ring. The seas are safe once again.",
      },
      {
        id: "gc_2",
        speaker: "Admiral Morgan",
        avatar: "🎖️",
        text: "You've proven yourself as a true Master of SQL, Captain. Take this Admiral Hat and enjoy the freedom of the open seas. You can continue exploring at your leisure.",
      },
      {
        id: "gc_3",
        speaker: "Admiral Morgan",
        avatar: "🎖️",
        text: "Thanks for playing SQL Quest! (Version 1.0 Complete)",
      }
    ],
    shady_informant: [
      {
        id: "gc_shady_1",
        speaker: "Shady Informant",
        avatar: "🕵️",
        text: "You shut down the boss... impressive. I guess I'll have to find a new line of work. Or maybe I'll just open a tavern.",
      }
    ],
    smuggler_boss: [
      {
        id: "gc_boss_1",
        speaker: "Smuggler Boss",
        avatar: "🦹",
        text: "You beat me fair and square. The boss is exposed. I'm retiring to a quiet island with no ledgers...",
      }
    ]
  }
};