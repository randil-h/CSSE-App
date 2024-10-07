import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { mongoDBURL, PORT } from "./config.js";
import binRoutes from "./routes/binRoutes.js";

import scheduleRoutes from "./routes/Schedules/ScheduleRoutes.js";

import mockBin from "./mockBin.js";


const app = express();

app.use(express.json());
app.use(cors({
    origin: ['http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT','PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type'],
}));

mongoose
    .connect(mongoDBURL)
    .then(() => {
        console.log('App connected to the database');
        app.listen(PORT, () => {
            console.log(`App is listening on port: ${PORT}`);
        });
    })
    .catch((error) => {
        console.log(error);
    });

app.use('/bin', binRoutes);

app.use('/schedule', scheduleRoutes);

app.use('/bin-simulation', mockBin);


