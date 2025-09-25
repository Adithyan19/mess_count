import React from "react";
import QRCode from "react-qr-code";
import { useAuth } from "../../hooks/useAuth";

export default function StudentDashboard() {
    const { user } = useAuth();

    return (
        <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="text-center">
                        <div className="inline-block bg-white p-4 rounded-lg shadow-md">
                            <QRCode
                                value={user.user_id}
                                size={256}
                                bgColor="#ffffff"
                                fgColor="#000000"
                            />
                        </div>
                    </div>
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold">
                            Student Details
                        </h3>
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <p>
                                <span className="font-medium">Name:</span>{" "}
                                {user.name}
                            </p>
                            <p>
                                <span className="font-medium">
                                    Admission No:
                                </span>{" "}
                                {user.admission_no}
                            </p>
                            <p>
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
