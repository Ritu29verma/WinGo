import { useEffect, useState } from "react";
import socket from "../socket";
import Loader from "../components/Loader";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const AdminSuggestions = () => {
  const [suggestions, setSuggestions] = useState(null);
  const [timeLeft, setTimeLeft] = useState({ minutes: 0, seconds: 0, isTimerActive: false });

  const handleSetBet = (type, value) => {
    socket.emit("setBetFromSuggestion", { type, value }, (response) => {
      if (response.success) {
        toast.success("Bet set successfully");
      } else {
        console.error("Error setting bet:", response.message);
      }
    });
  };
  useEffect(() => {
    socket.on("suggestions", (data) => {
        setSuggestions(data.suggestions);
      });
      socket.on("timerUpdate", ({ minutes, seconds, isTimerActive }) => {
        setTimeLeft({ minutes, seconds, isTimerActive });
      });
  
      return () => {
        socket.off("suggestions");
        socket.off("timerUpdate");
      };
  }, []);
  useEffect(() => {
    if (
      timeLeft.isTimerActive &&
      Number(timeLeft.minutes) === 0 && // Convert to number for comparison
      Number(timeLeft.seconds) === 5 && // Convert to number for comparison
      suggestions
    ) {
      // Create an array of bets
      const bets = [
        { type: "number", value: suggestions.minNumberBet.value, key: suggestions.minNumberBet.index },
        { type: "color", value: suggestions.minColorBet.value, key: suggestions.minColorBet.key },
        { type: "size", value: suggestions.minSizeBet.value, key: suggestions.minSizeBet.key },
      ];
  
      // Find the minimum value among bets
      const minBet = bets.reduce((min, bet) => {
        if (bet.value < min.value) return bet;
        if (bet.value === min.value && bet.type === "number") return bet; // Prioritize "number"
        return min;
      }, bets[0]);
  
      console.log(minBet.type, minBet.key);
  
      // Emit the event to set the bet automatically
      socket.emit("setBetFromSuggestion", { type: minBet.type, value: minBet.key }, (response) => {
        if (!response.success) {
          console.error("Error setting bet:", response.message);
        }
      });
    }
  }, [timeLeft, suggestions]);
  

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
            <button onClick={() => handleSetBet('color', suggestions.minColorBet.key)} className="mt-2 bg-orange-500 text-white p-2 rounded">
              Set Bet
            </button>
          </div>
  
          {/* Minimum Bet on Number */}
          <div className="flex flex-col bg-gray-700 p-4 rounded shadow w-full sm:w-80 items-center">
            <h3 className="text-white font-bold">Minimum Bet on Number</h3>
            <p className="text-gray-300">Number: {suggestions.minNumberBet.index}</p>
            <p className="text-gray-300">Amount: ₹{suggestions.minNumberBet.value}</p>
            <button onClick={() => handleSetBet('number', suggestions.minNumberBet.index)} className="mt-2 bg-orange-500 text-white p-2 rounded">
              Set Bet
            </button>
          </div>
  
          {/* Minimum Bet on Size */}
          <div className="bg-gray-700 p-4 rounded shadow w-full sm:w-80 items-center flex flex-col">
            <h3 className="text-white font-bold">Minimum Bet on Size</h3>
            <p className="text-gray-300">Size: {suggestions.minSizeBet.key}</p>
            <p className="text-gray-300">Amount: ₹{suggestions.minSizeBet.value}</p>
            <button onClick={() => handleSetBet('size', suggestions.minSizeBet.key)} className="mt-2 bg-orange-500 text-white p-2 rounded">
              Set Bet
            </button>
          </div>
        </div>
      ) : (
       <Loader/>
      )}
    </div>
  );
  
};

export default AdminSuggestions;
