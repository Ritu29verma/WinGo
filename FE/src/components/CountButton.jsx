import React from "react";

const CountButton = ({ number, color }) => {
  const colors = {
    green: "bg-green-500",
    violet: "bg-violet-500",
    red: "bg-red-500",
  };

  return (
    <button
      className={`py-4 rounded-full text-center font-bold text-white ${
        colors[color]
      }`}
    >
      {number}
    </button>
  );
};

export default CountButton;
