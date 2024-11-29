import React, { useState, useEffect , useRef} from "react";
import logo from "../assets/image2.png";
import socket from "../socket";
import beepSound from "../assets/amp2.mp3"

const TimerSection = () => {
  const [selectedTime, setSelectedTime] = useState(30); // Default timer 30s
  const [timeRemaining, setTimeRemaining] = useState(selectedTime);
  const [timerStatus, setTimerStatus] = useState(false);
  const [currentGameId, setCurrentGameId] = useState(null);
  const [timerDigits, setTimerDigits] = useState([0, 0, 0, 0]);
  const [alertNumber, setAlertNumber] = useState(null);
  const beepRef = useRef(null);

  useEffect(() => {
    socket.on("timerUpdate", ({ minutes, seconds, isTimerActive }) => {
      const totalSeconds = minutes * 60 + seconds;

      setTimeRemaining(totalSeconds);

      const minuteString = String(minutes).padStart(2, "0");
      const secondString = String(seconds).padStart(2, "0");

      setTimerDigits([
        ...minuteString.split("").map(Number),
        ...secondString.split("").map(Number),
      ]);

      setTimerStatus(isTimerActive);

      if (totalSeconds <= 5 && totalSeconds > 0) {
        setAlertNumber(parseInt(totalSeconds,10));
        if (beepRef.current) {
          beepRef.current.play();
        }
      } else {
        setAlertNumber(null);
      }
    });

    socket.on("gameId", ({ gameId }) => {
      setCurrentGameId(gameId);
      localStorage.setItem("nextGameId", gameId);
    });

    const storedGameId = localStorage.getItem("nextGameId");
    if (storedGameId) setCurrentGameId(storedGameId);

    return () => {
      socket.off("timerUpdate");
      socket.off("gameId");
    };
  }, []);

  return (
    <div className="bg-customBlue w-full max-w-7xl rounded-lg p-4 mb-4 shadow-lg">
        <audio ref={beepRef} src={beepSound} preload="auto"></audio>
      <div className="grid grid-cols-4 md:grid-cols-4 gap-4 mb-6 text-white">
        {[30, 60, 180, 300].map((time) => (
          <button
            key={time}
            onClick={() => setSelectedTime(time)}
            className={`flex flex-col items-center py-3 px-2 sm:py-4 sm:px-6 rounded-lg font-bold text-center text-sm sm:text-base ${
              selectedTime === time
                ? "bg-gradient-to-b from-blue-900 to-blue-500"
                : "bg-customBlue"
            }`}
          >
            <img
              src={logo}
              alt="Logo"
              className="w-12 h-12 sm:w-16 sm:h-16 mb-1"
            />
            {time / 60 > 1 ? `${time / 60} Min` : `${time}s`}
          </button>
        ))}
      </div>

      {/* Countdown Display */}
      <div className="flex flex-col md:flex-row justify-between items-center bg-black p-4 rounded-lg shadow-lg">
        {/* Header Section */}
        <h2 className="text-base sm:text-lg md:text-xl font-bold text-white mb-4 md:mb-0">
          How to Play
        </h2>

       {/* Time Remaining Clock */}
<div className="flex space-x-2 items-center">
  {timerDigits.map((digit, index) => (
    <React.Fragment key={index}>
      <div
        className="bg-white text-blue-900 font-bold text-lg sm:text-xl md:text-2xl w-10 h-10 sm:w-12 sm:h-12 flex justify-center items-center rounded-md shadow-md"
      >
        {digit}
      </div>
      {index === 1 && (
        <span className="text-white font-bold text-lg sm:text-xl md:text-2xl">:</span>
      )}
    </React.Fragment>
  ))}
</div>

        <div className="text-white p-2"> {currentGameId}</div>
      </div>

      {/* Countdown Alert for Last Few Seconds */}
      {alertNumber && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-20">
    <div className="bg-black rounded-lg p-10 shadow-lg transform scale-95 animate-fade text-white text-4xl sm:text-5xl md:text-6xl font-bold">
      {alertNumber}
    </div>
  </div>
)}
    </div>
  );
};

export default TimerSection;
