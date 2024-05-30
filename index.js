// index.js
const express = require("express");
const http = require("http");
const connectToMongo = require("./db");
const cors = require("cors");

// Import routers
const userRouter = require("./routes/userInfo");
const pointsRouter = require("./routes/points");
const betRecordsRouter = require('./routes/betRecords'); // Import the betRecords router
const gameLogicRouter = require('./routes/colorGameLogic'); // Import the game logic router

const setupWebSocket = require("./webSockets/aviatorServer"); // Import WebSocket setup function from aviatorServer.js

const app = express();
const port = 5000;

const allowedOrigins = ["https://client-r8jh.onrender.com"];

app.use(cors({ origin: allowedOrigins }));
app.use(express.json());

// Mount routers
app.use("/api", userRouter);
app.use("/api", pointsRouter);
app.use('/api', betRecordsRouter);
app.use('/api', gameLogicRouter); // Mount the game logic router

// Create HTTP server
const server = http.createServer(app);

// Setup WebSocket server using the imported function
setupWebSocket(server); // Pass the HTTP server to the WebSocket setup function

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

connectToMongo();
