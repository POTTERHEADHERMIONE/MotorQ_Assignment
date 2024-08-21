const express = require('express');
const cors = require('cors');
const WebSocket = require('ws');
const app = express();
const port = 3002;

app.use(cors());
app.use(express.json());

app.post('/notify', (req, res) => {
  const { message } = req.body;
  console.log('Notification received:', message);
  
  // Broadcast the message to all WebSocket clients
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
  
  res.status(200).send('Notification received');
});

const wss = new WebSocket.Server({ port: 3003 });

wss.on('connection', ws => {
  console.log('Client connected');
  ws.on('message', message => {
    console.log('Received:', message);
  });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
