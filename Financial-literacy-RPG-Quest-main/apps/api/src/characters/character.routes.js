const express = require("express");
const router = express.Router();

const characterController = require("./character.controller");

router.post("/create", characterController.createCharacter);
router.get("/", characterController.getCharacters);
router.get("/leaderboard", characterController.getLeaderboard);
router.get("/:id", characterController.getCharacterById);

module.exports = router;