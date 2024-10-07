import { useState } from "react";
import {useNavigate} from "react-router-dom";
import Navbar from "../../components/utility/Navbar";
import SideBar from "../../components/utility/SideBar";
import BackButton from "../../components/utility/BackButton";
import Breadcrumb from "../../components/utility/Breadcrumbs";

const breadcrumbItems = [
    { name: 'Schedules', href: '/Schedules/home' },
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
                            {/* Waste Type */}
                            <div>
                                <label className="block text-sm font-medium mb-2 text-left">Waste Type</label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    <label className="flex items-center space-x-2">
                                        <input
                                            type="radio"
                                            name="wasteType"
                                            value="E-Waste"
                                            checked={wasteType === 'E-Waste'}
                                            onChange={() => setWasteType('E-Waste')}
                                            className="form-radio"
                                        />
                                        <span>E-Waste</span>
                                    </label>
                                    <label className="flex items-center space-x-2">
                                        <input
                                            type="radio"
                                            name="wasteType"
                                            value="Bulky Items"
                                            checked={wasteType === 'Bulky Items'}
                                            onChange={() => setWasteType('Bulky Items')}
                                            className="form-radio"
                                        />
                                        <span>Bulky Items</span>
                                    </label>
                                    <label className="flex items-center space-x-2">
                                        <input
                                            type="radio"
                                            name="wasteType"
                                            value="Yard Waste"
                                            checked={wasteType === 'Yard Waste'}
                                            onChange={() => setWasteType('Yard Waste')}
                                            className="form-radio"
                                        />
                                        <span>Yard Waste</span>
                                    </label>
                                    <label className="flex items-center space-x-2">
                                        <input
                                            type="radio"
                                            name="wasteType"
                                            value="Construction Debris"
                                            checked={wasteType === 'Construction Debris'}
                                            onChange={() => setWasteType('Construction Debris')}
                                            className="form-radio"
                                        />
                                        <span>Construction Debris</span>
                                    </label>
                                    <label className="flex items-center space-x-2">
                                        <input
                                            type="radio"
                                            name="wasteType"
                                            value="Textiles"
                                            checked={wasteType === 'Textiles'}
                                            onChange={() => setWasteType('Textiles')}
                                            className="form-radio"
                                        />
                                        <span>Textiles</span>
                                    </label>
                                    <label className="flex items-center space-x-2">
                                        <input
                                            type="radio"
                                            name="wasteType"
                                            value="Recyclables"
                                            checked={wasteType === 'Recyclables'}
                                            onChange={() => setWasteType('Recyclables')}
                                            className="form-radio"
                                        />
                                        <span>Recyclables</span>
                                    </label>
                                    <label className="flex items-center space-x-2">
                                        <input
                                            type="radio"
                                            name="wasteType"
                                            value="Other"
                                            checked={wasteType === 'Other'}
                                            onChange={() => setWasteType('Other')}
                                            className="form-radio"
                                        />
                                        <span>Other</span>
                                    </label>
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
                            {/* Time Input */}
                            <div>
                                <label className="block text-sm font-medium mb-2 text-left">Time</label>
                                <input
                                    type="time"
                                    value={time}
                                    onChange={(e) => setTime(e.target.value)}
                                    className="block w-full p-2 border rounded"
                                    required
                                />
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