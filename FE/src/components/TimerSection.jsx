import React, { useState, useEffect, useRef } from "react";
import logo from "../assets/image2.png";
import socket from "../socket";
import beepSound from "../assets/amp2.mp3";
import { FiVolume2, FiVolumeX } from "react-icons/fi"
const TimerSection = ({ selectedTime, setSelectedTime }) => {
  const [timeRemaining, setTimeRemaining] = useState(selectedTime);
  const [timerStatus, setTimerStatus] = useState(false);
  const [currentGameId, setCurrentGameId] = useState(null);
  const [timerDigits, setTimerDigits] = useState([0, 0, 0, 0]);
  const [alertNumber, setAlertNumber] = useState(null);
  const [isMuted, setIsMuted] = useState(false); 
  const beepRef = useRef(null);

  const handleTimerUpdate = (event) => {
    const { minutes, seconds, isTimerActive } = event;
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
      setAlertNumber(parseInt(totalSeconds, 10));
      if (beepRef.current && !isMuted) {
        beepRef.current.play();
      }
    } else {
      setAlertNumber(null);
    }
  };

  const getTimerEvent = (selectedTime) => {
    switch (selectedTime) {
      case 30:
        return "timerUpdate"
      case 60:
        return "timerUpdate2";
      case 180:
        return "timerUpdate3";
      case 300:
        return "timerUpdate4";
    }
  };
  
  const getGameIdEvent = (selectedTime) => {
    switch (selectedTime) {
      case 30:
        return "gameId"
      case 60:
        return "gameId2";
      case 180:
        return "gameId3";
      case 300:
        return "gameId4";
    }
  };
  
  const getLocalStorageKey = (selectedTime) => {
    switch (selectedTime) {
      case 30:
        return "nextGameId"
      case 60:
        return "nextGameId2";
      case 180:
        return "nextGameId3";
      case 300:
        return "nextGameId4";
    }
  };
  useEffect(() => {
    const timerEvent = getTimerEvent(selectedTime);
    const gameIdEvent = getGameIdEvent(selectedTime);
    const localStorageKey = getLocalStorageKey(selectedTime);

    socket.on(timerEvent, handleTimerUpdate);

    socket.on(gameIdEvent, ({ gameId }) => {
      setCurrentGameId(gameId);
      localStorage.setItem(localStorageKey, gameId);
    });

    const storedGameId = localStorage.getItem(localStorageKey);
    if (storedGameId) setCurrentGameId(storedGameId);

    return () => {
      socket.off(timerEvent, handleTimerUpdate);
      socket.off(gameIdEvent);
    };
  }, [selectedTime]);
    useEffect(() => {
      if (beepRef.current) {
        beepRef.current.muted = isMuted;
      }
    }, [isMuted]);
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
      <div className="flex flex-col gap-y-2 md:flex-row justify-between items-center bg-black p-4 rounded-lg shadow-lg">
      
      <div className="flex items-center space-x-2">
        <h2 className="text-base md:text-xl font-bold text-white">
          How to Play
        </h2>
        <button
        onClick={() => setIsMuted(!isMuted)}
        className="flex items-center justify-center bg-gray-500 text-black p-1 md:p-2 rounded-full shadow-md hover:bg-gray-400 
                   md:w-8 md:h-8"
      >
        {isMuted ? (
          <FiVolumeX size={16} className="text-black md:text-sm" />
        ) : (
          <FiVolume2 size={16} className="text-black md:text-sm" />
        )}
      </button>
      </div>

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
                <span className="text-white font-bold text-lg sm:text-xl md:text-2xl">
                  :
                </span>
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
