const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Threshold = require('../models/threshold');
const Feedback = require('../models/feedback');

const JWT_SECRET = '1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';

// Main Controller
exports.getIndex = (req, res) => {
    res.sendFile(path.join(__dirname, '../views/homepage.html'));
};

// Auth Controller
exports.register = async (req, res) => {
    const { username, password } = req.body;
    console.log(req.body); // Log the request payload

    const db = req.app.locals.db;
    const userModel = new User(db);

    if (username !== 'admin') {
        return res.status(403).send('Only admin can be created');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const userId = await userModel.createUser(username, hashedPassword);
        console.log('User created with ID:', userId);
        res.status(201).send('Admin user created');
    } catch (err) {
        console.error('Error creating user:', err); // Log the error details
        res.status(400).send('Error creating user');
    }
};

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        console.log('Login attempt:', { username, password }); // Log the login attempt

        const db = req.app.locals.db;
        const userModel = new User(db);

        const user = await userModel.findUserByUsername(username);
        if (!user) {
            console.log('User not found:', username); // Log if user is not found
            return res.status(400).send({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log('Password mismatch for user:', username); // Log if password does not match
            return res.status(400).send({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
        console.log('Login successful for user:', username); // Log successful login
        res.send({ token, redirectUrl: '/admin' }); // Include the redirect URL
    } catch (err) {
        console.error('Error during login:', err); // Log unexpected errors
        res.status(500).send({ message: 'An unexpected error occurred' });
    }
};

// Threshold Controller
exports.setThreshold = async (req, res) => {
    const { thresholdValue } = req.body;
    const db = req.app.locals.db;
    const thresholdModel = new Threshold(db);

    try {
        await thresholdModel.setThreshold(thresholdValue);
        res.status(201).send({ message: 'Threshold value set successfully' });
    } catch (err) {
        console.error('Error setting threshold:', err);
        res.status(500).send({ message: 'An unexpected error occurred' });
    }
};

exports.updateThreshold = async (req, res) => {
    const { thresholdValue } = req.body;
    const db = req.app.locals.db;
    const thresholdModel = new Threshold(db);

    try {
        await thresholdModel.updateThreshold(thresholdValue);
        res.status(200).send({ message: 'Threshold value updated successfully' });
    } catch (err) {
        console.error('Error updating threshold:', err);
        res.status(500).send({ message: 'An unexpected error occurred' });
    }
};

exports.getThreshold = async (req, res) => {
    const db = req.app.locals.db;
    const thresholdModel = new Threshold(db);

    try {
        const threshold = await thresholdModel.getThreshold();
        res.status(200).send({ value: threshold });
    } catch (err) {
        console.error('Error fetching threshold:', err);
        res.status(500).send({ message: 'An unexpected error occurred' });
    }
};

exports.deleteFeedback = async (req, res) => {
    const { name } = req.params;
    const db = req.app.locals.db;
    const feedbackModel = new Feedback(db);

    try {
        console.log(`Received request to delete feedback with name: ${name}`);
        const result = await feedbackModel.deleteFeedbackByName(name);
        if (result.deletedCount === 0) {
            console.log(`Feedback with name ${name} not found`);
            return res.status(404).send({ message: 'Feedback not found' });
        }
        console.log(`Feedback with name ${name} deleted successfully`);
        res.status(200).send({ message: 'Feedback deleted successfully' });
    } catch (err) {
        console.error('Error deleting feedback:', err);
        res.status(500).send({ message: 'An unexpected error occurred' });
    }
};

exports.updatePassword = async (req, res) => {
    const { username, newPassword } = req.body;
    const db = req.app.locals.db;
    const userModel = new User(db);

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    try {
        await userModel.updateUserPassword(username, hashedPassword);
        res.status(200).send({ message: 'Password updated successfully' });
    } catch (err) {
        console.error('Error updating password:', err);
        res.status(500).send({ message: 'An unexpected error occurred' });
    }
};


