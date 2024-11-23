import React from "react";
import img1 from "../assets/winpopup.png";
import img2 from "../assets/losspopup.png";
const WinOrLoss = ({ isWin, lotteryResult, bonus, period, autoClose }) => {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      style={{ display: isWin !== null ? "flex" : "none" }} // Show only when isWin is not null
    >
      {/* Popup Container */}
      <div
        className="relative w-[350px] h-[500px] bg-cover bg-center text-white flex flex-col items-center justify-between rounded-lg shadow-lg"
        style={{
            backgroundImage: `url(${isWin ? img2 : img1})`,
        }}
      >
        {/* Header */}
        <div className="text-center mt-36">
          <h2 className="text-2xl font-bold">Congratulations</h2>
        </div>

        {/* Lottery Result Section */}
        <div className="text-center text-white">
          <p className="text-lg ">Lottery Result:</p>
          <div className="flex justify-center gap-2 text-lg font-bold">
            {/* <span className="bg-green-500 px-4 py-1 rounded-md">{lotteryResult.color}</span>
            <span className="bg-yellow-500 px-4 py-1 rounded-md">{lotteryResult.number}</span>
            <span className="bg-gray-500 px-4 py-1 rounded-md">{lotteryResult.size}</span> */}
             <span className="text-black">red</span>
            <span className="text-black">7</span>
            <span className="text-black">small</span>
          </div>
        </div>

        {/* Bonus Section */}
        <div className="text-center mb-9">
          <p className="text-3xl font-bold text-orange-400">Bonus</p>
          <p className="text-2xl font-bold mt-2 text-orange-400">₹100</p>
          <p className="text-sm mt-1 text-orange-400">Period: 5656</p>
        </div>

        {/* Auto Close Section */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <input
            type="checkbox"
            checked={autoClose}
            readOnly
            className="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300"
          />
          <label className="text-sm">3 Seconds auto close</label>
        </div>

        {/* Close Button */}
        <button
          className="absolute bottom-4 text-white bg-black bg-opacity-50 px-4 py-2 rounded-full"
          onClick={() => window.location.reload()}
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default WinOrLoss;
