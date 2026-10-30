const express = require("express");
const router = express.Router();

const userController = require("./user.controller");
const authMiddleware = require("../config/auth.middleware");

router.post("/register", userController.register);
router.post("/login", userController.login);
router.get("/me", authMiddleware, userController.me);

module.exports = router;