const express = require("express");
const router = express.Router();
const questController = require("./quest.controller");

router.get("/", questController.getQuests);
router.post("/complete", questController.completeQuest);

module.exports = router;