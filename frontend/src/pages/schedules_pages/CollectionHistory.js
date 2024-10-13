import { useState, useEffect, useRef } from "react";
import Navbar from "../../components/utility/Navbar";
import SideBar from "../../components/utility/SideBar";
import jsPDF from 'jspdf';
import { ArchiveBoxArrowDownIcon as ArchiveBoxArrowDownIconSolid } from '@heroicons/react/24/solid';
import { ArchiveBoxArrowDownIcon as ArchiveBoxArrowDownIconOutline } from '@heroicons/react/24/outline';
import WasteTypePieChart from "../../components/schedules/WasteTypePieChart";
import Modal from "../../components/schedules/Model";
import axios from "axios";

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

    const fetchHistory = async () => {
        try {
            const response = await axios.get("https://csse-backend.vercel.app/schedule");
            setHistory(response.data);
            calculateWasteSummary(response.data);
        } catch (error) {
            console.error("Error fetching history:", error);
        }
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

        // Add title with larger font size and centered alignment
        doc.setFontSize(18);
        doc.text("Special Waste Collection History", doc.internal.pageSize.getWidth() / 2, 20, { align: 'center' });

        // Line below the title for separation
        doc.setLineWidth(0.5);
        doc.line(10, 25, doc.internal.pageSize.getWidth() - 10, 25); // Draw line

        // Move the yOffset down to leave space after title and line
        let yOffset = 35;

        history.forEach((item, index) => {
            const date = new Date(item.date).toLocaleDateString();
            const statusText = item.status === "Cancelled" ? "Cancelled" : "Completed";
            const displayStatus = item.status === "Pending" ? "Completed" : statusText;
            const statusColor = displayStatus === "Completed" ? 'green' : 'red';

            // Waste Type and Location
            const wasteType = item.wasteType || "Unknown";
            const location = item.location || "Not Specified";

            // Section title for each schedule
            doc.setFontSize(14);
            doc.text(`Schedule ${index + 1}`, 10, yOffset);

            // Waste Type
            doc.setFontSize(12);
            doc.text(`Waste Type:`, 10, yOffset + 10);
            doc.text(wasteType, 50, yOffset + 10);

            // Date
            doc.text(`Date:`, 10, yOffset + 20);
            doc.text(date, 50, yOffset + 20);

            // Location
            doc.text(`Location:`, 10, yOffset + 30);
            doc.text(location, 50, yOffset + 30);

            // Status (with color)
            doc.text(`Status:`, 10, yOffset + 40);
            doc.setTextColor(displayStatus === "Completed" ? 0 : 255, displayStatus === "Completed" ? 128 : 0, 0); // Green for completed, red for others
            doc.text(displayStatus, 50, yOffset + 40);

            // Reset color back to default for the next section
            doc.setTextColor(0, 0, 0);

            // Add space before the next schedule entry
            yOffset += 50;

            // Check if we need a new page (Avoid content getting cut off)
            if (yOffset > doc.internal.pageSize.getHeight() - 30) {
                doc.addPage();
                yOffset = 20; // Reset yOffset for new page
            }
        });

        // Save the generated PDF
        doc.save('special_collection_history.pdf');
    };



    return (
        <div className="min-h-screen flex flex-col bg-white">
            <div className="sticky top-0 z-10">
                <Navbar/>
                <div className="bg-green-200 w-full h-12 flex items-center justify-between px-4">
                    <div className="text-gray-700 font-semibold ">Special Collection History</div>
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

            <div className={`flex-grow transition-all duration-300 p-4 ${isSidebarVisible ? 'ml-0 sm:ml-64' : 'ml-0'}`}>
                <div className="w-full max-w-6xl mx-auto">
                    <h2 className="text-2xl font-bold mb-6 text-center sm:text-left">Special Waste Collection
                        History</h2>

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
                                {history.map((item) => {
                                    // Logic to determine status text and color
                                    let statusText = item.status === "Cancelled" ? "Cancelled" : "Completed";
                                    let statusColor = item.status === "Cancelled" ? "text-red-500" : "text-green-500";

                                    // Override the status for "Pending" to show "Completed"
                                    if (item.status === "Pending") {
                                        statusText = "Completed"; // Show 'Completed' for Pending
                                        statusColor = "text-green-500"; // Use green color for Completed
                                    }

                                    return (
                                        <li key={item._id}
                                            className="p-4 border rounded-lg flex justify-between items-center bg-gray-100 hover:bg-gray-100 transition-shadow duration-300">
                                            <div className="flex flex-col text-left">
                                                <span><strong>Date:</strong> {new Date(item.date).toLocaleDateString()}</span>
                                                <span>
                        <strong>Status: </strong>
                        <span className={statusColor}>{statusText}</span>
                    </span>
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>

                        </div>
                        {/* Right section: Pie chart */}
                        <div className="w-full lg:w-1/2 mt-8 lg:mt-0 lg:ml-6">
                            <h3 className="text-xl font-bold mb-4">Summary of Waste Disposed By Type</h3>
                            <div className="flex justify-center lg:justify-end">
                                <WasteTypePieChart data={wasteSummary}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


    {/* Modal */
    }
    {
        isModalOpen && selectedItem && (
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} item={selectedItem}/>
        )
    }
</div>

)
    ;
}
