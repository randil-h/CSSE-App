import express from 'express';
import cors from 'cors';
import AutoSchedule from './models/Autoschedule/AutoscheduleModel.js'; // Import the AutoSchedule model

const PORT = process.env.PORT || 9494;

const app = express();

app.use(cors());

const collectors = Array.from({ length: 50 }, (_, index) => `Collector${index + 120}`);
const categories = ['General', 'Organic', 'Recyclable', 'Hazardous'];

const getRandomInRange = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const getSkewedWasteLevel = () => {
  const skew = Math.random();
  if (skew < 0.25) {
    return getRandomInRange(0, 20);
  } else if (skew < 0.5) {
    return getRandomInRange(20, 40);
  } else if (skew < 0.75) {
    return getRandomInRange(60, 80);
  } else {
    return getRandomInRange(80, 100);
  }
};

// Helper function to handle the deletion after 2 minutes
const scheduleDeletion = (scheduleId) => {
  setTimeout(async () => {
    try {
      const deletedSchedule = await AutoSchedule.findByIdAndDelete(scheduleId);
      if (deletedSchedule) {
        console.log(`Autoschedule ${scheduleId} deleted after 2 minutes.`);
      }
    } catch (error) {
      console.error(`Error deleting autoschedule ${scheduleId}:`, error);
    }
  }, 120000);  // 2 minutes = 120000 ms
};

export let bins = Array.from({ length: 1000 }, (_, index) => ({
  binID: `B${(index + 1).toString().padStart(4, '0')}`,
  zone: `${String.fromCharCode(65 + (index % 6))}`,
  collectorID: collectors[getRandomInRange(0, collectors.length - 1)],
  collectionTime: Math.floor(Date.now() / 1000),
  wasteLevel: getSkewedWasteLevel(),
  fillRate: Math.random() * 10 + 1,
  category: categories[getRandomInRange(0, categories.length - 1)]
}));

// Function to update waste levels over time and simulate emptying
export async function updateWasteLevels() {
  bins = await Promise.all(bins.map(async (bin) => {
    let newWasteLevel = bin.wasteLevel;
    newWasteLevel += bin.fillRate;

    if (newWasteLevel > 100) {
      newWasteLevel = 100;
    }
    newWasteLevel = Math.round(newWasteLevel);

    const shouldEmptyBin = Math.random() < 0.05 || newWasteLevel === 100;
    if (shouldEmptyBin) {
      console.log(`Bin ${bin.binID} is being emptied.`);
      newWasteLevel = 0;
    }

    if (bin.wasteLevel !== newWasteLevel) {
      console.log(`Bin ${bin.binID} changed from ${bin.wasteLevel}% to ${newWasteLevel}%`);
    }

    // Check if the waste level dropped below 5
    if (newWasteLevel < 5) {
      const autoschedule = await AutoSchedule.findOne({ binID: bin.binID, status: 'Active' });
      if (autoschedule) {
        autoschedule.status = 'Completed';
        autoschedule.date = new Date();  // Update the completion date to the current time
        autoschedule.time = new Date().toLocaleTimeString('en-US', { hour12: false }); // Use 24-hour format
        await autoschedule.save();
        console.log(`Autoschedule for bin ${bin.binID} marked as Completed.`);

        // Schedule deletion after 2 minutes
        scheduleDeletion(autoschedule._id);
      }
    }

    return {
      ...bin,
      wasteLevel: newWasteLevel,
      collectionTime: shouldEmptyBin ? Math.floor(Date.now() / 1000) : bin.collectionTime,
    };
  }));

  return bins;
}



// Endpoint to get bin simulation data
app.get('/bin-simulation', (req, res) => {
  res.json(bins);
});

// Endpoint to update waste levels manually (if needed)
app.get('/update-waste-levels', async (req, res) => {
  const updatedBins = await updateWasteLevels();
  res.json(updatedBins);
});

// Set up an interval to update waste levels every 5 seconds
setInterval(async () => {
  console.log('Updating waste levels...');
  await updateWasteLevels();
}, 5000); // 5000 ms = 5 seconds

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
