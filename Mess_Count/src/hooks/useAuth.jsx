// Frontend Auth Context (unchanged)
import { BACKEND_URL } from "../utils/api";
import { createContext, useContext, useState, useEffect, useRef } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const refreshingRef = useRef(false);

    const fetchWithAuth = async (url, options = {}) => {
        let accessToken = localStorage.getItem("accessToken");

        if (!accessToken) {
            throw new Error("No access token");
        }

        options.headers = {
            ...(options.headers || {}),
            Authorization: `Bearer ${accessToken}`,
        };

        let response = await fetch(url, options);

        if (response.status === 401 && !refreshingRef.current) {
            refreshingRef.current = true;

            try {
                const refreshResponse = await fetch(
                    `${BACKEND_URL}/api/auth/refresh-token`,
                    {
                        method: "POST",
                        credentials: "include",
                    }
                );

                if (refreshResponse.ok) {
                    const refreshData = await refreshResponse.json();
                    const newAccessToken = refreshData.accessToken;

                    localStorage.setItem("accessToken", newAccessToken);
                    options.headers.Authorization = `Bearer ${newAccessToken}`;
                    response = await fetch(url, options);
                } else {
                    localStorage.removeItem("accessToken");
                    setUser(null);
                    throw new Error("Session expired");
                }
            } catch (refreshError) {
                localStorage.removeItem("accessToken");
                setUser(null);
                throw new Error("Session expired");
            } finally {
                refreshingRef.current = false;
            }
        }

        return response;
    };

    useEffect(() => {
        const initializeAuth = async () => {
            try {
                const accessToken = localStorage.getItem("accessToken");

                if (accessToken) {
                    try {
                        const response = await fetchWithAuth(
                            `${BACKEND_URL}/api/auth/get-role`
                        );

                        if (response.ok) {
                            const userData = await response.json();
                            setUser(userData.user);
                        } else {
                            localStorage.removeItem("accessToken");
                            setUser(null);
                        }
                    } catch (error) {
                        localStorage.removeItem("accessToken");
                        setUser(null);
                    }
                } else {
                    setUser(null);
                }
            } catch (error) {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        initializeAuth();
    }, []);

    const login = async (email, password) => {
        try {
            const response = await fetch(`${BACKEND_URL}/api/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                const data = await response.json();

                localStorage.setItem("accessToken", data.accessToken);
                setUser(data.user);

                return { success: true };
            } else {
                const errorData = await response.json().catch(() => ({
                    message: "Login failed",
                }));

                return {
                    success: false,
                    error: errorData.message || "Invalid credentials",
                };
            }
        } catch (error) {
            return {
                success: false,
                error: "Network error. Please try again.",
            };
        }
    };

    const logout = async () => {
        try {
            setUser(null);
            localStorage.removeItem("accessToken");

            await fetch(`${BACKEND_URL}/api/auth/logout`, {
                method: "POST",
                credentials: "include",
            });
        } catch (error) {}
    };

    const contextValue = {
        user,
        login,
        logout,
        fetchWithAuth,
        isAuthenticated: !!user,
        loading,
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
