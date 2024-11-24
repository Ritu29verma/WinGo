import React, { useEffect, useState } from "react";
import AdminNavbar from "../components/AdminNavbar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const DepositHistory = () => {
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

      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/auth/get-user-transactions`,
        {
          headers: { Authorization: `${token}` },
        }
      );

      setTransactions(response.data.transactions || []);
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to fetch transactions.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (

      <div className="p-5 bg-gray-700 h-screen">
        <h2 className="text-2xl font-bold mb-5 text-center text-gray-100">
          Deposit History
        </h2>
        {isLoading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : transactions.length === 0 ? (
          <p className="text-center text-gray-500">No deposit transactions found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-gray-800 text-white">
              <thead>
                <tr className="bg-gray-500">
                  <th className="px-4 py-2 text-center">Order ID</th>
                  <th className="px-4 py-2 text-center">Payment Type</th>
                  <th className="px-4 py-2 text-center">UTR</th>
                  <th className="px-4 py-2 text-center">Amount</th>
                  <th className="px-4 py-2 text-center">Time</th>
                  <th className="px-4 py-2 text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr
                    key={transaction._id}
                    className="border-t border-gray-600 text-center"
                  >
                    <td className="px-4 py-2">{transaction._id}</td>
                    <td className="px-4 py-2">{transaction.paymentType}</td>
                    <td className="px-4 py-2">{transaction.utr}</td>
                    <td className="px-4 py-2">₹{transaction.amount}</td>
                    <td className="px-4 py-2">
                      {new Date(transaction.time).toLocaleString()}
                    </td>
                    <td className="px-4 py-2">
                      <span
                        className={`px-3 py-1 rounded text-sm ${
                          transaction.status === "approved"
                            ? "bg-green-500"
                            : transaction.status === "pending"
                            ? "bg-yellow-500"
                            : "bg-red"
                        } text-white`}
                      >
                        {transaction.status.charAt(0).toUpperCase() +
                          transaction.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <ToastContainer />
      </div>

  );
};

export default DepositHistory;
