import {useState, useEffect, useRef} from "react";
import Navbar from "../../components/utility/Navbar";
import SideBar from "../../components/utility/SideBar";
import BackButton from "../../components/utility/BackButton";
import Breadcrumb from "../../components/utility/Breadcrumbs";
import {useNavigate} from "react-router-dom";
import { ArchiveBoxArrowDownIcon as ArchiveBoxArrowDownIconSolid } from '@heroicons/react/24/solid';
import { ArchiveBoxArrowDownIcon as ArchiveBoxArrowDownIconOutline } from '@heroicons/react/24/outline';

const breadcrumbItems = [
    { name: 'Schedules', href: '/schedules/list' },
];

export default function ScheduleList() {
    const [schedules, setSchedules] = useState([]);
    const navigate = useNavigate();
    const [isSidebarVisible, setIsSidebarVisible] = useState(false);
    useEffect(() => {
        fetchSchedules();
    }, []); // Fetch schedules when the component mounts

    const toggleSidebar = () => {
        setIsSidebarVisible(!isSidebarVisible);
    };

    const fetchSchedules = () => {
        fetch('http://localhost:5555/schedule')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                // Filter out cancelled schedules
                const activeSchedules = data.filter(schedule => schedule.status !== 'Cancelled');
                setSchedules(activeSchedules);
            })
            .catch(error => console.error('Error fetching schedules:', error));
    };

    const handleCancel = (id) => {
        // PATCH request to update the status of the schedule
        fetch(`http://localhost:5555/schedule/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status: 'Cancelled' }),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(updatedSchedule => {
                console.log('Updated Schedule:', updatedSchedule);
                setSchedules(prevSchedules =>
                    prevSchedules.filter(schedule => schedule._id !== id)
                );
                navigate('/schedules/history', {
                    state: {
                        cancelledSchedule: updatedSchedule
                    }
                });
            })
            .catch(error => {
                console.error('Error cancelling schedule:', error);
                alert('An error occurred while cancelling the schedule. Please try again.');
            });

    };

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
        <div className="min-h-screen flex flex-col bg-neutral-100">
            {/* Navbar */}
            <div className="sticky top-0 z-10">
                <Navbar />
                <div className="bg-green-200 w-full h-12 flex items-center justify-between px-4">
                    <div className="text-gray-700 font-semibold">Special Collection Schedule</div>
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

            {/* Main Content */}
            <div className="flex flex-1 relative">
                {/* Sidebar */}
                {isSidebarVisible && (
                    <div className="fixed top-0 left-0 w-2/3 sm:w-1/3 lg:w-1/4 h-full bg-gray-100 shadow-lg z-40">

                        <SideBar/>
                    </div>
                )}

                {/* Main content */}
                <div
                    className={`flex-1 p-4 transition-all duration-300 ease-in-out ${isSidebarVisible ? "lg:ml-64" : ""}`}>

                    <div className="w-full h-auto">
                        <BackButton/>
                        <Breadcrumb items={breadcrumbItems}/>
                    </div>

                    {/* Ongoing Schedules */}
                    <div className="p-4">
                        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center sm:text-left">Ongoing
                            Schedules</h2>

                        <div className="mb-6">
                            <h3 className="text-lg sm:text-xl font-bold">Regular Schedules</h3>
                            <ul className="space-y-2">
                                {regularSchedules.map((schedule, index) => (
                                    <li key={index} className="p-4 border rounded-lg flex justify-between items-center">
                                        <div>
                                            <strong>Date / Time:</strong> {schedule.date}, {schedule.time}
                                        </div>
                                        <div
                                            className={`text-${schedule.status === 'In progress' ? 'green-500' : 'orange-500'}`}>
                                            {schedule.status}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="mb-6">
                            <h3 className="text-lg sm:text-xl font-bold">Special Collection Schedules</h3>
                            <ul className="space-y-2">
                                {schedules.map(schedule => (
                                    <li key={schedule._id}
                                        className="p-4 border rounded-lg flex justify-between items-center">
                                        <div>
                                            <strong>Date /
                                                Time:</strong> {new Date(schedule.date).toLocaleDateString()} {schedule.time}
                                            <br/>
                                            <strong>Location:</strong> {schedule.location}
                                            <br/>
                                            <strong>Special Remarks:</strong> {schedule.specialRemarks}
                                        </div>
                                        <button
                                            onClick={() => handleCancel(schedule._id)}
                                            className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 transition duration-300"
                                        >
                                            Cancel
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="text-center sm:text-left">
                            <button
                                onClick={goToAddSchedule}
                                className="bg-green-500 text-white py-2 px-6 rounded-full hover:bg-green-600 transition duration-300"
                            >
                                + Add Special Collection Schedule
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}