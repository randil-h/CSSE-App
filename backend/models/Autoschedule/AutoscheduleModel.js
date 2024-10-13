import mongoose from 'mongoose';

const AutoscheduleSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  binID: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true
  }
});

const AutoSchedule = mongoose.model('Auto Schedule', AutoscheduleSchema);

export default AutoSchedule;
