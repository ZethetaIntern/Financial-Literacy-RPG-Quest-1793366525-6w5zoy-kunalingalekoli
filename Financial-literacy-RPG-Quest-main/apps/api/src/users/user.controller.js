const bcrypt = require("bcryptjs");
const userModel = require("./user.model");
const characterModel = require("../characters/character.model");
const { generateToken } = require("../config/auth");

function register(req, res) {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "All fields required" });
  }

  userModel.findUserByEmail(email, async (err, existingUser) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      characterModel.createCharacter(name, (charErr, character) => {
        if (charErr) {
          return res.status(500).json({ error: charErr.message });
        }

        userModel.createUser(
          name,
          email,
          hashedPassword,
          character.id,
          (userErr, user) => {
            if (userErr) {
              return res.status(500).json({ error: userErr.message });
            }

            const token = generateToken(user);

            res.json({
              message: "User registered",
              token,
              user: {
                id: user.id,
                name: user.name,
                email: user.email,
                characterId: user.characterId
              },
              character
            });
          }
        );
      });
    } catch (error) {
      return res.status(500).json({ error: "Failed to hash password" });
    }
  });
}

function login(req, res) {
  const { email, password } = req.body;

  userModel.findUserByEmail(email, async (err, user) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    try {
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const token = generateToken(user);

      res.json({
        message: "Login successful",
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          characterId: user.characterId
        }
      });
    } catch (error) {
      return res.status(500).json({ error: "Login failed" });
    }
  });
}

function me(req, res) {
  res.json({
    message: "Authorized",
    user: req.user
  });
}

module.exports = {
  register,
  login,
  me
};