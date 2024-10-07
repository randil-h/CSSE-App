import express from 'express';
import cors from 'cors';

const PORT = process.env.PORT || 9494;

const app = express();

app.use(cors());

// Initialize bins with 65 entries
let bins = Array.from({ length: 65 }, (_, index) => ({
    _id: `bin_${index + 1}`,
    binID: `B${(index + 1).toString().padStart(3, '0')}`,
    zone: `Zone ${String.fromCharCode(65 + (index % 6))}`, // Zones: A, B, C, D, E, F
    collectorID: `Collector${Math.floor(Math.random() * 10) + 120}`, // Random collector IDs
    collectionTime: Math.floor(Date.now() / 1000), // Unix timestamp for last collection
    wasteLevel: Math.floor(Math.random() * 30), // Initial waste level between 0 and 30%
    fillRate: Math.random() * 5 + 1, // Fill rate per interval (between 1% and 6% per minute)
}));

// Function to update waste levels over time and simulate emptying
function updateWasteLevels() {
    bins = bins.map((bin) => {
        let newWasteLevel = bin.wasteLevel;

        // Gradual increase in waste based on fill rate
        newWasteLevel += bin.fillRate;

        // Cap waste level to 100%
        if (newWasteLevel > 100) {
            newWasteLevel = 100;
        }

        newWasteLevel = Math.round(newWasteLevel);

        // Randomly empty the bin with a small probability or if it's full
        const shouldEmptyBin = Math.random() < 0.05 || newWasteLevel === 100; // 5% chance to empty + full bin
        if (shouldEmptyBin) {
            console.log(`Bin ${bin.binID} in ${bin.zone} is being emptied.`);
            newWasteLevel = 0; // Empty the bin
        }

        // Print log if waste level changes significantly
        if (bin.wasteLevel !== newWasteLevel) {
            console.log(
                `Bin ${bin.binID} in ${bin.zone} changed from ${bin.wasteLevel}% to ${newWasteLevel}%`
            );
        }

        // Update the bin's waste level and collection time
        return {
            ...bin,
            wasteLevel: newWasteLevel,
            collectionTime: shouldEmptyBin ? Math.floor(Date.now() / 1000) : bin.collectionTime
        };
    });
}

// Update waste levels every 1 minute (60000 ms)
setInterval(updateWasteLevels, 60000);

// API Endpoint to get the bins data
app.get('/bin-simulation', (req, res) => {
    res.json(bins);
});

// Start server if the module is the main entry point
if (process.argv[1] === new URL(import.meta.url).pathname) {
    app.listen(PORT, () => {
        console.log(`Garbage bin server running on http://localhost:${PORT}`);
    });
}

export default app;
