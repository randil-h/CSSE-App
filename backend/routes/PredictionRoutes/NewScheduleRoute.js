import express from 'express';
import Schedule from "../../models/Schedules/SchedulesModel.js";
import NewSchedule from "../../models/Prediction Schedule/NewScheduleModel.js";

const router = express.Router();

// Create a new schedule entry
router.post('/', async (req, res) => {
    try {
        const schedule = new NewSchedule(req.body);
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
        const savedSchedules = await NewSchedule.insertMany(schedules);

        res.status(201).send(savedSchedules);
    } catch (error) {
        console.error('Error saving schedules:', error);
        res.status(400).send({ message: error.message });
    }
});


// Read all schedule entries
router.get('/', async (req, res) => {
    try {
        const schedules = await NewSchedule.find();
        res.status(200).send(schedules);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Update a schedule entry
router.put('/:id', async (req, res) => {
    try {
        const schedule = await NewSchedule.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!schedule) return res.status(404).send();
        res.status(200).send(schedule);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Delete a schedule entry
router.delete('/:id', async (req, res) => {
    try {
        const schedule = await NewSchedule.findByIdAndDelete(req.params.id);
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

router.get('/charts', async (req, res) => {
    const { filterBy } = req.query; // Get filter parameter

    let startDate, endDate;
    const now = new Date();

    if (filterBy === 'week') {
        // Filter for the current week
        startDate = new Date(now.setDate(now.getDate() - now.getDay())); // Start of the week (Sunday)
        endDate = new Date(now.setDate(now.getDate() + 6)); // End of the week (Saturday)
    } else if (filterBy === 'month') {
        // Filter for the current month
        startDate = new Date(now.getFullYear(), now.getMonth(), 1); // Start of the month
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0); // End of the month
    } else if (filterBy === 'year') {
        // Filter for the current year
        startDate = new Date(now.getFullYear(), 0, 1); // Start of the year
        endDate = new Date(now.getFullYear(), 11, 31); // End of the year
    }

    try {
        // If a filter is provided, apply date range filtering
        const query = startDate && endDate ? { date: { $gte: startDate, $lte: endDate } } : {};

        const schedules = await NewSchedule.aggregate([
            { $match: query }, // Match filtered dates
            { $group: { _id: "$location", count: { $sum: 1 } } }, // Group by location and count
            { $sort: { _id: 1}}
        ]);

        res.status(200).send(schedules);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.get('/timeslot-average', async (req, res) => {
    const { dayOfWeek } = req.query; // Get the day of the week filter (optional)

    // Define the timeslots (in military time format)
    const timeslots = [
        { start: '08:00', end: '10:00' },
        { start: '10:00', end: '12:00' },
        { start: '12:00', end: '14:00' },
        { start: '14:00', end: '16:00' },
        { start: '16:00', end: '18:00' },
        { start: '18:00', end: '20:00' },
    ];

    try {
        // Creating match query for the day of the week filter
        const match = {};
        if (dayOfWeek) {
            match.$expr = {
                $eq: [{ $dayOfWeek: "$date" }, parseInt(dayOfWeek)] // 1 = Sunday, 7 = Saturday
            };
        }

        const schedules = await NewSchedule.aggregate([
            { $match: match }, // Match by day of the week if provided
            {
                $addFields: {
                    // Split the time string into start and end times
                    timeRange: {
                        $split: ["$time", " - "]
                    }
                }
            },
            {
                $addFields: {
                    startTime: { $arrayElemAt: ["$timeRange", 0] }, // Get the start time
                    endTime: { $arrayElemAt: ["$timeRange", 1] } // Get the end time
                }
            },
            {
                $addFields: {
                    timeslot: {
                        $switch: {
                            branches: timeslots.map((slot, index) => ({
                                case: {
                                    $and: [
                                        { $eq: ["$startTime", slot.start] }, // Match start time
                                        { $eq: ["$endTime", slot.end] } // Match end time
                                    ]
                                },
                                then: index + 1 // Assign an index to each timeslot
                            })),
                            default: null
                        }
                    }
                }
            },
            { $match: { timeslot: { $ne: null } } }, // Only include documents that match a timeslot
            {
                $group: {
                    _id: "$timeslot", // Group by timeslot
                    totalSchedules: { $sum: 1 }, // Count the schedules
                    daysWithSchedules: { $addToSet: { $dayOfYear: "$date" } } // Count unique days
                }
            },
            {
                $addFields: {
                    daysCount: { $size: "$daysWithSchedules" }, // Number of unique days
                    averageSchedules: { $divide: ["$totalSchedules", { $size: "$daysWithSchedules" }] } // Calculate average
                }
            },
            {
                $sort: { _id: 1 } // Sort by timeslot
            }
        ]);

        // Format the response with timeslot labels
        const response = schedules.map(schedule => ({
            timeslot: `${timeslots[schedule._id - 1].start}-${timeslots[schedule._id - 1].end}`,
            averageSchedules: schedule.averageSchedules
        }));

        res.status(200).json(response);
    } catch (error) {
        res.status(500).send(error);
    }
});


export default router;