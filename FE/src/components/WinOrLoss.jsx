import React, { useEffect } from "react";
import img1 from "../assets/win-popup.png";
import img2 from "../assets/loss-popup.png";

const WinOrLoss = ({ isWin, lotteryResult, bonus, period, autoClose }) => {
  useEffect(() => {
    if (autoClose && isWin !== null) {
      const timer = setTimeout(() => {
        window.location.reload();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isWin, autoClose]);

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 ${
        isWin !== null ? "flex" : "hidden"
      }`}
    >
      {/* Popup Container */}
      <div
        className="relative w-[350px] h-[500px] bg-cover bg-center text-white flex flex-col items-center justify-between rounded-lg shadow-lg"
        style={{
          backgroundImage: `url(${isWin ? img1 : img2})`,
        }}
      >
        {/* Header */}
        <div className="text-center mt-36">
          <h2 className="text-2xl font-bold">
            {isWin ? "Congratulations!" : "Better Luck Next Time!"}
          </h2>
        </div>

        {/* Lottery Result Section */}
        <div className="text-center text-white">
          <p className="text-lg">Lottery Result:</p>
          <div className="flex justify-center gap-2 text-lg font-bold">
            <span className="text-black">{lotteryResult.color}</span>
            <span className="text-black">{lotteryResult.number}</span>
            <span className="text-black">{lotteryResult.size}</span>
          </div>
        </div>

        {/* Bonus Section */}
        <div className="text-center mb-9">
        <div className="text-center mb-1">
  <p className={`text-3xl font-bold ${isWin ? "text-orange-400" : "text-gray-400"}`}>
    Bonus
  </p>
  <p className={`text-2xl font-bold mt-2 ${isWin ? "text-orange-400" : "text-gray-400"}`}>
    ₹{bonus}
  </p>
  <p className={`text-sm mt-1 ${isWin ? "text-orange-400" : "text-gray-400"}`}>
    Period: {period}
  </p>
</div>

        </div>

        {/* Auto Close Section */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <input
            type="checkbox"
            checked={autoClose}
            readOnly
            className="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300"
          />
          <label className="text-sm">5 Seconds auto close</label>
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
