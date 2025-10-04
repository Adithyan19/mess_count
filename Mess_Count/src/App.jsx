import React from "react";
import { useAuth, AuthProvider } from "./hooks/useAuth";
import Layout from "./components/layout/Layout";
import { Login } from "./components/auth/login";

function AppContent() {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-800">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                <span className="ml-3 text-white text-lg">Loading...</span>
            </div>
        );
    }

    if (!user) {
        return <Login />;
    }

    return <Layout />;
}

function App() {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
}

export default App;
