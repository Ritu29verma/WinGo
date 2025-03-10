import React, { useEffect, useState } from "react";
import AdminNavbar from "../components/AdminNavbar";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Loader from "../components/Loader";

const NonPendingTransactionsTable = () => {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchNonPendingTransactions = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/admin/non-pending-transactions`
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

  useEffect(() => {
    fetchNonPendingTransactions();
  }, []);

  return (
    <AdminNavbar>
    <div className="p-5 bg-gray-700 min-h-screen relative">
      {isLoading ? (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-700">
          <Loader />
        </div>
      ) : (
        <>
          <h2 className="md:text-2xl text-lg font-bold mb-5 text-center text-gray-100">
            Recharge Requests
          </h2>
          {transactions.length === 0 ? (
            <p className="text-center text-gray-500">No non-pending transactions found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-gray-800 text-white">
                <thead>
                  <tr className="bg-gray-500">
                    <th className="px-4 py-2 text-center">User</th>
                    <th className="px-4 py-2 text-center">Wallet No</th>
                    <th className="px-4 py-2 text-center">UTR</th>
                    <th className="px-4 py-2 text-center">Amount</th>
                    <th className="px-4 py-2 text-center">Payment Type</th>
                    <th className="px-4 py-2 text-center">Time</th>
                    <th className="px-4 py-2 text-center">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction, index) => (
                    <tr key={index} className="border-t border-gray-600 text-center">
                      <td className="px-4 py-2">{transaction.phoneNo}</td>
                      <td className="px-4 py-2">{transaction.walletNo}</td>
                      <td className="px-4 py-2">{transaction.utr}</td>
                      <td className="px-4 py-2">₹{transaction.amount}</td>
                      <td className="px-4 py-2">{transaction.paymentType}</td>
                      <td className="px-4 py-2">
                        {new Date(transaction.time).toLocaleString()}
                      </td>
                      <td className="px-4 py-2">
                        {transaction.status === "approved" ? (
                          <span className="bg-green-500 text-white px-3 py-1 rounded-md">
                            Success
                          </span>
                        ) : transaction.status === "rejected" ? (
                          <span className="bg-red text-white px-3 py-1 rounded-md">
                            Closed
                          </span>
                        ) : null}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
      <ToastContainer />
    </div>
  </AdminNavbar>
  
  );
};

export default NonPendingTransactionsTable;
