import React, { useState } from "react";
import { useAuth } from "../../../hooks/useAuth";
import { Vote, Trash2, Plus } from "lucide-react";
import { BACKEND_URL } from "../../../utils/api.js";

export default function Poll() {
  const { user, loading, fetchWithAuth } = useAuth();
  const [options, setOptions] = useState(["", ""]);
  const [error, setError] = useState("");
  const [title, setTitle] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (loading) {
    return (
      <div className="flex justify-center items-center p-6">
        <p className="text-black">Loading...</p>
      </div>
    );
  }

  const addOption = () => {
    setOptions([...options, ""]);
  };

  const removeOption = (index) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const updateOption = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleCreatePoll = async () => {
    setError("");

    if (!title.trim()) {
      setError("Please enter a poll title");
      return;
    }

    const filledOptions = options.filter((opt) => opt.trim());
    if (filledOptions.length < 2) {
      setError("Please add at least 2 options");
      return;
    }

    setIsSubmitting(true);

    try {
      const pollData = {
        title,
        options: filledOptions.map((opt) => ({
          text: opt,
          votes: 0,
        })),
      };

      const response = await fetchWithAuth(`${BACKEND_URL}/api/polls/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pollData),
      });

      if (response.ok) {
        setTitle("");
        setOptions(["", ""]);
      } else {
        const errorData = await response.json().catch(() => ({
          message: "Failed to create poll",
        }));
        setError(errorData.message || "Failed to create poll");
      }
    } catch (err) {
      setError(err.message);
      console.error("Poll creation error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center mx-auto px-4 py-6 sm:px-6 lg:px-8">
      <div className="w-full max-w-5xl border-blue-600 border-2 rounded-xl shadow-lg p-4 sm:p-6">
        <div className="flex flex-wrap items-center gap-2 mb-6 text-center sm:text-left">
          <Vote className="size-6 shrink-0 mx-auto sm:mx-0" />
          <h2 className="text-black text-xl sm:text-2xl font-bold w-full sm:w-auto">
            Create a Poll
          </h2>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm sm:text-base">
            {error}
          </div>
        )}

        <div className="mb-4">
          <label className="text-black font-semibold text-lg mb-3">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter the title"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isSubmitting}
          />
        </div>
        <div className="mb-4">
          <label className="text-lg font-semibold text-black mb-3">
            Options
          </label>
          <div>
            {options.map((option, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={option}
                  onChange={(e) => updateOption(index, e.target.value)}
                  placeholder={`Option ${index + 1}`}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
                  disabled={isSubmitting}
                />
                {options.length > 2 && (
                  <button
                    onClick={() => removeOption(index)}
                    className="px-3 py-2 bg-red-100 text-red-600 hover:bg-red-200 rounded-lg transition mb-3"
                    disabled={isSubmitting}
                  >
                    <Trash2 className="size-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
          {options.length < 6 && (
            <button
              onClick={addOption}
              className="mt-3 flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg transition font-medium disabled:opacity-50"
              disabled={isSubmitting}
            >
              <Plus className="size-4" />
              Add Option
            </button>
          )}
        </div>
        <button
          onClick={handleCreatePoll}
          disabled={isSubmitting}
          className="w-full px-4 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition disabled:bg-blue-400 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Creating..." : "Create Poll"}
        </button>
      </div>
    </div>
  );
}
