const characterModel = require("./character.model");
const { calculateLevelFromXp } = require("./leveling");

exports.createCharacter = (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Name is required" });
  }

  characterModel.createCharacter(name, (err, character) => {
    if (err) {
      return res.status(500).json({
        message: "Error creating character",
        error: err.message
      });
    }

    const levelData = calculateLevelFromXp(character.xp);

    res.status(201).json({
      ...character,
      level: levelData.level,
      currentLevelXp: levelData.currentLevelXp,
      nextLevelXp: levelData.nextLevelXp
    });
  });
};

exports.getCharacters = (req, res) => {
  characterModel.getCharacters((err, characters) => {
    if (err) {
      return res.status(500).json({
        message: "Error fetching characters",
        error: err.message
      });
    }

    const formattedCharacters = characters.map((character) => {
      const levelData = calculateLevelFromXp(character.xp);

      return {
        ...character,
        level: levelData.level,
        currentLevelXp: levelData.currentLevelXp,
        nextLevelXp: levelData.nextLevelXp
      };
    });

    res.json(formattedCharacters);
  });
};

exports.getLeaderboard = (req, res) => {
  characterModel.getLeaderboard((err, leaderboard) => {
    if (err) {
      return res.status(500).json({
        message: "Error fetching leaderboard",
        error: err.message
      });
    }

    const formattedLeaderboard = leaderboard.map((character) => {
      const levelData = calculateLevelFromXp(character.xp);

      return {
        ...character,
        level: levelData.level,
        currentLevelXp: levelData.currentLevelXp,
        nextLevelXp: levelData.nextLevelXp
      };
    });

    res.json(formattedLeaderboard);
  });
};

exports.getCharacterById = (req, res) => {
  const { id } = req.params;

  characterModel.getCharacterById(id, (err, character) => {
    if (err) {
      return res.status(500).json({
        message: "Error fetching character",
        error: err.message
      });
    }

    if (!character) {
      return res.status(404).json({ message: "Character not found" });
    }

    const levelData = calculateLevelFromXp(character.xp);

    res.json({
      ...character,
      level: levelData.level,
      currentLevelXp: levelData.currentLevelXp,
      nextLevelXp: levelData.nextLevelXp
    });
  });
};