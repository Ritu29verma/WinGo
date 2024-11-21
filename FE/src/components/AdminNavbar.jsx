import React, { useState } from "react";
import { FaBars } from "react-icons/fa"; // Menu icon
import AdminSidebar from "./AdminSidebar";

const AdminNavbar = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div
        className={`bg-gray-800 text-white fixed h-full z-50 transition-all duration-300 ease-in-out 
          ${
          isSidebarOpen ? "md:w-48" : "md:w-0"
        }
        `}
      >
        <AdminSidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
      </div>

      {/* Main Content */}
      <div
        className={`flex-1 ml-0 transition-all duration-300 ease-in-out ${
          isSidebarOpen ? "md:ml-48" : "md:ml-0"
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
          <h1 className="text-lg font-bold">Dashboard V5</h1>
          <div className="flex items-center space-x-4">
            <img
              src="https://via.placeholder.com/30"
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
