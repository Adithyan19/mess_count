import React, { useState, useEffect } from "react";
import QRCode from "react-qr-code";
import { useAuth } from "../../hooks/useAuth.jsx";
import { BACKEND_URL } from "../../utils/api.js";

function StudentDashboard() {
    const { user, fetchWithAuth } = useAuth();
    const [qrCode, setQrCode] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!user) return;
        fetchWithAuth(`${BACKEND_URL}/api/user/getQrCode`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                user_id: user.user_id,
                hostel_id: user.hostel_id,
            }),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch QR code");
                }
                return response.json();
            })
            .then((data) => {
                setQrCode(data.qrCode);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, [user, fetchWithAuth]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-gray-600 text-lg">Loading...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen p-4">
                <p className="text-red-500 text-center">{error}</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-center justify-center">
                        <div className="inline-block bg-white p-3 sm:p-4 rounded-lg shadow-md">
                            <div className="w-full max-w-[256px]">
                                <QRCode
                                    value={qrCode}
                                    size={256}
                                    bgColor="#ffffff"
                                    fgColor="#000000"
                                    className="w-full h-auto"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <h3 className="text-xl sm:text-2xl font-semibold text-gray-800">
                            Student Details
                        </h3>
                        <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                            <p className="text-gray-800 break-words">
                                <span className="font-medium">Name:</span>{" "}
                                {user.name}
                            </p>
                            <p className="text-gray-800 break-words">
                                <span className="font-medium">
                                    Admission No:
                                </span>{" "}
                                {user.admission_no}
                            </p>
                            <p className="text-gray-800 break-words">
                                <span className="font-medium">Hostel:</span>{" "}
                                {user.hostel_name}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default StudentDashboard;
