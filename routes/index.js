const express = require('express');
const router = express.Router();
const controller = require('../controllers/controller');

// Main routes
router.get('/', controller.getIndex);

// Auth routes
router.post('/api/auth/register', controller.register);
router.post('/api/auth/login', controller.login);

module.exports = router;
