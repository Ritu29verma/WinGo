import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

const WithdrawalHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const location = useLocation();
  const walletNo = location.state?.walletNo;

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
    <div className="p-5 bg-gray-700 h-screen">
      <h1 className="text-2xl font-bold mb-5 text-center text-gray-100">
        Withdrawal History
      </h1>
      {history.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-gray-800 text-white rounded-lg">
            <thead>
              <tr className="bg-gray-500">
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
            <tbody>
              {history.map((item) => (
                <tr
                  key={item._id}
                  className="border-t border-gray-600 hover:bg-gray-600 text-center"
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
                      className={`px-3 py-1 rounded text-sm ${
                        item.status === "approved"
                          ? "bg-green-500"
                          : item.status === "pending"
                          ? "bg-yellow-500"
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
        <p className="text-center text-gray-500">
          No withdrawal history available.
        </p>
      )}
    </div>
  );
};

export default WithdrawalHistory;
