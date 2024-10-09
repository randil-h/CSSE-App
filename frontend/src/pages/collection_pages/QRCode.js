import React, { useEffect, useState } from "react";
import { SnackbarProvider, useSnackbar } from "notistack";
import SideBar from "../../components/utility/SideBar";
import Navbar from "../../components/utility/Navbar";
import Breadcrumb from "../../components/utility/Breadcrumbs";
import BackButton from "../../components/utility/BackButton";
import QRScanner from "../../components/collection/QRScanner";
import { MdQrCodeScanner } from "react-icons/md";
import axios from "axios";
import { QRCodeCanvas } from "qrcode.react";

export default function QRCodePage() {
    const [showScanner, setShowScanner] = useState(false);
    const [cameras, setCameras] = useState([]);
    const [selectedCamera, setSelectedCamera] = useState(null);
    const [hasCameraPermission, setHasCameraPermission] = useState(false);
    const [binData, setBinData] = useState(null);
    const [bins, setBins] = useState([]);
    const [selectedBin, setSelectedBin] = useState("");
    const { enqueueSnackbar } = useSnackbar();

    const breadcrumbItems = [
        { name: 'Collection', href: '/collection/' },
        { name: 'QR Code', href: '/collection/qr-scanner' }
    ];

    useEffect(() => {
        fetchBins();
    }, []);

    const fetchBins = async () => {
        try {
            const response = await axios.get('https://csse-backend.vercel.app/bin', { timeout: 5000 });
            setBins(response.data);
        } catch (error) {
            console.error("Error fetching bins:", error);
            enqueueSnackbar("Failed to fetch bins", { variant: "error" });
        }
    };

    const handleBinSelect = (event) => {
        setSelectedBin(event.target.value);
    };

    const requestCameraPermission = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            setHasCameraPermission(true);
            stream.getTracks().forEach(track => track.stop());

            const devices = await navigator.mediaDevices.enumerateDevices();
            const videoDevices = devices.filter(device => device.kind === "videoinput");
            setCameras(videoDevices);

            const backCamera = videoDevices.find(device => device.label.toLowerCase().includes('back'));
            if (backCamera) {
                setSelectedCamera(backCamera.deviceId);
            } else if (videoDevices.length > 0) {
                setSelectedCamera(videoDevices[0].deviceId);
            }
        } catch (err) {
            console.error("Error requesting camera permission:", err);
            setHasCameraPermission(false);
            enqueueSnackbar("Failed to access camera", { variant: "error" });
        }
    };

    const handleScanButtonClick = async () => {
        await requestCameraPermission();
        if (hasCameraPermission) {
            setShowScanner(true);
        }
    };

    const handleQRCodeScanned = async (binId) => {
        try {
            const response = await axios.get(`https://csse-backend.vercel.app/bin/${binId}`);
            setBinData(response.data);
            setShowScanner(false);
            enqueueSnackbar("Bin data fetched successfully", { variant: "success" });
        } catch (error) {
            console.error("Error fetching bin data:", error);
            enqueueSnackbar("Failed to fetch bin data", { variant: "error" });
        }
    };

    const generateQRCode = () => {
        if (selectedBin) {
            return (
                <div className="mt-4 p-4 bg-white rounded-lg shadow">
                    <h2 className="text-xl font-bold mb-2">Generated QR Code</h2>
                    <QRCodeCanvas value={selectedBin} size={200} /> {/* Use QRCodeCanvas */}
                    <p className="mt-2">Bin ID: {selectedBin}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <SnackbarProvider>
            <div className="flex flex-col min-h-screen">
                <div className="sticky top-0 z-10">
                    <Navbar />
                </div>
                <div className="flex flex-1">
                    <div className="hidden sm:block w-1/6">
                        <SideBar />
                    </div>
                    <div className="w-full sm:w-5/6 flex flex-col p-4 mt-1 sm:mt-0">
                        <div className="flex flex-row items-center mb-4">
                            <BackButton />
                            <Breadcrumb items={breadcrumbItems} />
                        </div>
                        <div className="flex justify-start mb-4">
                            <button
                                className="flex items-center bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md focus:outline-none ml-10"
                                onClick={handleScanButtonClick}
                            >
                                <MdQrCodeScanner className="mr-2" size={20} />
                                <span className="text-sm sm:text-base">Scan QR</span>
                            </button>
                        </div>

                        {showScanner && hasCameraPermission && (
                            <QRScanner selectedCamera={selectedCamera} onScan={handleQRCodeScanned} />
                        )}

                        {binData && (
                            <div className="mt-4 p-4 bg-white rounded-lg shadow">
                                <h2 className="text-xl font-bold mb-2">Bin Details</h2>
                                <p><strong>Bin ID:</strong> {binData.binID}</p>
                                <p><strong>Zone:</strong> {binData.zone}</p>
                                <p><strong>Collector ID:</strong> {binData.collectorID}</p>
                                <p><strong>Last Collection Time:</strong> {new Date(binData.collectionTime * 1000).toLocaleString()}</p>
                                <p><strong>Waste Level:</strong> {binData.wasteLevel}%</p>
                            </div>
                        )}

                        <div className="mt-8">
                            <h2 className="text-xl font-bold mb-4">Generate QR Code for Existing Bin</h2>
                            <select
                                className="p-2 border rounded"
                                value={selectedBin}
                                onChange={handleBinSelect}
                            >
                                <option value="">Select a bin</option>
                                {bins.map(bin => (
                                    <option key={bin.binID} value={bin.binID}>{bin.binID} - {bin.zone}</option>
                                ))}
                            </select>
                            {generateQRCode()}
                        </div>
                    </div>
                </div>
            </div>
        </SnackbarProvider>
    );
}
