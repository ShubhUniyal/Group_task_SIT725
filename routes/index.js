const express = require('express');
const router = express.Router();
const path = require('path');
const controller = require('../controllers/controller');

// Main routes
router.get('/', controller.getIndex);

// Auth routes
router.post('/api/auth/register', controller.register);
router.post('/api/auth/login', controller.login);

// About Us route
router.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/about.html'));
});

router.post('/feedback', async (req, res) => {
    const { name, feedback, rating } = req.body;
    const db = req.app.locals.db;
    await db.collection('feedback').insertOne({ name, feedback, rating });
    res.redirect('/about');
});

router.get('/feedbacks', async (req, res) => {
    const db = req.app.locals.db;
    const feedbacks = await db.collection('feedback').find().toArray();
    res.json(feedbacks);
});

module.exports = router;
