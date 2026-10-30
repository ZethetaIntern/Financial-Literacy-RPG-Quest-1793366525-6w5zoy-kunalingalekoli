function xpNeededForLevel(level) {
  return 100 + (level - 1) * 50;
}

function calculateLevelFromXp(totalXp) {
  let level = 1;
  let remainingXp = totalXp;

  while (remainingXp >= xpNeededForLevel(level)) {
    remainingXp -= xpNeededForLevel(level);
    level++;
  }

  return {
    level,
    currentLevelXp: remainingXp,
    nextLevelXp: xpNeededForLevel(level)
  };
}

module.exports = {
  xpNeededForLevel,
  calculateLevelFromXp
};