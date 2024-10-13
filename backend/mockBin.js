import express from 'express';
import cors from 'cors';

const PORT = process.env.PORT || 9494;

const app = express();

app.use(cors());

const collectors = Array.from({ length: 10 }, (_, index) => `Collector${index + 120}`);

// Categories for bins
const categories = ['General', 'Organic', 'Recyclable', 'Hazardous'];

// Initialize bins with 200 entries
export let bins = Array.from({ length: 200 }, (_, index) => ({
  binID: `B${(index + 1).toString().padStart(3, '0')}`,
  zone: `${String.fromCharCode(65 + (index % 6))}`,
  collectorID: collectors[index % collectors.length],
  collectionTime: Math.floor(Date.now() / 1000),
  wasteLevel: Math.floor(Math.random() * 80) + 20,  // Starting with a higher variation (20% to 100%)
  fillRate: Math.random() * 8 + 1,  // Fill rate now varies more (1 to 9)
  category: categories[index % categories.length]  // Assign category to each bin
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
