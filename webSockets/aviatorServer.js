const WebSocket = require("ws");

let initialCountdown = 10; // Initial countdown value
let countdown = initialCountdown; // Shared countdown
let countdownInterval; // Interval reference for the shared countdown
let wss; // WebSocket server reference

function startCountdown() {
  countdownInterval = setInterval(() => {
    if (countdown === 0) {
      clearInterval(countdownInterval);
      
      // Generate a random time and notify all clients
      const newRandomTime = Math.floor(Math.random() * 30) + 1; // Random time between 1 and 30 seconds
      broadcastToAllClients({ type: "plane-countdown-start", time: newRandomTime });

      // Start the plane countdown for all clients
      startPlaneCountdown(newRandomTime);

      return;
    }

    // Broadcast the countdown to all connected clients
    broadcastToAllClients({ type: "countdown-update", time: countdown });

    countdown--;
  }, 1000);
}

function startPlaneCountdown(randomTime) {
  let planecountdown = randomTime;

  const planeCountdownInterval = setInterval(() => {
    planecountdown--;
    if (planecountdown <= 1) {
      broadcastToAllClients({ type: "countdown-nearing-end", time: planecountdown });
    }
    if (planecountdown === 0) {
      clearInterval(planeCountdownInterval);
      broadcastToAllClients({ type: "countdown-end" });

      // After a 3-second delay, restart the shared countdown
      setTimeout(() => {
        countdown = initialCountdown;
        startCountdown();
      }, 3000);
    }
  }, 600);
}

function broadcastToAllClients(message) {
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      try {
        client.send(JSON.stringify(message));
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  });
}

// Function to send current date to clients
function sendCurrentDate(client) {
  const currentDate = new Date().toLocaleString(); // Get current date and time
  try {
    client.send(JSON.stringify({ type: "current-date", date: currentDate }));
  } catch (error) {
    console.error("Error sending current-date:", error);
  }
}

function setupWebSocket(server) {
  // Create WebSocket server
  wss = new WebSocket.Server({ server });

  // Start the shared countdown when the server starts
  startCountdown();

  // WebSocket connection handler
  wss.on("connection", function connection(client) {
    console.log("WebSocket connection established");

    // Send the current countdown value to the newly connected client
    try {
      console.log(`Sending current countdown value: ${countdown} to new client.`);
      client.send(JSON.stringify({ type: "countdown-update", time: countdown }));
    } catch (error) {
      console.error("Error sending countdown-update:", error);
    }

    // Send current date immediately upon connection
    sendCurrentDate(client);

    // WebSocket connection close handler
    client.on("close", () => {
      console.log("WebSocket disconnected");
    });

    // Handle errors
    client.on("error", (error) => {
      console.error("WebSocket error:", error);
    });

    // Send a welcome message to the connected client
    try {
      client.send(JSON.stringify({ type: "welcome", message: "WebSocket connection established" }));
    } catch (error) {
      console.error("Error sending welcome message:", error);
    }
  });
}

module.exports = setupWebSocket;
