// components/Sidebar.js
import React from 'react';
import { Link } from 'react-router-dom';

const AdminSidebar = ({ isOpen }) => {
  return (
    <div
      className={`fixed inset-y-0 left-0 bg-gray-800 transform ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } transition-transform duration-300 ease-in-out z-50 w-64`}
    >
      <div className="py-4 px-6 text-xl font-bold border-b border-gray-700">
        Admin Panel
      </div>
      <ul className="mt-4 space-y-2">
        <li>
          <Link
            to="/dashboard"
            className="block py-2.5 px-4 rounded hover:bg-gray-700 transition"
          >
            Dashboard
          </Link>
        </li>
        <li>
          <Link
            to="#"
            className="block py-2.5 px-4 rounded hover:bg-gray-700 transition"
          >
            Wingo
          </Link>
        </li>
        <li>
          <Link
            to="#"
            className="block py-2.5 px-4 rounded hover:bg-gray-700 transition"
          >
            TRX
          </Link>
        </li>
        <li>
          <Link
            to="#"
            className="block py-2.5 px-4 rounded hover:bg-gray-700 transition"
          >
            Member
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default AdminSidebar;
