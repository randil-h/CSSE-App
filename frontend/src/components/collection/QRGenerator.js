import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import axios from 'axios';

function QRGenerator() {
    const [binID, setBinID] = useState('');
    const [qrCodeUrl, setQrCodeUrl] = useState('');
    const [binData, setBinData] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const canvasRef = useRef(null);

    useEffect(() => {
        if (qrCodeUrl && canvasRef.current) {
            QRCode.toCanvas(canvasRef.current, qrCodeUrl, function (error) {
                if (error) console.error('QR Code Error:', error);
                console.log('QR code generated!');
            });
        }
    }, [qrCodeUrl]);

    const fetchBinData = async (id) => {
        try {
            const response = await axios.get(`https://csse-backend.vercel.app/bin/${id}`);
            setBinData(response.data);
            setError('');
        } catch (err) {
            setError('Error fetching bin information');
            console.error('Axios Error:', err.response ? err.response.data : err.message);
        }
    };

    const generateQrCode = (binID) => {
        const url = `https://csse-backend.vercel.app/bin/${binID}`;
        setQrCodeUrl(url);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        generateQrCode(binID);
        fetchBinData(binID);
    };

    return (
        <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Generate Bin QR Code</h2>
            <form onSubmit={handleSubmit} className="mb-4">
                <input
                    type="text"
                    value={binID}
                    onChange={(e) => setBinID(e.target.value)}
                    placeholder="Enter Bin ID"
                    required
                    className="w-full p-2 border rounded mb-2"
                />
                <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
                    Generate QR Code
                </button>
            </form>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                    <span className="block sm:inline">{error}</span>
                </div>
            )}

            {success && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
                    <span className="block sm:inline">{success}</span>
                </div>
            )}

            {qrCodeUrl && (
                <div className="text-center">
                    <h3 className="text-xl font-semibold mb-2">Generated QR Code:</h3>
                    <canvas ref={canvasRef} className="mx-auto"></canvas>
                    <p className="mt-2 text-sm text-gray-600">Scan this code to get bin information</p>
                </div>
            )}

            {binData && (
                <div className="mt-6 bg-gray-100 p-4 rounded-md">
                    <h3 className="text-xl font-semibold mb-3 text-gray-800">Bin Information</h3>
                    <div className="space-y-2">
                        <p><span className="font-medium">Bin ID:</span> {binData.binID}</p>
                        <p><span className="font-medium">Zone:</span> {binData.zone}</p>
                        <p><span className="font-medium">Collector ID:</span> {binData.collectorID}</p>
                        <p><span className="font-medium">Collection Time:</span> {new Date(binData.collectionTime).toLocaleString()}</p>
                        <p><span className="font-medium">Waste Level:</span> {binData.wasteLevel}%</p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default QRGenerator;