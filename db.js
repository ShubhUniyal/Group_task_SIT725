// db.js
const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

let db;

async function connectDB() {
    try {
        await client.connect();
        console.log('Connected to MongoDB');
        db = client.db('fireDetectionDB');
    } catch (err) {
        console.error(err);
    }
}

function getDB() {
    return db;
}

module.exports = { connectDB, getDB };
