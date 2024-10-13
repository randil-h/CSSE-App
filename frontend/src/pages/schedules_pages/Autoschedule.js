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
        const response = await axios.get('http://localhost:5555/autoschedule'); // Replace with your actual endpoint
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
          <h2 className="text-xl font-semibold mb-4">Scheduled Bins</h2>
          {schedules.length > 0 ? (
            <table className="min-w-full bg-white shadow-md rounded-lg">
              <thead>
              <tr>
                <th className="p-2 text-left">Bin ID</th>
                <th className="p-2 text-left">Status</th>
                <th className="p-2 text-left">Date</th>
                <th className="p-2 text-left">Time</th>
              </tr>
              </thead>
              <tbody>
              {schedules.map(schedule => (
                <tr key={schedule._id} className="border-b">
                  <td className="p-2">{schedule.binID}</td>
                  <td className={`p-2 ${schedule.status === 'Completed' ? 'text-green-500' : ''}`}>
                    {schedule.status}
                  </td>
                  <td className="p-2">{new Date(schedule.date).toLocaleDateString()}</td>
                  <td className="p-2">{schedule.time}</td>
                </tr>
              ))}
              </tbody>
            </table>
          ) : (
            <div>No schedules available.</div>
          )}
        </div>

        {/* Sidebar */}
        <div
          className={`absolute top-0 left-0 h-full bg-white shadow-lg z-40 p-4 transition-transform duration-300 ease-in-out ${isSidebarVisible ? 'translate-x-0' : '-translate-x-full'}`}
          style={{width: '300px'}}  // Sidebar width
        >
          <SideBar onClose={toggleSidebar} />
        </div>
      </div>
    </div>
  );
}
