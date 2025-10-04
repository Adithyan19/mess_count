// src/dashboards/SuperAdminDashboard.jsx
import React from "react";
import { UserPlus, Users, ChefHat, BarChart3 } from "lucide-react";

function SuperAdminDashboard({ activeRoute }) {
    let content;
    switch (activeRoute) {
        case "/create-admin":
            content = (
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl font-bold mb-6 text-gray-800 flex items-center">
                        <UserPlus className="mr-2 h-8 w-8 text-purple-500" />{" "}
                        Create New Admin
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
                                    Password
                                </label>
                                <input
                                    type="password"
                                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Hostel Assignment
                                </label>
                                <select className="mt-1 block w-full border border-gray-300 rounded-md p-2">
                                    <option>All Hostels</option>
                                    <option>Block A</option>
                                </select>
                            </div>
                            <div className="md:col-span-2">
                                <button
                                    type="submit"
                                    className="w-full bg-purple-500 text-white py-3 rounded-lg hover:bg-purple-600"
                                >
                                    Create Admin
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            );
            break;
        case "/promote-admin":
            content = (
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl font-bold mb-6 text-gray-800 flex items-center">
                        <Users className="mr-2 h-8 w-8 text-purple-500" />{" "}
                        Promote to Admin
                    </h2>
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <div className="mb-6">
                            <input
                                type="text"
                                placeholder="Search user by email or ID"
                                className="w-full border border-gray-300 rounded-md p-3"
                            />
                        </div>
                        <div className="space-y-4">
                            {/* Example user */}
                            <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                                <div>
                                    <p className="font-medium">Jane Smith</p>
                                    <p className="text-sm text-gray-600">
                                        jane@example.com - Current: Staff
                                    </p>
                                </div>
                                <button className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600">
                                    Promote
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            );
            break;
        case "/add-mess-staff":
            content = (
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl font-bold mb-6 text-gray-800 flex items-center">
                        <ChefHat className="mr-2 h-8 w-8 text-purple-500" /> Add
                        Mess Staff
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
                                    Password
                                </label>
                                <input
                                    type="password"
                                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Shift
                                </label>
                                <select className="mt-1 block w-full border border-gray-300 rounded-md p-2">
                                    <option>Morning</option>
                                    <option>Evening</option>
                                </select>
                            </div>
                            <div className="md:col-span-2">
                                <button
                                    type="submit"
                                    className="w-full bg-purple-500 text-white py-3 rounded-lg hover:bg-purple-600"
                                >
                                    Add Staff
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            );
            break;
        case "/all-food-counts":
            content = (
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl font-bold mb-6 text-gray-800 flex items-center">
                        <BarChart3 className="mr-2 h-8 w-8 text-purple-500" />{" "}
                        All Food Counts
                    </h2>
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                            <div className="bg-purple-50 p-4 rounded-lg text-center">
                                <p className="text-3xl font-bold text-purple-700">
                                    450
                                </p>
                                <p className="text-gray-600">Total Served</p>
                            </div>
                            <div className="bg-purple-50 p-4 rounded-lg text-center">
                                <p className="text-3xl font-bold text-purple-700">
                                    150
                                </p>
                                <p className="text-gray-600">Breakfast</p>
                            </div>
                            <div className="bg-purple-50 p-4 rounded-lg text-center">
                                <p className="text-3xl font-bold text-purple-700">
                                    200
                                </p>
                                <p className="text-gray-600">Lunch</p>
                            </div>
                            <div className="bg-purple-50 p-4 rounded-lg text-center">
                                <p className="text-3xl font-bold text-purple-700">
                                    100
                                </p>
                                <p className="text-gray-600">Dinner</p>
                            </div>
                        </div>
                        <div className="h-80 bg-gray-100 rounded-lg flex items-center justify-center">
                            <p className="text-gray-500">
                                Comprehensive Chart Placeholder
                            </p>
                        </div>
                    </div>
                </div>
            );
            break;
        default:
            content = <div className="text-red-500">Invalid section</div>;
    }
    return content;
}

export default SuperAdminDashboard;
