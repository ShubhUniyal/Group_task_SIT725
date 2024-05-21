const { MongoClient } = require('mongodb');

const uri = 'mongodb+srv://Devesh:admin@cluster0.c7elije.mongodb.net/task4?retryWrites=true&w=majority&appName=Cluster0';

async function connectToMongoDB() {
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
        await client.connect();
        console.log('Connected to MongoDB');
        return client.db('task4');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
    }
}

module.exports = connectToMongoDB;
