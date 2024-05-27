const express = require('express');
const router = express.Router();
const path = require('path');
const controller = require('../controllers/controller');

// Main routes
router.get('/', controller.getIndex);

// Auth routes
router.post('/api/auth/register', controller.register);
router.post('/api/auth/login', controller.login);

// Routes for threshold value
router.post('/api/threshold', controller.setThreshold);
router.put('/api/threshold', controller.updateThreshold);
router.get('/api/threshold', controller.getThreshold);

// About Us route
router.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/about.html'));
});

router.post('/feedback', async (req, res) => {
    const { name, feedback, rating } = req.body;
    const db = req.app.locals.db;
    console.log(`Inserting feedback: ${JSON.stringify(req.body)}`);
    await db.collection('feedbacks').insertOne({ name, feedback, rating }); // Ensure collection name is 'feedbacks'
    res.redirect('/about');
});

router.get('/feedbacks', async (req, res) => {
    const db = req.app.locals.db;
    const feedbacks = await db.collection('feedbacks').find().toArray(); // Ensure collection name is 'feedbacks'
    res.json(feedbacks);
});

// New route for deleting feedback
router.delete('/api/feedback/:name', controller.deleteFeedback);

// Route for updating password
router.put('/api/auth/update-password', controller.updatePassword);


module.exports = router;
