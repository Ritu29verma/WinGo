import React, { useEffect, useState } from "react";
import AdminNavbar from "../components/AdminNavbar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import Header from "../components/Header";
import { IoArrowBackCircleOutline } from "react-icons/io5";

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

    <div className=" bg-gradient-to-br from-gray-700 to-gray-900 h-screen">
    <Header />
{/* Header */}
<header className="bg-gray-700 shadow-lg">
<div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
  <h1 className="text-3xl font-bold text-yellow-400">Deposit History</h1>
  <button
    onClick={() => window.history.back()}
    className="bg-yellow-500 flex items-center text-black font-semibold px-4 py-2 rounded hover:bg-yellow-600 transition duration-300"
  >
     <IoArrowBackCircleOutline className="m-1 text-lg" />
    Back
  </button>
  </div>
</header>

{/* Content */}
{isLoading ? (
  <p className="text-center text-gray-500">Loading...</p>
) : transactions.length === 0 ? (
  <p className="text-center text-gray-500">
    No deposit transactions found.
  </p>
) : (
  <div className="container mx-auto p-5">
  <div className=" overflow-x-auto bg-gray-800 shadow-lg rounded-lg">
    <table className="min-w-full text-gray-100">
      <thead>
        <tr className="bg-gray-700">
          <th className="px-6 py-3 text-center font-medium">Order ID</th>
          <th className="px-6 py-3 text-center font-medium">Payment Type  </th>
          <th className="px-6 py-3 text-center font-medium">UTR</th>
          <th className="px-6 py-3 text-center font-medium">Amount</th>
          <th className="px-6 py-3 text-center font-medium">Time</th>
          <th className="px-6 py-3 text-center font-medium">Status</th>
        </tr>
      </thead>
      <tbody>
        {transactions.map((transaction) => (
          <tr
            key={transaction._id}
            className="border-t border-gray-700 hover:bg-gray-600 transition duration-300 text-center"
          >
            <td className="px-6 py-3">{transaction._id}</td>
            <td className="px-6 py-3">{transaction.paymentType}</td>
            <td className="px-6 py-3">{transaction.utr}</td>
            <td className="px-6 py-3">₹{transaction.amount}</td>
            <td className="px-6 py-3">
              {new Date(transaction.time).toLocaleString()}
            </td>
            <td className="px-6 py-3">
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
  </div>
)}
<ToastContainer />
</div>

  );
};

export default DepositHistory;
