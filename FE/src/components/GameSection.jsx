import React from "react";
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

const GameSection = () => {
  const colors = ["green", "violet", "red"];
  const numbers = [zero, one, two, three, four, five, six, seven, eight, nine];

  return (
    <div className="bg-black w-full max-w-7xl rounded-lg p-4 shadow-lg">
      {/* Color Buttons */}
      <div className="grid grid-cols-3 sm:grid-cols-3 gap-4 mb-4">
        {colors.map((color) => (
          <button
            key={color}
            className={`py-2 lg:py-4 px-4 text-center font-bold text-white ${
              color === "green"
                ? "bg-green transform transition-transform hover:scale-95 rounded-tr-lg rounded-bl-lg"
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
            className="w-12 h-12 sm:w-16 sm:h-16 transform transition-transform hover:scale-95 md:w-24 md:h-24  object-contain"
          />
        ))}
      </div>

      {/* Random and Multipliers */}
      <div className="flex flex-wrap justify-center gap-4 mt-4">
        <button className="bg-black px-8 py-2 rounded-lg text-red border">
          Random
        </button>
        {["X1", "X5", "X10", "X20", "X50", "X100"].map((multiplier) => (
          <button
            key={multiplier}
            className="bg-customBlue hover:bg-green px-6 py-2 rounded-lg text-white"
          >
            {multiplier}
          </button>
        ))}
      </div>

      <div className="flex justify-center p-5 md:pt-8 items-center">
            <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-12 py-3 w-1/3 md:w-1/4 md:py-4 rounded-l-full">
              Small
            </button>
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-12 py-3 w-1/3 md:w-1/4 md:py-4 rounded-r-full">
              Big
            </button>
          </div>


    </div>
  );
};

export default GameSection;
