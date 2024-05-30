// colorGameLogic.js
const express = require("express");
const router = express.Router();

let period = 1;
let results = [];

const generateLotteryResult = () => Math.floor(Math.random() * 10);

const calculateWinnings = (type, number, result) => {
  const contractAmount = 98;
  let winnings = 0;

  switch (type) {
    case "JOIN_GREEN":
      if ([1, 3, 7, 9].includes(result)) {
        winnings = contractAmount * 2;
      } else if (result === 5) {
        winnings = contractAmount * 1.5;
      }
      break;
    case "JOIN_RED":
      if ([2, 4, 6, 8].includes(result)) {
        winnings = contractAmount * 2;
      } else if (result === 0) {
        winnings = contractAmount * 1.5;
      }
      break;
    case "JOIN_VIOLET":
      if ([0, 5].includes(result)) {
        winnings = contractAmount * 4.5;
      }
      break;
    case "SELECT_NUMBER":
      if (result === number) {
        winnings = contractAmount * 9;
      }
      break;
    default:
      break;
  }

  return winnings;
};

router.post("/trade", (req, res) => {
  const { type, number } = req.body;

  if (
    !["JOIN_GREEN", "JOIN_RED", "JOIN_VIOLET", "SELECT_NUMBER"].includes(type)
  ) {
    return res.status(400).json({ error: "Invalid trade type" });
  }

  if (type === "SELECT_NUMBER" && (number < 0 || number > 9)) {
    return res.status(400).json({ error: "Invalid number selection" });
  }

  const result = generateLotteryResult();
  const winnings = calculateWinnings(type, number, result);

  const tradeResult = {
    period,
    type,
    number,
    result,
    winnings,
  };

  results.push(tradeResult);
  period++;

  res.json(tradeResult);
});

router.get("/results", (req, res) => {
  res.json(results);
});

module.exports = router;
