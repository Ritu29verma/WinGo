import React, { useState, useEffect } from "react";
import AdminNavbar from "../components/AdminNavbar";
import socket from "../socket";
import UserStats from "./AdminUsers";
import AdminSuggestions from "../components/Betting";

const AdminDashboard = ({ isSidebarOpen }) => {
  const [remainingTime, setRemainingTime] = useState(null);
  const [gameData, setGameData] = useState([]);
  const [timerStatus, setTimerStatus] = useState(false);
  const [minutes, setMinutes] = useState("00");
  const [seconds, setSeconds] = useState("00");
  const [currentGameId, setCurrentGameId] = useState(null);
  const [manualNumber, setManualNumber] = useState("");
  const [adminSelectedGameData, setAdminSelectedGameData] = useState(null);


  
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
      localStorage.setItem("nextGameId", gameId); // Save to localStorage
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
        <div className="grid gap-4 grid-cols-4">
          <button
            onClick={() => startTimer(30000)}
            className="bg-orange-500 rounded-lg p-2 text-center font-bold transform transition-transform hover:scale-95"
          >
            30S Timer
          </button>
          <button
            onClick={() => startTimer(60000)}
            className="bg-orange-500 rounded-lg p-2 text-center font-bold transform transition-transform hover:scale-95"
          >
            1M Timer
          </button>
          <button
            onClick={() => startTimer(180000)}
            className="bg-orange-500 rounded-lg p-2 text-center font-bold transform transition-transform hover:scale-95"
          >
            3M Timer
          </button>
          <button
            onClick={() => startTimer(300000)}
            className="bg-orange-500 rounded-lg p-2 text-center font-bold transform transition-transform hover:scale-95"
          >
            5M Timer
          </button>
        </div>

        {/* Stop Timer Button */}
        <button
          onClick={stopTimer}
          className="bg-red-500 rounded-lg p-4 text-center font-bold"
        >
          Stop Timer
        </button>

    <div className="flex justify-center">
    <div className="flex justify-between space-x-8  ">
         {/* Timer Status & Current Game ID */}
         <div className="bg-gray-800 rounded-lg p-4 text-center w-1/2">
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
        {adminSelectedGameData && (
          <div className="mt-4 text-bold ">
          <strong>Manually Set Game Data:</strong>
          <div className="text-gold">
            Number: {adminSelectedGameData.number}, 
            Color: {adminSelectedGameData.color.join(", ")}, 
            Big/Small: {adminSelectedGameData.bigOrSmall}
          </div>
        </div>
        )}
        </div>

        {/* Manual Number Input */}
        <div className="bg-gray-800 rounded-lg p-4 text-center space-y-4 w-1/2">
          <label htmlFor="manualNumber" className="block mb-2 font-bold text-white">
            Enter a number (0-9) to set bet:
          </label>
          <div className="relative">
            <select
              id="manualNumber"
              value={manualNumber}
              onChange={(e) => setManualNumber(Number(e.target.value))}
              className="w-full p-2 rounded border border-gray-500 bg-gray-800 focus:outline-none focus:ring focus:ring-orange-500 text-white"
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
    </div>
        <AdminSuggestions/>
        <UserStats/>
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
              {gameData.map((game, index) => (
                <tr key={index} className="bg-gray-700 text-gray-200">
                  <td className="px-4 py-2">{game.gameId}</td>
                  <td className="px-4 py-2">{game.number}</td>
                  <td className="px-4 py-2">{game.color.join(", ")}</td>
                  <td className="px-4 py-2">{game.bigOrSmall}</td>
                  {/* <td className="px-4 py-2">{game.duration}</td>
                  <td className="px-4 py-2">{new Date(game.timestamp).toLocaleString()}</td> */}
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
