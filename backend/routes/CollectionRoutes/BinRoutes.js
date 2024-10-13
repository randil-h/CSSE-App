import express from 'express';
import Bin from '../../models/Collection/bin.js';

const router = express.Router();

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

    try {
        let bin;

        // If the ID is a valid ObjectId, search by _id
        if (mongoose.Types.ObjectId.isValid(id)) {
            bin = await Bin.findById(id);
        } else {
            // Otherwise, search by binID field
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


router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;

    console.log('Received PUT request for bin:', id);
    console.log('Request body:', updateData);

    try {
        let bin;
        try {
            bin = await Bin.findById(id);
            console.log('Found bin:', bin);
        } catch (findError) {
            console.error('Error finding bin:', findError);
            return res.status(500).json({ message: 'Error finding bin', error: findError.message });
        }

        if (!bin) {
            console.log('Bin not found:', id);
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

        let updatedBin;
        try {
            updatedBin = await bin.save();
            console.log('Bin updated successfully:', updatedBin);
        } catch (saveError) {
            console.error('Error saving updated bin:', saveError);
            return res.status(500).json({ message: 'Error saving updated bin', error: saveError.message });
        }

        res.status(200).json({ message: 'Bin updated successfully!', bin: updatedBin });
    } catch (error) {
        console.error('Unexpected error updating bin:', error);
        res.status(500).json({ message: 'Unexpected server error', error: error.message });
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

export default router;