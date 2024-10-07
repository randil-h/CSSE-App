import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import axios from 'axios';

function QRGenerator() {
    const [binID, setBinID] = useState('');
    const [qrCodeUrl, setQrCodeUrl] = useState('');
    const [binData, setBinData] = useState(null);
    const [error, setError] = useState('');
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
            const response = await axios.get(`http://localhost:5000/bin/${id}`);
            setBinData(response.data);
            setError('');
        } catch (err) {
            setError('Error fetching bin information');
            console.error('Axios Error:', err.response ? err.response.data : err.message);
        }
    };

    const generateQrCode = (binID) => {
        const url = `http://localhost:5000/bin/${binID}`;
        setQrCodeUrl(url);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        generateQrCode(binID);
        fetchBinData(binID);
    };

    return (
        <div style={{ textAlign: "center", marginTop: "20px" }}>
            <h2>Generate Bin QR Code</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={binID}
                    onChange={(e) => setBinID(e.target.value)}
                    placeholder="Enter Bin ID"
                    required
                />
                <button type="submit">Generate QR Code</button>
            </form>

            {qrCodeUrl && (
                <div style={{ marginTop: "20px" }}>
                    <h3>Generated QR Code:</h3>
                    <canvas ref={canvasRef}></canvas>
                    <p>Scan this code to get bin information</p>
                </div>
            )}

            {error && <p style={{ color: "red" }}>{error}</p>}

            {binData && (
                <div style={{ marginTop: "20px" }}>
                    <h3>Bin Information</h3>
                    <p><strong>Bin ID:</strong> {binData.binID}</p>
                    <p><strong>Zone:</strong> {binData.zone}</p>
                    <p><strong>Collector ID:</strong> {binData.collectorID}</p>
                    <p><strong>Collection Time:</strong> {new Date(binData.collectionTime).toLocaleString()}</p>
                    <p><strong>Waste Level:</strong> {binData.wasteLevel}</p>
                </div>
            )}
        </div>
    );
}

export default QRGenerator;
