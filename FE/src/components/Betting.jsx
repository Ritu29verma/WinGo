import { useEffect, useState } from "react";
import socket from "../socket";

const AdminSuggestions = () => {
  const [suggestions, setSuggestions] = useState(null);

  useEffect(() => {
    socket.on("suggestions", (data) => {
        setSuggestions(data.suggestions);
      });

    return () => socket.off("suggestions");
  }, []);

  return (
    <div className="bg-gray-800 p-8 rounded-lg border-2 border-orange-500 ">
      <h2 className="text-center text-xl font-bold text-white mb-4">
        Suggestions for Setting Bets
      </h2>

      {suggestions ? (
        <div className="flex flex-wrap gap-4 justify-center items-center ">
          {/* Minimum Bet on Color */}
          <div className="flex flex-col bg-gray-700 p-4 rounded shadow w-full sm:w-80 items-center">
            <h3 className="text-white font-bold">Minimum Bet on Color</h3>
            <p className="text-gray-300">Color: {suggestions?.minColorBet?.key || "N/A"}</p>
            <p className="text-gray-300">Amount: ₹{suggestions.minColorBet.value}</p>
          </div>

          {/* Minimum Bet on Number */}
          <div className="flex flex-col bg-gray-700 p-4 rounded shadow w-full sm:w-80 items-center">
            <h3 className="text-white font-bold">Minimum Bet on Number</h3>
            <p className="text-gray-300">Number: {suggestions.minNumberBet.index}</p>
            <p className="text-gray-300">Amount: ₹{suggestions.minNumberBet.value}</p>
          </div>

          {/* Minimum Bet on Size */}
          <div className="bg-gray-700 p-4 rounded shadow w-full sm:w-80 items-center flex flex-col">
            <h3 className="text-white font-bold">Minimum Bet on Size</h3>
            <p className="text-gray-300">Size: {suggestions.minSizeBet.key}</p>
            <p className="text-gray-300">Amount: ₹{suggestions.minSizeBet.value}</p>
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-300">Loading suggestions...</p>
      )}
    </div>
  );
};

export default AdminSuggestions;
