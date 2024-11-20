import React from "react";

const WalletSection = () => {
  return (
    <div className="bg-customBlue w-full max-w-7xl rounded-lg p-6 mb-4 shadow-lg m-3">
      <div>
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-lg font-semibold text-white">Wallet Balance</p>
            <p className="text-xl font-bold flex justify-center  text-white">₹0.00</p>
          </div>
          <div className="flex space-x-2">
            <button className="bg-red hover:bg-orange-900 text-white px-4 py-2 rounded-lg">
              Deposit
            </button>
            <button className="bg-green hover:bg-lime-900 text-white px-4 py-2 rounded-lg">
              Withdraw
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletSection;
