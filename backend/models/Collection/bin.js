import mongoose from 'mongoose';

const binSchema = new mongoose.Schema({
    binID: { type: String, required: true },
    zone: { type: String, required: true },
    collectorID: { type: String, required: true },
    collectionTime: { type: Number, required: true },
    wasteLevel: { type: Number, required: true },
  category: { type: String, required: true },
});

export default mongoose.model('Bin', binSchema);
