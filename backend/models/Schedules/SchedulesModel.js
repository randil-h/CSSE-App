import mongoose from 'mongoose';

const scheduleSchema = new mongoose.Schema({
    wasteType: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    specialRemarks: {
        type: String,
    },
    status: {
        type: String,
        enum: ['Pending', 'In progress', 'Cancelled', 'Completed'], // ensure 'Cancelled' is included
        default: 'Pending',
    },
});

const Schedule = mongoose.model('Schedule', scheduleSchema);

export default Schedule;
