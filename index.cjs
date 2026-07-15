const express = require('express');
const http = require('http');
const path = require('path');
const { createBareServer } = require('@tomphttp/bare-server-node');

const app = express();
const server = http.createServer(app);
const bare = createBareServer('/api/b/');

app.use((req, res, next) => {
  if (bare.shouldRoute(req)) {
    bare.routeRequest(req, res);
  } else {
    res.sendFile(path.join(__dirname, 'index.html'));
  }
});

server.on('upgrade', (req, socket, head) => {
  if (bare.shouldRoute(req)) {
    bare.routeUpgrade(req, socket, head);
  } else {
    socket.destroy();
  }
});

server.listen(8080, () => {
  console.log('Server is listening on port 8080');
});
