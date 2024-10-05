const mongoose = require('mongoose');

const binSchema = new mongoose.Schema({
    binID: { type: String, required: true },
    zone: { type: String, required: true },
    collectorID: { type: String, required: true },
    collectionTime: { type: Number, required: true },
    wasteLevel: { type: Number, required: true },
});

module.exports = mongoose.model('Bin', binSchema);