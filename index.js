const express = require('express');
const path = require('path');
const app = express();

// Set the port
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Routes
const indexRoutes = require('./routes/routes');
app.use('/', indexRoutes);

// Start the server
app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});

module.exports = app;
