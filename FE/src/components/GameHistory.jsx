import React, { useState, useEffect } from "react";
import socket from "../socket";
import axios from "axios";

const GameHistory = ({ selectedTime }) => {
  const [gameResults, setGameResults] = useState([]);
  const [expandedRows, setExpandedRows] = useState([]);
  const [myBets30, setMyBets30] = useState([]);
  const [myBets60, setMyBets60] = useState([]);
  const [myBets180, setMyBets180] = useState([]);
  const [myBets300, setMyBets300] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("game");
  const [gameData, setGameData] = useState([]);

  const getEventName = (time) => {
    switch (time) {
      case 30:
        return "userBetsUpdate";
      case 60:
        return "userBetsUpdate2";
      case 180:
        return "userBetsUpdate3";
      case 300:
        return "userBetsUpdate4";
      default:
        return null; // No event to listen for invalid times
    }
  };

  const getBetsSetter = (time) => {
    switch (time) {
      case 30:
        return setMyBets30;
      case 60:
        return setMyBets60;
      case 180:
        return setMyBets180;
      case 300:
        return setMyBets300;
      default:
        return null;
    }
  };

  useEffect(() => {
    const eventName = getEventName(selectedTime);
    const betsSetter = getBetsSetter(selectedTime);

    const handleUserBetsUpdate = (userBets) => {
      if (betsSetter) betsSetter(userBets || []);
    };

    if (eventName) {
      socket.on(eventName, handleUserBetsUpdate);
    }

    return () => {
      if (eventName) {
        socket.off(eventName, handleUserBetsUpdate);
      }
    };
  }, [selectedTime, socket]);

const renderBets = () => {
    let currentBets = [];
    switch (selectedTime) {
      case 30:
        currentBets = myBets30;
        break;
      case 60:
        currentBets = myBets60;
        break;
      case 180:
        currentBets = myBets180;
        break;
      case 300:
        currentBets = myBets300;
        break;
      default:
        break;
    }

    if (currentBets.length === 0) {
      return <p>No Bets yet...</p>;
    }

    return (
      <ul className="space-y-3">
        {currentBets.map((bet, index) => (
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
              <p className="text-white">
                {new Date(bet.timestamp).toLocaleString()}
              </p>
            </div>
          </li>
        ))}
      </ul>
    );
  };



  const fetchGameResults = async () => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      setError("User not authenticated. Please log in.");
      setLoading(false);
      return;
    }

    let apiUrl;
    switch (selectedTime) {
      case 30:
        apiUrl = `${import.meta.env.VITE_BASE_URL}/game/getGameResults`;
        break;
      case 60:
        apiUrl = `${import.meta.env.VITE_BASE_URL}/game/getGameResults2`;
        break;
      case 180:
        apiUrl = `${import.meta.env.VITE_BASE_URL}/game/getGameResults3`;
        break;
      case 300:
        apiUrl = `${import.meta.env.VITE_BASE_URL}/game/getGameResults4`;
        break;
      default:
        console.error("Invalid selectedTime");
        return;
    }

    try {
      const response = await axios.get(apiUrl, {
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

  useEffect(() => {
    fetchGameResults();
  }, [selectedTime]);

  const fetchGameLogs = async () => {
    let apiUrl;
  
    // Determine the API endpoint based on selectedTime
    switch (selectedTime) {
      case 30:
        apiUrl = `${import.meta.env.VITE_BASE_URL}/game/getlogs`;
        break;
      case 60:
        apiUrl = `${import.meta.env.VITE_BASE_URL}/game/getlogs2`;
        break;
      case 180:
        apiUrl = `${import.meta.env.VITE_BASE_URL}/game/getlogs3`;
        break;
      case 300:
        apiUrl = `${import.meta.env.VITE_BASE_URL}/game/getlogs4`;
        break;
      default:
        console.error("Invalid selected time:", selectedTime);
        return;
    }
  
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      setGameData(data);
    } catch (error) {
      console.error("Failed to fetch game logs:", error);
    }
  };
  



  useEffect(() => {
    if (activeTab === "Game History") {
      fetchGameLogs();
      const handleGameData = (data) => {
        setGameData((prev) => [data, ...prev]);
      };
  
      let eventName = "";
      switch (selectedTime) {
        case 30:
          eventName = "gameData";
          break;
        case 60:
          eventName = "gameData2";
          break;
        case 180:
          eventName = "gameData3";
          break;
        case 300:
          eventName = "gameData4";
          break;
        default:
          console.error("Invalid selectedTime");
          return;
      }
  
      socket.on(eventName, handleGameData);
  
      return () => {
        socket.off(eventName, handleGameData);
      };
  
    }
  }, [activeTab, selectedTime]);
  

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
      fetchGameResults();
    };

    let eventName = "";
    switch (selectedTime) {
      case 30:
        eventName = "betResults";
        break;
      case 60:
        eventName = "betResults2";
        break;
      case 180:
        eventName = "betResults3";
        break;
      case 300:
        eventName = "betResults4";
        break;
      default:
        console.error("Invalid selectedTime");
        return;
    }

    socket.on(eventName, handleBetResult);

    return () => {
      socket.off(eventName, handleBetResult);
    };
  }, [selectedTime]);
  

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
          {renderBets()}
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
