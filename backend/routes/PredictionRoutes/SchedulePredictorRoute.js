import express from 'express';
import * as tf from '@tensorflow/tfjs';
import NewSchedule from "../../models/Prediction Schedule/NewScheduleModel.js";

const router = express.Router();

// Function to fetch training data
const getTrainingDataByLocation = async (location) => {
    try {
        const schedules = await NewSchedule.find({ location }); // Fetch schedules by location
        const data = schedules.map(schedule => ({
            date: new Date(schedule.date).getTime(), // Convert to timestamp
            count: 1 // Each schedule counts as 1
        }));

        const dailyCounts = {};
        data.forEach(item => {
            const date = new Date(item.date).toISOString().split('T')[0]; // Get date in YYYY-MM-DD format

            if (!dailyCounts[date]) {
                dailyCounts[date] = 0;
            }
            dailyCounts[date] += item.count; // Sum counts for the same date
        });

        // Convert daily counts to weekly data
        const weeklyCounts = {};
        Object.keys(dailyCounts).forEach(dateStr => {
            const date = new Date(dateStr);
            const weekStart = new Date(date);
            weekStart.setDate(weekStart.getDate() - weekStart.getDay()); // Get start of the week

            const key = `${weekStart.toISOString().split('T')[0]}`;

            if (!weeklyCounts[key]) {
                weeklyCounts[key] = { date: weekStart, count: 0 };
            }
            weeklyCounts[key].count += dailyCounts[dateStr]; // Sum counts for the week
        });

        return Object.values(weeklyCounts).map(entry => ({
            date: entry.date.getTime(),
            count: entry.count
        }));
    } catch (error) {
        console.error('Error fetching training data:', error);
        throw error;
    }
};

router.post('/predict', async (req, res) => {
    try {
        const distinctLocations = await NewSchedule.distinct('location');

        const predictions = [];

        for (const location of distinctLocations) {
            const data = await getTrainingDataByLocation(location);

            if (data.length === 0) continue;

            const inputs = data.map(entry => entry.date);
            const outputs = data.map(entry => entry.count);

            // Normalize dates and counts
            const minDate = Math.min(...inputs);
            const maxDate = Math.max(...inputs);
            const normalizedInputs = inputs.map(input => (input - minDate) / (maxDate - minDate));

            const inputTensor = tf.tensor2d(normalizedInputs, [normalizedInputs.length, 1]);
            const outputTensor = tf.tensor2d(outputs, [outputs.length, 1]);

            // Create and train the model
            const model = tf.sequential();
            model.add(tf.layers.dense({ units: 32, activation: 'relu', inputShape: [1] }));
            model.add(tf.layers.dense({ units: 16, activation: 'relu' }));
            model.add(tf.layers.dense({ units: 1 }));
            model.compile({ optimizer: 'adam', loss: 'meanSquaredError' });

            // Log inputs and outputs before fitting
            console.log('Inputs:', normalizedInputs);
            console.log('Outputs:', outputs);

            await model.fit(inputTensor, outputTensor, { epochs: 100 });

            // Predict for the next 4 weeks (normalize future dates)
            const futureDates = [];
            let lastDate = new Date(data[data.length - 1].date);
            for (let i = 0; i < 4; i++) {
                lastDate.setDate(lastDate.getDate() + 7);
                futureDates.push(lastDate.getTime());
            }

            const normalizedFutureDates = futureDates.map(date => (date - minDate) / (maxDate - minDate));
            const futureInputTensor = tf.tensor2d(normalizedFutureDates, [normalizedFutureDates.length, 1]);
            const predictedCounts = model.predict(futureInputTensor).dataSync();

            // Log predicted counts for debugging
            console.log('Predicted Counts:', predictedCounts);

            // Sum predictions and store result
            const totalPredictedSchedules = predictedCounts.reduce((sum, count) => sum + count, 0);
            predictions.push({ location, predictedCount: Math.round(totalPredictedSchedules) });
        }

        res.status(200).json(predictions);
    } catch (error) {
        console.error('Error in prediction:', error);
        res.status(500).json({ message: error.message });
    }
});

export default router;
