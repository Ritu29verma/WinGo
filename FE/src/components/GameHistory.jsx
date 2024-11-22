import React, { useState, useEffect } from "react";
import socket from "../socket";

const GameHistory = () => {
  const [activeTab, setActiveTab] = useState("game");
  const [gameData, setGameData] = useState([]);

  const fetchGameLogs = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/game/getlogs`); // Backend URL
      const data = await response.json();
      setGameData(data); // Set fetched game data
    } catch (error) {
      console.error("Failed to fetch game logs:", error);
    }
  };

  useEffect(() => {
    if (activeTab === "Game History") {
      // Fetch game logs when "Game History" tab is active
      fetchGameLogs();

      // Attach socket listener for live updates
      const handleGameData = (data) => {
        setGameData((prev) => [data, ...prev]); // Add new data to the top
      };
      socket.on("gameData", handleGameData);

      // Cleanup socket listener when leaving the tab
      return () => {
        socket.off("gameData", handleGameData);
      };
    }
  }, [activeTab]);

  const handleTabClick = (tab) => {
    const newTab = tab
    setActiveTab(newTab);

    if (newTab === "Game History") {
      fetchGameLogs(); // Fetch logs when returning to "Game History"
    }
  };

  return (
    <div className="bg-black text-white w-full max-w-7xl rounded-lg p-4 mt-4">
      {/* Tabs */}
      <div className="flex space-x-2 justify-around mb-4">
        {["Game History", "Chart", "My History"].map((tab) => (
          <button
            key={tab}
            onClick={() => handleTabClick(tab)}
            className={`px-4 py-2 rounded-lg font-bold ${
              activeTab === tab.toLowerCase().replace(" ", "")
                ? "bg-green-500"
                : "bg-customBlue hover:bg-gradient-to-l from-blue-500 to-blue-900"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="text-center">
        {activeTab === "Game History" && (
          <div>
            {/* Game Data Logs */}
            <div className="bg-gray-800 rounded-lg p-4">
              <h2 className="text-lg font-bold mb-4">Game Logs</h2>
              <div className="overflow-x-auto ">
                <table className=" max-w-full w-screen text-sm  text-gray-400">
                  <thead className="bg-gray-700 text-gray-200">
                    <tr>
                      <th scope="col" className="md:px-4 px-1  py-2">Game ID</th>
                      <th scope="col" className="md:px-4 px-1 py-2">Number</th>
                      <th scope="col" className="md:px-4 px-1 py-2">Color</th>
                      <th scope="col" className="md:px-4 px-1 py-2">Big/Small</th>
                    </tr>
                  </thead>
                  <tbody>
                    {gameData.length > 0 ? (
                      gameData.map((data, index) => (
                        <tr key={index} className="bg-gray-900">
                          <td className="md:px-4 px-1 py-2">{data.gameId}</td>
                          <td className="md:px-4 px-1 py-2">{data.number}</td>
                          <td className="md:px-4 px-1 py-2">
                            {Array.isArray(data.color)
                              ? data.color.join(", ")
                              : data.color}
                          </td>
                          <td className="md:px-4 px-1 py-2">{data.bigOrSmall}</td>
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
          </div>
        )}
        {activeTab === "Chart" && <p>Chart content...</p>}
        {activeTab === "My History" && <p>My history content...</p>}
      </div>
    </div>
  );
};

export default GameHistory;
