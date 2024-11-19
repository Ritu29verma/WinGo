import React, { useState, useEffect } from "react";
import logo from "../assets/image2.png"
const TimerSection = () => {
  const [selectedTime, setSelectedTime] = useState(30); // Default timer 30s
  const [timeRemaining, setTimeRemaining] = useState(selectedTime);

  useEffect(() => {
    if (timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [timeRemaining]);

  useEffect(() => {
    setTimeRemaining(selectedTime); // Reset countdown when timer changes
  }, [selectedTime]);

  return (
    <div className="bg-customBlue w-full max-w-7xl rounded-lg p-4 mb-4 shadow-lg">
   <div className="grid grid-cols-4 gap-6 mb-4 text-white">
  {[30, 60, 180, 300].map((time) => (
    <button
      key={time}
      onClick={() => setSelectedTime(time)}
      className={`flex flex-col items-center py-4 px-6 rounded-lg font-bold text-center ${
        selectedTime === time ? "bg-gradient-to-b from-blue-900 to-blue-500" : "bg-customBlue"
      }`}
    >
      <img src={logo} alt="Logo" className="w-16 h-16 mb-1" /> 
      {time / 60 > 1 ? `${time / 60} Min` : `${time}s`}
    </button>
  ))}
</div>

      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold text-white">How to Play</h2>
        <p className="text-sm text-white">Time Remaining: {timeRemaining}s</p>
      </div>

      {timeRemaining <= 5 && timeRemaining > 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center text-white text-5xl font-bold z-50">
          {timeRemaining}
        </div>
      )}
    </div>
  );
};

export default TimerSection;
