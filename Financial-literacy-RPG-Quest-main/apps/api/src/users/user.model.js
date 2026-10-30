const connection = require("../config/db");

function createUser(name, email, password, characterId, callback) {
  const user = {
    id: Date.now(),
    name,
    email,
    password,
    characterId
  };

  const sql = `
    INSERT INTO users (id, name, email, password, characterId)
    VALUES (?, ?, ?, ?, ?)
  `;

  connection.query(
    sql,
    [user.id, user.name, user.email, user.password, user.characterId],
    (err) => {
      if (err) return callback(err, null);
      callback(null, user);
    }
  );
}

function findUserByEmail(email, callback) {
  const sql = "SELECT * FROM users WHERE email = ?";

  connection.query(sql, [email], (err, results) => {
    if (err) return callback(err, null);
    callback(null, results[0] || null);
  });
}

function findUserById(id, callback) {
  const sql = "SELECT * FROM users WHERE id = ?";

  connection.query(sql, [id], (err, results) => {
    if (err) return callback(err, null);
    callback(null, results[0] || null);
  });
}

module.exports = {
  createUser,
  findUserByEmail,
  findUserById
};