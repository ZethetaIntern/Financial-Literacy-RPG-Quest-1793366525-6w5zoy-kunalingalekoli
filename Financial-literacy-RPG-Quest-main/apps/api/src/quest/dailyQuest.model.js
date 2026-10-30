function getTodayDate() {
  return new Date().toISOString().split("T")[0];
}

const dailyQuestPool = [
  {
    id: 101,
    title: "Track Expenses Today",
    description: "Record every expense you make today.",
    category: "daily-habit",
    difficulty: "easy",
    xpReward: 40,
    goldReward: 20
  },
  {
    id: 102,
    title: "Save a Small Amount",
    description: "Set aside a small amount into savings today.",
    category: "daily-habit",
    difficulty: "easy",
    xpReward: 50,
    goldReward: 25
  },
  {
    id: 103,
    title: "Avoid Impulse Spending",
    description: "Skip one unnecessary purchase today.",
    category: "discipline",
    difficulty: "medium",
    xpReward: 60,
    goldReward: 30
  }
];

function getDailyQuests() {
  return {
    date: getTodayDate(),
    quests: dailyQuestPool
  };
}

function getDailyQuestById(id) {
  return dailyQuestPool.find((quest) => quest.id === Number(id));
}

module.exports = {
  getDailyQuests,
  getDailyQuestById
};