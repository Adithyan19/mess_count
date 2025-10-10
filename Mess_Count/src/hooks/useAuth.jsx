// todo: lear about zod and check whether it can be implemented in this?
import { BACKEND_URL } from "../utils/api.js";
import { createContext, useContext, useState, useEffect, useRef } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const refreshPromiseRef = useRef(null);
  const isInitializedRef = useRef(false);

  const subscribeToPush = async () => {
    try {
      if ("serviceWorker" in navigator && "PushManager" in window) {
        const registration = await navigator.serviceWorker.ready;

        const permission = await Notification.requestPermission();
        if (permission !== "granted") {
          console.log("Notification permission denied");
          return;
        }
        setInterval(() => {}, 1000);
        const vapidRes = await fetch(
          `${BACKEND_URL}/api/auth/vapid-public-key`,
        );
        const { publicKey } = await vapidRes.json();

        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(publicKey),
        });

        await fetchWithAuth(`${BACKEND_URL}/api/user/save-subscription`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ subscription }),
        });
      }
    } catch (error) {
      console.error("Push subscription error:", error);
    }
  };

  function urlBase64ToUint8Array(base64String) {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, "+")
      .replace(/_/g, "/");
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }
  const refreshAccessToken = async () => {
    if (refreshPromiseRef.current) {
      return refreshPromiseRef.current;
    }

    refreshPromiseRef.current = (async () => {
      try {
        const refreshResponse = await fetch(
          `${BACKEND_URL}/api/auth/refresh-token`,
          {
            method: "POST",
            credentials: "include",
          },
        );

        if (refreshResponse.ok) {
          const refreshData = await refreshResponse.json();
          const newAccessToken = refreshData.accessToken;
          localStorage.setItem("accessToken", newAccessToken);
          return newAccessToken;
        } else {
          localStorage.removeItem("accessToken");
          setUser(null);
          throw new Error("Session expired");
        }
      } catch (error) {
        console.error("Refresh error:", error.message);
        localStorage.removeItem("accessToken");
        setUser(null);
        throw error;
      } finally {
        refreshPromiseRef.current = null;
      }
    })();

    return refreshPromiseRef.current;
  };

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

    if (response.status === 401) {
      try {
        const newAccessToken = await refreshAccessToken();
        options.headers.Authorization = `Bearer ${newAccessToken}`;
        response = await fetch(url, options);
      } catch (refreshError) {
        console.error("Failed to refresh:", refreshError.message);
        throw new Error("Session expired");
      }
    }

    return response;
  };

  useEffect(() => {
    if (isInitializedRef.current) {
      return;
    }
    isInitializedRef.current = true;

    const initializeAuth = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");

        if (accessToken) {
          try {
            const response = await fetchWithAuth(
              `${BACKEND_URL}/api/auth/get-role`,
            );

            if (response.ok) {
              const userData = await response.json();
              setUser(userData.user);
            } else {
              localStorage.removeItem("accessToken");
              setUser(null);
            }
          } catch (error) {
            console.error("Auth initialization error:", error.message);
            localStorage.removeItem("accessToken");
            setUser(null);
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Outer auth error:", error.message);
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
        await subscribeToPush();
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
    } catch (error) {
      console.log("Logout error:", error);
    }
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
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
