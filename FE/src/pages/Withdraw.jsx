import React, { useState } from "react";
import { FaCreditCard, FaBitcoin, FaPlus, FaHeadset } from "react-icons/fa";

const Withdraw = () => {
  const [activeTab, setActiveTab] = useState("bank");

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="bg-gray-900 min-h-screen text-white p-4 flex flex-col items-center">
      {/* Header */}
      <div className="flex justify-between items-center w-full max-w-5xl px-4">
        <h1 className="text-lg font-bold">Withdraw</h1>
        <button className="text-sm text-blue-400">Withdraw history</button>
      </div>

      {/* Balance Card */}
      <div className="bg-gradient-to-r from-green-400 via-yellow-400 to-green-500 p-6 rounded-lg shadow-md w-full max-w-4xl mt-4 text-white">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold">Available Balance</h2>
          <button className="text-sm">⟳</button>
        </div>
        <p className="text-4xl font-bold my-4">₹1644.32</p>
        <p className="text-right text-gray-200">**** ****</p>
      </div>

    <div className="bg-black text-white w-full max-w-5xl rounded-lg p-4 mt-4" >
          {/* Withdrawal Methods */}
      <div className="w-full max-w-5xl mt-6 mb-6 flex justify-center items-center">
      <div className="grid items-center grid-cols-2 gap-4">
          <button
            onClick={() => handleTabChange("bank")}
            className={`flex flex-col items-center justify-center p-4 px-10 md:px-24 rounded-lg text-center font-bold ${
              activeTab === "bank"
                ? "bg-green-500"
                : "bg-customBlue hover:bg-gradient-to-l from-blue-500 to-blue-900"
            }`}
          >
            <FaCreditCard size={24} />
            Bank Card
          </button>
          <button
            onClick={() => handleTabChange("usdt")}
            className={`flex flex-col items-center justify-center p-4 rounded-lg text-center font-bold ${
              activeTab === "usdt"
                ? "bg-green-500"
                : "bg-customBlue hover:bg-gradient-to-l from-blue-500 to-blue-900"
            }`}
          >
            <FaBitcoin size={24} />
            USDT
          </button>
        </div>
      </div>

      {/* Conditional Content */}
      {activeTab === "bank" && (
        <div className="bg-gray-900 w-full max-w-5xl min-h-screen flex flex-col items-center px-4 py-6 text-white">
          

        {/* Add Bank Account */}
        <div className="bg-gray-800 mt-6 p-6 rounded-lg shadow w-full max-w-2xl flex flex-col items-center">
          <button className="flex flex-col items-center justify-center w-20 h-20 border-2 border-dashed border-gray-400 rounded-lg">
            <FaPlus className="text-gray-400 text-xl" />
            <span className="text-gray-400 text-sm mt-1">Add</span>
          </button>
          <p className="text-center text-sm mt-4">Add a bank account number</p>
        </div>

        {/* Beneficiary Warning */}
        <p className="text-red-500 text-center text-sm mt-4">
          Need to add beneficiary information to be able to withdraw money
        </p>

        {/* Withdrawal Form */}
        <div className="bg-gray-800 mt-6 p-6 rounded-lg shadow w-full max-w-2xl">
          <h2 className="text-lg font-bold mb-4">Select amount of USDT</h2>
          {/* Input Section */}
          <div className="space-y-4">
            <div className="flex items-center bg-gray-700 rounded-md p-3">
              <span className="text-xl font-bold mr-2">₹</span>
              <input
                type="number"
                placeholder="0"
                className="bg-transparent text-white text-xl w-full focus:outline-none"
              />
            </div>
          </div>

           {/* Withdrawable Balance */}
           <div className="flex justify-between items-center text-gray-400 text-sm mt-4">
             <p>Withdrawable balance ₹1177.42</p>
             <button className="text-blue-400 font-medium">All</button>
           </div>

               {/* Withdraw Button */}
               <button className="bg-gradient-to-r from-blue-500 to-blue-700 text-white w-full py-3 rounded-lg mt-6 font-bold hover:opacity-90">
             Withdraw
           </button>

          {/* Additional Info */}
          <ul className="text-sm text-gray-400 mt-6 space-y-2">
        <li className="flex items-center">
          <span className="text-blue-500 mr-2">◆</span>
          Need to bet <span className="text-red"> ₹378.00 </span> to be able to withdraw
        </li>
        <li className="flex items-center">
          <span className="text-blue-500 mr-2">◆</span>
          With time <span className="text-red"> 00:00-23:59</span>
        </li>
        <li className="flex items-center">
          <span className="text-blue-500 mr-2">◆</span>
          Inday Remaining Withdrawal Times: <span className="text-blue-400">3</span>
        </li>
        <li className="flex items-center">
          <span className="text-blue-500 mr-2">◆</span>
          Withdrawal amount range: <span className="text-red">₹300.00-₹150,000.00</span>
        </li>
        <li className="flex items-center">
          <span className="text-blue-500 mr-2">◆</span>
          Please confirm your beneficial account information before withdrawing.
        </li>
        <li className="flex items-center">
          <span className="text-blue-500 mr-2">◆</span>
          If your beneficial information is incorrect, please contact customer service.
        </li>
      </ul>
        </div>
      </div>
      )}

      {activeTab === "usdt" && (
       
         <div className="bg-gray-900 min-h-screen w-full max-w-5xl flex flex-col items-center px-4 py-6 text-white">
         

         {/* Contact Service */}
         <div className="bg-gray-800 mt-6 p-4 rounded-lg shadow w-full max-w-2xl flex items-center justify-between">
           <div className="flex items-center">
             <FaHeadset className="text-yellow-500 text-3xl mr-4" />
             <p>Contact customer service Add USDT address</p>
           </div>
         </div>

         {/* Withdrawal Form */}
         <div className="bg-gray-800 mt-6 p-6 rounded-lg shadow w-full max-w-2xl">
           <h2 className="text-lg font-bold mb-4">Select amount of USDT</h2>
           {/* Input Section */}
           <div className="space-y-4">
             <div className="flex items-center bg-gray-700 rounded-md p-3">
               <span className="text-xl font-bold mr-2">₹</span>
               <input
                 type="number"
                 placeholder="0"
                 className="bg-transparent text-white text-xl w-full focus:outline-none"
               />
             </div>
             <div className="flex items-center bg-gray-700 rounded-md p-3">
               <span className="text-xl font-bold mr-2">$</span>
               <input
                 type="number"
                 placeholder="0.00"
                 className="bg-transparent text-white text-xl w-full focus:outline-none"
               />
             </div>
           </div>
           {/* Withdrawable Balance */}
           <div className="flex justify-between items-center text-gray-400 text-sm mt-4">
             <p>Withdrawable balance ₹1177.42</p>
             <button className="text-blue-400 font-medium">All</button>
           </div>

           {/* Withdraw Button */}
           <button className="bg-gradient-to-r from-blue-500 to-blue-700 text-white w-full py-3 rounded-lg mt-6 font-bold hover:opacity-90">
             Withdraw
           </button>

            {/* Additional Info */}
            <ul className="text-sm text-gray-400 mt-6 space-y-2">
        <li className="flex items-center">
          <span className="text-blue-500 mr-2">◆</span>
          Need to bet <span className="text-red"> ₹378.00 </span> to be able to withdraw
        </li>
        <li className="flex items-center">
          <span className="text-blue-500 mr-2">◆</span>
          With time <span className="text-red"> 00:00-23:59</span>
        </li>
        <li className="flex items-center">
          <span className="text-blue-500 mr-2">◆</span>
          Inday Remaining Withdrawal Times: <span className="text-blue-400">3</span>
        </li>
        <li className="flex items-center">
          <span className="text-blue-500 mr-2">◆</span>
          Withdrawal amount range: <span className="text-red">₹300.00-₹150,000.00</span>
        </li>
        <li className="flex items-center">
          <span className="text-blue-500 mr-2">◆</span>
          Please confirm your beneficial account information before withdrawing.
        </li>
        <li className="flex items-center">
          <span className="text-blue-500 mr-2">◆</span>
          If your beneficial information is incorrect, please contact customer service.
        </li>
      </ul>
         </div>
       </div>
      )}
    </div>
    </div>
  );
};

export default Withdraw;
