const express = require("express");
const http = require("http");
const connectToMongo = require("./db");
require("dotenv").config();
const cors = require("cors");
const path = require("path");

const userRouter = require("./routes/userInfo");
const pointsRouter = require("./routes/points");
const betRecordsRouter = require('./routes/betRecords');
const gameLogicRouter = require('./routes/colorGameLogic');
const setupWebSocket = require("./webSockets/aviatorServer");

const app = express();
const port = process.env.PORT || 5000;

const allowedOrigins = [
  "http://localhost:3000",
  "http://192.168.1.5:3000",
  "https://client-r8jh.onrender.com"
];

app.use(cors({ origin: allowedOrigins }));
app.use(express.json());

app.use("/api", userRouter);
app.use("/api", pointsRouter);
app.use('/api', betRecordsRouter);
app.use('/api', gameLogicRouter);

// Serve static assets in production (React frontend)
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

const server = http.createServer(app);
setupWebSocket(server);

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

connectToMongo();
