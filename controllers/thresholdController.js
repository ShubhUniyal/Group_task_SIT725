const { ObjectId } = require('mongodb');

exports.getThreshold = async (req, res) => {
    const db = req.app.locals.db;
    try {
        const threshold = await db.collection('threshold').findOne({});
        res.json({ value: threshold.value });
    } catch (error) {
        console.error('Error fetching threshold value:', error);
        res.status(500).json({ message: 'Failed to fetch threshold value' });
    }
};

exports.setThreshold = async (req, res) => {
    const { thresholdValue } = req.body;
    const db = req.app.locals.db;
    try {
        await db.collection('threshold').insertOne({ value: thresholdValue });
        res.status(201).json({ message: 'Threshold value set successfully' });
    } catch (error) {
        console.error('Error setting threshold value:', error);
        res.status(500).json({ message: 'Failed to set threshold value' });
    }
};

exports.updateThreshold = async (req, res) => {
    const { thresholdValue } = req.body;
    const db = req.app.locals.db;
    try {
        await db.collection('threshold').updateOne({}, { $set: { value: thresholdValue } });
        res.json({ message: 'Threshold value updated successfully' });
    } catch (error) {
        console.error('Error updating threshold value:', error);
        res.status(500).json({ message: 'Failed to update threshold value' });
    }
};
