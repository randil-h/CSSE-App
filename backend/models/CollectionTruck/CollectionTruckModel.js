import mongoose from 'mongoose';

const truckSchema = new mongoose.Schema({
    driverID: {
        type: String,
        required: true
    },
    route: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true

    }
});

const CollectionTruck = mongoose.model('Collection Trucks', truckSchema);

export default CollectionTruck;