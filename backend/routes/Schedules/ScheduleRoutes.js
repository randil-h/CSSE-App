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

export default router;
