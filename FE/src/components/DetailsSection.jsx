import React from "react";
import Marquee from "react-fast-marquee";

const DetailsSection = () => {
  return (
    <div className="relative bg-customBlue w-full max-w-7xl p-5 rounded-lg shadow-lg text-sm mb-4 text-white">
      <Marquee 
        gradient={false} 
        speed={90} 
        className="text-center"
      >
        Contact our Support team, Thanks. Welcome To GoldenCma. If you need any help, contact the support team.
      </Marquee>
      <button 
        className="absolute top-1/2 right-4 transform -translate-y-1/2 solid bg-blue-700 hover:bg-blue-900 text-white px-4 py-2 rounded-full z-10"
      >
        Details
      </button>
    </div>
  );
};

export default DetailsSection;
