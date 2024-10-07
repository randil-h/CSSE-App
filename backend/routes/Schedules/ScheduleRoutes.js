import express from 'express';
import Schedule from "../../models/Schedules/SchedulesModel.js";

const router = express.Router();

// Create a new schedule entry
router.post('/', async (req, res) => {
    try {
        const schedule = new Schedule(req.body);
        await schedule.save();
        res.status(201).send(schedule);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Read all schedule entries
router.get('/', async (req, res) => {
    try {
        const schedules = await Schedule.find();
        res.status(200).send(schedules);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Update a schedule entry
router.put('/:id', async (req, res) => {
    try {
        const schedule = await Schedule.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!schedule) return res.status(404).send();
        res.status(200).send(schedule);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Delete a schedule entry
router.delete('/:id', async (req, res) => {
    try {
        const schedule = await Schedule.findByIdAndDelete(req.params.id);
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
        const updatedSchedule = await Schedule.findByIdAndUpdate(id, updates, { new: true });
        if (!updatedSchedule) {
            return res.status(404).json({ message: 'Schedule not found' });
        }
        res.status(200).json(updatedSchedule);
    } catch (error) {
        console.error('Error updating schedule:', error); // Log error
        res.status(500).json({ message: error.message });
    }
});


export default router;
