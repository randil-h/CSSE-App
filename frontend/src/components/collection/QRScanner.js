import React, { useState } from "react";
import QrScanner from "react-qr-scanner";
import axios from "axios";

const QRScanner = ({ selectedCamera, onScan }) => {
    const [scanResult, setScanResult] = useState(null);
    const [binData, setBinData] = useState(null);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleScan = async (data) => {
        // Ensure data is in the correct format (string) before proceeding
        const binID = typeof data === 'string' ? data : data?.binID || ''; // Adjust based on your data structure

        if (binID) {
            setScanResult(binID);
            let retryCount = 0;
            const maxRetries = 3;

            while (retryCount < maxRetries) {
                try {
                    console.log("Fetching bin data...");
                    // Use the corrected binID in the request URL
                    const response = await axios.get(`https://csse-backend.vercel.app/bin/${binID}`);
                    console.log("Bin data received:", response.data);
                    setBinData(response.data);

                    console.log("Updating waste level...");
                    const updateResponse = await axios.put(`https://csse-backend.vercel.app/bin/${binID}`, { wasteLevel: 0 });

                    if (updateResponse.status === 200) {
                        setSuccess("Bin emptied successfully!");
                        setBinData(prevData => ({ ...prevData, wasteLevel: 0 }));
                        onScan(binID);
                        break;
                    }
                } catch (err) {
                    retryCount += 1;

                    if (retryCount >= maxRetries) {
                        console.error("Full error object:", err);
                        let errorMessage = "Unknown error occurred";
                        if (err.response) {
                            errorMessage = `Server Error: ${err.response.status} - ${err.response.statusText}`;
                            if (err.response.data && err.response.data.error) {
                                errorMessage += ` - ${err.response.data.error}`;
                            }
                        } else if (err.request) {
                            errorMessage = "No response received from server";
                        } else {
                            errorMessage = err.message;
                        }
                        setError(`Error processing bin: ${errorMessage}`);
                        break;
                    } else {
                        console.log(`Retrying... (${retryCount})`);
                    }
                }
            }
        } else {
            console.error("Invalid binID:", binID);
            setError("Invalid binID provided.");
        }
    };

    const handleError = (err) => {
        console.error("QR Scanner Error:", err);
        setError("Error scanning the QR code");
    };

    return (
        <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
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
                <div
                    className="bg-red-100 border border-red-400 text-red-700 px-6 py-5 rounded-lg relative mt-6"
                    style={{ fontSize: "18px", maxHeight: "150px", overflowY: "auto" }}
                    role="alert"
                >
                    <strong className="font-bold block mb-2 text-xl">Error!</strong>
                    <span className="block">{error}</span>
                </div>
            )}

            {success && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mt-4" role="alert">
                    <span className="block sm:inline">{success}</span>
                </div>
            )}
            {binData && (
                <div className="mt-6 bg-gray-100 p-4 rounded-md">
                    <h3 className="text-xl font-semibold mb-3 text-gray-800">Bin Information</h3>
                    <div className="space-y-2">
                        <p><span className="font-medium">Bin ID:</span> {binData.binID}</p>
                        <p><span className="font-medium">Zone:</span> {binData.zone}</p>
                        <p><span className="font-medium">Collector ID:</span> {binData.collectorID}</p>
                        <p><span className="font-medium">Last Collection:</span> {new Date(binData.collectionTime).toLocaleString()}</p>
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