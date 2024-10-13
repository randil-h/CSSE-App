import express from 'express';
import mongoose from 'mongoose';
import Bin from '../../models/Collection/bin.js';

const router = express.Router();

router.post('/', async (req, res) => {
    const { binID, zone, collectorID, collectionTime, wasteLevel, category } = req.body;

    if (!binID || !zone || !collectorID || !collectionTime || wasteLevel || category == null) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    try {
        const newBin = new Bin({
            binID,
            zone,
            collectorID,
            collectionTime,
            wasteLevel,
          category,
        });

        await newBin.save();
        res.status(201).json({
            message: 'Bin created successfully!',
            bin: newBin
        });
    } catch (error) {
        console.error('Error creating bin:', error);
        res.status(500).json({ message: 'Server error' });
    }
});


router.get('/', async (req, res) => {
    try {
        const bins = await Bin.find();
        res.status(200).json(bins);
    } catch (error) {
        console.error('Error fetching bins:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;

    // Check if 'id' is a string and not an object
    if (typeof id !== 'string') {
        return res.status(400).json({ message: 'Invalid binID. Expected a string.' });
    }

    try {
        let bin;

        if (mongoose.Types.ObjectId.isValid(id)) {
            bin = await Bin.findById(id);
        } else {
            bin = await Bin.findOne({ binID: id });
        }

        if (!bin) {
            return res.status(404).json({ message: 'Bin not found' });
        }

        res.status(200).json(bin);
    } catch (error) {
        console.error('Error fetching bin:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.put('/:binID', async (req, res) => {
    const { binID } = req.params;
    const updateData = req.body;

    console.log('Received PUT request for bin:', binID);
    console.log('Request body:', JSON.stringify(updateData, null, 2));

    try {
        let bin = await Bin.findOne({ binID: binID });
        console.log('Found bin:', bin ? JSON.stringify(bin, null, 2) : 'Not found');

        if (!bin) {
            console.log('Bin not found:', binID);
            return res.status(404).json({ message: 'Bin not found' });
        }

        Object.keys(updateData).forEach(key => {
            if (updateData[key] !== undefined) {
                bin[key] = updateData[key];
            }
        });

        if (updateData.wasteLevel !== undefined) {
            bin.collectionTime = Date.now();
        }

        let updatedBin = await bin.save();
        console.log('Bin updated successfully:', JSON.stringify(updatedBin, null, 2));

        res.status(200).json({ message: 'Bin updated successfully!', bin: updatedBin });
    } catch (error) {
        console.error('Unexpected error updating bin:', error);
        res.status(500).json({
            message: 'Unexpected server error',
            error: error.message,
            stack: error.stack
        });
    }
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const deletedBin = await Bin.findByIdAndDelete(id);
        if (!deletedBin) {
            return res.status(404).json({ message: 'Bin not found' });
        }

        res.status(200).json({ message: 'Bin deleted successfully!' });
    } catch (error) {
        console.error('Error deleting bin:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/test/:binID', async (req, res) => {
    const { binID } = req.params;
    try {
        const bin = await Bin.findOne({ binID: binID });
        if (!bin) {
            return res.status(404).json({ message: 'Bin not found' });
        }
        res.json(bin);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching bin', error: error.message });
    }
});

export default router;
