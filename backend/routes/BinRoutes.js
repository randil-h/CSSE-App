const express = require('express');
const router = express.Router();
const Bin = require('../models/bin');

router.post('/', async (req, res) => {
    const { binID, zone, collectorID, collectionTime, wasteLevel } = req.body;

    if (!binID || !zone || !collectorID || !collectionTime || wasteLevel == null) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    try {
        const newBin = new Bin({
            binID,
            zone,
            collectorID,
            collectionTime,
            wasteLevel,
        });

        await newBin.save();
        res.status(201).json({ message: 'Bin created successfully!', bin: newBin });
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

    try {
        const bin = await Bin.findById(id);
        if (!bin) {
            return res.status(404).json({ message: 'Bin not found' });
        }

        res.status(200).json(bin);
    } catch (error) {
        console.error('Error fetching bin:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { binID, zone, collectorID, collectionTime, wasteLevel } = req.body;

    if (!binID || !zone || !collectorID || !collectionTime || wasteLevel == null) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    try {
        const updatedBin = await Bin.findByIdAndUpdate(
            id,
            { binID, zone, collectorID, collectionTime, wasteLevel },
            { new: true }
        );

        if (!updatedBin) {
            return res.status(404).json({ message: 'Bin not found' });
        }

        res.status(200).json({ message: 'Bin updated successfully!', bin: updatedBin });
    } catch (error) {
        console.error('Error updating bin:', error);
        res.status(500).json({ message: 'Server error' });
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

module.exports = router;
