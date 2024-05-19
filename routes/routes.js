const express = require('express');
const router = express.Router();
const mainController = require('../controllers/controller');

router.get('/', mainController.getIndex);

// Define other routes here
module.exports = router;
