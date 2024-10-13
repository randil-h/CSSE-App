import { useState } from "react";
import {useNavigate} from "react-router-dom";
import Navbar from "../../components/utility/Navbar";
import SideBar from "../../components/utility/SideBar";
import BackButton from "../../components/utility/BackButton";
import Breadcrumb from "../../components/utility/Breadcrumbs";
import { ArchiveBoxArrowDownIcon as ArchiveBoxArrowDownIconSolid } from '@heroicons/react/24/solid';
import { ArchiveBoxArrowDownIcon as ArchiveBoxArrowDownIconOutline } from '@heroicons/react/24/outline';

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
    const [isSidebarVisible, setIsSidebarVisible] = useState(false);

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
    const toggleSidebar = () => {
        setIsSidebarVisible(!isSidebarVisible);
    };

    const goToConfirmation = () => {
        navigate("/schedules/conf");
    };

    const today = new Date();
    const formattedToday = today.toISOString().split("T")[0]; // Format to YYYY-MM-DD

    return (
        <div className="min-h-screen flex flex-col bg-white">
            <div className="sticky top-0 z-10">
                <Navbar />
                <div className="bg-green-200 w-full h-12 flex items-center justify-between px-4">
                    <div className="text-gray-700 font-semibold">Book a collection slot</div>
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
                {isSidebarVisible && (
                    <div className="fixed top-0 left-0 w-2/3 sm:w-1/3 lg:w-1/5 h-full bg-gray-100 shadow-lg z-40">
                        <SideBar />
                    </div>
                )}

                <div
                    className={`flex-1 p-4 transition-all duration-300 ease-in-out ${isSidebarVisible ? "lg:ml-64" : ""}`}>
                    <div className="container mx-auto max-w-4xl">
                        <div className="flex items-center space-x-4 mb-4">
                            <BackButton />
                            <Breadcrumb items={breadcrumbItems} />
                        </div>
                        <div className="text-center sm:text-right mt-6">
                            <button
                                onClick={goToScheduleList}
                                className="py-2 px-6 bg-black rounded-full text-white hover:bg-blue-700 transition duration-300"
                            >
                                View Schedule
                            </button>
                        </div>

                        <div className="p-6 bg-gray-100 shadow rounded-lg mt-6">
                            <h2 className="text-2xl font-bold mb-4 text-center sm:text-left">Add a New Special Collection Schedule</h2>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-lg font-medium mb-2 text-left">Waste Type</label>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 text-center">
                                        {wasteTypes.map((type) => (
                                            <div
                                                key={type}
                                                onClick={() => setWasteType(type)}
                                                className={`p-4 sm:p-3 md:p-2 lg:p-4 border rounded-lg cursor-pointer transition duration-300 ${wasteType === type ? 'bg-green-500 text-white' : 'bg-white'} hover:bg-green-300`}
                                            >
                                                {type}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-lg font-medium mb-2 text-left ">Date</label>
                                    <input
                                        type="date"
                                        value={date}
                                        min={formattedToday} // Prevent past date selection
                                        onChange={(e) => setDate(e.target.value)}
                                        className="block w-full p-2 border rounded border-gray-200"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-lg font-medium mb-2 text-left">Time</label>
                                    <select
                                        value={time}
                                        onChange={(e) => setTime(e.target.value)}
                                        className="block w-full p-2 border rounded border-gray-200"
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

                                <div>
                                    <label className="block text-lg font-medium mb-2 text-left">
                                        Location</label>
                                    <input
                                        type="text"
                                        value={location}
                                        onChange={(e) => setLocation(e.target.value)}
                                        placeholder="Enter pickup location"
                                        className="block w-full p-2 border rounded border-gray-200"
                                        required
                                    />
                                </div>


                                <div>
                                    <label className="block text-lg font-medium mb-2 text-left">Special Remarks
                                        (Optional)</label>
                                    <input
                                        type="text"
                                        value={specialRemarks}
                                        onChange={(e) => setSpecialRemarks(e.target.value)}
                                        className="block w-full p-2 border rounded border-gray-200"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full sm:w-auto py-2 px-4 sm:px-6 bg-black text-white rounded-full hover:bg-gray-500 transition duration-300">
                                    Add Schedule
                                </button>

                            </form>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}