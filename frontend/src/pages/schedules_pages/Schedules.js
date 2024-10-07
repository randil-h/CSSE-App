import { useState } from "react";
import {useNavigate} from "react-router-dom";
import Navbar from "../../components/utility/Navbar";
import SideBar from "../../components/utility/SideBar";
import BackButton from "../../components/utility/BackButton";
import Breadcrumb from "../../components/utility/Breadcrumbs";

const breadcrumbItems = [
    { name: 'Schedules', href: '/Schedules/home' },
];
const wasteTypes = [
    "E-Waste",
    "Bulky Items",
    "Yard Waste",
    "Construction Debris",
    "Textiles",
    "Recyclables",
    "Other"
];
export default function Schedules() {
    const navigate = useNavigate();

    // State for form inputs
    const [wasteType, setWasteType] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [location, setLocation] = useState('');
    const [specialRemarks, setSpecialRemarks] = useState('');

    // Function to handle adding a new schedule
    const handleSubmit = async (e) => {
        e.preventDefault();
        const scheduleData = { wasteType, date, time, location, specialRemarks };

        try {
            const response = await fetch('http://localhost:5555/schedule', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(scheduleData),
            });

            if (response.ok) {
                console.log('Schedule added successfully');
                // Navigate to confirmation page after successful submission
                navigate("/schedules/conf");
            } else {
                console.error('Failed to add schedule');
                alert("Failed to add schedule. Please try again.");
            }
        } catch (error) {
            console.error('Error while adding schedule:', error);
            alert("An error occurred. Please try again.");
        }
    };
    // Navigate to the schedule list page
    const goToScheduleList = () => {
        navigate("/schedules/list");
    };
    const goToConfirmation = () => {
        navigate("/schedules/conf");
    };

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
                    <div className="flex items-center space-x-4 mb-6">
                        <BackButton />
                        <Breadcrumb items={breadcrumbItems} />
                    </div>
                    {/* Form to add new schedule */}
                    <div className="p-6 bg-white shadow rounded-lg ">
                        <h2 className="text-xl font-bold mb-4 text-center sm:text-left">Add a New Special Collection Schedule</h2>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Waste Type Selection */}
                            <div>
                                <label className="block text-sm font-medium mb-2 text-left">Waste Type</label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    {wasteTypes.map((type) => (
                                        <div
                                            key={type}
                                            onClick={() => setWasteType(type)}
                                            className={`p-4 border rounded-lg cursor-pointer transition duration-300 ${
                                                wasteType === type ? 'bg-green-500 text-white' : 'bg-white'
                                            } hover:bg-green-300`}
                                        >
                                            {type}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            {/* Date Input */}
                            <div>
                                <label className="block text-sm font-medium mb-2 text-left">Date</label>
                                <input
                                    type="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    className="block w-full p-2 border rounded"
                                    required
                                />
                            </div>
                            {/* Time Slot Selection */}
                            <div>
                                <label className="block text-sm font-medium mb-2 text-left">Time</label>
                                <select
                                    value={time}
                                    onChange={(e) => setTime(e.target.value)}
                                    className="block w-full p-2 border rounded"
                                    required
                                >
                                    <option value="" disabled>Select a time slot</option>
                                    <option value="08:00 - 10:00">08:00 - 10:00</option>
                                    <option value="10:00 - 12:00">10:00 - 12:00</option>
                                    <option value="12:00 - 14:00">12:00 - 14:00</option>
                                    <option value="14:00 - 16:00">14:00 - 16:00</option>
                                    <option value="16:00 - 18:00">16:00 - 18:00</option>
                                    <option value="18:00 - 20:00">18:00 - 20:00</option>
                                </select>
                            </div>
                            {/* Location Input */}
                            <div>
                                <label className="block text-sm font-medium mb-2 text-left">Location</label>
                                <input
                                    type="text"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    className="block w-full p-2 border rounded"
                                    required
                                />
                            </div>
                            {/* Special Remarks Input */}
                            <div>
                                <label className="block text-sm font-medium mb-2 text-left">Special Remarks (Optional)</label>
                                <input
                                    type="text"
                                    value={specialRemarks}
                                    onChange={(e) => setSpecialRemarks(e.target.value)}
                                    className="block w-full p-2 border rounded"
                                />
                            </div>
                            <button type="submit" className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 transition duration-300">
                                Add Schedule
                            </button>
                        </form>
                    </div>
                    {/* Button to go to the schedule list page */}
                    <div className="text-center sm:text-left mt-6">
                        <button onClick={goToScheduleList} className="py-2 px-6 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-300">
                            View Schedules
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}