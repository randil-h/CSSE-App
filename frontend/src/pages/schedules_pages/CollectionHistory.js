import { useState, useEffect, useRef } from "react";
import Navbar from "../../components/utility/Navbar";
import SideBar from "../../components/utility/SideBar";
import jsPDF from 'jspdf';
import { ArchiveBoxArrowDownIcon as ArchiveBoxArrowDownIconSolid } from '@heroicons/react/24/solid';
import { ArchiveBoxArrowDownIcon as ArchiveBoxArrowDownIconOutline } from '@heroicons/react/24/outline';
import WasteTypePieChart from "../../components/schedules/WasteTypePieChart";
import Modal from "../../components/schedules/Model";

export default function SpecialCollectionHistory() {
    const [history, setHistory] = useState([]);
    const [isSidebarVisible, setIsSidebarVisible] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [wasteSummary, setWasteSummary] = useState([]);

    useEffect(() => {
        fetchHistory();
    }, []);

    const toggleSidebar = () => {
        setIsSidebarVisible(!isSidebarVisible);
    };

    const fetchHistory = () => {
        fetch('http://localhost:5555/schedule')
            .then(response => response.json())
            .then(data => {
                setHistory(data);
                calculateWasteSummary(data);
            });
    };

    const calculateWasteSummary = (schedules) => {
        const summary = schedules.reduce((acc, schedule) => {
            if (schedule.wasteType) {
                acc[schedule.wasteType] = (acc[schedule.wasteType] || 0) + 1;
            }
            return acc;
        }, {});
        const pieChartData = Object.keys(summary).map(type => ({
            type,
            value: summary[type]
        }));
        setWasteSummary(pieChartData);
    };

    const handlePDFDownload = () => {
        const doc = new jsPDF();
        doc.text("Special Waste Collection History", 10, 10);
        doc.save('special_collection_history.pdf');
    };

    return (
        <div className="min-h-screen flex flex-col bg-white">
            <Navbar />
            <div className="flex flex-1">
                {isSidebarVisible && (
                    <div className="fixed top-0 left-0 w-2/3 sm:w-1/3 lg:w-1/5 h-full bg-gray-100 z-40">
                        <SideBar />
                    </div>
                )}

                <div className={`flex-grow transition-all duration-300 p-4 ${isSidebarVisible ? 'ml-0 sm:ml-64' : 'ml-0'}`}>
                    <div className="w-full max-w-6xl mx-auto">
                        <h2 className="text-2xl font-bold mb-6 text-center sm:text-left">Special Waste Collection History</h2>

                        {/* Flex container for web view */}
                        <div className="flex flex-col lg:flex-row">
                            {/* Left section: Past schedules and download button */}
                            <div className="w-full lg:w-1/2">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-xl font-bold mb-4">Past Schedules</h3>
                                    <button
                                        onClick={handlePDFDownload}
                                        className="bg-black py-2 px-6 rounded-full text-sm hover:bg-gray-400 transition duration-300 text-white"
                                    >
                                        Download Details
                                    </button>
                                </div>

                                {/* Schedules list */}
                                <ul className="space-y-2">
                                    {history.map((item) => (
                                        <li key={item._id}
                                            className="p-4 border rounded-lg flex justify-between items-center bg-gray-100 hover:bg-gray-100 transition-shadow duration-300">
                                            <div className="flex flex-col text-left">
                                                <span><strong>Date:</strong> {new Date(item.date).toLocaleDateString()}</span>
                                                <span><strong>Status:</strong> {item.status}</span>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Right section: Pie chart */}
                            <div className="w-full lg:w-1/2 mt-8 lg:mt-0 lg:ml-6">
                                <h3 className="text-xl font-bold mb-4">Waste Disposed By Type</h3>
                                <div className="flex justify-center lg:justify-end">
                                    <WasteTypePieChart data={wasteSummary} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && selectedItem && (
                <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} item={selectedItem} />
            )}
        </div>
    );
}
