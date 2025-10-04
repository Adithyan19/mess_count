// src/dashboards/AdminDashboard.jsx
import React from "react";
import { BarChart3, UtensilsCrossed, UserPlus, Clock } from "lucide-react";

function AdminDashboard({ activeRoute }) {
    let content;
    switch (activeRoute) {
        case "/food-count":
            content = (
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl font-bold mb-6 text-gray-800 flex items-center">
                        <BarChart3 className="mr-2 h-8 w-8 text-blue-500" />{" "}
                        Food Count Analytics
                    </h2>
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                            <div className="bg-blue-50 p-4 rounded-lg text-center">
                                <p className="text-3xl font-bold text-blue-700">
                                    150
                                </p>
                                <p className="text-gray-600">
                                    Breakfast Served
                                </p>
                            </div>
                            <div className="bg-blue-50 p-4 rounded-lg text-center">
                                <p className="text-3xl font-bold text-blue-700">
                                    200
                                </p>
                                <p className="text-gray-600">Lunch Served</p>
                            </div>
                            <div className="bg-blue-50 p-4 rounded-lg text-center">
                                <p className="text-3xl font-bold text-blue-700">
                                    180
                                </p>
                                <p className="text-gray-600">Dinner Served</p>
                            </div>
                        </div>
                        <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                            <p className="text-gray-500">Chart Placeholder</p>
                        </div>
                    </div>
                </div>
            );
            break;
        case "/food-taken":
            content = (
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl font-bold mb-6 text-gray-800 flex items-center">
                        <UtensilsCrossed className="mr-2 h-8 w-8 text-blue-500" />{" "}
                        Food Taken Records
                    </h2>
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-blue-100">
                                <tr>
                                    <th className="p-4 text-left">
                                        Student ID
                                    </th>
                                    <th className="p-4 text-left">Meal</th>
                                    <th className="p-4 text-left">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-t">
                                    <td className="p-4">STD123</td>
                                    <td className="p-4">Lunch</td>
                                    <td className="p-4">2023-10-01</td>
                                </tr>
                                {/* Add more rows */}
                            </tbody>
                        </table>
                    </div>
                </div>
            );
            break;
        case "/add-student":
            content = (
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl font-bold mb-6 text-gray-800 flex items-center">
                        <UserPlus className="mr-2 h-8 w-8 text-blue-500" /> Add
                        New Student
                    </h2>
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Student ID
                                </label>
                                <input
                                    type="text"
                                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Hostel
                                </label>
                                <select className="mt-1 block w-full border border-gray-300 rounded-md p-2">
                                    <option>Block A</option>
                                    <option>Block B</option>
                                </select>
                            </div>
                            <div className="md:col-span-2">
                                <button
                                    type="submit"
                                    className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600"
                                >
                                    Add Student
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            );
            break;
        case "/student-logs":
            content = (
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl font-bold mb-6 text-gray-800 flex items-center">
                        <Clock className="mr-2 h-8 w-8 text-blue-500" /> Student
                        Activity Logs
                    </h2>
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-blue-100">
                                <tr>
                                    <th className="p-4 text-left">
                                        Student ID
                                    </th>
                                    <th className="p-4 text-left">Action</th>
                                    <th className="p-4 text-left">Timestamp</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-t">
                                    <td className="p-4">STD123</td>
                                    <td className="p-4">Meal Taken</td>
                                    <td className="p-4">2023-10-01 12:30</td>
                                </tr>
                                {/* Add more rows */}
                            </tbody>
                        </table>
                    </div>
                </div>
            );
            break;
        default:
            content = <div className="text-red-500">Invalid section</div>;
    }
    return content;
}

export default AdminDashboard;
