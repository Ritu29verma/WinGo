import React from 'react';

const ColorButtons = ({ number , color1 , color2 , digitColor1 , digitColor2 }) => {
  return (
    <div className="relative w-20 h-20 rounded-full overflow-hidden shadow-md flex items-center justify-center">
      {/* Background Circle with Diagonal Split */}
      <div
        className={`absolute w-full h-full ${color1} transform rotate-[30deg]`}
        style={{
          clipPath: 'polygon(0 0, 100% 0, 0 100%)', // Clip to half circle with tilt
        }}
      />

      {/* Tilted Right Half Circle */}
      <div
        className={`absolute w-full h-full ${color2} transform -rotate-[-30deg]`}
        style={{
          clipPath: 'polygon(100% 0, 100% 100%, 0 100%)', // Clip to other half circle with tilt
        }}
      />
      {/* Centered Digit with Diagonal Split */}
      <div className="absolute inset-0 flex items-center justify-center bg-white rounded-full m-[10px]">
      <div className="relative flex items-center justify-center ">
        {/* Left Half of Digit */}
        <span
          className={`absolute text-3xl font-bold ${digitColor1} ` }
          // style={{
          //   clipPath: 'polygon(0 0, 100% 0, 0 100%) ', // Clip to half circle with tilt
          // }}
        >
          {number}
        </span>

        {/* Right Half of Digit */}
        <span
          className={`absolute text-3xl font-bold ${digitColor2}`}
          style={{
            clipPath: 'polygon(100% 0, 100% 100%, 0 100%)', // Clip to other half circle with tilt
          }}
        >
          {number}
        </span>
      </div>
        </div>
    </div>
  );
};

export default ColorButtons;
