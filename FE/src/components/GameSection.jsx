import React, { useState } from "react";
import zero from "../assets/0.png";
import one from "../assets/1.png";
import two from "../assets/2.png";
import three from "../assets/3.png";
import four from "../assets/4.png";
import five from "../assets/5.png";
import six from "../assets/6.png";
import seven from "../assets/7.png";
import eight from "../assets/8.png";
import nine from "../assets/9.png";
import PopupCard from "./PopupCard";

const GameSection = () => {
  const [popup, setPopup] = useState({ isOpen: false, color: "", content: "" });

  const colors = ["green", "violet", "red" ];
  const numbers = [zero, one, two, three, four, five, six, seven, eight, nine];


  const handleColorClick = (color) => {
    const popupColor = color === "violet" ? "#9400D3" : color;
    setPopup({ isOpen: true, color: popupColor,  content: color.toUpperCase() });
  };

  const handleNumberClick = (index) => {
    let bgColor = "";
    switch (index) {
      case 0:
        bgColor = "red-violet";
        break;
      case 5:
        bgColor = "green-violet";
        break;
      case 1:
      case 7:
      case 3:
      case 9:
        bgColor = "Green";
        break;
      case 6:
      case 2:
      case 8:
      case 4:
        bgColor = "red";
        break;
      default:
        bgColor = "gray";
    }
    setPopup({ isOpen: true, color: bgColor, content: `Number ${index}` });
  };

  const closePopup = () => setPopup({ isOpen: false, color: "", content: "" });

  const handleSizeClick = (size) => {
    const color = size === "Small" ? "#FBBF24" : "#3B82F6";
    setPopup({ isOpen: true, color, content: size });
  };


  return (
    <div className="bg-black w-full max-w-7xl rounded-lg p-4 shadow-lg">
      {/* Color Buttons */}
      <div className="grid grid-cols-3 sm:grid-cols-3 gap-4 mb-4">
        {colors.map((color) => (
          <button
            key={color}
            onClick={() => handleColorClick(color)}
            className={`py-2 lg:py-4 px-4 text-center font-bold text-white ${
              color === "green"
                ? "bg-Green transform transition-transform hover:scale-95 rounded-tr-lg rounded-bl-lg"
                : color === "violet"
                ? "bg-violet transform transition-transform hover:scale-95 rounded-lg"
                : "bg-red transform transition-transform hover:scale-95 rounded-tr-lg rounded-bl-lg"
            }`}
          >
            {color.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Number Buttons */}
      <div className="grid sm:grid-cols-5 md:grid-cols-10 grid-cols-5 gap-2 p-4">
        {numbers.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Number ${index}`}
            onClick={() => handleNumberClick(index)}
            className="w-12 h-12 sm:w-16 sm:h-16 transform transition-transform hover:scale-95 md:w-24 md:h-24 object-contain cursor-pointer"
          />
        ))}
      </div>

       {/* Random and Multipliers */}
       <div className="flex flex-wrap justify-center gap-2 md:gap-4 mt-4">
        <button className="bg-black md:px-8 py-2 px-2 rounded-lg text-red border">
          Random
        </button>
        {["X1", "X5", "X10", "X20", "X50", "X100"].map((multiplier) => (
          <button
            key={multiplier}
            className="bg-customBlue hover:bg-Green md:px-6 py-2 px-2 rounded-lg text-white"
          >
            {multiplier}
          </button>
        ))}
      </div>

      {/* Small and Big Buttons */}
      <div className="flex justify-center p-5 md:pt-8 items-center">
        <button
          onClick={() => handleSizeClick("Small")}
          className="bg-yellow-500 hover:bg-yellow-600 text-white  py-3 w-1/3 md:w-1/4 md:py-4 rounded-l-full justify-self-center"
        >
          Small
        </button>
        <button
          onClick={() => handleSizeClick("Big")}
          className="bg-blue-500 hover:bg-blue-600 text-white py-3 w-1/3 md:w-1/4 md:py-4 rounded-r-full justify-self-center"
        >
          Big
        </button>
      </div>

      <PopupCard
        isOpen={popup.isOpen}
        onClose={closePopup}
        content={popup.content}
        color={popup.color}
      />
    </div>
  );
};

export default GameSection;
