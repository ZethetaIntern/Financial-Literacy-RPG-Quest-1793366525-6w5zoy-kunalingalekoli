const express = require("express");
const router = express.Router();

const dailyQuestController = require("./dailyQuest.controller");
const authMiddleware = require("../config/auth.middleware");

router.get("/", dailyQuestController.getDailyQuests);
router.post("/complete", authMiddleware, dailyQuestController.completeDailyQuest);

module.exports = router;