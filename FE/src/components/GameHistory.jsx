import React, { useState, useEffect } from "react";
import socket from "../socket";

const GameHistory = () => {
  const [activeTab, setActiveTab] = useState("game");
  const [gameData, setGameData] = useState([]);

  useEffect(() => {
    if (activeTab === "game") {
      // Attach listener for gameData when Game History tab is active
      const handleGameData = (data) => {
        setGameData((prev) => [...prev, data]);
      };

      // Attach socket listener
      socket.on("gameData", handleGameData);

      // Cleanup listener when leaving Game History tab
      return () => {
        socket.off("gameData", handleGameData);
      };
    }
  }, [activeTab]);

  const handleTabClick = (tab) => {
    const newTab = tab.toLowerCase().replace(" ", "");
    setActiveTab(newTab);

    if (newTab === "game") {
      // Clear the game data and refresh listener when returning to Game History
      setGameData([]); // Optional: Clear if needed
      socket.emit("requestGameData"); // Emit an event to fetch latest data if supported
    }
  };

  return (
    <div className="bg-black text-white w-full max-w-7xl rounded-lg p-4 mt-4">
      {/* Tabs */}
      <div className="flex justify-around mb-4">
        {["Game History", "Chart", "My History"].map((tab) => (
          <button
            key={tab}
            onClick={() => handleTabClick(tab)}
            className={`px-4 py-2 rounded-lg font-bold ${
              activeTab === tab.toLowerCase().replace(" ", "")
                ? "bg-green-500"
                : "bg-customBlue hover:bg-gradient-to-l from-blue-900 to-blue-500"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="text-center">
        {activeTab === "game" && (
          <div>
            {/* Game Data Logs */}
            <div className="bg-gray-800 rounded-lg p-4">
              <h2 className="text-lg font-bold mb-4">Game Logs</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm text-left text-gray-400">
                  <thead className="bg-gray-700 text-gray-200">
                    <tr>
                      <th scope="col" className="px-4 py-2">Game ID</th>
                      <th scope="col" className="px-4 py-2">Number</th>
                      <th scope="col" className="px-4 py-2">Color</th>
                      <th scope="col" className="px-4 py-2">Big/Small</th>
                    </tr>
                  </thead>
                  <tbody>
                    {gameData.length > 0 ? (
                      gameData.map((data, index) => (
                        <tr key={index} className="bg-gray-900">
                          <td className="px-4 py-2">{data.gameId}</td>
                          <td className="px-4 py-2">{data.number}</td>
                          <td className="px-4 py-2">
                            {Array.isArray(data.color)
                              ? data.color.join(", ")
                              : data.color}
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
          </div>
        )}
        {activeTab === "chart" && <p>Chart content...</p>}
        {activeTab === "myhistory" && <p>My history content...</p>}
      </div>
    </div>
  );
};

export default GameHistory;
