import { useState } from "react";
import { useAuth } from "../../hooks/useAuth.jsx";
import Header from "../common/Header.jsx";
import StudentDashboard from "../dashboards/StudentDashboard.jsx";
import MessStaffDashboard from "../dashboards/MessStaffDashboard.jsx";
import AdminDashboard from "../dashboards/AdminDashboard.jsx";
import SuperAdminDashboard from "../dashboards/SuperAdminDashboard.jsx";

function Layout() {
    const { user, loading } = useAuth();

    if (loading || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-xl text-gray-600">Loading...</div>
            </div>
        );
    }

    const renderContent = () => {
        switch (user.role) {
            case "STUDENT":
                return <StudentDashboard />;
            case "MESS_STAFF":
                return <MessStaffDashboard />;
            case "ADMIN":
                return <AdminDashboard />;
            case "SUPER_ADMIN":
                return <SuperAdminDashboard />;
            default:
                return (
                    <div className="p-4 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded">
                        Unknown role: {user.role}. Please contact administrator.
                    </div>
                );
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <div className="flex pt-16">
                <main className="flex-1 transition-all duration-300lg:ml-64">
                    <div className="p-6">{renderContent()}</div>
                </main>
            </div>
        </div>
    );
}
export default Layout;
