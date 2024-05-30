// gameLogic.js

// Function to update countdown and table with results periodically
const updateGame = (gameState) => {
    const gameInterval = setInterval(() => {
      // Update countdown
      if (gameState.countdown.seconds === 0) {
        gameState.countdown.minutes--;
        gameState.countdown.seconds = 59;
      } else {
        gameState.countdown.seconds--;
      }
  
      // Check if countdown reached 30 seconds to disable buttons
      if (gameState.countdown.minutes === 0 && gameState.countdown.seconds === 30) {
        gameState.buttonsDisabled = true;
      }
  
      // Generate random number for game result
      const randomNumber = Math.floor(Math.random() * 10);
  
      let result;
      if (randomNumber < 3) {
        result = "green";
      } else if (randomNumber >= 3 && randomNumber < 6) {
        result = "blue";
      } else {
        result = "red";
      }
  
      // Update the result for the current period
      gameState.results.push({
        period: gameState.results.length + 1,
        price: "",
        number: randomNumber,
        result: result,
      });
  
    }, 1000); // Update game every second
  
    return gameInterval;
  };
  
  module.exports = {
    updateGame
  };
  