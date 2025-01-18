import React, { useState, useEffect } from "react";
import AdminNavbar from "../components/AdminNavbar";
import socket from "../socket";
import UserStats from "./AdminUsers";
import axios from "axios";
import AdminSuggestions from "../components/Betting";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminDashboard = ({ isSidebarOpen }) => {
  const [remainingTime, setRemainingTime] = useState(null);
  const [gameData, setGameData] = useState([]);
  const [timerStatus, setTimerStatus] = useState(false);
  const [minutes, setMinutes] = useState("00");
  const [seconds, setSeconds] = useState("00");
  const [currentGameId, setCurrentGameId] = useState(null);
  const [manualNumber, setManualNumber] = useState("");
  const [adminSelectedGameData, setAdminSelectedGameData] = useState(null);
  const [quantity, setQuantity] = useState('20');
  const [showDropdown, setShowDropdown] = useState(false);
  const [logsCount, setLogsCount] = useState("");

  useEffect(() => {
    if (showDropdown) {
      const fetchLogsCount = async () => {
        try {
          const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/game/getgamecount`);
          if (response.data.success) {
            setLogsCount(response.data.totalCount);
          } else {
            console.error("Failed to fetch logs count");
          }
        } catch (error) {
          console.error("Error fetching logs count:", error);
        }
      };
      fetchLogsCount();
    }
  }, [showDropdown]);

  const handleDelete = async () => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/game/delete-game-logs`, { quantity });
      if (response.status === 200) {
        toast.success('Logs deleted successfully');
      } else {
        toast.error('Unexpected response from server');
      }
    } catch (error) {
      if (error.response) {
        console.error('Response error:', error.response.data);
        toast.error('Failed to delete game logs: ' + error.response.data.error);
      } else if (error.request) {
        console.error('Request error:', error.request);
        toast.error('No response from server');
      } else {
        console.error('Error', error.message);
        toast.error('Error: ' + error.message);
      }
    } finally {
      setShowDropdown(false); // Close the dropdown after the toast message
    }
  };
  
  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  useEffect(() => {  
    const fetchGameLogs = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/game/getlogs`);
        const data = await response.json();
        setGameData(data);
      } catch (error) {
        console.error("Failed to fetch game logs:", error);
      }
    };
  
    fetchGameLogs();
  
    socket.on("gameData", (data) => {
      setGameData((prev) => [data, ...prev]); // Add new game data to the top
    });

    socket.on("timerUpdate", ({ minutes, seconds, isTimerActive }) => {
      setMinutes(minutes);
      setSeconds(seconds);
      setTimerStatus(isTimerActive);
    });
    socket.on("adminSelectedGameData", (data) => {
      setAdminSelectedGameData(data);
    });
    socket.on("gameId", ({ gameId }) => {
      setCurrentGameId(gameId);
      localStorage.setItem("nextGameId", gameId); 
    });
  
    // Restore the nextGameId on component load
    const storedGameId = localStorage.getItem("nextGameId");
    if (storedGameId) setCurrentGameId(storedGameId);

    return () => {
      socket.off("gameData");
      socket.off("timerUpdate");
      socket.off("gameId");
      socket.off("adminSelectedGameData");
    };
  }, []);

  const setManualGameData = () => {
    if (manualNumber >= 0 && manualNumber <= 9) {
      socket.emit("setManualGameData", { number: manualNumber }, (response) => {
        if (response.success) {
          console.log("Manual game data set:", response.gameData);
        }
      });
      setManualNumber(""); // Reset the input field
    }
  };

  const startTimer = (durationMs) => {
    socket.emit("startTimer", durationMs, (response) => {
      if (response.success) {
        console.log("Timer started");
      }
    });
  };

  const stopTimer = () => {
    socket.emit("stopTimer", (response) => {
      if (response.success) {
        console.log("Timer stopped");
        setRemainingTime(null);
        setTimerStatus(false);
      }
    });
  };

  return (
    <AdminNavbar>
      <div className="bg-gray-700 text-white min-h-screen p-6 space-y-6">
        {/* Timer Controls */}
        <div className="flex items-center justify-center ">
          <button

            className="bg-orange-500 rounded-lg p-2 px-8 text-center font-bold "
          >
            30S Timer
          </button>
        </div>
        <div className="flex justify-between items-center space-x-4">
          {/* Stop Timer Button */}
          <button
            onClick={stopTimer}
            className="bg-red text-white rounded-lg p-1 md:p-4 font-bold transform transition-transform hover:scale-95"
          >
            Stop Timer
          </button>

          {/* Admin Selected Game Data */}
          {adminSelectedGameData && (
            <div className="text-center text-bold">
              <div className="text-gold">
                <span>Number: {adminSelectedGameData.number},</span>
                <span> Color: {adminSelectedGameData.color.join(", ")},</span>
                <span> Size: {adminSelectedGameData.bigOrSmall}</span>
              </div>
            </div>
          )}

          {/* Start Timer Button */}
          <button
            onClick={() => startTimer(30000)}
            className="bg-green-700 text-white rounded-lg p-1 md:p-4 font-bold transform transition-transform hover:scale-95"
          >
            Start Timer
          </button>
        </div>


    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-2">
         {/* Timer Status & Current Game ID */}
         <div className="bg-gray-800 rounded-lg p-4 text-center">
          <h2 className="text-lg font-bold mb-4">Timer Status</h2>
          {timerStatus ? (
            <div className="flex justify-center items-center space-x-4">
              <div className="bg-gray-700 text-white rounded-lg p-2 text-2xl font-bold flex justify-center items-center">
                {minutes}
              </div>
              <div className="text-white text-2xl font-bold">:</div>
              <div className="bg-gray-700 text-white rounded-lg p-2 text-2xl font-bold flex justify-center items-center">
                {seconds}
              </div>
            </div>
          ) : (
            <p className="text-lg">Timer is currently inactive</p>
          )}
          {currentGameId && (
          <div className="mt-4 text-lg">
            <strong>Current Game ID:</strong> {currentGameId}
          </div>
        )}
        
        </div>

        {/* Manual Number Input */}
        <div className="bg-gray-800 rounded-lg p-4 text-center space-y-4">
          <label htmlFor="manualNumber" className="block mb-2 font-bold text-white">
            Enter a number (0-9) to set bet:
          </label>
          <div className="relative">
            <select
              id="manualNumber"
              value={manualNumber}
              onChange={(e) => setManualNumber(Number(e.target.value))}
              className="w-3/4 p-2 rounded border border-gray-500 bg-gray-800 focus:outline-none focus:ring focus:ring-orange-500 text-white"
            >
              <option value="" disabled>
                Select a number
              </option>
              <option value="0">0 - Red, Violet (Small)</option>
              <option value="1">1 - Green (Small)</option>
              <option value="2">2 - Red (Small)</option>
              <option value="3">3 - Green (Small)</option>
              <option value="4">4 - Red (Small)</option>
              <option value="5">5 - Green, Violet (Big)</option>
              <option value="6">6 - Red (Big)</option>
              <option value="7">7 - Green (Big)</option>
              <option value="8">8 - Red (Big)</option>
              <option value="9">9 - Green (Big)</option>
            </select>
          </div>
          <button
            onClick={setManualGameData}
            className="bg-orange-500 rounded-lg px-6 py-2 text-center font-bold transform transition-transform hover:scale-95"
          >
            Submit
          </button>
          
        </div>
     </div>
    
        <AdminSuggestions/>
        <UserStats/>

   {/* Game Data Logs Section */}
   <div className="bg-gray-800 rounded-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-gray-200">Game Logs</h2>
          <div className="relative">
            <button
              onClick={toggleDropdown}
              className="bg-orange-500 text-white py-1 px-4 rounded-lg font-bold transform transition-transform hover:scale-95"
            >
              Manage Game Logs
            </button>
            
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-gray-900 border border-gray-700 rounded-lg shadow-lg">
                <div className="p-4">
                  <label htmlFor="quantity" className="block text-lg font-medium text-white mb-2">Quantity:</label>
                  <select
                    id="quantity"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="w-full border rounded p-2 text-black"
                  >
                    <option value="20">20</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                    <option value="all">All</option>
                  </select>
                  <p className="text-white mt-2">Current Logs: {logsCount || "..."}</p>
                  <div className="flex justify-between mt-4 space-x-2">
                    <button
                      onClick={handleDelete}
                      className="bg-red text-white py-2 px-4 rounded hover:bg-darkRed"
                    >
                      Delete Logs
                    </button>
                    <button
                      onClick={toggleDropdown}
                      className="bg-gray-600 text-white py-2 px-4 rounded hover:bg-orange-500"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Table of Game Logs */}
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
              {gameData.map((game, index) => (
                <tr key={index} className="bg-gray-700 text-gray-200">
                  <td className="px-4 py-2">{game.gameId}</td>
                  <td className="px-4 py-2">{game.number}</td>
                  <td className="px-4 py-2">{game.color.join(", ")}</td>
                  <td className="px-4 py-2">{game.bigOrSmall}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      </div>
    </AdminNavbar>
  );
};

export default AdminDashboard;
