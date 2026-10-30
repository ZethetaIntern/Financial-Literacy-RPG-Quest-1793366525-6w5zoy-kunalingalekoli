const quests = [
  {
    id: 1,
    title: "Track Your Expenses",
    description: "Record all expenses for a day",
    difficulty: "easy",
    xpReward: 40,
    goldReward: 20
  },
  {
    id: 2,
    title: "Save Small Amount",
    description: "Save a small portion of income",
    difficulty: "easy",
    xpReward: 50,
    goldReward: 25
  },
  {
    id: 3,
    title: "Avoid Impulse Spending",
    description: "Skip one unnecessary purchase",
    difficulty: "medium",
    xpReward: 60,
    goldReward: 30
  },
  {
    id: 4,
    title: "Investment Basics",
    description: "Learn about risk and return",
    difficulty: "hard",
    xpReward: 100,
    goldReward: 50
  }
];

function getAllQuests(callback) {
  callback(null, quests);
}

function getQuestById(id, callback) {
  const quest = quests.find(q => q.id == id);
  callback(null, quest);
}

module.exports = {
  getAllQuests,
  getQuestById
};