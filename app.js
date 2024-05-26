const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const http = require('http');
const WebSocket = require('ws');
const connectToMongoDB = require('./config/db');
const routes = require('./routes');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Middleware
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Connect to MongoDB and store the connection in app locals
connectToMongoDB().then((db) => {
    app.locals.db = db;

    // Routes
    app.use('/', routes);

    // Serve the HTML files
    app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, 'views', 'homepage.html'));
    });

    app.get('/about', (req, res) => {
        res.sendFile(path.join(__dirname, 'views', 'about.html'));
    });

    app.get('/dashboard', (req, res) => {
        res.sendFile(path.join(__dirname, 'views', 'index.html'));
    });

    app.get('/admin', (req, res) => {
        res.sendFile(path.join(__dirname, 'views', 'admin.html'));
    });

    app.get('/login', (req, res) => {
        res.sendFile(path.join(__dirname, 'views', 'login.html'));
    });

    const PORT = process.env.PORT || 3000;
    server.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}).catch(err => {
    console.error('Failed to connect to MongoDB:', err);
});

wss.on('connection', (ws) => {
    console.log('WebSocket connection established');

    ws.on('message', (message) => {
        console.log('Received:', message);
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    });

    ws.on('close', () => {
        console.log('WebSocket connection closed');
    });
});

module.exports = app;
