// const WebSocket = require('ws');

// const wss = new WebSocket.Server({ port: 8080 });

// wss.on('connection', function connection(ws) {
//   console.log('WebSocket connection established');

//   ws.on('message', function incoming(message) {
//     console.log('Received message:', message);
//     // Echo the received message back to the client
//     ws.send(message);
//   });
// });

// const ws = new WebSocket('ws://localhost:5000');

// ws.onopen = function() {
//   console.log('WebSocket connection established');
// };

// ws.onmessage = function(event) {
//   console.log('Received message from server:', event.data);
// };

// ws.onerror = function(error) {
//   console.error('WebSocket error:', error);
// };
