import React from 'react';
import { FaDice, FaDiceD20, FaDiceFive, FaDiceFour } from 'react-icons/fa';

function Card({ title, subtitle, icon }) {
  return (
    <div className="bg-gray-800 rounded-lg p-6 mb-6">
      <div className="flex items-center mb-4">
        {icon}
        <h2 className="text-white text-lg font-bold ml-2">{title}</h2>
      </div>
      <p className="text-gray-400">{subtitle}</p>
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4">
      </button>
    </div>
  );
}

export default Card;