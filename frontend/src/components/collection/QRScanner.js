import React, { useState } from "react";
import QrScanner from "react-qr-scanner";
import axios from "axios";
import { Camera, AlertCircle } from "lucide-react";

const QRScanner = ({ selectedCamera, onScan }) => {
    const [scanResult, setScanResult] = useState(null);
    const [binData, setBinData] = useState(null);
    const [error, setError] = useState("");

    const handleScan = async (data) => {
        if (data) {
            console.log("Scanned Data:", data);
            setScanResult(data);
            try {
                const response = await axios.get(`http://localhost:5000/bin/${data}`);
                setBinData(response.data);
                onScan(data);
            } catch (err) {
                setError("Error fetching bin information");
                console.error("Axios Error:", err.response ? err.response.data : err.message);
            }
        }
    };

    const handleError = (err) => {
        console.error("QR Scanner Error:", err);
        setError("Error scanning the QR code");
    };

    return (
        <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
                <Camera className="inline-block mr-2 mb-1" />
                Scan Bin's QR Code
            </h2>
            {selectedCamera && (
                <div className="relative">
                    <QrScanner
                        delay={300}
                        onError={handleError}
                        onScan={handleScan}
                        className="w-full h-64 rounded-lg overflow-hidden"
                        constraints={{
                            video: {
                                deviceId: selectedCamera,
                                facingMode: "environment"
                            }
                        }}
                    />
                    <div className="absolute inset-0 border-2 border-blue-500 rounded-lg pointer-events-none"></div>
                </div>
            )}
            {error && (
                <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md flex items-center">
                    <AlertCircle className="mr-2" />
                    <p>{error}</p>
                </div>
            )}
            {binData && (
                <div className="mt-6 bg-gray-100 p-4 rounded-md">
                    <h3 className="text-xl font-semibold mb-3 text-gray-800">Bin Information</h3>
                    <div className="space-y-2">
                        <p><span className="font-medium">Bin ID:</span> {binData.binID}</p>
                        <p><span className="font-medium">Zone:</span> {binData.zone}</p>
                        <p><span className="font-medium">Collector ID:</span> {binData.collectorID}</p>
                        <p><span className="font-medium">Last Collection:</span> {new Date(binData.collectionTime * 1000).toLocaleString()}</p>
                        <div className="flex items-center">
                            <span className="font-medium mr-2">Waste Level:</span>
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div
                                    className="bg-green-600 h-2.5 rounded-full"
                                    style={{width: `${binData.wasteLevel}%`}}
                                ></div>
                            </div>
                            <span className="ml-2">{binData.wasteLevel}%</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default QRScanner;