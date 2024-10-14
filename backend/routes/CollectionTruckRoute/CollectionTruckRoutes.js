import express from 'express';
import Schedule from "../../models/Schedules/SchedulesModel.js";
import NewSchedule from "../../models/Prediction Schedule/NewScheduleModel.js";
import CollectionTruck from "../../models/CollectionTruck/CollectionTruckModel.js";

const router = express.Router();

// Create a new schedule entry
router.post('/', async (req, res) => {
    try {
        const schedule = new CollectionTruck(req.body);
        await schedule.save();
        res.status(201).send(schedule);
    } catch (error) {
        res.status(400).send(error);
    }
});

router.post('/multiple', async (req, res) => {
    try {
        const schedules = req.body; // Assuming an array of schedules is sent
        if (!Array.isArray(schedules)) {
            return res.status(400).send({ message: 'Expected an array of schedules.' });
        }

        // Validate and save each schedule
        const savedSchedules = await CollectionTruck.insertMany(schedules);

        res.status(201).send(savedSchedules);
    } catch (error) {
        console.error('Error saving schedules:', error);
        res.status(400).send({ message: error.message });
    }
});


// Read all schedule entries
router.get('/', async (req, res) => {
    try {
        const schedules = await CollectionTruck.find();
        res.status(200).send(schedules);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Update a schedule entry
router.put('/:id', async (req, res) => {
    try {
        const schedule = await CollectionTruck.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!schedule) return res.status(404).send();
        res.status(200).send(schedule);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Delete a schedule entry
router.delete('/:id', async (req, res) => {
    try {
        const schedule = await CollectionTruck.findByIdAndDelete(req.params.id);
        if (!schedule) return res.status(404).send();
        res.status(200).send(schedule);
    } catch (error) {
        res.status(500).send(error);
    }
});
// PATCH route to update a schedule
router.patch('/:id', async (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    console.log(`Updating schedule ID: ${id}, with updates:`, updates); // Log incoming data

    try {
        const updatedSchedule = await NewSchedule.findByIdAndUpdate(id, updates, { new: true });
        if (!updatedSchedule) {
            return res.status(404).json({ message: 'Schedule not found' });
        }
        res.status(200).json(updatedSchedule);
    } catch (error) {
        console.error('Error updating schedule:', error); // Log error
        res.status(500).json({ message: error.message });
    }
});

router.get('/truck_status', async (req, res) => {
    try {
        const trucksStatus = await CollectionTruck.aggregate([
            {
                $group: {
                    _id: "$status", // Group by status
                    count: { $sum: 1 } // Count the number of trucks for each status
                }
            },
            {
                $sort: { _id: 1 } // Optional: Sort by status
            }
        ]);

        res.status(200).send(trucksStatus);
    } catch (error) {
        res.status(500).send(error);
    }
});


export default router;