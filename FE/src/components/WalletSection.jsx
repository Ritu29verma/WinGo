import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import socket from "../socket";
const WalletSection = ({ token }) => {
  const [walletDetails, setWalletDetails] = useState({ walletNo: "", totalAmount: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const syncWallets = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/auth/sync-wallets`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Sync Wallets Response:", response.data);
    } catch (error) {
      console.error("Error syncing wallets:", error.response?.data || error.message);
    }
  };

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
      setError(null); 
    } catch (err) {
      console.error("Error fetching wallet details:", err);
      setError("Failed to fetch wallet details");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const handleBetResult = (data) => {
      syncWallets();
      fetchWalletDetails();

    };
  
    socket.on("betResults", handleBetResult);
  
    return () => {
      socket.off("betResults", handleBetResult);
    };
  }, []);

  // Initial fetch of wallet details
  useEffect(() => {
    syncWallets();
    fetchWalletDetails();

  }, []);
  useEffect(() => {
    const handleWalletUpdated = (data) => {
      if (data.walletNo === walletDetails.walletNo) {
        setWalletDetails((prev) => ({
          ...prev,
          totalAmount: data.totalAmount,
        }));
        syncWallets();
      }
      
    };

    socket.on("walletUpdated", handleWalletUpdated);

    return () => {
      socket.off("walletUpdated", handleWalletUpdated); // Cleanup on unmount
    };
  }, [walletDetails.walletNo]);
  const handleDeposit = () => {
    navigate("/wingo/deposit");
  };

  const handleWithdraw = () => {
    navigate("/wingo/withdraw");
  };
  

  useEffect(() => {
    const handleWalletUpdate = (data) => {
      console.log("Wallet updated:", data);
      if (data.walletDetails) {
        setWalletDetails(data.walletDetails);
        syncWallets();
      }
      
    };
    socket.on("walletUpdate", handleWalletUpdate);
  
    return () => {
      socket.off("walletUpdate", handleWalletUpdate); 
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
        <div className="flex flex-col md:flex-row justify-center items-center">
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
          {/* <div className="flex space-x-2">
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
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default WalletSection;
