const WebSocket = require("ws");
const BetRecord = require('../models/BetRecord'); // Import the BetRecord model

let initialCountdown = 10; // Initial countdown value

function startCountdown(ws) {
  let countdown = initialCountdown; // Use initialCountdown for the first countdown
  let countdownInterval = setInterval(() => {
    if (countdown === 0) {
      clearInterval(countdownInterval);

      // Execute planeflytiming only if it hasn't been called before
      if (!ws.planeflyCalled) {
        // Call planeflytiming with ws as an argument
        planeflytiming(ws);
        ws.planeflyCalled = true; // Set flag to indicate planeflytiming has been called
      }

      return;
    }
    ws.send(JSON.stringify({ type: "countdown-update", time: countdown }));
    countdown--;
  }, 1000);
}

function planeflytiming(ws) {
  const newRandomTime = Math.floor(Math.random() * 30) + 1; // Generate random time between 1 and 10 seconds

  // Start countdown for the random time
  let planecountdown = newRandomTime;
  ws.send(
    JSON.stringify({ type: "plane-countdown-start", time: planecountdown })
  ); // Notify client about new countdown
  const countdownInterval = setInterval(() => {
    planecountdown--;
    if (planecountdown <= 1) {
      ws.send(
        JSON.stringify({ type: "countdown-nearing-end", time: planecountdown })
      ); // Send message when countdown nears end
    }
    if (planecountdown === 0) {
      clearInterval(countdownInterval);
      ws.send(JSON.stringify({ type: "countdown-end" })); // Notify client about countdown end

      // After a 3-second delay, start the countdown and planeflytiming again
      setTimeout(() => {
        ws.planeflyCalled = false; // Reset planeflyCalled flag
        startCountdown(ws);
      }, 3000);
    }
  }, 1000);
}

// Function to send current date to clients
function sendCurrentDate(ws) {
  const currentDate = new Date().toLocaleString(); // Get current date and time
  ws.send(JSON.stringify({ type: "current-date", date: currentDate }));
}

function setupWebSocket(server) {
  // Create WebSocket server
  const wss = new WebSocket.Server({ server });

  // WebSocket connection handler
  wss.on("connection", function connection(ws) {
    console.log("WebSocket connection established");

    // Start countdown on connection
    startCountdown(ws);

    // Send current date immediately upon connection
    sendCurrentDate(ws);

    // Periodically send current date to clients every second
    const currentDateInterval = setInterval(() => {
      //   sendCurrentDate(ws);
    }, 1000);

    // WebSocket connection close handler
    ws.on("close", () => {
      console.log("WebSocket disconnected");

      // Clear the current date interval when the connection closes
      clearInterval(currentDateInterval);
    });

    // WebSocket message handler
    ws.on("message", async (message) => {
      const data = JSON.parse(message);

      switch (data.type) {
        case 'place-bet':
          // Create a new bet record when a bet is placed
          const newBetRecord = new BetRecord({
            user_id: data.user_id,
            bet_amount: data.bet_amount,
            multiplier: 1, // Initial multiplier
            cashout_amount: 0 // Initial cashout amount
          });
          await newBetRecord.save();
          ws.send(JSON.stringify({ type: 'bet-placed', record: newBetRecord }));
          break;
        case 'cash-out':
          // Update the bet record when a user cashes out
          const betRecord = await BetRecord.findById(data.record_id);
          if (betRecord) {
            betRecord.cashout_amount = data.cashout_amount;
            betRecord.multiplier = data.multiplier;
            await betRecord.save();
            ws.send(JSON.stringify({ type: 'cash-out-success', record: betRecord }));
          } else {
            ws.send(JSON.stringify({ type: 'cash-out-failure', message: 'Record not found' }));
          }
          break;
        default:
          console.log('Unknown message type:', data.type);
      }
    });

    // Send a welcome message to the connected client
    ws.send("WebSocket connection established");
  });
}

module.exports = setupWebSocket;
