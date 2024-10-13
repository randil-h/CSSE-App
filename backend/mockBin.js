import express from 'express';
import cors from 'cors';

const PORT = process.env.PORT || 9494;

const app = express();

app.use(cors());

// Array of collectors
const collectors = Array.from({ length: 50 }, (_, index) => `Collector${index + 120}`);

// Categories for bins
const categories = ['General', 'Organic', 'Recyclable', 'Hazardous'];

// Helper function to generate random values within a range
const getRandomInRange = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// Helper function to skew waste levels to extremes (favor low or high)
const getSkewedWasteLevel = () => {
  const skew = Math.random(); // Generate a random number between 0 and 1

  if (skew < 0.25) {
    // 25% chance of having very low waste level (0-20)
    return getRandomInRange(0, 20);
  } else if (skew < 0.5) {
    // 25% chance of having moderately low waste level (20-40)
    return getRandomInRange(20, 40);
  } else if (skew < 0.75) {
    // 25% chance of having moderately high waste level (60-80)
    return getRandomInRange(60, 80);
  } else {
    // 25% chance of having very high waste level (80-100)
    return getRandomInRange(80, 100);
  }
};

// Initialize bins with 1000 entries and skewed waste levels per zone
export let bins = Array.from({ length: 1000 }, (_, index) => ({
  binID: `B${(index + 1).toString().padStart(4, '0')}`,
  zone: `${String.fromCharCode(65 + (index % 10))}`, // More zones for better distribution
  collectorID: collectors[getRandomInRange(0, collectors.length - 1)], // Random collector assignment
  collectionTime: Math.floor(Date.now() / 1000),
  wasteLevel: getSkewedWasteLevel(),  // Skewed random waste levels
  fillRate: Math.random() * 10 + 1,  // Fill rate varies (1 to 11)
  category: categories[getRandomInRange(0, categories.length - 1)]  // Random category assignment
}));

// Function to update waste levels over time and simulate emptying
export function updateWasteLevels() {
  bins = bins.map((bin) => {
    let newWasteLevel = bin.wasteLevel;

    // Update waste level based on fill rate
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

    // Log the change in waste level
    if (bin.wasteLevel !== newWasteLevel) {
      console.log(`Bin ${bin.binID} in ${bin.zone} changed from ${bin.wasteLevel}% to ${newWasteLevel}%`);
    }

    // Return updated bin information
    return {
      ...bin,
      wasteLevel: newWasteLevel,
      collectionTime: shouldEmptyBin ? Math.floor(Date.now() / 1000) : bin.collectionTime,
    };
  });

  return bins;
}

// Endpoint to get bin simulation data
app.get('/bin-simulation', (req, res) => {
  res.json(bins);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Optional: Add a route to update the waste levels (if needed)
app.get('/update-waste-levels', (req, res) => {
  const updatedBins = updateWasteLevels();
  res.json(updatedBins);
});

export default app;
