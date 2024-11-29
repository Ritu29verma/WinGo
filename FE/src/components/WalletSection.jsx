import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import socket from "../socket";
const WalletSection = ({ token }) => {
  const [walletDetails, setWalletDetails] = useState({ walletNo: "", totalAmount: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();


  const fetchWalletDetails = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("User is not authenticated. Please log in.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/auth/wallet-details`, {
        headers: { Authorization: `${token}` },
      });
      setWalletDetails(response.data);
      setError(null); // Clear any previous error
    } catch (err) {
      console.error("Error fetching wallet details:", err);
      setError("Failed to fetch wallet details");
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch of wallet details
  useEffect(() => {
    fetchWalletDetails();
  }, []);

  const handleDeposit = () => {
    navigate("/wingo/deposit");
  };

  const handleWithdraw = () => {
    navigate("/wingo/withdraw");
  };
  useEffect(() => {
    const handleBetResult = (data) => {
      console.log("Bet result received:", data);
      fetchWalletDetails();
    };

    socket.on("betResult", handleBetResult);

    // Clean up the listener on unmount
    return () => {
      socket.off("betResult", handleBetResult);
    };
  }, [socket]);

  useEffect(() => {
    const handleWalletUpdate = (data) => {
      console.log("Wallet updated:", data);
      if (data.walletDetails) {
        setWalletDetails(data.walletDetails);
      }
    };
  
    // Listen for wallet updates after placing a bet
    socket.on("walletUpdate", handleWalletUpdate);
  
    return () => {
      socket.off("walletUpdate", handleWalletUpdate); // Cleanup on unmount
    };
  }, []);

  if (loading) {
    return (
      <div className="bg-customBlue w-full max-w-7xl rounded-lg p-6 mb-4 shadow-lg m-3">
        <p className="text-white text-center">Loading wallet details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-customBlue w-full max-w-7xl rounded-lg p-6 mb-4 shadow-lg m-3">
        <p className="text-red-500 text-center">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-customBlue w-full max-w-7xl rounded-lg p-6 mb-4 shadow-lg m-3">
      <div>
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            
            <p className="text-lg font-semibold text-white">Wallet Balance</p>
            <p className="text-xl font-bold flex justify-center text-white">
              ₹{walletDetails.totalAmount.toFixed(2)}
              <button 
            className="text-lg mx-2" 
            onClick={() => window.location.reload()}
          >
            ⟳
          </button>
            </p>
            <p className="text-md font-bold flex justify-center text-white">
              {walletDetails.walletNo}
            </p>
          </div>
          <div className="flex space-x-2">
            <button
              className="bg-red hover:bg-orange-900 text-white px-4 py-2 rounded-lg"
              onClick={handleDeposit}
            >
              Deposit
            </button>
            <button
              className="bg-Green hover:bg-lime-900 text-white px-4 py-2 rounded-lg"
              onClick={handleWithdraw}
            >
              Withdraw
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletSection;
