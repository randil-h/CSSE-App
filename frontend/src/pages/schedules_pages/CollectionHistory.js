import {useState, useEffect, useRef} from "react";
import Navbar from "../../components/utility/Navbar";
import SideBar from "../../components/utility/SideBar";
import BackButton from "../../components/utility/BackButton";
import { useLocation } from "react-router-dom";
import jsPDF from 'jspdf';
import { ArchiveBoxArrowDownIcon as ArchiveBoxArrowDownIconSolid } from '@heroicons/react/24/solid';
import { ArchiveBoxArrowDownIcon as ArchiveBoxArrowDownIconOutline } from '@heroicons/react/24/outline';

export default function SpecialCollectionHistory() {
    const [history, setHistory] = useState([]);
    const location = useLocation();
    const historyRef = useRef();
    const [isSidebarVisible, setIsSidebarVisible] = useState(false);

    useEffect(() => {
        fetchHistory();
    }, []);

    useEffect(() => {
        // Add the cancelled schedule to history if it exists
        if (location.state && location.state.cancelledSchedule) {
            setHistory(prevHistory => [location.state.cancelledSchedule, ...prevHistory]);
        }
    }, [location.state]);

    const toggleSidebar = () => {
        setIsSidebarVisible(!isSidebarVisible);
    };

    const fetchHistory = () => {
        fetch('http://localhost:5555/schedule')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                const currentDate = new Date();
                const pastSchedules = data.filter(schedule =>
                    new Date(schedule.date) < currentDate || schedule.status === 'Cancelled'
                );


                // Set the history state
                setHistory(pastSchedules);
            })
            .catch(error => console.error('Error fetching history:', error));
    };

    // Function to handle the PDF export
    const handlePDFDownload = () => {
        const doc = new jsPDF();

        doc.text("Special Collection History", 10, 10);

        history.forEach((item, index) => {
            const date = new Date(item.date).toLocaleDateString();
            const status = item.status === 'Cancelled' ? "Cancelled" : "Completed";
            doc.text(`Schedule ${index + 1}:`, 10, 20 + index * 10);
            doc.text(`Date/Time: ${date} ${item.time}`, 10, 25 + index * 10);
            doc.text(`Status: ${status}`, 10, 30 + index * 10);
        });

        doc.save('special-collection-history.pdf');
    };

    return (
        <div className="min-h-screen flex flex-col bg-neutral-100">
            <div className="sticky top-0 z-10">
                <Navbar />
                <div className="bg-gray-100 w-full h-12 flex items-center justify-between px-4">
                    <div className="text-gray-700 font-semibold"></div>
                    <button
                        onClick={toggleSidebar}
                        className="flex items-center justify-center text-black p-4 rounded-full transition"
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

            <div className="flex flex-1">
                {/* Sidebar */}
                {isSidebarVisible && (
                    <div className="fixed top-0 left-0 w-2/3 sm:w-1/3 lg:w-1/5 h-full bg-gray-100 shadow-lg z-40">
                        <SideBar />
                    </div>
                )}

                {/* Main content */}
                <div className={`flex-grow transition-all duration-300 ease-in-out p-4 ${isSidebarVisible ? 'ml-0 sm:ml-64' : 'ml-0'}`}>
                    <div className="w-full max-w-3xl mx-auto">
                        <h2 className="text-2xl font-bold mb-6 text-center sm:text-left">Special Collection History</h2>

                        <h3 className="text-lg font-bold mb-4">Past Schedules</h3>
                        <ul className="space-y-2">
                            {history.map((item) => (
                                <li key={item._id} className="p-4 border rounded-lg flex justify-between items-center">
                                    <div>
                                        <strong>Date / Time:</strong>{" "}
                                        {new Date(item.date).toLocaleDateString()} {item.time}
                                        <br />
                                        <strong>Status:</strong>{" "}
                                        <span className={item.status === "Cancelled" ? "text-red-500" : "text-green-500"}>
                                            {item.status || "Completed"}
                                        </span>
                                    </div>
                                    <button className="bg-green-500 text-white py-1 px-4 rounded-lg hover:bg-green-600">
                                        Review
                                    </button>
                                </li>
                            ))}
                        </ul>

                        <div className="text-right mt-6">
                            <button
                                onClick={handlePDFDownload}
                                className="bg-gray-300 py-2 px-6 rounded-full text-sm hover:bg-gray-400 transition duration-300"
                            >
                                Save as PDF
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}