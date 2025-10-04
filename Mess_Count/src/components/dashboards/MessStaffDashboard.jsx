import { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";
import { useAuth } from "../../hooks/useAuth.jsx";
import { BACKEND_URL } from "../../utils/api.js";

function MessStaffDashboard() {
    const { user, fetchWithAuth } = useAuth();
    const videoRef = useRef(null);
    const codeReaderRef = useRef(null);
    const streamRef = useRef(null);
    const [hostels, setHostels] = useState([]);
    const [selectedHostelId, setSelectedHostelId] = useState("");
    const [scannerActive, setScannerActive] = useState(false);
    const [scannedUser, setScannedUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadHostels() {
            try {
                const res = await fetchWithAuth(
                    `${BACKEND_URL}/api/user/hostels`
                );
                const data = await res.json();
                console.log(data);
                if (res.ok) setHostels(data.hostels);
                else setError(data.message || "Failed to load hostels");
            } catch {
                setError("Error fetching hostels");
            }
        }
        loadHostels();
        return () => {
            stopScanner();
        };
    }, [fetchWithAuth]);

    const stopScanner = () => {
        try {
            if (codeReaderRef.current) {
                codeReaderRef.current.reset();
                codeReaderRef.current = null;
            }
            if (streamRef.current) {
                streamRef.current.getTracks().forEach((t) => t.stop());
                streamRef.current = null;
            }
            if (videoRef.current) {
                videoRef.current.srcObject = null;
            }
            setScannerActive(false);
        } catch (e) {
            console.error("Error stopping scanner:", e);
        }
    };

    const handleHostelChange = (e) => {
        const newHostelId = e.target.value;

        if (scannerActive) {
            stopScanner();
        }

        setScannedUser(null);
        setError("");
        setLoading(false);

        setSelectedHostelId(newHostelId);

        if (newHostelId) {
            setScannerActive(true);
        }
    };

    useEffect(() => {
        if (!scannerActive || !selectedHostelId) return;

        let isActive = true;

        async function initScanner() {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: "environment" },
                });

                if (!isActive) {
                    stream.getTracks().forEach((t) => t.stop());
                    return;
                }

                streamRef.current = stream;

                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    await videoRef.current.play();

                    if (!isActive) {
                        stopScanner();
                        return;
                    }

                    const codeReader = new BrowserMultiFormatReader();
                    codeReaderRef.current = codeReader;

                    codeReader.decodeFromVideoElement(
                        videoRef.current,
                        (result, err) => {
                            if (result && isActive) {
                                handleQrScan(result.getText());
                            }
                        }
                    );
                }
            } catch (e) {
                console.error("Camera error:", e);
                if (isActive) {
                    setError("Failed to access camera");
                    stopScanner();
                }
            }
        }

        initScanner();

        return () => {
            isActive = false;
            stopScanner();
        };
    }, [scannerActive, selectedHostelId]);

    const handleQrScan = async (qrCode) => {
        if (!user || loading || !selectedHostelId) return;
        setLoading(true);
        setError("");

        try {
            const res = await fetchWithAuth(`${BACKEND_URL}/api/user/scanQr`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    qrCode,
                    currentHostelId: selectedHostelId,
                }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Scan failed");
            setScannedUser(data.user);
        } catch (err) {
            setError(err.message);
            setScannedUser(null);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="mb-6">
                    <label className="block font-medium mb-2 text-gray-700">
                        Select Hostel
                    </label>
                    <select
                        className="w-full p-2 border border-gray-300 rounded bg-white text-gray-900"
                        value={selectedHostelId}
                        onChange={handleHostelChange}
                    >
                        <option className="text-gray-900" value="">
                            -- Choose Hostel --
                        </option>
                        {hostels.map((h) => (
                            <option
                                key={h.hostel_id}
                                className="text-gray-900"
                                value={h.hostel_id}
                            >
                                {h.hostel_name}
                            </option>
                        ))}
                    </select>
                    {error && <p className="mt-2 text-red-500">{error}</p>}
                </div>

                {selectedHostelId && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="text-center">
                            <div className="inline-block bg-white p-4 rounded-lg shadow-md">
                                <video
                                    ref={videoRef}
                                    className="w-[300px] h-[300px] bg-black rounded-lg"
                                    muted
                                    playsInline
                                />
                            </div>
                            {loading && (
                                <p className="mt-2 text-blue-500">
                                    Processing QR code...
                                </p>
                            )}
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-xl font-semibold text-gray-800">
                                Student Details
                            </h3>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                {scannedUser ? (
                                    <>
                                        <p className="text-gray-800">
                                            <span className="font-medium">
                                                Name:
                                            </span>{" "}
                                            {scannedUser.name}
                                        </p>
                                        <p className="text-gray-800">
                                            <span className="font-medium">
                                                Admission No:
                                            </span>{" "}
                                            {scannedUser.admission_no}
                                        </p>
                                        <p className="text-gray-800">
                                            <span className="font-medium">
                                                Hostel:
                                            </span>{" "}
                                            {
                                                hostels.find(
                                                    (h) =>
                                                        h.hostel_id ===
                                                        selectedHostelId
                                                )?.hostel_name
                                            }
                                        </p>
                                    </>
                                ) : (
                                    <p className="text-gray-500"></p>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default MessStaffDashboard;
