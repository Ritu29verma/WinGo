import React, { useState, useEffect } from "react";
import { FaWallet, FaPaypal, FaBitcoin, FaQrcode } from "react-icons/fa";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import QRModal from "../components/QRModal";

const DepositPage = () => {
  const [channels, setChannels] = useState({});
  const [selectedType, setSelectedType] = useState("E-Wallet");
  const [walletDetails, setWalletDetails] = useState({ walletNo: "", totalAmount: 0 });
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [depositAmount, setDepositAmount] = useState("");
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);

  useEffect(() => {
    const fetchWalletDetails = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/auth/wallet-details`,
          { headers: { Authorization: `${token}` } }
        );
        setWalletDetails(response.data);
      } catch (err) {
        console.error("Error fetching wallet details:", err);
      }
    };

    fetchWalletDetails();
  }, []);

  useEffect(() => {
    fetchChannels(selectedType);
  }, [selectedType]);

  const fetchChannels = async (type) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/admin/channels/type/${type}`
      );
      setChannels((prev) => ({ ...prev, [type]: response.data }));
    } catch (error) {
      console.error("Failed to fetch channels:", error);
      toast.error("Failed to fetch channels.");
    }
  };

  const handleDeposit = () => {
    if (!selectedChannel) {
      toast.error("Please select a channel.");
      return;
    }
    const { fromBalance, toBalance } = selectedChannel;
    const amount = parseFloat(depositAmount);

    if (isNaN(amount) || amount < fromBalance || amount > toBalance) {
      toast.error(`Please enter an amount between ₹${fromBalance} and ₹${toBalance}.`);
      return;
    }

    // Open the QR modal
    setIsQRModalOpen(true);
  };

  const paymentMethods = [
    { name: "E-Wallet", icon: <FaWallet /> },
    { name: "Paytm X QR", icon: <FaPaypal /> },
    { name: "UPI X QR", icon: <FaQrcode /> },
    { name: "USDT", icon: <FaBitcoin /> },
  ];

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
        <p className="text-4xl font-bold my-4">₹{walletDetails.totalAmount.toFixed(2)}</p>
        <p className="text-right text-gray-200">{walletDetails.walletNo}</p>
      </div>

      {/* Payment Methods */}
      <div className="bg-black text-white w-full max-w-7xl rounded-lg p-4 mt-4">
        <h2 className="text-lg font-bold mb-4">Select Channel</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          {paymentMethods.map((type) => (
            <button
              key={type.name}
              onClick={() => setSelectedType(type.name)}
              className={`flex items-center justify-center px-4 py-2 rounded-lg font-bold gap-2 ${
                selectedType === type.name
                  ? "bg-green-500"
                  : "bg-customBlue hover:bg-gradient-to-l from-blue-500 to-blue-900"
              }`}
            >
              {type.icon}
              {type.name}
            </button>
          ))}
        </div>

        {/* Channels */}
        <div className="text-center">
          {channels[selectedType]?.length > 0 ? (
            <div>
              <div className="bg-gray-800 rounded-lg p-4">
                <h2 className="text-lg font-bold mb-4">
                  Available Channels for {selectedType}
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {channels[selectedType].map((channel) => (
                    <div
                      key={channel._id}
                      onClick={() => setSelectedChannel(channel)}
                      className={`bg-gray-900 p-4 rounded-lg text-left shadow-md cursor-pointer ${
                        selectedChannel?._id === channel._id
                          ? "bg-gradient-to-l from-blue-500 to-blue-900"
                          : "bg-customBlue hover:bg-gradient-to-l from-blue-500 to-blue-900"
                      }`}
                    >
                      <p className="font-bold">{channel.channelName}</p>
                      <p className="text-sm text-gray-400">
                        Balance: ₹{channel.fromBalance} - ₹{channel.toBalance}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <p>No channels available for {selectedType}.</p>
          )}
        </div>
      </div>

      {/* Deposit Amount Section */}
      {selectedChannel && (
        <div className="p-4 mt-4 bg-gray-800 rounded-lg w-full max-w-lg">
          <h1 className="text-lg font-bold mb-4">Deposit Amount</h1>
          <div className="space-y-4">
            <div className="flex items-center bg-gray-700 rounded-md p-3">
              <span className="text-xl font-bold mr-2">₹</span>
              <input
                type="number"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                placeholder="0"
                className="bg-transparent text-white text-xl w-full focus:outline-none"
              />
            </div>
            <p className="text-sm text-gray-400">
              Enter an amount between ₹{selectedChannel.fromBalance} and ₹
              {selectedChannel.toBalance}.
            </p>
          </div>
          <button
            onClick={handleDeposit}
            className="bg-gradient-to-l from-blue-500 to-blue-900 text-white w-full py-3 rounded-lg mt-6 font-bold hover:opacity-90"
          >
            Deposit
          </button>
        </div>
      )}

      {/* QR Modal */}
      <QRModal
      isOpen={isQRModalOpen}
      onClose={() => setIsQRModalOpen(false)}
      channel={selectedChannel}
      depositAmount={depositAmount}
      walletDetails={walletDetails}
      setDepositAmount={setDepositAmount}
    />


    </div>
  );
};

export default DepositPage;
