import React, { useState, useEffect } from "react";

const HowToPlay = ({ selectedTime }) => {
  const [timeRemaining, setTimeRemaining] = useState(null);

  useEffect(() => {
    if (selectedTime) {
      const totalSeconds = parseInt(selectedTime);
      setTimeRemaining(totalSeconds);
    }
  }, [selectedTime]);

  useEffect(() => {
    if (timeRemaining === 5) {
      alert("5, 4, 3, 2, 1"); // Full-screen countdown effect
    }
  }, [timeRemaining]);

  return (
    <div className="bg-blue-800 w-full max-w-md p-4 rounded-lg shadow-lg text-center">
      <h3 className="font-bold text-lg">Time Remaining: {timeRemaining}s</h3>
    </div>
  );
};

export default HowToPlay;
