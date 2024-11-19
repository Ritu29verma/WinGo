import React, { useState } from "react";

const GameHistory = () => {
  const [activeTab, setActiveTab] = useState("game");

  const tabs = ["Game History", "Chart", "My History"];

  return (
    <div className="bg-blue-800 w-full max-w-7xl rounded-lg p-4 shadow-lg mt-4">
      <div className="flex justify-around mb-4">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab.toLowerCase().replace(" ", ""))}
            className={`px-4 py-2 rounded-lg font-bold ${
              activeTab === tab.toLowerCase().replace(" ", "")
                ? "bg-green-500"
                : "bg-gray-700 hover:bg-gray-600"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="text-center">
        {activeTab === "game" && <p>Game history content...</p>}
        {activeTab === "chart" && <p>Chart content...</p>}
        {activeTab === "myhistory" && <p>My history content...</p>}
      </div>
    </div>
  );
};

export default GameHistory;
