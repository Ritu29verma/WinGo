import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const WithdrawHistoryModal = ({ isOpen, onClose }) => {
  const [withdrawHistory, setWithdrawHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      fetchWithdrawHistory();
    }
  }, [isOpen]);

  const fetchWithdrawHistory = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/admin/get-withdraw-history`);
      if (!response.ok) {
        throw new Error("No withdrawal records exist.");
      }
      const data = await response.json();
      setWithdrawHistory(data);
    } catch (error) {
      toast.error(error.message);
      setWithdrawHistory([]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
      <div className="bg-gray-900 rounded-lg p-5 w-full max-w-md max-h-[85vh] relative overflow-hidden flex flex-col">
        {/* Close Button at Top Right */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 font-bold hover:text-white"
        >
          ✕
        </button>

        <h2 className="text-xl font-bold text-white mb-3 text-center">
          Admin Withdraw History
        </h2>

        {loading ? (
          <p className="text-center text-white">Loading...</p>
        ) : withdrawHistory.length > 0 ? (
            <ul className="space-y-2 overflow-y-auto max-h-[65vh] pr-2 scrollbar-hide">

            {withdrawHistory.map((withdraw) => (
              <li
                key={withdraw._id}
                className="bg-gray-800 p-3 rounded-lg flex flex-col space-y-1"
              >
                <div className="flex flex-row justify-between">
                <span className="text-white font-medium">₹{withdraw.amount}</span>
                <span className="text-blue-400 text-sm">
                
                  📞 {withdraw.adminId?.phoneNo || "N/A"}
                </span>
                </div>
                <span className="text-gray-400 text-sm">
                  {new Date(withdraw.createdAt).toLocaleString()}
                </span>
                
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-400">No withdrawal records exist.</p>
        )}

        <ToastContainer />
      </div>
    </div>
  );
};

export default WithdrawHistoryModal;
