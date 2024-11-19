import React from "react";
import CountButton from "./CountButton";
import ColorButtons from "./ColorButtons";
const GameSection = () => {
  const colors = ["green", "violet", "red"];
  const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  return (
    <div className="bg-blue-800 w-full max-w-7xl rounded-lg p-4 shadow-lg">
      {/* Color Buttons */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        {colors.map((color) => (
          <button
            key={color}
            className={`py-2 px-4 rounded-lg text-center font-bold text-white ${
              color === "green"
                ? "bg-green"
                : color === "violet"
                ? "bg-violet"
                : "bg-red"
            }`}
          >
            {color.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Number Buttons */}
      <div className="p-10  flex space-x-4">
      {/* Usage of ColorButtons with different colors */}
      <ColorButtons
        number={1} 
        color1="bg-red" 
        color2="bg-yellow-500"
        digitColor1="text-red"
        digitColor2="text-yellow-500"
      />
      
      <ColorButtons
        number={2} 
        color1="bg-pink-500" 
        color2="bg-yellow-500"
        digitColor1="text-pink-500"
        digitColor2="text-yellow-500"
      />
      
      <ColorButtons
        number={3} 
        color1="bg-blue-500" 
        color2="bg-green"
        digitColor1="text-blue-500"
        digitColor2="text-green-500"
      />
      <ColorButtons
        number={4} 
        color1="bg-blue-500" 
        color2="bg-green-500"
        digitColor1="text-blue-500"
        digitColor2="text-green-500"
      />
      <ColorButtons
        number={5} 
        color1="bg-blue-500" 
        color2="bg-green"
        digitColor1="text-blue-500"
        digitColor2="text-green"
      />
      <ColorButtons
        number={6} 
        color1="bg-blue-500" 
        color2="bg-green-500"
        digitColor1="text-blue-500"
        digitColor2="text-green-500"
      />
      <ColorButtons
        number={7} 
        color1="bg-pink-500" 
        color2="bg-green-500"
        digitColor1="text-pink-500"
        digitColor2="text-green-500"
      />
      <ColorButtons
        number={8} 
        color1="bg-yellow-500" 
        color2="bg-green-500"
        digitColor1="text-yellow-500"
        digitColor2="text-green-500"
      />
        <ColorButtons
        number={9} 
        color1="bg-red" 
        color2="bg-yellow-500"
        digitColor1="text-red"
        digitColor2="text-yellow-500"
      />

    </div>

      {/* Random and Multipliers */}
      <div className="flex justify-around mb-4">
        <button className="bg-gray-700 px-4 py-2 rounded-lg text-white">Random</button>
        {["X1", "X5", "X10", "X20", "X50", "X100"].map((multiplier) => (
          <button
            key={multiplier}
            className="bg-gray-700 px-4 py-2 rounded-lg text-white"
          >
           
            {multiplier}
          </button>
        ))}
      </div>

      {/* Big/Small Buttons */}
      {/* <div className="flex justify-between">
        <button className="bg-yellow-500 px-4 py-2 rounded-lg text-black font-bold">
          Big
        </button>
        <button className="bg-blue-500 px-4 py-2 rounded-lg text-white font-bold">
          Small
        </button>
      </div> */}
    </div>
  );
};

export default GameSection;
