import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom"; // Import Link
import Navbar from "../../components/utility/Navbar";
import SideBar from "../../components/utility/SideBar";
import BackButton from "../../components/utility/BackButton";
import Breadcrumb from "../../components/utility/Breadcrumbs";
import { MdQrCodeScanner } from 'react-icons/md';
import QRScanner from "../../components/collection/QRScanner";
import BinChart from "../../components/collection/BinChart";


const breadcrumbItems = [
    { name: 'Collection', href: '/collection/' },
];

export default function Collection() {
    const [isScannerOpen, setIsScannerOpen] = useState(false);
    const [binSummary, setBinSummary] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBinData = async () => {
            try {
                setLoading(true);
                const response = await axios.get("http://localhost:5555/bin");
                const binData = response.data;

                const summary = {};
                binData.forEach(bin => {
                    if (bin.wasteLevel > 75) {
                        if (!summary[bin.zone]) {
                            summary[bin.zone] = 1;
                        } else {
                            summary[bin.zone] += 1;
                        }
                    }
                });

                const summaryArray = Object.entries(summary).map(([zone, binCount]) => ({
                    zone,
                    binCount,
                }));

                const sortedSummary = summaryArray.sort((a, b) => b.binCount - a.binCount);

                setBinSummary(sortedSummary);
            } catch (err) {
                setError("Failed to load bin data");
            } finally {
                setLoading(false);
            }
        };

        fetchBinData();
    }, []);

    return (
        <div className="min-h-screen flex flex-col">
            <div className="sticky top-0 z-10">
                <Navbar />
            </div>
            <div className="flex flex-1">
                <div className="hidden sm:block w-1/6">
                    <SideBar />
                </div>
                <div className="flex-1 w-full sm:w-5/6 p-4 flex flex-col">
                    <div className="mb-4">
                        <div className="flex flex-row items-center space-x-2 mb-4">
                            <BackButton />
                            <Breadcrumb items={breadcrumbItems} />
                        </div>
                        <div className="flex justify-start">
                            <Link to="/collection/qr-scanner">
                                <button
                                    className="flex items-center bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md focus:outline-none"
                                >
                                    <MdQrCodeScanner className="mr-2" size={20} />
                                    <span className="text-sm sm:text-base">Scan QR</span>
                                </button>
                            </Link>
                        </div>
                    </div>

                    {isScannerOpen && (
                        <div className="flex justify-center mt-4">
                            <QRScanner selectedCamera={null} />
                        </div>
                    )}

                    {loading ? (
                        <div className="text-center mt-4">Loading...</div>
                    ) : error ? (
                        <div className="text-center text-red-500 mt-4">{error}</div>
                    ) : (
                        <BinChart binSummary={binSummary} />
                    )}
                </div>
            </div>
        </div>
    );
}
