const express = require('express');
const http = require('http');
const path = require('path');
const { createBareServer } = require('@tomphttp/bare-server-node');

const app = express();
const server = http.createServer(app);
const bare = createBareServer('/api/b/');

// Middleware to inject CORS headers
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, HEAD');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');

    // Handle preflight OPTIONS requests immediately
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }

    next();
});

// Routing logic
app.use((req, res) => {
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
