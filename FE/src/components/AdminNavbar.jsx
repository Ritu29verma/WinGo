// components/AdminNavbar.js
import React, { useState } from 'react';
import { FaBars } from 'react-icons/fa'; // Icon for the menu
import Sidebar from './AdminSidebar';

const AdminNavbar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <div className="relative flex bg-gray-900 text-white">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} />

      {/* Top Bar */}
      <div className="flex-1 flex flex-col">
        <div className="bg-gray-800 flex items-center justify-between p-4">
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

        {/* Content (will be replaced by routes) */}
        <div className="p-6 flex-grow bg-gray-700">
          {/* Add children or routes here */}
        </div>
      </div>
    </div>
  );
};

export default AdminNavbar;
