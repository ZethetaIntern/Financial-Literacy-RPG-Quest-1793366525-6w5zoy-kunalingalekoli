const dailyQuestModel = require("./dailyQuest.model");
const characterModel = require("../characters/character.model");
const { calculateLevelFromXp } = require("../characters/leveling");

function getDailyQuests(req, res) {
  const dailyData = dailyQuestModel.getDailyQuests();

  res.json(dailyData);
}

function completeDailyQuest(req, res) {
  const { questId, characterId } = req.body;

  const dailyData = dailyQuestModel.getDailyQuests();
  const quest = dailyData.quests.find((q) => q.id === questId);

  if (!quest) {
    return res.status(404).json({ error: "Daily quest not found" });
  }

  characterModel.getCharacterById(characterId, (err, character) => {
    if (err) {
      return res.status(500).json({ error: "Failed to fetch character" });
    }

    if (!character) {
      return res.status(404).json({ error: "Character not found" });
    }

    if (!Array.isArray(character.completedQuests)) {
      character.completedQuests = [];
    }

    if (character.completedQuests.includes(questId)) {
      return res.status(400).json({ error: "Daily quest already completed" });
    }

    character.xp += quest.xpReward;
    character.gold += quest.goldReward;
    character.completedQuests.push(questId);

    const levelData = calculateLevelFromXp(character.xp);
    character.level = levelData.level;

    characterModel.updateCharacter(character, (updateErr) => {
      if (updateErr) {
        return res.status(500).json({ error: "Failed to update character" });
      }

      res.json({
        success: true,
        message: "Daily quest completed successfully",
        questId: quest.id,
        questTitle: quest.title,
        character
      });
    });
  });
}

module.exports = {
  getDailyQuests,
  completeDailyQuest
};