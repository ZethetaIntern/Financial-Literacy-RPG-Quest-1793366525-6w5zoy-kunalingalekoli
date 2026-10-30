const connection = require("../config/db");

function parseJsonField(value, fallback = []) {
  if (!value) return fallback;
  if (Array.isArray(value)) return value;

  try {
    const parsed = JSON.parse(value);
    return parsed;
  } catch (error) {
    return fallback;
  }
}

function createCharacter(name, callback) {
  const character = {
    id: Date.now(),
    name,
    level: 1,
    xp: 0,
    gold: 100,
    completedQuests: [],
    achievements: [],
    stats: {
      financialIntelligence: 10,
      netWorth: 0,
      debt: 0,
      creditScore: 600,
      emergencyFund: 0
    }
  };

  const sql = `
    INSERT INTO characters (id, name, level, xp, gold, completedQuests, achievements, stats)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  connection.query(
    sql,
    [
      character.id,
      character.name,
      character.level,
      character.xp,
      character.gold,
      JSON.stringify(character.completedQuests),
      JSON.stringify(character.achievements),
      JSON.stringify(character.stats)
    ],
    (err) => {
      if (err) return callback(err, null);
      callback(null, character);
    }
  );
}

function getCharacters(callback) {
  const sql = `SELECT * FROM characters`;

  connection.query(sql, (err, results) => {
    if (err) return callback(err, null);

    const characters = results.map((row) => ({
      ...row,
      completedQuests: parseJsonField(row.completedQuests, []),
      achievements: parseJsonField(row.achievements, []),
      stats: parseJsonField(row.stats, {})
    }));

    callback(null, characters);
  });
}

function getCharacterById(id, callback) {
  const sql = `SELECT * FROM characters WHERE id = ?`;

  connection.query(sql, [id], (err, results) => {
    if (err) return callback(err, null);
    if (results.length === 0) return callback(null, null);

    const row = results[0];

    const character = {
      ...row,
      completedQuests: parseJsonField(row.completedQuests, []),
      achievements: parseJsonField(row.achievements, []),
      stats: parseJsonField(row.stats, {})
    };

    callback(null, character);
  });
}

function updateCharacter(character, callback) {
  const sql = `
    UPDATE characters
    SET level = ?, xp = ?, gold = ?, completedQuests = ?, achievements = ?, stats = ?
    WHERE id = ?
  `;

  connection.query(
    sql,
    [
      character.level,
      character.xp,
      character.gold,
      JSON.stringify(character.completedQuests || []),
      JSON.stringify(character.achievements || []),
      JSON.stringify(character.stats || {}),
      character.id
    ],
    (err) => {
      if (err) return callback(err);
      callback(null);
    }
  );
}

function getLeaderboard(callback) {
  const sql = `
    SELECT * FROM characters
    ORDER BY level DESC, xp DESC, gold DESC
  `;

  connection.query(sql, (err, results) => {
    if (err) return callback(err, null);

    const leaderboard = results.map((row, index) => ({
      rank: index + 1,
      ...row,
      completedQuests: parseJsonField(row.completedQuests, []),
      achievements: parseJsonField(row.achievements, []),
      stats: parseJsonField(row.stats, {})
    }));

    callback(null, leaderboard);
  });
}

module.exports = {
  createCharacter,
  getCharacters,
  getCharacterById,
  updateCharacter,
  getLeaderboard
};