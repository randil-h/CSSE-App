import { useState } from "react";
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

  // Dummy data for bins (this would normally come from your backend)
  const binsData = [
    { id: 1, type: "Organic Bin", filledPercentage: 45 },
    { id: 2, type: "Non-Organic Bin", filledPercentage: 65 },
    { id: 3, type: "Recycling Bin", filledPercentage: 90 },
  ];

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
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
          <div className="w-full h-auto">
            {/* Dynamically display bins */}
            <div className="grid grid-cols-1 gap-4">
              {binsData.map((bin) => (
                <div
                  key={bin.id}
                  className="relative px-4 py-24 rounded-3xl shadow-md bg-sky-100"
                >
                  {/* Indicator circle with gradient */}
                  <div
                    className="absolute top-3 right-3 size-14 rounded-full flex items-center justify-center text-black font-bold"
                    style={{
                      background: getBinGradient(bin.filledPercentage),
                    }}
                  >
                    {bin.filledPercentage}%
                  </div>
                  <h3 className="text-start font-bold">{bin.type}</h3>
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
