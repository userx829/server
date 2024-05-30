// routes/gameRoutes.js

const express = require("express");
const router = express.Router();
const GameController = require("../controllers/GameController");

// Routes for handling game actions
router.get("/profile", GameController.getUserProfile);
router.post("/join", GameController.joinColor);
router.post("/select-number", GameController.selectNumber);
router.get("/records", GameController.getUserRecords);

module.exports = router;
