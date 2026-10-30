const jwt = require("jsonwebtoken");

const JWT_SECRET = "financial_literacy_rpg_secret_key";

function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      characterId: user.characterId
    },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
}

function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

module.exports = {
  generateToken,
  verifyToken,
  JWT_SECRET
};