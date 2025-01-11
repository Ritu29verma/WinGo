import React, { useEffect, useState } from "react";
import AdminNavbar from "../components/AdminNavbar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "../components/Loader";
const NonPendingWithdrawalsTable = () => {
  const [withdrawals, setWithdrawals] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchNonPendingWithdrawals = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/admin/non-pending-withdrawals`
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

  useEffect(() => {
    fetchNonPendingWithdrawals();
  }, []);

  return (
  <AdminNavbar>
  <div className="p-4 bg-gray-700 min-h-screen relative">
    {isLoading ? (
      <div className="absolute inset-0 flex items-center justify-center bg-gray-700">
        <Loader />
      </div>
    ) : (
      <>
        <h2 className="md:text-2xl text-lg font-bold mb-5 text-center text-gray-100">
          Withdrawal Requests
        </h2>
        {withdrawals.length === 0 ? (
          <p className="text-center text-gray-500">No non-pending withdrawals found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-gray-800 text-white">
              <thead>
                <tr className="bg-gray-500">
                  <th className="px-2 py-2 text-center">Order ID</th>
                  <th className="px-2 py-2 text-center">Wallet No</th>
                  <th className="px-2 py-2 text-center">Type</th>
                  <th className="px-2 py-2 text-center">Bank Name</th>
                  <th className="px-2 py-2 text-center">Account No</th>
                  <th className="px-2 py-2 text-center">IFSC</th>
                  <th className="px-2 py-2 text-center">Cardholder Name</th>
                  <th className="px-2 py-2 text-center">Amount</th>
                  <th className="px-2 py-2 text-center">Date</th>
                  <th className="px-2 py-2 text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {withdrawals.map((withdrawal, index) => (
                  <tr key={index} className="border-t border-gray-600 text-center">
                    <td className="px-2 py-2">{withdrawal.id}</td>
                    <td className="px-2 py-2">{withdrawal.walletNo}</td>
                    <td className="px-2 py-2">{withdrawal.type}</td>
                    <td className="px-2 py-2">{withdrawal.bankName}</td>
                    <td className="px-2 py-2">{withdrawal.accountNo}</td>
                    <td className="px-2 py-2">{withdrawal.ifscCode}</td>
                    <td className="px-2 py-2">{withdrawal.cardHolderName}</td>
                    <td className="px-2 py-2">₹{withdrawal.amount}</td>
                    <td className="px-2 py-2">
                      {new Date(withdrawal.date).toLocaleString()}
                    </td>
                    <td className="px-2 py-2">
                      {withdrawal.status === "approved" ? (
                        <span className="bg-green-500 text-white px-3 py-1 rounded-md">
                          Approved
                        </span>
                      ) : withdrawal.status === "rejected" ? (
                        <span className="bg-red text-white px-3 py-1 rounded-md">
                          Rejected
                        </span>
                      ) : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <ToastContainer />
      </>
    )}
  </div>
</AdminNavbar>

  );
};

export default NonPendingWithdrawalsTable;
