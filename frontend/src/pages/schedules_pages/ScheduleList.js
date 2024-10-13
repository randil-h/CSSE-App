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
                // Filter out cancelled schedules and past schedules
                const activeSchedules = data.filter(schedule => {
                    const scheduleDate = new Date(schedule.date);
                    const today = new Date();

                    return scheduleDate >= today && schedule.status !== 'Cancelled';

                });
                setSchedules(activeSchedules);
            })
            .catch(error => console.error('Error fetching schedules:', error));
    };

    // Define fetchHistory here
    const fetchHistory = () => {
        fetch('http://localhost:5555/schedule') // Adjust the endpoint if needed
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                const historySchedules = data.filter(schedule => schedule.status === 'Cancelled');
                setSchedules(historySchedules); // Update state to show only cancelled schedules
            })
            .catch(error => console.error('Error fetching history:', error));
    };

    const handleCancel = (id) => {
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
                // Fetch the latest schedule data after cancellation
                fetchSchedules(); // To refresh the active schedules
                fetchHistory(); // Optionally, you could fetch the history as well if needed

                // Navigate to the history page
                navigate('/schedules/history');
            })
            .catch(error => {
                console.error('Error cancelling schedule:', error);
                alert('An error occurred while cancelling the schedule. Please try again.');
            });
    };
    // Function to calculate days left
    const calculateDaysLeft = (scheduleDate) => {
        const today = new Date();
        const collectionDate = new Date(scheduleDate);
        const timeDiff = collectionDate - today;
        const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)); // Convert timeDiff to days
        return daysLeft >= 0 ? daysLeft : 0; // Return 0 if the collection date has passed
    };

    // Static regular schedule data
    const regularSchedules = [
        { date: '2024-10-16', time: '10:00 AM', status: 'In progress' },
        { date: '2024-10-20', time: '10:45 AM', status: 'Pending' },
        { date: '2024-10-24', time: '02:00 PM', status: 'Pending' },
    ];

    const goToAddSchedule = () => {
        navigate("/schedules/home");
    };
    return (
        <div className="min-h-screen flex flex-col bg-white">
            {/* Navbar */}
            <div className="sticky top-0 z-10">
                <Navbar/>
                <div className="bg-green-200 w-full h-12 flex items-center justify-between px-4">
                    <div className="text-gray-700 font-semibold ">Special Collection Schedule</div>
                    <button
                        onClick={toggleSidebar}
                        className="flex items-center justify-center text-black p-2 rounded-full transition"
                        aria-label="Toggle Sidebar"
                    >
                        {isSidebarVisible ? (
                            <ArchiveBoxArrowDownIconSolid className="h-6 w-6"/>
                        ) : (
                            <ArchiveBoxArrowDownIconOutline className="h-6 w-6"/>
                        )}
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex flex-1 relative">
                {/* Sidebar */}
                {isSidebarVisible && (
                    <div className="fixed top-0 left-0 w-2/3 sm:w-1/3 lg:w-1/6 h-full bg-gray-100 shadow-lg z-40">
                        <SideBar/>
                    </div>
                )}

                {/* Main content */}
                <div
                    className={`flex-1 p-4 transition-all duration-300 ease-in-out ${isSidebarVisible ? "lg:ml-64" : ""}`}>
                    <div className="w-full h-auto">
                        {/* Align BackButton and Breadcrumb on the same horizontal line, both on the left */}
                        <div className="flex items-center justify-start space-x-4 mb-4">
                            <BackButton/>
                            <Breadcrumb items={breadcrumbItems}/>
                        </div>
                    </div>


                {/* Ongoing Schedules */}
                    <div className="p-4">
                        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center sm:text-left">Ongoing
                            Schedules</h2>

                        <div className="mb-6">
                            <h3 className="text-lg sm:text-xl font-bold pb-3">Regular Schedules</h3>
                            <ul className="space-y-2">
                                {regularSchedules.map((schedule, index) => (
                                    <li key={index}
                                        className="p-4 border rounded-lg flex justify-between items-center text-left">
                                        <div className="flex flex-col text-left">
                                            <p><strong>Date:</strong> {new Date(schedule.date).toLocaleDateString()}</p>
                                            <p><strong>Time:</strong> {schedule.time}</p>
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
                            <h3 className="text-lg sm:text-xl font-bold pb-3">Upcoming Special Waste Schedule</h3>
                            <ul className="space-y-2">
                                {schedules.map(schedule => (
                                    <li key={schedule._id}
                                        className="p-4 border rounded-lg flex justify-between items-center text-left">
                                        <div>
                                            <strong>Date:</strong> {new Date(schedule.date).toLocaleDateString()}
                                            <br/>
                                            <strong>Time:</strong> {schedule.time}
                                            <br/>
                                            <strong>Location:</strong> {schedule.location}
                                            <br/>
                                            <strong>Special
                                                Remarks:</strong> {schedule.specialRemarks ? schedule.specialRemarks : 'N/A'}
                                            <div className="ml-0 text-gray-400 text-left">
                                                {calculateDaysLeft(schedule.date)} days left
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleCancel(schedule._id)}
                                            className="bg-red-500 text-white py-1 px-4 rounded-full hover:bg-red-600 transition duration-300"
                                        >
                                            Cancel
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="flex flex-col sm:flex-row justify-between text-center sm:text-left">
                            <button
                                onClick={goToAddSchedule}
                                className="bg-black text-white py-2 px-6 rounded-full hover:bg-gray-800 transition duration-300 mb-2 sm:mb-0"
                            >
                                +  Add Special Collection Schedule
                            </button>
                            {/* New Button for Collection History */}
                            <button
                                onClick={() => navigate('/schedules/history')} // Navigate to collection history
                                className="bg-black text-white py-2 px-6 rounded-full hover:bg-gray-800 transition duration-300"
                            >
                                View Collection History
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </div>

    )
        ;
}