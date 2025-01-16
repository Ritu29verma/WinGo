import { useEffect, useState } from "react";
import socket from "../socket";
import Loader from "../components/Loader";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const AdminSuggestions3 = () => {
  const [suggestions, setSuggestions] = useState(null);

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

export default AdminSuggestions3;
