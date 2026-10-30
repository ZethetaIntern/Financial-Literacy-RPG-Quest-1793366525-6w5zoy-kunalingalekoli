const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Financial Literacy RPG Quest API running");
});

const characterRoutes = require("./characters/character.routes");
const questRoutes = require("./quest/quest.routes");
const achievementRoutes = require("./achievements/achievement.routes");
const dailyQuestRoutes = require("./quest/dailyQuest.routes");
const userRoutes = require("./users/user.routes");

app.use("/characters", characterRoutes);
app.use("/quests", questRoutes);
app.use("/achievements", achievementRoutes);
app.use("/daily-quests", dailyQuestRoutes);
app.use("/users", userRoutes);

module.exports = app;