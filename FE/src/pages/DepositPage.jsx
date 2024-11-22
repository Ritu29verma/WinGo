import React , {useState} from "react";
import { FaWallet } from "react-icons/fa";
import { FaPaypal } from "react-icons/fa";
import { FaBitcoin } from "react-icons/fa";
import { FaQrcode } from "react-icons/fa";

const channels = {
    ewallet: [
  { name: "LuckyPay-APP", balance: "100 - 50K" },
  { name: "RsPayINR", balance: "100 - 50K" },
  { name: "OoPay APP", balance: "100 - 50K" },
  { name: "TBIndia-INR", balance: "100 - 10K" },
  { name: "FunPay - APP", balance: "100 - 50K" },
  { name: "Super-APPpay", balance: "100 - 50K" },
  { name: "HappyPayINR2app", balance: "500 - 50K" },
  { name: "HappyPayINR2-app", balance: "500 - 50K" },
] ,
paytm: [
  { name: "Paytm Channel 1", balance: "100 - 20K" },
  { name: "Paytm Channel 2", balance: "200 - 50K" },
],
upi: [
  { name: "UPI Channel 1", balance: "50 - 10K" },
  { name: "UPI Channel 2", balance: "100 - 25K" },
],
usdt: [
  { name: "USDT Channel 1", balance: "500 - 50K" },
  { name: "USDT Channel 2", balance: "1000 - 100K" },
],
};

const DepositPage = () => {
    const [activeTab, setActiveTab] = useState("ewallet");

    const handleTabClick = (tabKey) => {
        setActiveTab(tabKey); 
      };

  return (
    <div className="bg-gray-900 min-h-screen flex flex-col items-center text-white p-4">
      {/* Header Section */}
      <div className="flex justify-between w-full px-10 mb-4">
        <h1 className="text-lg font-bold">Deposit</h1>
        <button className="text-sm text-blue-400">Deposit history</button>
      </div>

      {/* Balance Card */}
      <div className="bg-gradient-to-r w-full max-w-6xl from-green-400 via-yellow-400 to-green-600 p-6 rounded-lg shadow-lg mb-6 text-white">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold">Balance</h2>
          <button className="text-sm text-gray-100">⟳</button>
        </div>
        <p className="text-4xl font-bold my-4">₹1644.32</p>
        <p className="text-right text-gray-200">**** ****</p>
      </div>

      <div className="bg-black text-white w-full max-w-7xl rounded-lg p-4 mt-4">
      {/* Payment Methods */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        {[
          { name: "E-Wallet", key: "ewallet", icon: <FaWallet /> },
          { name: "Paytm × QR", key: "paytm", icon: <FaPaypal /> },
          { name: "UPI × QR", key: "upi", icon: <FaQrcode /> },
          { name: "USDT", key: "usdt", icon: <FaBitcoin /> },
        ].map((tab, index) => (
          <button
            key={index}
            onClick={() => handleTabClick(tab.key)} // Use `key` instead of name transformation
            className={`flex items-center justify-center px-4 py-2 rounded-lg font-bold gap-2 ${
              activeTab === tab.key
                ? "bg-green-500"
                : "bg-customBlue hover:bg-gradient-to-l from-blue-500 to-blue-900"
            }`}
          >
            {tab.icon}
            {tab.name}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="text-center">
        {channels[activeTab]?.length > 0 ? (
          <div>
            <div className="bg-gray-800 rounded-lg p-4">
              <h2 className="text-lg font-bold mb-4">
                Available Channels for{" "}
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {channels[activeTab].map((channel, index) => (
                  <div
                    key={index}
                    className="bg-gray-900 p-4 rounded-lg text-left shadow-md"
                  >
                    <p className="font-bold">{channel.name}</p>
                    <p className="text-sm text-gray-400">
                      Balance: {channel.balance}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <p>No channels available.</p>
        )}
      </div>

    </div>

    </div>
  );
};

export default DepositPage;
