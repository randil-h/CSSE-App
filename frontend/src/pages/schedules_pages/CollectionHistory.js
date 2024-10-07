import { useState, useEffect } from "react";
import Navbar from "../../components/utility/Navbar";
import SideBar from "../../components/utility/SideBar";
import BackButton from "../../components/utility/BackButton";
import { useLocation } from "react-router-dom";

export default function SpecialCollectionHistory() {
    const [history, setHistory] = useState([]);
    const [canceledSchedules, setCanceledSchedules] = useState([]);
    const location = useLocation();

    // Fetch schedule history from the backend
    useEffect(() => {
        fetch('http://localhost:5555/schedule')
            .then(response => response.json())
            .then(data => {
                const currentDate = new Date();
                const pastSchedules = data.filter(schedule => new Date(schedule.date) < currentDate);
                setHistory(pastSchedules);
            })
            .catch(error => console.error('Error fetching history:', error));
    }, []);

    // Get canceled schedules passed from ScheduleList
    useEffect(() => {
        if (location.state && location.state.canceledSchedules) {
            setCanceledSchedules(location.state.canceledSchedules);
        }
    }, [location.state]);

    return (
        <div className="min-h-screen flex flex-col">
            {/* Navbar */}
            <div className="sticky top-0 z-10">
                <Navbar />
            </div>

            <div className="flex flex-col sm:flex-row sm:space-x-4">
                {/* Sidebar */}
                <div className="sm:w-1/5 sticky top-0">
                    <SideBar />
                </div>

                {/* Main content */}
                <div className="w-full sm:w-4/5 flex flex-col p-4">
                    <BackButton />
                    <h2 className="text-2xl font-bold mb-6 text-center sm:text-left">Special Collection History</h2>

                    {/* History List */}
                    <h3 className="text-lg font-bold mb-4">Past Schedules</h3>
                    <ul className="space-y-2">
                        {history.map(item => (
                            <li key={item._id} className="p-4 border rounded-lg flex justify-between items-center">
                                <div>
                                    <strong>Date / Time:</strong> {new Date(item.date).toLocaleDateString()} {item.time}
                                    <br />
                                    <strong>Status:</strong> <span className="text-green-500">Completed</span>
                                </div>

                                <button
                                    className="bg-green-500 text-white py-1 px-4 rounded-lg hover:bg-green-600">
                                    Review
                                </button>
                            </li>
                        ))}
                    </ul>

                    {/* Canceled Schedules List */}
                    <h3 className="text-lg font-bold mt-6 mb-4">Canceled Schedules</h3>
                    <ul className="space-y-2">
                        {canceledSchedules.map(item => (
                            <li key={item._id} className="p-4 border rounded-lg flex justify-between items-center">
                                <div>
                                    <strong>Date / Time:</strong> {new Date(item.date).toLocaleDateString()} {item.time}
                                    <br />
                                    <strong>Status:</strong> <span className="text-red-500">Canceled</span>
                                </div>

                                <button
                                    className="bg-green-500 text-white py-1 px-4 rounded-lg hover:bg-green-600">
                                    Review
                                </button>
                            </li>
                        ))}
                    </ul>

                    {/* Export Button */}
                    <div className="text-right mt-6">
                        <button className="bg-gray-300 py-2 px-6 rounded-full text-sm hover:bg-gray-400 transition duration-300">
                            Save as PDF
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
