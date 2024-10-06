import React, { useState, useEffect } from "react";
import QrScanner from "react-qr-scanner";
import axios from "axios";

const QRScanner = () => {
    const [scanResult, setScanResult] = useState(null);
    const [binData, setBinData] = useState(null);
    const [error, setError] = useState("");
    const [hasBackCamera, setHasBackCamera] = useState(false);
    const [stream, setStream] = useState(null);

    useEffect(() => {
        checkForBackCamera();
        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    const checkForBackCamera = async () => {
        try {
            const devices = await navigator.mediaDevices.enumerateDevices();
            const backCamera = devices.find(device =>
                device.kind === 'videoinput' && device.label.toLowerCase().includes('back')
            );
            setHasBackCamera(!!backCamera);
            if (backCamera) {
                const newStream = await navigator.mediaDevices.getUserMedia({
                    video: { deviceId: backCamera.deviceId }
                });
                setStream(newStream);
            }
        } catch (err) {
            console.error("Error accessing camera:", err);
            setError("Error accessing camera. Please ensure you've granted camera permissions.");
        }
    };

    const handleScan = async (data) => {
        if (data) {
            console.log("Scanned Data (Bin ID):", data);
            setScanResult(data);

            try {
                const response = await axios.get(`http://localhost:5000/bin/${data}`);
                setBinData(response.data);
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

    const previewStyle = {
        height: 300,
        width: 300,
    };

    if (!hasBackCamera) {
        return <div>This device does not have a back camera. Please use a device with a back camera.</div>;
    }

    return (
        <div style={{ textAlign: "center", marginTop: "20px" }}>
            <h2>Scan Bin's QR Code</h2>
            {stream && (
                <QrScanner
                    delay={300}
                    onError={handleError}
                    onScan={handleScan}
                    style={previewStyle}
                    constraints={{ video: { facingMode: "environment" } }}
                />
            )}
            {error && <p style={{ color: "red" }}>{error}</p>}
            {binData && (
                <div style={{ marginTop: "20px" }}>
                    <h3>Bin Information</h3>
                    <p><strong>Bin ID:</strong> {binData.binID}</p>
                    <p><strong>Zone:</strong> {binData.zone}</p>
                    <p><strong>Waste Level:</strong> {binData.wasteLevel}%</p>
                    <p><strong>Collection Time:</strong> {new Date(binData.collectionTime).toLocaleString()}</p>
                    <p><strong>Last Collected By:</strong> {binData.collectorID}</p>
                </div>
            )}
        </div>
    );
};

export default QRScanner;