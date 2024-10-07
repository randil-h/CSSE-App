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

        const response = await fetch('http://localhost:5555/schedule', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(scheduleData),
        });

        if (response.ok) {
            console.log('Schedule added successfully');
        } else {
            console.error('Failed to add schedule');
        }
    };

    // Navigate to the schedule list page
    const goToScheduleList = () => {
        navigate("/schedules/list");
    };

    return (
        <div className="">
            {/* Navbar */}
            <div className="sticky top-0 z-10">
                <Navbar />
            </div>
            <div className="">
                <div className="grid sm:grid-cols-6 ">
                    <div className="col-span-1 sticky left-0 top-0">
                        <SideBar />
                    </div>
                    <div className="w-full col-span-5 flex flex-col ">
                        <div className="flex flex-row ">
                            <BackButton />
                            <Breadcrumb items={breadcrumbItems} />
                        </div>

                        {/* Form to add new schedule */}
                        <div className="p-4">
                            <h2 className="text-xl font-bold mb-4">Add a New Schedule</h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium">Waste Type</label>
                                    <input
                                        type="text"
                                        value={wasteType}
                                        onChange={(e) => setWasteType(e.target.value)}
                                        className="block w-full p-2 border rounded"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium">Date</label>
                                    <input
                                        type="date"
                                        value={date}
                                        onChange={(e) => setDate(e.target.value)}
                                        className="block w-full p-2 border rounded"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium">Time</label>
                                    <input
                                        type="time"
                                        value={time}
                                        onChange={(e) => setTime(e.target.value)}
                                        className="block w-full p-2 border rounded"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium">Location</label>
                                    <input
                                        type="text"
                                        value={location}
                                        onChange={(e) => setLocation(e.target.value)}
                                        className="block w-full p-2 border rounded"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium">Special Remarks</label>
                                    <input
                                        type="text"
                                        value={specialRemarks}
                                        onChange={(e) => setSpecialRemarks(e.target.value)}
                                        className="block w-full p-2 border rounded"
                                    />
                                </div>
                                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Add Schedule</button>
                            </form>
                        </div>

                        {/* Button to go to the schedule list page */}
                        <div className="p-4">
                            <button onClick={goToScheduleList} className="px-4 py-2 bg-green-600 text-white rounded">
                                View Schedules
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
