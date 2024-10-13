import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/utility/Navbar";
import SideBar from "../../components/utility/SideBar";
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css'; // Import styles

import { ArchiveBoxArrowDownIcon as ArchiveBoxArrowDownIconSolid } from '@heroicons/react/24/solid';
import { ArchiveBoxArrowDownIcon as ArchiveBoxArrowDownIconOutline } from '@heroicons/react/24/outline';
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

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
  const [sortDirection, setSortDirection] = useState("desc");

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
      setZones(["All Zones", ...uniqueZones]);
    };

    fetchBins();
  }, []);

  // Calculate average fill rate for each zone and the number of bins by category
  const calculateAverageFillRates = () => {
    const zoneFillRates = {};
    const categoryFillRates = {}; // To hold total waste levels and bin counts per category
    const categoryCounts = {}; // To hold the counts of bins in each category

    binsData.forEach((bin) => {
      const { zone, wasteLevel, category } = bin;

      // Calculate fill rates for zones
      if (!zoneFillRates[zone]) {
        zoneFillRates[zone] = { total: 0, count: 0 };
      }
      zoneFillRates[zone].total += wasteLevel;
      zoneFillRates[zone].count += 1;

      // Calculate fill rates for categories within zones
      if (!categoryFillRates[zone]) {
        categoryFillRates[zone] = {};
      }
      if (!categoryFillRates[zone][category]) {
        categoryFillRates[zone][category] = { total: 0, count: 0 };
      }
      categoryFillRates[zone][category].total += wasteLevel;
      categoryFillRates[zone][category].count += 1;

      // Count bins by category
      if (!categoryCounts[zone]) {
        categoryCounts[zone] = {};
      }
      categoryCounts[zone][category] = (categoryCounts[zone][category] || 0) + 1;
    });

    return Object.entries(zoneFillRates).map(([zone, { total, count }]) => {
      const categories = Object.entries(categoryFillRates[zone] || {}).reduce(
        (acc, [category, { total: categoryTotal, count: categoryCount }]) => {
          acc[category] = {
            count: categoryCount,
            averageFillRate: Math.ceil(categoryTotal / categoryCount), // Calculate average fill rate for the category
          };
          return acc;
        },
        {}
      );

      return {
        zone,
        averageFillRate: Math.ceil(total / count),
        binCount: count,
        categoryCounts: categories, // Add category counts and fill rates for this zone
      };
    });
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
        <div className="bg-neutral-200 border-b border-neutral-300 bg-opacity-70 backdrop-blur w-full h-8 flex items-center justify-between px-4">
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
            <div className="flex flex-row mb-4 justify-end gap-2">
              {/* Dropdown for selecting zone */}
              <div className="">
                <select
                  id="zone-dropdown"
                  value={selectedZone}
                  onChange={(e) => setSelectedZone(e.target.value)}
                  className="bg-sky-900 text-gray-200 border-0 rounded-full px-8 py-1"
                >
                  {zones.map((zone, index) => (
                    <option key={index} value={zone}>{zone}</option>
                  ))}
                </select>
              </div>

              {/* Sorting dropdown */}
              <div className=" flex  items-center bg-sky-900 text-gray-200 border-0 rounded-full">
                <select
                  id="sort-dropdown"
                  value={sortCriteria}
                  onChange={handleSortChange}
                  className="bg-sky-900 text-gray-200 border-0 rounded-full px-8 py-1"
                >
                  <option value="averageFillRate">Average Fill Rate</option>
                  <option value="binCount">Total Bins</option>
                </select>
                <button
                  onClick={toggleSortDirection}
                  className="bg-sky-700 text-gray-200 mr-1 p-0.5 rounded-full flex items-center"
                >
                  {sortDirection === 'asc' ? (
                    <ChevronUpIcon className="h-5 w-5" aria-hidden="true" />
                  ) : (
                    <ChevronDownIcon className="h-5 w-5" aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>


            {/* Dynamically display average fill rates per zone */}
            <div className="grid xl:grid-cols-6 lg:grid-cols-4 sm:grid-cols-3 grid-cols-2 gap-4">
              {sortedAverageFillRates().map(({ zone, averageFillRate, binCount, categoryCounts }) => (
                <div key={zone}
                     className="px-4 py-4 rounded-3xl bg-neutral-200 hover:bg-neutral-300 transition duration-200 flex flex-col gap-4">

                  {/* Indicator ring with gradient based on average fill rate */}
                  <div className="flex flex-row w-full justify-between">
                    <div>
                      <h3 className="text-start font-bold flex flex-col">
                        <span className="text-5xl text-neutral-800">{zone}</span>
                        <span className="font-medium">Zone</span>
                      </h3>
                    </div>

                    {/* Percentage circle using CircularProgressbar */}
                    <div className="relative" style={{width: '50px', height: '50px'}}>
                      <CircularProgressbar
                        value={averageFillRate}
                        text={`${averageFillRate}%`}
                        styles={{
                          path: {
                            stroke: '#457c39', // Use your existing gradient function
                            strokeWidth: 8, // Adjust as needed
                          },
                          text: {
                            fill: 'black',
                            fontSize: '28px', // Adjust as needed
                            fontWeight: 'bold',
                          },
                          trail: {
                            stroke: '#e0e0e0',
                            strokeWidth: 10, // Adjust as needed
                          },
                        }}
                      />
                    </div>
                  </div>

                  <div className="flex flex-row w-full justify-between">
                    <div>
                      {/* Display bin count */}
                      <ul className="list-none">
                        <li className="flex justify-between">
                          <div
                            className="bg-neutral-800 text-neutral-100 rounded-full size-6 font-bold text-sm items-center justify-center content-center">
                            {binCount}
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* Display categorical bin counts and fill rates */}
                  <div className="mt-4">
                    <ul className="list-none flex flex-col ">
                      {Object.entries(categoryCounts).map(([category, {count, averageFillRate}]) => (
                        <li key={category}
                            className="flex flex-col border-t border-gray-300 py-2"> {/* Added border-t and padding */}
                          <div className="flex justify-between items-center ">
                            <div className="flex flex-row gap-1">
                              <div
                                className="bg-neutral-800 text-neutral-100 rounded-full size-6 font-bold text-sm items-center justify-center content-center">
                                {count}
                              </div>
                              <span className="text-sm">{category}</span>
                            </div>

                            <div className="flex flex-col items-center ">
                              <span className="font-bold text-sm">{averageFillRate}%</span>
                              <div
                                className="w-12 h-1 bg-gray-300 rounded-full"
                                style={{border: '0px solid #d1d5db'}} // Remove unnecessary border
                              >
                                <div
                                  className="h-full rounded-full"
                                  style={{
                                    width: `${averageFillRate}%`,
                                    backgroundColor: '#457c39'
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>


                </div>
              ))}
            </div>

          </div>
        </div>

        {/* Sidebar */}
        <div
          className={`absolute top-0 left-0 h-full bg-white shadow-lg z-40 p-4 transition-transform duration-300 ease-in-out ${isSidebarVisible ? 'translate-x-0' : '-translate-x-full'}`}
          style={{width: '300px'}}  // Sidebar width
        >
          <SideBar onClose={toggleSidebar}/>
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
