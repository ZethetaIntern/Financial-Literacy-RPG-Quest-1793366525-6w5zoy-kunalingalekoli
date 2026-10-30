const achievements = [
  {
    id: 1,
    title: "First Step",
    description: "Complete your first quest",
    condition: "firstQuest"
  },
  {
    id: 2,
    title: "Level Up Learner",
    description: "Reach level 2",
    condition: "reachLevel2"
  },
  {
    id: 3,
    title: "Gold Collector",
    description: "Earn at least 150 gold",
    condition: "reach150Gold"
  },
  {
    id: 4,
    title: "Quest Explorer",
    description: "Complete 3 quests",
    condition: "complete3Quests"
  }
];

function getAchievements() {
  return achievements;
}

module.exports = {
  getAchievements
};