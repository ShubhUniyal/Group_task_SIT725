// server.js
const express = require('express');
const bodyParser = require('body-parser');
const { connectDB, getDB } = require('./db');

const app = express();
app.use(bodyParser.json());

connectDB();

app.get('/api/records', async (req, res) => {
    const db = getDB();
    const records = await db.collection('records').find().toArray();
    res.json(records);
});

app.post('/api/records', async (req, res) => {
    const db = getDB();
    const record = req.body;
    await db.collection('records').insertOne(record);
    res.status(201).json(record);
});

app.put('/api/records/:id', async (req, res) => {
    const db = getDB();
    const id = req.params.id;
    const newValues = { $set: req.body };
    await db.collection('records').updateOne({ _id: new ObjectId(id) }, newValues);
    res.json({ message: 'Record updated' });
});

app.delete('/api/records/:id', async (req, res) => {
    const db = getDB();
    const id = req.params.id;
    await db.collection('records').deleteOne({ _id: new ObjectId(id) });
    res.json({ message: 'Record deleted' });
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
