import { useState, useEffect } from "react";
import Navbar from "../../components/utility/Navbar";
import SideBar from "../../components/utility/SideBar";
import axios from "axios";

export default function Autoschedule() {
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [schedules, setSchedules] = useState([]);

  // Fetch the auto-schedules initially and then every 5 seconds
  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const response = await axios.get('https://csse-backend.vercel.app/autoschedule'); // Replace with your actual endpoint
        setSchedules(response.data);
      } catch (error) {
        console.error("Error fetching schedules", error);
      }
    };

    // Fetch schedules initially
    fetchSchedules();

    // Set up a polling interval to fetch schedules every 5 seconds
    const intervalId = setInterval(fetchSchedules, 5000);

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  return (
    <div className="min-h-screen flex flex-col bg-neutral-100">
      {/* Navbar */}
      <div className="sticky top-0 z-10">
        <Navbar />
        <div className="bg-neutral-200 border-b border-neutral-300 bg-opacity-70 backdrop-blur w-full h-8 flex items-center justify-between px-4">
          <div className="text-gray-700 font-semibold">Auto Schedules</div>
        </div>
      </div>

      <div className="flex flex-1 relative">
        {/* Main content */}
        <div className="flex-1 p-4 transition-all duration-300 ease-in-out">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">Scheduled Bins</h2>
          {schedules.length > 0 ? (
            <table className="min-w-full bg-white shadow-lg rounded-lg overflow-hidden">
              <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left text-gray-600 font-semibold uppercase">Bin ID</th>
                <th className="p-3 text-left text-gray-600 font-semibold uppercase">Status</th>
                <th className="p-3 text-left text-gray-600 font-semibold uppercase">Date</th>
                <th className="p-3 text-left text-gray-600 font-semibold uppercase">Time</th>
              </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
              {schedules.map(schedule => (
                <tr
                  key={schedule._id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="p-3 text-gray-900 font-semibold">{schedule.binID}</td>
                  <td
                    className={`p-3 font-medium ${
                      schedule.status === 'Completed' ? 'text-green-500' : 'text-red-500'
                    }`}
                  >
                    {schedule.status}
                  </td>
                  <td className="p-3 text-gray-500">
                    {new Date(schedule.date).toLocaleDateString()}
                  </td>
                  <td className="p-3 text-gray-500">{schedule.time}</td>
                </tr>
              ))}
              </tbody>
            </table>
          ) : (
            <div className="text-gray-500">No schedules available.</div>
          )}
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
