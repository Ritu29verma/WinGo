import React from "react";
import "../App.css"
const WalletSection = () => {
  return (
     <div className="bg-customBlue w-full max-w-7xl rounded-lg p-6 mb-4 shadow-lg m-3 ">
       <div className=" ">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-lg font-semibold text-white">Wallet Balance</p>
          <p className="text-xl font-bold text-white">₹0.00</p>
        </div>
        <div>
          <button className="bg-red hover:bg-orange-900 text-white px-4 py-2 rounded-lg mr-2">
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
