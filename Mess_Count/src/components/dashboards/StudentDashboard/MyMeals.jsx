import React, { useEffect, useState } from "react";
import { useAuth } from "../../../hooks/useAuth";
import { BACKEND_URL } from "../../../utils/api";
import { Clock, Utensils, AlertCircle } from "lucide-react";

function MyMeals() {
  const { fetchWithAuth, loading: authLoading } = useAuth();
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!authLoading) {
      fetchMeals();
    }
  }, [authLoading]);

  const fetchMeals = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetchWithAuth(`${BACKEND_URL}/api/user/mymeals`);

      if (response.ok) {
        const data = await response.json();
        setMeals(data.meals || []);
      } else {
        const errorData = await response.json().catch(() => ({
          error: "Failed to fetch meals",
        }));
        setError(errorData.error || "Failed to fetch meals");
      }
    } catch (err) {
      setError(err.message || "An error occurred while fetching meals");
      console.error("Fetch meals error:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getMealColor = (mealType) => {
    const colorMap = {
      breakfast: "bg-amber-100 text-amber-700",
      lunch: "bg-green-100 text-green-700",
      dinner: "bg-purple-100 text-purple-700",
      snack: "bg-blue-100 text-blue-700",
    };
    return colorMap[mealType?.toLowerCase()] || "bg-gray-100 text-gray-700";
  };

  if (authLoading || loading) {
    return (
      <div className="flex justify-center items-center p-6 min-h-screen">
        <p className="text-black text-lg">Loading your meals...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto px-4 py-6 sm:px-6 lg:px-8 max-w-5xl">
      <div className="w-full max-w-5xl border-blue-600 border-2 rounded-xl shadow-lg p-4 sm:p-6">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-black">
            My Meals
          </h1>
          <p className="text-gray-600">Today's meal history</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg flex items-start gap-3">
            <AlertCircle className="size-5 text-red-600 mt-0.5 shrink-0" />
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {meals.length === 0 ? (
          <div className="p-8 bg-gray-50 border-2 border-gray-300 rounded-xl text-center">
            <p className="text-gray-600 text-lg font-medium">
              No meals logged today
            </p>
            <p className="text-gray-500 text-sm mt-1">
              Your meals will appear here once you log them
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {meals.map((meal, index) => (
              <div
                key={index}
                className="bg-white border-2 border-blue-200 rounded-lg p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div
                      className={`px-3 py-2 rounded-lg font-semibold ${getMealColor(meal.meal_type)}`}
                    >
                      {(meal.meal_type || "Meal").slice(0, 3).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg sm:text-xl font-semibold text-black capitalize">
                        {meal.meal_type || "Unknown Meal"}
                      </h3>
                      <div className="flex items-center gap-2 mt-2 text-gray-600">
                        <Clock className="size-4" />
                        <time className="text-sm sm:text-base">
                          {formatTime(meal.time)}
                        </time>
                      </div>
                    </div>
                  </div>
                  <div className="bg-blue-100 px-3 py-1 rounded-full">
                    <span className="text-sm font-medium text-blue-700">
                      #{index + 1}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyMeals;
