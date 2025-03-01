import React, { useState,useEffect} from "react";
import { FaBars } from "react-icons/fa"; 
import AdminSidebar from "./AdminSidebar";
import { useNavigate } from 'react-router-dom';
import socket from "../socket";
const AdminNavbar = ({ children, logout }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [balance, setBalance] = useState(0);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/admin/get-wallet`);
        const data = await response.json();
        setBalance(data.balance);
      } catch (error) {
        console.error("Error fetching balance:", error);
      }
    };
    fetchBalance();


    // Listen for real-time updates
    socket.on("adminWalletUpdate", (newBalance) => {
      setBalance(newBalance); // Update the balance in real-time
    });

    return () => {
      socket.off("adminWalletUpdate"); // Clean up listener on unmount
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("isAdmin");
    localStorage.removeItem("admin_id");
    navigate("/admin/login");
    // window.location.href="https://goldencma.com"
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div
        className={`bg-gray-800 text-white fixed h-full z-50 transition-all duration-300 ease-in-out 
          ${
          isSidebarOpen ? "md:w-52" : "md:w-0"
        }
        `}
      >
        <AdminSidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
      </div>

      {/* Main Content */}
      <div
        className={`flex-1 ml-0 transition-all duration-300 ease-in-out ${
          isSidebarOpen ? "md:ml-52" : "md:ml-0"
        }`}
      >
        {/* Top Bar */}
        <div className="bg-gray-800 flex items-center justify-between p-4 text-white">
          {/* Menu Button */}
          <button
            onClick={toggleSidebar}
            className="text-white text-2xl focus:outline-none"
          >
            <FaBars />
          </button>
          <h1 className="text-lg font-bold">Dashboard</h1>
        
          <div className="flex items-center space-x-4">
          <span className="text-yellow-400 font-bold">Balance: ₹{balance}</span>
          <button onClick={handleLogout} className="bg-orange-500 text-white hover:bg-white hover:text-orange-500 transform transition-transform hover:scale-95 font-bold px-4 py-1 rounded">
            Logout
          </button>
            <img
              src="https://www.shutterstock.com/image-vector/user-account-avatar-icon-pictogram-600nw-1860375778.jpg"
              alt="Profile"
              className="w-8 h-8 rounded-full"
            />
            <span>Admin</span>
          </div>
        </div>

        {/* Dashboard Content */}
        {React.cloneElement(children, { isSidebarOpen })}
      </div>
    </div>
  );
};

export default AdminNavbar;
