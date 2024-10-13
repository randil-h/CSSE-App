import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { mongoDBURL, PORT } from "./config.js";
import binRoutes from "./routes/CollectionRoutes/BinRoutes.js";
import mockBin, { bins as mockBins, updateWasteLevels } from "./mockBin.js";
import schedulesRoutes from "./routes/Schedules/ScheduleRoutes.js";
import Bin from "./models/Collection/bin.js";
import trackingDeviceRoutes from "./routes/TrackingDeviceRoute/TrackingDeviceRoutes.js";
import schedulePredictorRoute from "./routes/PredictionRoutes/SchedulePredictorRoute.js";
import newScheduleRoute from "./routes/PredictionRoutes/NewScheduleRoute.js";
import morgan from 'morgan';

const app = express();

app.use(express.json());
app.use(cors({
    origin: process.env.NODE_ENV === 'production' ? 'https://your-production-domain.com' : '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));
app.use(morgan('dev')); // For logging requests in development mode

// Health check route
app.get('/health', (req, res) => {
    res.status(200).send('Server is healthy');
});

// Function to initialize the database with mockBin data only if it's empty
async function initializeDatabase() {
    try {
        const binCount = await Bin.countDocuments();
        if (binCount === 0) {
            const createdBins = await Bin.create(mockBins);
            console.log(`Initialized database with ${createdBins.length} bins`);
        } else {
            console.log(`Database already contains ${binCount} bins. Skipping initialization.`);
        }
    } catch (error) {
        console.error('Error initializing database:', error);
    }
}

// Function to update bins in the database
async function updateBinsInDatabase() {
    const updatedBins = updateWasteLevels();
    for (const bin of updatedBins) {
        try {
            await Bin.findOneAndUpdate({ binID: bin.binID }, bin, { new: true, upsert: true });
        } catch (error) {
            console.error(`Error updating bin ${bin.binID}:`, error);
        }
    }
}

mongoose
    .connect(mongoDBURL)
    .then(async () => {
        console.log('App connected to the database');
        await initializeDatabase();
        app.listen(PORT, () => {
            console.log(`App is listening on port: ${PORT}`);
        });

        // Periodically update bins, with error handling
        setInterval(async () => {
            try {
                await updateBinsInDatabase();
            } catch (error) {
                console.error('Error during bin update:', error);
            }
        }, 60000);
    })
    .catch((error) => {
        console.log(error);
    });

app.use('/bin', binRoutes);
app.use('/bin_simulation', mockBin);
app.use('/schedule', schedulesRoutes);
app.use('/device', trackingDeviceRoutes);
app.use('/predictor', schedulePredictorRoute);
app.use('/newSchedule', newScheduleRoute);

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('SIGINT signal received. Closing server gracefully.');
    await mongoose.connection.close();
    process.exit(0);
});

export default app;
