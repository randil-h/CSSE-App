import express from 'express';
import cors from 'cors';

const PORT = process.env.PORT || 9494;

const app = express();

app.use(cors());

let bins = Array.from({ length: 65 }, (_, index) => ({
    _id: `bin_${index + 1}`,
    binID: `B${(index + 1).toString().padStart(3, '0')}`,
    zone: `Zone ${String.fromCharCode(65 + (index % 6))}`, // Zones: A, B, C, D, E, F
    collectorID: `Collector${Math.floor(Math.random() * 10) + 120}`, // Random collector IDs
    collectionTime: Math.floor(Date.now() / 1000), // Unix timestamp
    wasteLevel: Math.floor(Math.random() * 100) // Initial waste level between 0 and 100
}));

function updateWasteLevels() {
    bins = bins.map((bin) => {
        const change = Math.floor(Math.random() * 20) - 10;
        let newWasteLevel = Math.max(0, Math.min(100, bin.wasteLevel + change));

        if (bin.wasteLevel !== newWasteLevel) {
            console.log(
                `Bin ${bin.binID} in ${bin.zone} changed from ${bin.wasteLevel}% to ${newWasteLevel}%`
            );
        }

        return {
            ...bin,
            wasteLevel: newWasteLevel,
            collectionTime: Math.floor(Date.now() / 1000)
        };
    });
}

// Schedule waste level updates every 5 seconds
setInterval(updateWasteLevels, 5000);

// API Endpoint to get the bins data
app.get('/bin-simulation', (req, res) => {
    res.json(bins);
});

export default app;
