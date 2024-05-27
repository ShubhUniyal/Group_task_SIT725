class Threshold {
    constructor(db) {
        this.collection = db.collection('thresholds');
    }

    async setThreshold(value) {
        const result = await this.collection.insertOne({ threshold: value });
        return result.insertedId;
    }

    async updateThreshold(value) {
        const result = await this.collection.updateOne({}, { $set: { threshold: value } }, { upsert: true });
        return result.matchedCount > 0;
    }

    async getThreshold() {
        const threshold = await this.collection.findOne({});
        return threshold ? threshold.threshold : null;
    }
}

module.exports = Threshold;
