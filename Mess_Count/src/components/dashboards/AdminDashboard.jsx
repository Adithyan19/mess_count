// src/dashboards/AdminDashboard.jsx
import React, { useState, useEffect } from "react";
import { BarChart3, UtensilsCrossed, UserPlus, Clock } from "lucide-react";
import { useAuth } from "../../hooks/useAuth.jsx";
import Papa from "papaparse";

function AdminDashboard() {
  const { user, fetchWithAuth } = useAuth();
  const [selectedFile, setSelectedFile] = useState(null);
  const [csvData, setCsvData] = useState([]);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  async function sendData() {
    if (!selectedFile) {
      alert("No file selected!");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const res = await fetchWithAuth(
        `${import.meta.env.VITE_BACKEND_URL}/api/upload-csv`,
        {
          method: "POST",
          body: formData,
        },
      );
      if (res.ok) {
      } else {
        console.log("SCv upload failed");
      }
    } catch (error) {
      console.error("Error uploading CSV:", error);
    }
  }

  const handleUpload = () => {
    if (selectedFile) {
      Papa.parse(selectedFile, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          setCsvData(results.data);
        },
        error: (error) => {
          console.error("Error parsing CSV:", error);
        },
      });
    } else {
      alert("Please select a CSV file first.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
        Add Students
      </h2>

      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
          <label className="w-full md:w-2/3">
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="block w-full h-10 text-sm text-gray-700 border-2 border-gray-300 rounded-lg
               bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </label>

          <button
            onClick={handleUpload}
            className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2
             px-6 rounded-lg transition duration-200"
          >
            Upload CSV
          </button>
        </div>

        <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-4 overflow-x-auto">
          {!selectedFile && csvData.length === 0 && (
            <p className="text-gray-500 text-center py-10">
              No file selected yet. Upload a CSV file.
            </p>
          )}

          {selectedFile && csvData.length === 0 && (
            <p className="text-gray-700 text-center font-medium py-10">
              Selected file has no data:{" "}
              <span className="font-semibold">{selectedFile.name}</span>
            </p>
          )}

          {csvData.length > 0 && (
            <div className="w-full">
              <h3 className="font-semibold mb-4 text-gray-700">Data:</h3>

              <div className="overflow-x-auto max-h-96 border rounded-lg shadow-sm">
                <table className="min-w-full border-collapse bg-white">
                  <thead className="bg-gray-100 text-gray-700 text-sm font-semibold">
                    <tr>
                      {Object.keys(csvData[0]).map((header, index) => (
                        <th
                          key={index}
                          className="border-b px-4 py-3 text-left whitespace-nowrap"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="text-gray-600 text-sm">
                    {csvData.map((row, rowIndex) => (
                      <tr
                        key={rowIndex}
                        className="hover:bg-gray-50 transition duration-150"
                      >
                        {Object.values(row).map((value, colIndex) => (
                          <td
                            key={colIndex}
                            className="border-b px-4 py-2 whitespace-nowrap"
                          >
                            {value || "-"}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
        {csvData.length > 0 && (
          <div>
            <button
              onClick={sendData}
              className="mt-6 w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2
             px-6 rounded-lg transition duration-200"
            >
              Submit Data
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
