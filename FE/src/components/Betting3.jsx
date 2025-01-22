import { useEffect, useState } from "react";
import socket from "../socket";
import Loader from "../components/Loader";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const AdminSuggestions3 = () => {
  const [suggestions, setSuggestions] = useState(null);
  const [isSuggestionOn, setIsSuggestionOn] = useState(false);
  useEffect(() => {
    socket.emit("requestSuggestionState3");

    // Listen for the state from the server
    socket.on("toggleSuggestion3", (state) => {
      setIsSuggestionOn(state);
    });

    // Clean up the listener when the component unmounts
    return () => {
      socket.off("toggleSuggestion3");
    };
  }, []);

  // Toggle the state and notify the server
  const toggleSuggestion = () => {
    const newState = !isSuggestionOn;
    setIsSuggestionOn(newState);
    socket.emit("toggleSuggestion3", newState);
  };
  const handleSetBet = (type, value) => {
    socket.emit("setBetFromSuggestion3", { type, value }, (response) => {
      if (response.success) {
        toast.success("Bet set successfully");
      } else {
        console.error("Error setting bet:", response.message);
      }
    });
  };
  useEffect(() => {
    socket.on("suggestions3", (data) => {
        setSuggestions(data.suggestions);
      });

    return () => socket.off("suggestions3");
  }, []);

  return (
    <div className="bg-gray-800 p-8 rounded-lg border-2 border-orange-500 ">
      <h2 className="text-center text-xl font-bold text-white mb-4">
        Suggestions for Setting Bets
      </h2>
  
      {suggestions ? (
        <div className="flex flex-col gap-4 justify-center items-center">
        {/* Toggle Switch */}
 <div className="flex justify-center items-center mb-2">
   <span className="mr-2 text-white font-bold">Suggestion:</span>
   <div
     onClick={toggleSuggestion}
     className={`w-14 h-7 flex items-center rounded-full cursor-pointer transition-colors ${
       isSuggestionOn ? "bg-orange-500" : "bg-gray-400"
     }`}
   >
     <span
       className={`w-6 h-6 bg-white rounded-full shadow transform transition-transform ${
         isSuggestionOn ? "translate-x-7" : "translate-x-0"
       }`}
     />
   </div>
 </div>
        <div className="flex flex-wrap gap-4 justify-center items-center ">
          {/* Minimum Bet on Color */}
          <div className="flex flex-col bg-gray-700 p-4 rounded shadow w-full sm:w-80 items-center">
            <h3 className="text-white font-bold">Minimum Bet on Color</h3>
            <p className="text-gray-300">Color: {suggestions?.minColorBet?.key || "N/A"}</p>
            <p className="text-gray-300">Amount: ₹{suggestions.minColorBet.value}</p>
            {/* <button onClick={() => handleSetBet('color', suggestions.minColorBet.key)} className="mt-2 bg-orange-500 text-white p-2 rounded">
              Set Bet
            </button> */}
          </div>
  
          {/* Minimum Bet on Number */}
          <div className="flex flex-col bg-gray-700 p-4 rounded shadow w-full sm:w-80 items-center">
            <h3 className="text-white font-bold">Minimum Bet on Number</h3>
            <p className="text-gray-300">Number: {suggestions.minNumberBet.index}</p>
            <p className="text-gray-300">Amount: ₹{suggestions.minNumberBet.value}</p>
            {/* <button onClick={() => handleSetBet('number', suggestions.minNumberBet.index)} className="mt-2 bg-orange-500 text-white p-2 rounded">
              Set Bet
            </button> */}
          </div>
  
          {/* Minimum Bet on Size */}
          <div className="bg-gray-700 p-4 rounded shadow w-full sm:w-80 items-center flex flex-col">
            <h3 className="text-white font-bold">Minimum Bet on Size</h3>
            <p className="text-gray-300">Size: {suggestions.minSizeBet.key}</p>
            <p className="text-gray-300">Amount: ₹{suggestions.minSizeBet.value}</p>
            {/* <button onClick={() => handleSetBet('size', suggestions.minSizeBet.key)} className="mt-2 bg-orange-500 text-white p-2 rounded">
              Set Bet
            </button> */}
          </div>
        </div>
        </div>
      ) : (
       <Loader/>
      )}
    </div>
  );
  
};

export default AdminSuggestions3;
