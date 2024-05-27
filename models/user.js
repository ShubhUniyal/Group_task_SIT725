const { ObjectId } = require('mongodb');

class User {
    constructor(db) {
        this.collection = db.collection('users');
    }

    async createUser(username, passwordHash) {
        try {
            const result = await this.collection.insertOne({ username, password: passwordHash });
            return result.insertedId;  // Access the inserted document ID directly
        } catch (error) {
            console.error('Error inserting user into database:', error);
            throw new Error('Database insertion error');
        }
    }

    async findUserByUsername(username) {
        return await this.collection.findOne({ username });
    }
    async updateUserPassword(username, hashedPassword) {
        try {
            const result = await this.collection.updateOne(
                { username },
                { $set: { password: hashedPassword } }
            );
            return result;
        } catch (err) {
            console.error('Error updating user password:', err);
            throw err;
        }
    }
}

module.exports = User;
