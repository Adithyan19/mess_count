import { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";
import { useAuth } from "../../hooks/useAuth.jsx";
import { BACKEND_URL } from "../../utils/api.js";

function MessStaffDashboard() {
  const { user, fetchWithAuth } = useAuth();
  const videoRef = useRef(null);
  const codeReaderRef = useRef(null);
  const controlsRef = useRef(null);
  const [hostels, setHostels] = useState([]);
  const [selectedHostelId, setSelectedHostelId] = useState("");
  const [scannerActive, setScannerActive] = useState(false);
  const [scannedUser, setScannedUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const lastScanTimeRef = useRef(0);

  useEffect(() => {
    async function loadHostels() {
      try {
        const res = await fetchWithAuth(`${BACKEND_URL}/api/user/hostels`);
        const data = await res.json();
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

  useEffect(() => {
    if (!user) {
      stopScanner();
      setScannerActive(false);
      setSelectedHostelId("");
      setScannedUser(null);
      setError("");
    }
  }, [user]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (scannerActive) {
          stopScanner();
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [scannerActive]);

  useEffect(() => {
    const handleBlur = () => {
      if (scannerActive) {
        stopScanner();
      }
    };

    const handlePageHide = () => {
      stopScanner();
    };

    window.addEventListener("blur", handleBlur);
    document.addEventListener("pagehide", handlePageHide);
    return () => {
      window.removeEventListener("blur", handleBlur);
      document.removeEventListener("pagehide", handlePageHide);
    };
  }, [scannerActive]);

  const stopScanner = () => {
    try {
      if (controlsRef.current) {
        controlsRef.current.stop();
        controlsRef.current = null;
      }
      if (codeReaderRef.current) {
        codeReaderRef.current = null;
      }
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.srcObject = null;
      }
      setScannerActive(false);
    } catch (e) {
      console.error("Error stopping scanner:", e);
    }
  };

  const handleHostelChange = (e) => {
    const newHostelId = e.target.value;
    if (scannerActive) stopScanner();

    setScannedUser(null);
    setError("");
    setLoading(false);
    setSelectedHostelId(newHostelId);
  };

  const toggleScanner = () => {
    if (scannerActive) {
      stopScanner();
    } else if (selectedHostelId) {
      setScannerActive(true);
    } else {
      setError("Please select a hostel first.");
      setTimeout(() => setError(""), 2000);
    }
  };

  useEffect(() => {
    if (!scannerActive || !selectedHostelId) return;
    let isActive = true;

    async function initScanner() {
      try {
        if (videoRef.current) {
          videoRef.current.srcObject = null;
        }

        if (!isActive) return;

        const codeReader = new BrowserMultiFormatReader();
        codeReaderRef.current = codeReader;

        const constraints = {
          video: { facingMode: "environment" },
        };

        const controls = await codeReader.decodeFromConstraints(
          constraints,
          videoRef.current,
          (result, err) => {
            if (err && err.name !== "NotFoundException2") {
              console.error("Decode error:", err);
            }
            if (result && isActive) {
              const now = Date.now();
              if (now - lastScanTimeRef.current > 1500 && !loading) {
                lastScanTimeRef.current = now;
                handleQrScan(result.getText());
              }
            }
          },
        );
        controlsRef.current = controls;
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
        body: JSON.stringify({ qrCode, currentHostelId: selectedHostelId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Scan failed");
      setScannedUser(data.user);
    } catch (err) {
      setError(err.message);
      setScannedUser(null);
      setTimeout(() => setError(""), 2000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div
        className={`rounded-xl shadow-lg p-6 transition-all duration-300 ${
          error ? "bg-red-500 border border-red-400" : "bg-white"
        }`}
      >
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
          {error && <p className="mt-2 text-amber-50">{error}</p>}
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
              <button
                onClick={toggleScanner}
                className={`mt-4 px-6 py-2 rounded-lg font-medium transition-colors ${
                  scannerActive
                    ? "bg-red-500 hover:bg-red-600 text-white"
                    : "bg-green-500 hover:bg-green-600 text-white"
                }`}
              >
                {scannerActive ? "Stop Scanner" : "Start Scanner"}
              </button>
              {loading && (
                <p className="mt-2 text-blue-500">Processing QR code...</p>
              )}
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-800">
                Student Details
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                {scannedUser ? (
                  <>
                    <p className="text-green-600">
                      <span className="font-medium">Name:</span>{" "}
                      {scannedUser.name}
                    </p>
                    <p className="text-green-600">
                      <span className="font-medium">Admission No:</span>{" "}
                      {scannedUser.admission_no}
                    </p>
                    <p className="text-green-600">
                      <span className="font-medium">Hostel:</span>{" "}
                      {
                        hostels.find((h) => h.hostel_id == selectedHostelId)
                          ?.hostel_name
                      }
                    </p>
                  </>
                ) : (
                  <p className="text-gray-500 ">Scan a QR</p>
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
