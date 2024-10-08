import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { mongoDBURL, PORT } from "./config.js";
import binRoutes from "./routes/CollectionRoutes/BinRoutes.js";
import mockBin, { bins as mockBins, updateWasteLevels } from "./mockBin.js";
import schedulesRoutes from "./routes/Schedules/ScheduleRoutes.js";
import Bin from "./models/Collection/bin.js";

const app = express();

app.use(express.json());
app.use(cors({
    origin: ['http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type'],
}));

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

        setInterval(updateBinsInDatabase, 60000);
    })
    .catch((error) => {
        console.log(error);
    });

app.use('/bin', binRoutes);
app.use('/bin-simulation', mockBin);
app.use('/schedule', schedulesRoutes);

export default app;