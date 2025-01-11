import React, { useEffect, useState } from "react";
import AdminNavbar from "./AdminNavbar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
const UsersTable = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const handleRowClick = (userId,phone) => {
    navigate(`/user-game-history/${userId}`,{ state: { phone }});
  };
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
      if (data.success) {
        setUsers(data.users); // Assuming users array is in `data.users`
      } else {
        throw new Error(data.message || "Failed to fetch users.");
      }
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
  <div className="p-5 bg-gray-700 min-h-screen relative">
    {isLoading ? (
      <div className="absolute inset-0 flex items-center justify-center bg-gray-700">
        <Loader />
      </div>
    ) : users.length === 0 ? (
      <p className="text-center text-gray-500">No users found.</p>
    ) : (
      <div className="overflow-x-auto">
        <h2 className="md:text-2xl text-lg font-bold mb-5 text-center text-gray-100">
          Users List
        </h2>
        <table className="min-w-full bg-gray-800 text-white">
          <thead>
            <tr className="bg-gray-500">
              <th className="px-2 py-2 text-center">Sn.</th>
              <th className="px-2 py-2 text-center">Phone</th>
              <th className="px-2 py-2 text-center">Wallet No</th>
              <th className="px-2 py-2 text-center">Total Balance</th>
              <th className="px-2 py-2 text-center">Win Amount</th>
              <th className="px-2 py-2 text-center">Loss Amount</th>
              <th className="px-2 py-2 text-center">Date of Registration</th>
              <th className="px-2 py-2 text-center">Invite Code</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr
                key={index}
                onClick={() => handleRowClick(user._id, user.phoneNo)}
                className="cursor-pointer hover:bg-gray-600 border-t border-gray-600 text-center"
              >
                <td className="px-2 py-2">{user.serialNo}</td>
                <td className="px-2 py-2">{user.phoneNo}</td>
                <td className="px-2 py-2">{user.walletNo}</td>
                <td className="px-2 py-2">
                  ₹{parseFloat(user.totalAmount).toFixed(2)}/-
                </td>
                <td className="px-2 py-2">
                  ₹{parseFloat(user.totalWinAmount || 0).toFixed(2)}/-
                </td>
                <td className="px-2 py-2">
                  ₹{parseFloat(user.totalLossAmount || 0).toFixed(2)}/-
                </td>
                <td className="px-2 py-2">
                  {new Date(user.dateOfRegistration).toLocaleDateString()}
                </td>
                <td className="px-2 py-2">
                  {user.inviteCode || "N/A"}
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

export default UsersTable;
