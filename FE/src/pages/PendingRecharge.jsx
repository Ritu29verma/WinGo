import React, { useEffect, useState } from "react";
import AdminNavbar from "../components/AdminNavbar";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const RechargeTransactionsTable = () => {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchTransactions = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Authentication token missing. Please log in.");
        return;
      }

      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/admin/get-recharge?status=pending`
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch transactions.");
      }

      const data = await response.json();
      setTransactions(data.data || []);
    } catch (error) {
      toast.error(error.message || "An error occurred while fetching data.");
    } finally {
      setIsLoading(false);
    }
  };

  const approveTransaction = async (transactionId) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/admin/approve-recharge`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ transactionId }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to approve transaction.");
      }

      const data = await response.json();
      toast.success(data.message || "Transaction approved successfully.");
      fetchTransactions(); // Refresh transactions
    } catch (error) {
      toast.error(error.message || "An error occurred while approving.");
    }
  };

  const rejectTransaction = async (transactionId) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/admin/reject-recharge`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ transactionId }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to reject transaction.");
      }

      const data = await response.json();
      toast.success(data.message || "Transaction rejected successfully.");
      fetchTransactions(); // Refresh transactions
    } catch (error) {
      toast.error(error.message || "An error occurred while rejecting.");
    }
  };


  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <AdminNavbar>
      <div className="p-5 bg-gray-700 h-screen">
        <h2 className="text-2xl font-bold mb-5 text-center text-gray-100">Pending Recharge Requests</h2>
        {isLoading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : transactions.length === 0 ? (
          <p className="text-center text-gray-500">No pending transactions found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-gray-800 text-white">
              <thead>
                <tr className="bg-gray-500">
                  <th className="px-4 py-2 text-center">Order ID</th>
                  <th className="px-4 py-2 text-center">Wallet No</th>
                  <th className="px-4 py-2 text-center">UTR</th>
                  <th className="px-4 py-2 text-center">Amount</th>
                  <th className="px-4 py-2 text-center">Payment Type</th>
                  <th className="px-4 py-2 text-center">Time</th>
                  <th className="px-4 py-2 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction, index) => (
                  <tr key={index} className="border-t border-gray-600 text-center">
                    <td className="px-4 py-2">{transaction.id}</td>
                    <td className="px-4 py-2">{transaction.walletNo}</td>
                    <td className="px-4 py-2">{transaction.utr}</td>
                    <td className="px-4 py-2">₹{transaction.amount}</td>
                    <td className="px-4 py-2">{transaction.paymentType}</td>
                    <td className="px-4 py-2">
                      {new Date(transaction.time).toLocaleString()}
                    </td>
                    <td className="px-4 py-2">
                      <button
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded mr-2"
                        onClick={() => approveTransaction(transaction.id)}
                      >
                        Approve
                      </button>
                      <button
                        className="bg-red hover:bg-darkRed text-white px-3 py-1 rounded"
                        onClick={() => rejectTransaction(transaction.id)}
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
  );
};

export default RechargeTransactionsTable;
