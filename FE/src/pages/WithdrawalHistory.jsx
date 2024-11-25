import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header"
import { IoArrowBackCircleOutline } from "react-icons/io5";

const WithdrawalHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const location = useLocation();
  const walletNo = location.state?.walletNo;
  const navigate = useNavigate();
  useEffect(() => {
    if (walletNo) {
      axios
        .get(`${import.meta.env.VITE_BASE_URL}/auth/get-user-withdrawals`, {
          params: { walletNo },
        })
        .then((response) => {
          if (response.data && response.data.withdrawals) {
            setHistory(response.data.withdrawals);
          } else {
            setError("No data found.");
          }
          setLoading(false);
        })
        .catch(() => {
          setError("Failed to fetch withdrawal history.");
          setLoading(false);
        });
    } else {
      setError("Wallet number is missing.");
      setLoading(false);
    }
  }, [walletNo]);

  if (loading) {
    return <p className="text-center text-gray-500">Loading withdrawal history...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-700 to-gray-900 text-gray-100">
    <Header />
{/* Header Section */}
<header className="bg-gray-700 shadow-lg">
  <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
 
    <h1 className="text-3xl font-bold tracking-wide text-yellow-400">
      Withdrawal History
    </h1>
    <button   onClick={() => window.history.back()}
     className="bg-yellow-500 flex text-black font-semibold px-4 py-2 rounded hover:bg-yellow-600">
    <IoArrowBackCircleOutline className="m-1 text-lg" />
      Back 
    </button>
  </div>
</header>

{/* Main Content */}
<div className="container mx-auto p-5">
  {history.length > 0 ? (
    <div className="overflow-x-auto bg-gray-800 shadow-lg rounded-lg">
      <table className="min-w-full bg-gray-800 text-gray-100">
        {/* Table Header */}
        <thead>
          <tr className="bg-gray-700 border-b border-gray-600 text-sm uppercase tracking-wide">
            <th className="py-3 px-4 text-center">Order ID</th>
            <th className="py-3 px-4 text-center">Type</th>
            <th className="py-3 px-4 text-center">Account No</th>
            <th className="py-3 px-4 text-center">Bank Name</th>
            <th className="py-3 px-4 text-center">IFSC Code</th>
            <th className="py-3 px-4 text-center">Card Holder Name</th>
            <th className="py-3 px-4 text-center">Amount</th>
            <th className="py-3 px-4 text-center">Date</th>
            <th className="py-3 px-4 text-center">Status</th>
          </tr>
        </thead>

        {/* Table Body */}
        <tbody>
          {history.map((item) => (
            <tr
              key={item._id}
              className="border-t border-gray-700 hover:bg-gray-700 transition-all text-center text-sm"
            >
              <td className="py-3 px-4">{item._id}</td>
              <td className="py-3 px-4">{item.type}</td>
              <td className="py-3 px-4">{item.accountNo}</td>
              <td className="py-3 px-4">{item.bankName}</td>
              <td className="py-3 px-4">{item.ifscCode}</td>
              <td className="py-3 px-4">{item.cardHolderName}</td>
              <td className="py-3 px-4">₹{item.amount}</td>
              <td className="py-3 px-4">
                {new Date(item.date).toLocaleDateString()}
              </td>
              <td className="py-3 px-4">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium tracking-wide ${
                    item.status === "approved"
                      ? "bg-green-600"
                      : item.status === "pending"
                      ? "bg-yellow-600"
                      : "bg-red"
                  } text-white`}
                >
                  {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ) : (
    <p className="text-center text-gray-300 text-lg mt-8">
      No withdrawal history available.
    </p>
  )}
</div>
</div>
  );
};

export default WithdrawalHistory;
