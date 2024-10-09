import mongoose from 'mongoose';

const deviceSchema = new mongoose.Schema({
    deviceID: { type: String, required: true },
    zone: { type: String, required: true },
    binID: { type: String, required: true },
    installationDate: { type: Date, required: true },
});

export default mongoose.model('Device', deviceSchema);