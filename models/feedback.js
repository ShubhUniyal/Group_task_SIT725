class Feedback {
    constructor(db) {
        this.collection = db.collection('feedbacks'); // Ensure collection name is 'feedbacks'
    }

    async deleteFeedbackByName(name) {
        try {
            console.log(`Attempting to delete feedback with name: ${name}`);
            const regex = new RegExp(`^${name}$`, 'i'); // Create a case-insensitive regular expression
            const feedbacks = await this.collection.find({}).toArray(); // Fetch all feedbacks for logging
            console.log(`All feedbacks in the collection: ${JSON.stringify(feedbacks)}`);

            const result = await this.collection.deleteOne({ name: regex });
            console.log(`Delete operation result: ${JSON.stringify(result)}`);
            return result;
        } catch (err) {
            console.error('Error deleting feedback:', err);
            throw err;
        }
    }
}

module.exports = Feedback;
