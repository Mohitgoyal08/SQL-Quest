export const TUTORIAL_DIALOGUES = {
  chal_01: [
    {
      id: "node_1",
      speaker: "Captain Blackbeard",
      avatar: "🏴‍☠️",
      text: "Ahoy, greenhorn! Welcome to Tutorial Harbor. Before we hoist the sails and brave open waters, I need to know every soul currently aboard my ship.",
    },
    {
      id: "node_2",
      speaker: "Captain Blackbeard",
      avatar: "🏴‍☠️",
      text: "Our harbor harbor records hold the crew manifest in a table called 'employees'. Your first task is straightforward: inspect every column of the entire table.",
    },
  ],
  chal_02: [
    {
      requirements: { requiredItem: 'beginners_compass' },
      dialogue: [
        {
          id: "node_1",
          speaker: "Quartermaster Flint",
          avatar: "📜",
          text: "I see you hold the Captain's compass. That means you've passed his inspection, but I only care about results, not shiny trinkets.",
        },
        {
          id: "node_2",
          speaker: "Quartermaster Flint",
          avatar: "📜",
          text: "Strip that ledger down for daily roll call! Query the 'employees' table again, but this time retrieve ONLY the 'name' column.",
        }
      ]
    },
    {
      dialogue: [
        {
          id: "node_1",
          speaker: "Quartermaster Flint",
          avatar: "📜",
          text: "Aye, the Captain got his full headcount. But I'm the Quartermaster, and reading through fifty columns of birthdates and hometowns gives me a splitting headache.",
        },
        {
          id: "node_2",
          speaker: "Quartermaster Flint",
          avatar: "📜",
          text: "Strip that ledger down for daily roll call! Query the 'employees' table again, but this time retrieve ONLY the 'name' column.",
        }
      ]
    }
  ],
  chal_03: [
    {
      id: "node_1",
      speaker: "Quartermaster Flint",
      avatar: "📜",
      text: "Keep your voice down... rumblings of mutiny are stirring below decks. The deckhands claim the high-ranking officers are hoarding too much plunder.",
    },
    {
      id: "node_2",
      speaker: "Quartermaster Flint",
      avatar: "📜",
      text: "We need to audit the payroll immediately. Filter the records using a WHERE clause and retrieve every column for hands whose salary is greater than 50,000 gold pieces!",
    },
  ],
};