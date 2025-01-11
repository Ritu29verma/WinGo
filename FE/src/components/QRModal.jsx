import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'; 
import Loader from "../components/Loader";


const QRModal = ({ isOpen, onClose, channel, depositAmount, walletDetails, setDepositAmount }) => {
  const [utrNumber, setUtrNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false); 

  const handleDeposit = async () => {
    if (!utrNumber) {
      toast.error("Please enter a UTR number.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Authentication token missing. Please log in.");
        return;
      }

      setIsLoading(true); 

      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/auth/recharge`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json", 
          Authorization: `${token}`, 
        },
        body: JSON.stringify({
          utr: utrNumber,
          paymentType: channel.type,
          amount: depositAmount,
          walletNo: walletDetails.walletNo,
        }),
      });

      if (response.status === 201) {
        
        toast.success("Recharge request sent successfully.");
        
        setTimeout(() => {
            setUtrNumber("");
            setDepositAmount(""); 
            onClose();
          }, 1500);
      } else {
        const errorData = await response.json(); 
        throw new Error(errorData.error || "Failed to submit the deposit. Please try again.");
      }
    } catch (error) {
      toast.error(error.message || "An error occurred. Please try again.");
    } finally {
      setIsLoading(false); 
    }
  };

  if (!isOpen || !channel) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-gray-900 rounded-lg p-5 w-full max-w-md">
        {/* Channel Name */}
        <h2 className="text-xl font-bold text-white mb-3 text-center">
          {channel.channelName}
        </h2>

        {/* Deposit Amount */}
        <div className="text-center bg-gray-800 p-3 rounded-lg mb-5">
          <p className="text-sm text-gray-400">Amount to be Paid:</p>
          <p className="text-2xl font-bold text-green-400">
            ₹{parseFloat(depositAmount).toFixed(2)}
          </p>
        </div>

        <div className="text-white space-y-4">
          {/* QR Code */}
          {channel.qrImage ? (
            <div className="flex justify-center mb-4">
              <img
                src={`${import.meta.env.VITE_BASE_URL}/images/${channel.qrImage}`}
                alt="QR Code"
                className="rounded-lg shadow-md max-w-[180px]"
              />
            </div>
          ) : (
            <p className="text-red-500">QR Code not available.</p>
          )}
          {/* Depositor ID */}
          <div>
            <p className="text-sm text-gray-400">Depositor ID:</p>
            <p className="font-bold">{channel.depositorId}</p>
          </div>

          {/* UTR Input */}
          <div>
            <p className="text-sm text-gray-400">Enter UTR Number:</p>
            <input
              type="text"
              value={utrNumber}
              onChange={(e) => setUtrNumber(e.target.value)}
              placeholder="Input 12-digit here"
              className="bg-gray-800 text-white w-full p-3 rounded-lg mt-2 focus:outline-none"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-4 mt-6">
          <button
            onClick={onClose}
            className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:opacity-80"
          >
            Cancel
          </button>
          <button
            onClick={handleDeposit}
            disabled={isLoading}
            className={`${
              isLoading
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-gradient-to-l from-blue-500 to-blue-900 hover:opacity-80"
            } text-white px-4 py-2 rounded-lg`}
          >
            {isLoading ? "Submitting..." : "Submit"}
          </button>
        </div>
        <ToastContainer />
      </div>
    </div>
  );
};

export default QRModal;
