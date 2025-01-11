import React, { useEffect, useState } from "react";
import AdminNavbar from "../components/AdminNavbar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "../components/Loader";
const PendingWithdrawalsTable = () => {
  const [withdrawals, setWithdrawals] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchWithdrawals = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Authentication token missing. Please log in.");
        return;
      }

      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/admin/pending-withdrawals`
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch withdrawals.");
      }

      const data = await response.json();
      setWithdrawals(data.data || []);
    } catch (error) {
      toast.error(error.message || "An error occurred while fetching data.");
    } finally {
      setIsLoading(false);
    }
  };
  const handleApprove = async (withdrawalId) => {
    try {
  
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/admin/approve-withdrawal`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ withdrawalId }),
        }
      );

      const data = await response.json();
      toast.success(data.message || "Withdrawal approved successfully.");
  
      fetchWithdrawals();
    } catch (error) {
      toast.error(error.message || "An error occurred while approving.");
    }
  };

  const handleReject = async (withdrawalId) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/admin/reject-withdrawal`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ withdrawalId }),
        }
      );
      const data = await response.json();
      toast.success(data.message || "Withdrawal rejected successfully.");
      fetchWithdrawals();
    } catch (error) {
      toast.error(error.message || "An error occurred while rejecting.");
    }
  };
  
  useEffect(() => {
    fetchWithdrawals();
  }, []);

  return (
    <div className="min-h-screen min-w-full relative">
    <AdminNavbar>
      <div className="p-5 bg-gray-700 h-screen">
        <h2 className="text-2xl font-bold mb-5 text-center text-gray-100">
          Pending Withdrawal Requests
        </h2>
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-700">
            <Loader />
          </div>
        ) : withdrawals.length === 0 ? (
          <p className="text-center text-gray-500">No pending withdrawals found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-gray-800 text-white text-xs md:text-sm">
              <thead>
                <tr className="bg-gray-500">
                  <th className="px-4 py-2 text-center">Order ID</th>
                  <th className="px-4 py-2 text-center">Wallet No</th>
                  <th className="px-4 py-2 text-center">Type</th>
                  <th className="px-4 py-2 text-center">Bank Name</th>
                  <th className="px-4 py-2 text-center">Account No</th>
                  <th className="px-4 py-2 text-center">IFSC</th>
                  <th className="px-4 py-2 text-center">Cardholder Name</th>
                  <th className="px-4 py-2 text-center">Amount</th>
                  <th className="px-4 py-2 text-center">Date</th>
                  <th className="px-4 py-2 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {withdrawals.map((withdrawal, index) => (
                  <tr key={index} className="border-t border-gray-600 text-center text-xs md:text-sm">
                    <td className="px-4 py-2">{withdrawal.id}</td>
                    <td className="px-4 py-2">{withdrawal.walletNo}</td>
                    <td className="px-4 py-2">{withdrawal.type}</td>
                    <td className="px-4 py-2">{withdrawal.bankName || "N/A"}</td>
                    <td className="px-4 py-2">{withdrawal.accountNo || "N/A"}</td>
                    <td className="px-4 py-2">{withdrawal.ifscCode || "N/A"}</td>
                    <td className="px-4 py-2">{withdrawal.cardHolderName || "N/A"}</td>
                    <td className="px-4 py-2">₹{withdrawal.amount}</td>
                    <td className="px-4 py-2">
                      {new Date(withdrawal.date).toLocaleString()}
                    </td>
                    <td className="px-4 py-2 flex items-center justify-center gap-2">
                      <button
                        className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded text-xs md:text-sm"
                        onClick={() => handleApprove(withdrawal.id)}
                      >
                        Approve
                      </button>
                      <button
                        className="bg-red hover:bg-darkRed text-white px-2 py-1 rounded text-xs md:text-sm"
                        onClick={() => handleReject(withdrawal.id)}
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <ToastContainer />
      </div>
    </AdminNavbar>
  </div>  
  );
};

export default PendingWithdrawalsTable;
