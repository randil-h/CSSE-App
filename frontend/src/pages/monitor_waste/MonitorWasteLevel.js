import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/utility/Navbar";
import SideBar from "../../components/utility/SideBar";
import { ArchiveBoxArrowDownIcon as ArchiveBoxArrowDownIconSolid } from '@heroicons/react/24/solid';
import { ArchiveBoxArrowDownIcon as ArchiveBoxArrowDownIconOutline } from '@heroicons/react/24/outline';
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/outline'; // Import chevron icons

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

  // State for sorting
  const [sortCriteria, setSortCriteria] = useState("averageFillRate");
  const [sortDirection, setSortDirection] = useState("asc"); // Default sorting direction

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  // Fetch bins data from the backend on component mount
  useEffect(() => {
    const fetchBins = async () => {
      const response = await fetch('https://csse-backend.vercel.app/bin');
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
      averageFillRate: Math.ceil(total / count),
      binCount: count, // Add bin count for sorting
    }));
  };

  const averageFillRates = calculateAverageFillRates();

  // Sorting function
  const sortedAverageFillRates = () => {
    return averageFillRates.sort((a, b) => {
      const valueA = sortCriteria === "averageFillRate" ? a.averageFillRate : a.binCount;
      const valueB = sortCriteria === "averageFillRate" ? b.averageFillRate : b.binCount;
      return sortDirection === "asc" ? valueA - valueB : valueB - valueA;
    });
  };

  const handleSortChange = (e) => {
    setSortCriteria(e.target.value);
  };

  const toggleSortDirection = () => {
    setSortDirection((prevDirection) => (prevDirection === "asc" ? "desc" : "asc"));
  };

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
          <div className="w-full h-auto ">
            {/* Dropdown for selecting zone */}
            <div className="mb-4">
              <select
                id="zone-dropdown"
                value={selectedZone}
                onChange={(e) => setSelectedZone(e.target.value)}
                className="bg-neutral-700 text-gray-200 border-0 rounded-full px-8 py-1"
              >
                {zones.map((zone, index) => (
                  <option key={index} value={zone}>{zone}</option>
                ))}
              </select>
            </div>

            {/* Sorting dropdown */}
            <div className="mb-4 flex justify-between items-center">
              <select
                id="sort-dropdown"
                value={sortCriteria}
                onChange={handleSortChange}
                className="bg-neutral-700 text-gray-200 border-0 rounded-full px-8 py-1"
              >
                <option value="averageFillRate">Average Fill Rate</option>
                <option value="binCount">Total Bins</option>
              </select>
              <button
                onClick={toggleSortDirection}
                className="bg-neutral-700 text-gray-200 px-4 py-2 rounded-full flex items-center"
              >
                {sortDirection === 'asc' ? (
                  <ChevronUpIcon className="h-5 w-5" aria-hidden="true" />
                ) : (
                  <ChevronDownIcon className="h-5 w-5" aria-hidden="true" />
                )}
              </button>
            </div>

            {/* Dynamically display average fill rates per zone */}
            <div className="grid grid-cols-2 gap-4">
              {sortedAverageFillRates().map(({ zone, averageFillRate, binCount }) => (
                <div key={zone} className="px-4 py-4 rounded-3xl bg-neutral-200 flex flex-col gap-4">
                  {/* Indicator circle with gradient based on average fill rate */}
                  <div className="flex flex-row w-full justify-between">
                    <div>
                      <h3 className="text-start font-bold flex flex-col">
                        <span className="text-5xl">{zone}</span>
                        <span className="font-medium">Zone</span>
                      </h3>
                    </div>
                    <div
                      className="relative size-14 flex items-center justify-center"
                    >
                      {/* Outer ring */}
                      <div
                        className="absolute w-full h-full rounded-full"
                        style={{
                          background: `conic-gradient(${getBinGradient(averageFillRate)} ${averageFillRate * 3.6}deg, #e0e0e0 0deg)`, // Use gradient based on the percentage
                        }}
                      ></div>
                      {/* Inner circle for text */}
                      <div
                        className="relative flex items-center justify-center bg-neutral-200 w-12 h-12 rounded-full text-black font-bold">
                        {averageFillRate}%
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-row w-full justify-between">
                    <div>
                      {/* Display bin count */}
                      <ul className="list-none">
                        <li className="flex justify-between">
                          <span>Total Bins</span>
                          <span>{binCount}</span>
                        </li>
                      </ul>
                    </div>
                  </div>
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
