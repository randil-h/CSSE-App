import mongoose from 'mongoose';

const newScheduleSchema = new mongoose.Schema({
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

const NewSchedule = mongoose.model('New Schedule (prediction)', newScheduleSchema);

export default NewSchedule;