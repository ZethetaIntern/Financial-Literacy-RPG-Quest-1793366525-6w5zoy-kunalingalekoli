const questModel = require("./quest.model");
const characterModel = require("../characters/character.model");
const { calculateLevelFromXp } = require("../characters/leveling");

function getQuests(req, res) {
  questModel.getAllQuests((err, quests) => {
    if (err) {
      return res.status(500).json({ error: "Failed to fetch quests" });
    }

    res.json(quests);
  });
}

function completeQuest(req, res) {
  const { questId, characterId } = req.body;

  if (!questId || !characterId) {
    return res.status(400).json({ error: "questId and characterId are required" });
  }

  questModel.getQuestById(questId, (questErr, quest) => {
    if (questErr) {
      return res.status(500).json({ error: "Failed to fetch quest" });
    }

    if (!quest) {
      return res.status(404).json({ error: "Quest not found" });
    }

    characterModel.getCharacterById(characterId, (charErr, character) => {
      if (charErr) {
        return res.status(500).json({ error: "Failed to fetch character" });
      }

      if (!character) {
        return res.status(404).json({ error: "Character not found" });
      }

      if (!Array.isArray(character.completedQuests)) {
        character.completedQuests = [];
      }

      if (!Array.isArray(character.achievements)) {
        character.achievements = [];
      }

      if (!character.stats || typeof character.stats !== "object") {
        character.stats = {
          financialIntelligence: 10,
          netWorth: 0,
          debt: 0,
          creditScore: 600,
          emergencyFund: 0
        };
      }

      if (character.completedQuests.includes(quest.id)) {
        return res.status(400).json({ error: "Quest already completed" });
      }

      character.xp += quest.xpReward;
      character.gold += quest.goldReward;
      character.completedQuests.push(quest.id);

      const levelData = calculateLevelFromXp(character.xp);
      character.level = levelData.level;

      if (
        character.completedQuests.length >= 1 &&
        !character.achievements.some((a) => a.id === 1)
      ) {
        character.achievements.push({
          id: 1,
          title: "First Step",
          description: "Complete your first quest"
        });
      }

      characterModel.updateCharacter(character, (updateErr) => {
        if (updateErr) {
          return res.status(500).json({ error: "Failed to update character" });
        }

        res.json({
          success: true,
          message: "Quest completed successfully",
          quest: quest.title,
          character
        });
      });
    });
  });
}

module.exports = {
  getQuests,
  completeQuest
};