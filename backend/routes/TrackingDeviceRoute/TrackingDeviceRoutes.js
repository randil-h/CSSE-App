import express from 'express';
import Device from '../../models/TrackingDevice/trackingDevice.js';
import Schedule from "../../models/Schedules/SchedulesModel.js";

const router = express.Router();

router.post('/', async (req, res) => {
    const { deviceID, zone, binID, installationDate} = req.body;

    if (!deviceID || !zone || !binID || !installationDate == null) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    try {
        const newDevice = new Device({
            deviceID,
            zone,
            binID,
            installationDate,
        });

        await newDevice.save();
        res.status(201).json({
            message: 'Device created successfully!',
            device: newDevice
        });
    } catch (error) {
        console.error('Error creating bin:', error);
        res.status(500).json({ message: 'Server error' });
    }
});


router.get('/', async (req, res) => {
    try {
        const devices = await Device.find();
        res.status(200).json(devices);
    } catch (error) {
        console.error('Error fetching bins:', error);
        res.status(500).json({ message: 'Server error' });
    }
});


router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { deviceID, zone, binID, installationDate } = req.body;

    if (!deviceID || !zone || !binID || !installationDate == null) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    try {
        const updateDevice = await Device.findByIdAndUpdate(
            id,
            { deviceID, zone, binID, installationDate},
            { new: true }
        );

        if (!updateDevice) {
            return res.status(404).json({ message: 'Bin not found' });
        }

        res.status(200).json({ message: 'Bin updated successfully!', bin: updateDevice });
    } catch (error) {
        console.error('Error updating bin:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const deleteDevice = await Device.findByIdAndDelete(id);
        if (!deleteDevice) {
            return res.status(404).json({ message: 'Device not found' });
        }

        res.status(200).json({ message: 'Device deleted successfully!' });
    } catch (error) {
        console.error('Error deleting bin:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// In your bin route (bin.js)
router.get('/charts', async (req, res) => {
    const { filterBy } = req.query; // Get filter parameter

    let startDate, endDate;
    const now = new Date();

    if (filterBy === 'week') {
        // Filter for the current week
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay()); // Start of the week (Sunday)

        const endOfWeek = new Date(now);
        endOfWeek.setDate(now.getDate() + (6 - now.getDay())); // End of the week (Saturday)

        startDate = startOfWeek;
        endDate = endOfWeek;
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
        // Match filtered dates
        const query = { installationDate: { $gte: startDate, $lte: endDate } };

        const device = await Device.aggregate([
            { $match: query }, // Match filtered dates
            { $group: { _id: "$zone", count: { $sum: 1 } } }, // Group by location and count
            { $sort: { _id: 1}}
        ]);

        res.status(200).send(device);
    } catch (error) {
        console.error('Error fetching device data:', error);
        res.status(500).send({ message: 'Server error' });
    }
});

const getDateRange = (filterType) => {
    const today = new Date();
    let startDate;
    let endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0); // End of the current month

    switch (filterType) {
        case 'month':
            startDate = new Date(today.getFullYear(), today.getMonth(), 1); // Start of the current month
            break;
        case 'week':
            startDate = new Date(today.setDate(today.getDate() - today.getDay())); // Start of the week
            endDate = new Date(today.setDate(today.getDate() + 6)); // End of the week
            break;
        case 'year':
            startDate = new Date(today.getFullYear(), 0, 1); // Start of the current year
            break;
        default:
            throw new Error('Invalid filter type');
    }
    return { startDate, endDate };
};



export default router;