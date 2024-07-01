const express = require("express");
const http = require("http");
const connectToMongo = require("./db");
require("dotenv").config(); // Ensure you load environment variables at the top
const cors = require("cors");

// Import routers
const userRouter = require("./routes/userInfo");
const pointsRouter = require("./routes/points");
const betRecordsRouter = require('./routes/betRecords'); // Import the betRecords router
const gameLogicRouter = require('./routes/colorGameLogic'); // Import the game logic router
const boxgameLogicRouter = require('./routes/boxGame'); // Import the game logic router
const setupWebSocket = require("./webSockets/aviatorServer"); // Import WebSocket setup function from aviatorServer.js

const app = express();
const port = process.env.PORT || 5000; // Use PORT from environment variables or default to 5000

// Add your Render frontend URL to the allowed origins
const allowedOrigins = [
  "http://localhost:3000",
  "http://192.168.1.5:3000",
  "https://client-r8jh.onrender.com"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: 'GET,POST,PUT,DELETE',
  credentials: true
}));

app.use(express.json());

// Mount routers
app.use("/api", userRouter);
app.use("/api", pointsRouter);
app.use('/api', betRecordsRouter);
app.use('/api', gameLogicRouter);
app.use('/api', boxgameLogicRouter); // Mount the game logic router

// Create HTTP server
const server = http.createServer(app);

// Setup WebSocket server using the imported function
setupWebSocket(server); // Pass the HTTP server to the WebSocket setup function

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

connectToMongo();
