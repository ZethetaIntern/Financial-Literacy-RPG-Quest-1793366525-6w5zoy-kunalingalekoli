const achievementModel = require("./achievement.model");
const characterModel = require("../characters/character.model");

function getAllAchievements(req, res) {
  res.json(achievementModel.getAchievements());
}

function getCharacterAchievements(req, res) {
  const { id } = req.params;
  const character = characterModel.getCharacterById(id);

  if (!character) {
    return res.status(404).json({ error: "Character not found" });
  }

  res.json(character.achievements);
}

module.exports = {
  getAllAchievements,
  getCharacterAchievements
};