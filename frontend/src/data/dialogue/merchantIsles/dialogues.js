export const MERCHANT_DIALOGUES = {
  merchant_00: [
    {
      id: "m_node_0_1",
      speaker: "Quartermaster Quincy",
      avatar: "👨‍✈️",
      text: "Before we can audit the ledgers, we need to locate the elite traders. There's a rumor they are hoarding the best cargo.",
    },
    {
      id: "m_node_0_2",
      speaker: "Quartermaster Quincy",
      avatar: "👨‍✈️",
      text: "Retrieve all columns from the employees table using the WHERE clause, but only for those whose salary is greater than 50000.",
    }
  ],
  merchant_01: [
    {
      id: "m_node_1",
      speaker: "Master Marlowe",
      avatar: "🪙",
      text: "Fresh paint... old hull... Barnaby finally trusted someone with her? You must be the Captain I've been hearing about.",
    },
    {
      id: "m_node_2",
      speaker: "Master Marlowe",
      avatar: "🪙",
      text: "Our trade tables are completely in disarray. Help me audit this ledger by selecting all employees and ordering them by salary DESC so we can identify our highest paid workers.",
    }
  ],
  merchant_02: [
    {
      id: "m_node_1",
      speaker: "Quartermaster Quincy",
      avatar: "👨‍✈️",
      text: "Ah, Captain! Master Marlowe said you'd be stopping by. The Cargo Exchange is fully stocked.",
    },
    {
      id: "m_node_2",
      speaker: "Quartermaster Quincy",
      avatar: "👨‍✈️",
      text: "Before I can open the premium wares, I need to see only the top 3 highest earners for our tax exemption report. Limit the query to exactly 3 records.",
    }
  ],
  chapter_complete: {
    marlowe: [
      {
        id: "m_complete_1",
        speaker: "Master Marlowe",
        avatar: "🪙",
        text: "Incredible! The audit is complete, and the guild ledgers are finally balanced. Your SQL skills are truly legendary, Captain.",
      },
      {
        id: "m_complete_2",
        speaker: "Master Marlowe",
        avatar: "🪙",
        text: "I've authorized Quincy to open the premium stock for you. When you are ready, set sail for Smuggler's Cove... I hear Admiral Morgan is looking for a skilled data privateer.",
      }
    ],
    quincy: [
      {
        id: "q_complete_1",
        speaker: "Quartermaster Quincy",
        avatar: "👨‍✈️",
        text: "The books are clean! The premium stock is now available in the Cargo Exchange. Have a look!",
      }
    ]
  }
};
