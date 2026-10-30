const express = require("express");
const router = express.Router();
const controller = require("./achievement.controller");

router.get("/", controller.getAllAchievements);
router.get("/character/:id", controller.getCharacterAchievements);

module.exports = router;