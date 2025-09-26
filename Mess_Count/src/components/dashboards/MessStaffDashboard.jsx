import { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";

export default function MessStaffDashboard() {
    const videoRef = useRef(null);
    const [result, setResult] = useState("");

    useEffect(() => {
        let codeReader;
        let stream;

        async function initScanner() {
            try {
                stream = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: "environment" },
                });
                videoRef.current.srcObject = stream;
                await videoRef.current.play();

                codeReader = new BrowserMultiFormatReader();
                codeReader.decodeFromVideoElement(
                    videoRef.current,
                    (scanResult, err) => {
                        if (scanResult) {
                            setResult(scanResult.getText());
                        }
                    }
                );
            } catch (e) {
                console.error("Camera error:", e);
            }
        }

        initScanner();

        return () => {
            if (codeReader) {
                codeReader.reset();
            }
            if (stream) {
                stream.getTracks().forEach((t) => t.stop());
            }
        };
    }, []);

    return (
        <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-6">
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
                    </div>
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold">
                            Student Details
                        </h3>
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <p>
                                <span className="font-medium">Name:</span>
                                {result}
                                {/* {user.name} */}
                            </p>
                            <p>
                                <span className="font-medium">
                                    Admission No:
                                </span>{" "}
                                {/* {user.admission_no} */}
                            </p>
                            <p>
                                <span className="font-medium">Hostel:</span>{" "}
                                {/* {user.hostel_name} */}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
