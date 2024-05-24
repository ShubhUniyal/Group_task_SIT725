const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const connectToMongoDB = require('./config/db');
const routes = require('./routes');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Connect to MongoDB and store the connection in app locals
connectToMongoDB().then((db) => {
    app.locals.db = db;

    // Routes
    app.use('/', routes);

    // Serve the HTML file
    app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, 'views', 'index.html'));
    });

    app.get('/admin', (req, res) => {
        res.sendFile(path.join(__dirname, 'views', 'admin.html'));
    });

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}).catch(err => {
    console.error('Failed to connect to MongoDB:', err);
});

module.exports = app;
