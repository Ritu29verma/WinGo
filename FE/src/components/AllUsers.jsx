import React, { useEffect, useState } from "react";
import AdminNavbar from "./AdminNavbar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UsersTable = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/admin/get-all-users`
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch user data.");
      }

      const data = await response.json();
      setUsers(data);
    } catch (error) {
      toast.error(error.message || "An error occurred while fetching users.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <AdminNavbar>
      <div className="p-5 bg-gray-700 min-h-screen">
        <h2 className="md:text-2xl text-lg font-bold mb-5 text-center text-gray-100">
          Users List
        </h2>
        {isLoading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : users.length === 0 ? (
          <p className="text-center text-gray-500">No users found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-gray-800 text-white">
              <thead>
                <tr className="bg-gray-500">
                  <th className="px-2 py-2 text-center">User ID</th>
                  <th className="px-2 py-2 text-center">Phone</th>
                  <th className="px-2 py-2 text-center">Wallet No</th>
                  <th className="px-2 py-2 text-center">Total Balance</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr key={index} className="border-t border-gray-600 text-center">
                    <td className="px-2 py-2">{user.userId}</td>
                    <td className="px-2 py-2">
                      {user.countryCode} {user.phoneNo}
                    </td>
                    <td className="px-2 py-2">{user.walletNo}</td>
                    <td className="px-2 py-2"> ₹{parseFloat(user.totalAmount).toFixed(2)}/-</td>
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

export default UsersTable;
