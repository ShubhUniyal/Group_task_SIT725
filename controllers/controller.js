const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const JWT_SECRET = '1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';

// Main Controller
exports.getIndex = (req, res) => {
    res.sendFile(path.join(__dirname, '../views/index.html'));
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
        res.send({ token });
    } catch (err) {
        console.error('Error during login:', err); // Log unexpected errors
        res.status(500).send({ message: 'An unexpected error occurred' });
    }
};
