import React, { useState, useEffect } from "react";
import { useAuth } from "../../../hooks/useAuth";
import { Download, Loader, ChevronDown, ChevronUp } from "lucide-react";
import { BACKEND_URL } from "../../../utils/api.js";

function Results() {
  const { fetchWithAuth, loading: authLoading } = useAuth();
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedPoll, setExpandedPoll] = useState(null);
  const [downloadingPoll, setDownloadingPoll] = useState(null);

  useEffect(() => {
    if (!authLoading) {
      fetchPollResults();
    }
  }, [authLoading]);

  const fetchPollResults = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetchWithAuth(
        `${BACKEND_URL}/api/user/polls/results`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        },
      );
      if (response.ok) {
        const data = await response.json();
        setPolls(data.polls || []);
      } else {
        setError("Failed to fetch poll results");
      }
    } catch (err) {
      setError(err.message || "An error occurred while fetching results");
      console.error("Fetch results error:", err);
    } finally {
      setLoading(false);
    }
  };

  const downloadVoterList = async (pollId, pollTitle) => {
    setDownloadingPoll(pollId);
    try {
      const response = await fetchWithAuth(
        `${BACKEND_URL}/api/user/polls/${pollId}/voters`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to fetch voter data");
      }

      const data = await response.json();
      const voters = data.voters;

      if (voters.length === 0) {
        alert("No voters found for this poll");
        return;
      }

      const headers = ["Name", "Email", "Admission No", "Room", "Voted For"];
      const csvRows = [
        headers.join(","),
        ...voters.map((voter) =>
          [
            `"${voter.name}"`,
            `"${voter.email}"`,
            voter.admission_no,
            `"${voter.room || "N/A"}"`,
            `"${voter.voted_for}"`,
          ].join(","),
        ),
      ];

      const csvContent = csvRows.join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `${pollTitle.replace(/[^a-z0-9]/gi, "_")}_voters.csv`,
      );
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Download error:", err);
      alert("Failed to download voter list");
    } finally {
      setDownloadingPoll(null);
    }
  };

  const togglePollExpansion = (pollId) => {
    setExpandedPoll(expandedPoll === pollId ? null : pollId);
  };

  if (authLoading || loading) {
    return (
      <div className="flex justify-center items-center p-6">
        <p className="text-gray-600">Loading poll results...</p>
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
            <p className="text-gray-600 text-lg">
              No polls created yet. Create a poll to see results here!
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {polls.map((poll) => {
              const isExpanded = expandedPoll === poll.id;

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
                      poll.options.map((option, index) => (
                        <div
                          key={option.id}
                          className="border-2 border-gray-200 bg-white rounded-xl overflow-hidden"
                        >
                          <div className="relative p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3 flex-1">
                                <span className="font-medium text-base text-gray-800">
                                  {option.text}
                                </span>
                              </div>
                              <span className="font-bold text-base ml-4 text-gray-700">
                                {option.votes} votes
                              </span>
                            </div>
                          </div>

                          {isExpanded && option.voters.length > 0 && (
                            <div className="border-t border-gray-200 bg-gray-50 p-4">
                              <p className="text-sm font-semibold text-gray-700 mb-2">
                                Voters ({option.voters.length}):
                              </p>
                              <div className="space-y-2 max-h-48 overflow-y-auto">
                                {option.voters.map((voter) => (
                                  <div
                                    key={voter.user_id}
                                    className="flex items-center justify-between text-sm p-2 bg-white rounded-lg border border-gray-200"
                                  >
                                    <div>
                                      <p className="font-medium text-gray-800">
                                        {voter.name}
                                      </p>
                                      <p className="text-gray-500 text-xs">
                                        {voter.email}
                                      </p>
                                    </div>
                                    <div className="text-right text-xs text-gray-600">
                                      <p>Adm: {voter.admission_no}</p>
                                      <p>Room: {voter.room || "N/A"}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                  </div>

                  <div className="px-6 pb-6 space-y-3">
                    <button
                      onClick={() => togglePollExpansion(poll.id)}
                      className="w-full bg-white border-2 border-blue-400 text-blue-400 font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 hover:bg-blue-50"
                    >
                      {isExpanded ? (
                        <>
                          <ChevronUp className="w-5 h-5" />
                          Hide Voters
                        </>
                      ) : (
                        <>
                          <ChevronDown className="w-5 h-5" />
                          Show Voters
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => downloadVoterList(poll.id, poll.title)}
                      disabled={
                        downloadingPoll === poll.id || poll.totalVotes === 0
                      }
                      className="w-full bg-blue-400 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {downloadingPoll === poll.id ? (
                        <>
                          <Loader className="w-5 h-5 animate-spin" />
                          Downloading...
                        </>
                      ) : (
                        <>
                          <Download className="w-5 h-5" />
                          Download Voter List
                        </>
                      )}
                    </button>
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

export default Results;
