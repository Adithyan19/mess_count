import React, { useState, useEffect } from "react";
import { useAuth } from "../../../hooks/useAuth";
import { Check, Loader } from "lucide-react";
import { BACKEND_URL } from "../../../utils/api.js";

function Vote() {
  const { fetchWithAuth, loading: authLoading, user } = useAuth();
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userVotes, setUserVotes] = useState({});
  const [submitting, setSubmitting] = useState({});

  useEffect(() => {
    if (!authLoading) {
      fetchPolls();
      fetchUserVotes();
    }
  }, [authLoading]);

  const fetchUserVotes = async () => {
    try {
      const response = await fetchWithAuth(`${BACKEND_URL}/api/user/myvotes`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (response.ok) {
        const data = await response.json();
        const votesMap = {};
        if (data.votes) {
          data.votes.forEach((vote) => {
            votesMap[vote.poll_id] = vote.option_id;
          });
        }
        setUserVotes(votesMap);
      }
    } catch (err) {
      console.error("Fetch user votes error:", err);
    }
  };

  const fetchPolls = async () => {
    setLoading(true);
    setError("");
    try {
      const hostelId = user?.hostel_id;
      if (!hostelId) {
        setError("Hostel information not available");
        setLoading(false);
        return;
      }
      const response = await fetchWithAuth(`${BACKEND_URL}/api/user/getpolls`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hostel_id: hostelId }),
      });
      if (response.ok) {
        const data = await response.json();
        setPolls(data.pollData || []);
      } else {
        setError("Failed to fetch polls");
      }
    } catch (err) {
      setError(err.message || "An error occurred while fetching polls");
      console.error("Fetch polls error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (pollId, optionId) => {
    setSubmitting({ ...submitting, [pollId]: true });
    setError("");
    try {
      const response = await fetchWithAuth(
        `${BACKEND_URL}/api/user/polls/vote`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ optionId }),
        },
      );
      if (response.ok) {
        setUserVotes({ ...userVotes, [pollId]: optionId });
        await fetchPolls();
      } else {
        const errorData = await response.json().catch(() => ({
          message: "Failed to vote",
        }));
        setError(errorData.message || "Failed to vote on poll");
      }
    } catch (err) {
      setError(err.message || "An error occurred while voting");
      console.error("Vote error:", err);
    } finally {
      setSubmitting({ ...submitting, [pollId]: false });
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex justify-center items-center p-6">
        <p className="text-gray-600">Loading polls...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white px-4 py-8">
      <div className="mx-auto max-w-2xl">
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}
        {polls.length === 0 ? (
          <div className="bg-gray-50 rounded-3xl shadow-xl p-8 text-center border border-gray-200">
            <p className="text-gray-600 text-lg">No active polls available</p>
          </div>
        ) : (
          <div className="space-y-6">
            {polls.map((poll) => {
              const userVotedOptionId = userVotes[poll.id];
              const totalVotes = poll.options.reduce(
                (sum, opt) => sum + (opt.votes || 0),
                0,
              );
              return (
                <div
                  key={poll.id}
                  className="bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-200"
                >
                  <div className="bg-blue-400 p-6">
                    <h2 className="text-white text-2xl sm:text-3xl font-bold leading-tight">
                      {poll.title}
                    </h2>
                    <div className="h-1 w-12 bg-white mt-4 rounded-full" />
                  </div>
                  <div className="p-6 space-y-3">
                    {poll.options &&
                      poll.options.map((option) => {
                        const voteCount = option.votes || 0;
                        const isUserVote = userVotedOptionId === option.id;
                        const isVoting = submitting[poll.id];

                        return (
                          <button
                            key={option.id}
                            onClick={() => handleVote(poll.id, option.id)}
                            disabled={isVoting}
                            className={`w-full text-left transition-all duration-300 rounded-xl overflow-hidden border-2 ${
                              isUserVote
                                ? "border-blue-400 bg-blue-50"
                                : "border-gray-200 bg-white hover:border-blue-300 hover:bg-gray-50"
                            } ${isVoting ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                          >
                            <div className="relative p-4">
                              <div className="relative flex items-center justify-between">
                                <div className="flex items-center gap-3 flex-1">
                                  {isUserVote && (
                                    <div className="w-6 h-6 rounded-full bg-blue-400 flex items-center justify-center flex-shrink-0">
                                      <Check className="w-4 h-4 text-white" />
                                    </div>
                                  )}
                                  <span
                                    className={`font-medium text-base ${
                                      isUserVote
                                        ? "text-blue-700"
                                        : "text-gray-800"
                                    }`}
                                  >
                                    {option.text}
                                  </span>
                                </div>
                                <span
                                  className={`font-bold text-base ml-4 ${
                                    isUserVote
                                      ? "text-blue-600"
                                      : "text-gray-500"
                                  }`}
                                >
                                  {voteCount}{" "}
                                  {voteCount === 1 ? "vote" : "votes"}
                                </span>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                  </div>
                  <div className="px-6 pb-6">
                    <p
                      className={`w-full py-4 font-bold text-md transition-all flex items-center justify-center gap-2 bg-white text-blue-400 ${
                        submitting[poll.id]
                          ? "opacity-70 cursor-not-allowed"
                          : ""
                      }`}
                    >
                      {submitting[poll.id] ? (
                        <>
                          <Loader className="w-5 h-5 animate-spin" />
                          Submitting...
                        </>
                      ) : userVotedOptionId ? (
                        "Click to change your vote!"
                      ) : (
                        "Click an option to vote!"
                      )}
                    </p>
                  </div>
                  <div className="px-6 pb-6 flex justify-between text-gray-500 text-sm">
                    <p>
                      Created: {new Date(poll.created_at).toLocaleDateString()}
                    </p>
                    <p>Ends: {new Date(poll.end_time).toLocaleDateString()}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Vote;
