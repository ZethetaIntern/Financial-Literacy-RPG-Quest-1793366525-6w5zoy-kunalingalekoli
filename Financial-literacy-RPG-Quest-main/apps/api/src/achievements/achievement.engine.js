const { getAchievements } = require("./achievement.model");

function checkAchievements(character) {
  const allAchievements = getAchievements();
  const unlocked = [];

  for (const achievement of allAchievements) {
    const alreadyUnlocked = character.achievements.some(
      (a) => a.id === achievement.id
    );

    if (alreadyUnlocked) {
      continue;
    }

    if (
      achievement.condition === "firstQuest" &&
      character.completedQuests.length >= 1
    ) {
      unlocked.push(achievement);
    }

    if (
      achievement.condition === "reachLevel2" &&
      character.level >= 2
    ) {
      unlocked.push(achievement);
    }

    if (
      achievement.condition === "reach150Gold" &&
      character.gold >= 150
    ) {
      unlocked.push(achievement);
    }

    if (
      achievement.condition === "complete3Quests" &&
      character.completedQuests.length >= 3
    ) {
      unlocked.push(achievement);
    }
  }

  return unlocked;
}

module.exports = {
  checkAchievements
};