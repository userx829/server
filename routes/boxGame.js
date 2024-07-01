// routes/colorGameLogic.js
const express = require('express');
const router = express.Router();

const getRandomColorAndNumber = () => {
  let colors = ["red", "blue", "green", "yellow", "black"];
  let randomNumber = Math.floor(Math.random() * 5) + 1; // Random number between 1 and 5
  let selectedColor = colors[randomNumber - 1];
  console.log(randomNumber);
  console.log(selectedColor);
  return { randomNumber, selectedColor };
};

router.post('/color-change', (req, res) => {
  try {
    const { randomNumber, selectedColor } = getRandomColorAndNumber();
    res.status(200).json({ randomNumber, color: selectedColor });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
