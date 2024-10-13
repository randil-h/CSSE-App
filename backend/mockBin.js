import express from 'express';
import cors from 'cors';

const PORT = process.env.PORT || 9494;

const app = express();

app.use(cors());

const collectors = Array.from({ length: 10 }, (_, index) => `Collector${index + 120}`);

// Initialize bins with 65 entries
export let bins = Array.from({ length: 65 }, (_, index) => ({
    binID: `B${(index + 1).toString().padStart(3, '0')}`,
    zone: `${String.fromCharCode(65 + (index % 6))}`,
    collectorID: collectors[index % collectors.length],
    collectionTime: Math.floor(Date.now() / 1000),
    wasteLevel: Math.floor(Math.random() * 30),
    fillRate: Math.random() * 5 + 1,
}));

// Function to update waste levels over time and simulate emptying
export function updateWasteLevels() {
    bins = bins.map((bin) => {
        let newWasteLevel = bin.wasteLevel;

        newWasteLevel += bin.fillRate;

        if (newWasteLevel > 100) {
            newWasteLevel = 100;
        }

        newWasteLevel = Math.round(newWasteLevel);

        const shouldEmptyBin = Math.random() < 0.05 || newWasteLevel === 100;
        if (shouldEmptyBin) {
            console.log(`Bin ${bin.binID} in ${bin.zone} is being emptied.`);
            newWasteLevel = 0;
        }

        if (bin.wasteLevel !== newWasteLevel) {
            console.log(
                //`Bin ${bin.binID} in ${bin.zone} changed from ${bin.wasteLevel}% to ${newWasteLevel}%`
            );
        }

        return {
            ...bin,
            wasteLevel: newWasteLevel,
            collectionTime: shouldEmptyBin ? Math.floor(Date.now() / 1000) : bin.collectionTime
        };
    });

    return bins;
}

app.get('/bin-simulation', (req, res) => {
    res.json(bins);
});

export default app;
