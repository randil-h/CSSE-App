import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/utility/Navbar";
import SideBar from "../../components/utility/SideBar";
import { ArchiveBoxArrowDownIcon as ArchiveBoxArrowDownIconSolid } from '@heroicons/react/24/solid';
import { ArchiveBoxArrowDownIcon as ArchiveBoxArrowDownIconOutline } from '@heroicons/react/24/outline';

const breadcrumbItems = [
  { name: 'Schedules', href: '/Schedules/home' },
];

export default function MonitorWasteLevel() {
  const navigate = useNavigate();

  // State for sidebar visibility
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);

  // State for bins and zones
  const [binsData, setBinsData] = useState([]);
  const [zones, setZones] = useState([]);
  const [selectedZone, setSelectedZone] = useState("All Zones");

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  // Fetch bins data from the backend on component mount
  useEffect(() => {
    const fetchBins = async () => {
      const response = await fetch('http://localhost:5555/bin');
      const data = await response.json();
      setBinsData(data);

      // Get unique zones
      const uniqueZones = [...new Set(data.map(bin => bin.zone))];
      setZones(["All Zones", ...uniqueZones]); // Add "All Zones" option
    };

    fetchBins();
  }, []);

  // Calculate average fill rate for each zone
  const calculateAverageFillRates = () => {
    const zoneFillRates = {};

    binsData.forEach((bin) => {
      const { zone, wasteLevel } = bin;
      if (!zoneFillRates[zone]) {
        zoneFillRates[zone] = { total: 0, count: 0 };
      }
      zoneFillRates[zone].total += wasteLevel;
      zoneFillRates[zone].count += 1;
    });

    return Object.entries(zoneFillRates).map(([zone, { total, count }]) => ({
      zone,
      averageFillRate: total / count,
    }));
  };

  const averageFillRates = calculateAverageFillRates();

  return (
    <div className="min-h-screen flex flex-col bg-neutral-100">
      {/* Navbar */}
      <div className="sticky top-0 z-10">
        <Navbar />
        {/* Small Navbar with Sidebar Toggle Button */}
        <div className="bg-sky-100 w-full h-12 flex items-center justify-between px-4">
          <div className="text-gray-700 font-semibold">Monitor Waste Level</div>
          {/* Sidebar Toggle Button */}
          <button
            onClick={toggleSidebar}
            className="flex items-center justify-center text-black p-2 rounded-full transition"
            aria-label="Toggle Sidebar"
          >
            {isSidebarVisible ? (
              <ArchiveBoxArrowDownIconSolid className="h-6 w-6" />
            ) : (
              <ArchiveBoxArrowDownIconOutline className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      <div className="flex flex-1 relative">
        {/* Main content */}
        <div className={`flex-1 p-4 transition-all duration-300 ease-in-out`}>
          <div className="w-full h-auto">
            {/* Dropdown for selecting zone */}
            <div className="mb-4">
              <label htmlFor="zone-dropdown" className="block mb-2">Select Zone:</label>
              <select
                id="zone-dropdown"
                value={selectedZone}
                onChange={(e) => setSelectedZone(e.target.value)}
                className="border rounded px-2 py-1"
              >
                {zones.map((zone, index) => (
                  <option key={index} value={zone}>{zone}</option>
                ))}
              </select>
            </div>

            {/* Dynamically display average fill rates per zone */}
            <div className="grid grid-cols-1 gap-4">
              {averageFillRates.map(({ zone, averageFillRate }) => (
                <div
                  key={zone}
                  className="relative px-4 py-24 rounded-3xl shadow-md bg-sky-100"
                >
                  {/* Indicator circle with gradient based on average fill rate */}
                  <div
                    className="absolute top-3 right-3 size-14 rounded-full flex items-center justify-center text-black font-bold"
                    style={{
                      background: getBinGradient(averageFillRate), // Use average fill rate here
                    }}
                  >
                    {averageFillRate.toFixed(2)}%
                  </div>
                  <h3 className="text-start font-bold">{zone}</h3>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div
          className={`absolute top-0 left-0 h-full bg-white shadow-lg z-40 p-4 transition-transform duration-300 ease-in-out ${isSidebarVisible ? 'translate-x-0' : '-translate-x-full'}`}
          style={{ width: '300px' }}  // Adjust the width as needed
        >
          <SideBar />
        </div>
      </div>
    </div>
  );
}

// Function to get a gradient based on filled percentage
const getBinGradient = (percentage) => {
  if (percentage === 100) {
    return 'linear-gradient(135deg, #FF0000, #FF5733)'; // Full red gradient
  } else if (percentage >= 75) {
    return 'linear-gradient(135deg, #FF5733, #FFC300)'; // Red to orange
  } else if (percentage >= 50) {
    return 'linear-gradient(135deg, #FFC300, #C4E538)'; // Orange to light green
  } else if (percentage >= 25) {
    return 'linear-gradient(135deg, #C4E538, #28B463)'; // Light green to dark green
  } else {
    return 'linear-gradient(135deg, #28B463, #C4E538)'; // Dark green for empty
  }
};
