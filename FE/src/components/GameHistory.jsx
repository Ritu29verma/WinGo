import React, { useState, useEffect } from "react";
import socket from "../socket";
import axios from "axios";

const GameHistory = () => {
  const [gameResults, setGameResults] = useState([]);
  const [expandedRows, setExpandedRows] = useState([]);
  const [myBets, setMyBets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("game");
  const [gameData, setGameData] = useState([]);


  useEffect(() => {
    const handleUserBetsUpdate = (userBets) => {
      setMyBets(userBets || []); // Fallback to empty array if null or undefined
    };
  
    socket.on("userBetsUpdate", handleUserBetsUpdate);
  
    return () => {
      socket.off("userBetsUpdate", handleUserBetsUpdate);
    };
  }, []);

  const fetchGameResults = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("User not authenticated. Please log in.");
      setLoading(false);
      return;
    }
    try {
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/game/getGameResults`, {
        headers: { Authorization: token },
      });
      setGameResults(response.data);
    } catch (err) {
      console.error("Error fetching game results:", err);
      setError("Failed to fetch game history.");
    } finally {
      setLoading(false);
    }
  };

  const fetchGameLogs = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/game/getlogs`);
      const data = await response.json();
      setGameData(data);
    } catch (error) {
      console.error("Failed to fetch game logs:", error);
    }
  };

  useEffect(() => {
    fetchGameResults();
  }, []);

  useEffect(() => {
    if (activeTab === "Game History") {
      fetchGameLogs();
      const handleGameData = (data) => {
        setGameData((prev) => [data, ...prev]);
      };
      socket.on("gameData", handleGameData);
      return () => {
        socket.off("gameData", handleGameData);
      };
    }
  }, [activeTab]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    if (tab === "Game History") {
      fetchGameLogs();
    }
  };

  const toggleRow = (id) => {
    setExpandedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  useEffect(() => {
    const handleBetResult = (data) => {
      console.log("Bet result received:", data);
      fetchGameResults();
    };

    socket.on("betResult", handleBetResult);

    return () => {
      socket.off("betResult", handleBetResult);
    };
  }, [socket]);

  return (
    <div className="bg-black text-white w-full max-w-7xl mx-auto rounded-lg p-4 mt-4">
      {/* Tabs */}
      <div className="flex space-x-2 justify-around mb-4">
        {["Game History", "My Bets", "My History"].map((tab) => (
          <button
            key={tab}
            onClick={() => handleTabClick(tab)}
            className={`px-4 py-2 rounded-lg font-bold text-sm md:text-base ${
              activeTab === tab ? "bg-green-500" : "bg-customBlue hover:bg-gradient-to-l from-blue-500 to-blue-900"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="text-center">
        {activeTab === "Game History" && (
          <div className="bg-gray-800 rounded-lg p-4 mx-auto">
            <h2 className="text-lg font-bold mb-4">Game Logs</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-gray-400">
                <thead className="bg-gray-700 text-gray-200">
                  <tr>
                    <th className="px-4 py-2">Game ID</th>
                    <th className="px-4 py-2">Number</th>
                    <th className="px-4 py-2">Color</th>
                    <th className="px-4 py-2">Big/Small</th>
                  </tr>
                </thead>
                <tbody>
                  {gameData.length > 0 ? (
                    gameData.map((data, index) => (
                      <tr key={index} className="bg-gray-900">
                        <td className="px-4 py-2">{data.gameId}</td>
                        <td className="px-4 py-2">{data.number}</td>
                        <td className="px-4 py-2">
                          {Array.isArray(data.color) ? data.color.join(", ") : data.color}
                        </td>
                        <td className="px-4 py-2">{data.bigOrSmall}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td className="px-4 py-2" colSpan="4">
                        No game history available.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {activeTab === "My Bets" && (
          <div className="bg-gray-800 rounded-lg p-4 mx-auto">
            <h2 className="text-lg font-bold mb-4">My Bets</h2>
            {myBets.length === 0 ? (
              <p>No Bets yet...</p>
            ) : (
              <ul className="space-y-3">
                {myBets.map((bet, index) => (
                  <li key={index} className="bg-customBlue p-3 rounded-lg">
                    <div className="flex justify-between mb-1">
                    <p className="text-gray-400">Selected:</p>
                    <p className="text-white">{bet.content}</p>
                    </div>
                    <div className="flex justify-between mb-1">
                    <p className="text-gray-400">Purchase Amount:</p>
                    <p className="text-white">₹{bet.purchaseAmount}</p>
                    </div>
                    <div className="flex justify-between mb-1">
                    <p className="text-gray-400">Timestamp:</p>
                    <p className="text-white">{new Date(bet.timestamp).toLocaleString()}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
        {activeTab === "My History" && (
          <div className="bg-gray-800 rounded-lg p-4 mx-auto">
            <h1 className="text-lg font-bold mb-4">My Game History</h1>
            {gameResults.length === 0 ? (
              <p className="text-center text-white">No game history found.</p>
            ) : (
              <div className="space-y-4">
                {gameResults.map((result) => (
                  <div
                    key={result._id}
                    className="bg-customBlue rounded-lg shadow-md p-4 cursor-pointer hover:bg-slate-700"
                    onClick={() => toggleRow(result._id)}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-white text-lg">{result.periodNumber}</p>
                        <p className="text-gray-400 text-sm">{new Date(result.time).toLocaleString()}</p>
                      </div>
                      <div>
                        <p
                          className={`text-lg ${
                            result.status === "succeed" ? "text-green-400" : "text-red"
                          }`}
                        >
                          {result.status === "succeed" ? "Win" : "Loss"}
                        </p>
                        <p className="text-white text-sm">₹{result.winLoss.toFixed(2)}</p>
                      </div>
                    </div>
                    {expandedRows.includes(result._id) && (
                      <div className="mt-4 bg-gray-900 rounded-lg p-3 text-sm">
                        <div className="flex justify-between mb-2">
                          <p className="text-gray-400">Purchase Amount:</p>
                          <p className="text-white">₹{result.purchaseAmount.toFixed(2)}</p>
                        </div>
                        <div className="flex justify-between mb-2">
                          <p className="text-gray-400">Amount After Tax:</p>
                          <p className="text-white">₹{result.amountAfterTax.toFixed(2)}</p>
                        </div>
                        <div className="flex justify-between mb-2">
                          <p className="text-gray-400">Tax:</p>
                          <p className="text-white">₹{result.tax.toFixed(2)}</p>
                        </div>
                        <div className="flex justify-between mb-2">
                          <p className="text-gray-400">Result:</p>
                          <p className="text-white">{result.result}</p>
                        </div>
                        <div className="flex justify-between">
                          <p className="text-gray-400">Selection:</p>
                          <p className="text-white">{result.select}</p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default GameHistory;
