import { useState, useEffect } from "react";
import Navbar from "../../components/utility/Navbar";
import SideBar from "../../components/utility/SideBar";
import BackButton from "../../components/utility/BackButton";
import Breadcrumb from "../../components/utility/Breadcrumbs";
import {useNavigate} from "react-router-dom";

const breadcrumbItems = [
    { name: 'Schedules', href: '/schedules/list' },
];

export default function ScheduleList() {
    const [schedules, setSchedules] = useState([]);
    const navigate = useNavigate();

    // Fetch schedules from backend on component mount
    useEffect(() => {
        fetch('http://localhost:5555/schedule')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => setSchedules(data))
            .catch(error => console.error('Error fetching schedules:', error));
    }, []);

    // Static regular schedule data
    const regularSchedules = [
        { date: '11-08-24', time: '10:00 AM', status: 'In progress' },
        { date: '14-08-24', time: '10:45 AM', status: 'Pending' },
        { date: '18-08-24', time: '02:00 PM', status: 'Pending' },
    ];
    const goToAddSchedule = () => {
        navigate("/schedules/home");
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
                <div className="w-full sm:w-4/5 flex flex-col">
                    <div className="flex items-center space-x-4 p-4">
                        <BackButton />
                        <Breadcrumb items={breadcrumbItems} />
                    </div>

                    {/* Static Regular Schedules */}
                    <div className="p-4">
                        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center sm:text-left">Ongoing Schedules</h2>

                        {/* Regular Schedules */}
                        <div className="mb-6">
                            <h3 className="text-lg sm:text-xl font-bold">Regular Schedules</h3>
                            <ul className="space-y-2">
                                {regularSchedules.map((schedule, index) => (
                                    <li key={index} className="p-4 border rounded-lg flex flex-col sm:flex-row justify-between items-center text-sm sm:text-base">
                                        <div>
                                            <strong>Date / Time:</strong> {schedule.date}, {schedule.time}
                                        </div>
                                        <div className={`text-${schedule.status === 'In progress' ? 'green-500' : 'orange-500'}`}>
                                            {schedule.status}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Dynamic Special Collection Schedules */}
                        <div className="mb-6">
                            <h3 className="text-lg sm:text-xl font-bold">Special Collection Schedules</h3>
                            <ul className="space-y-2">
                                {schedules.map(schedule => (
                                    <li key={schedule._id} className="p-4 border rounded-lg text-sm sm:text-base">
                                        <strong>Date / Time:</strong> {new Date(schedule.date).toLocaleDateString()} {schedule.time} <br />
                                        <strong>Location:</strong> {schedule.location} <br />
                                        <strong>Special Remarks:</strong> {schedule.specialRemarks}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Add Special Collection Schedule Button */}
                        <div className="text-center sm:text-left">
                            <button onClick={goToAddSchedule } className="bg-green-500 text-white py-2 px-6 rounded-full text-sm sm:text-base hover:bg-green-600 transition duration-300">
                                + Add Special Collection Schedule
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
