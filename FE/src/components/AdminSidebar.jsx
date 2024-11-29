import React from 'react';
import { Link } from 'react-router-dom';
import { FaTimes } from 'react-icons/fa'; // Import close icon

const AdminSidebar = ({ isOpen, onClose }) => {
  return (
    <div
  className={`fixed inset-y-0 left-0 bg-gray-800 shadow-2xl z-50 transform ${
    isOpen ? 'translate-x-0' : '-translate-x-full'
  } transition-transform duration-300 ease-in-out w-36 md:w-52`}
>
      {/* Sidebar Header with Close Button */}
      <div className="flex items-center justify-between py-4 px-4 text-sm md:text-lg font-bold border-b border-gray-700 text-white">
        <span>Admin Panel</span>
        <button
          onClick={onClose}
          className="text-white text-xl focus:outline-none"
        >
          <FaTimes />
        </button>
      </div>

      {/* Sidebar Links */}
      <ul className="mt-4 space-y-2 text-white">
        <li>
          <Link
            to="/admin/dashboard"
            className="block py-2.5 px-4 rounded hover:bg-gray-700 transition"
          >
            Dashboard
          </Link>
        </li>

        <li>
          <Link
            to="/admin/users"
            className="block py-2.5 px-4 rounded hover:bg-gray-700 transition"
          >
            Users
          </Link>
        </li>
        
        <li>
          <Link
            to="/admin/pendingrecharge"
            className="block py-2.5 px-4 rounded hover:bg-gray-700 transition"
          >
            Pending Recharge
          </Link>
        </li>

        <li>
          <Link
            to="/admin/pendingwithdrawl"
            className="block py-2.5 px-4 rounded hover:bg-gray-700 transition"
          >
            Pending Withdrawal
          </Link>
        </li>

        <li>
          <Link
            to="/admin/approvedrecharge"
            className="block py-2.5 px-4 rounded hover:bg-gray-700 transition"
          >
            Recharge (Approved)
          </Link>
        </li>

        <li>
          <Link
            to="/admin/approvedwithdrawl"
            className="block py-2.5 px-4 rounded hover:bg-gray-700 transition"
          >
            Withdrawal (Approved)
          </Link>
        </li>

        <li>
          <Link
            to="/admin/paymentmanage"
            className="block py-2.5 px-4 rounded hover:bg-gray-700 transition"
          >
            Payment Manage
          </Link>
        </li>

      </ul>
    </div>
  );
};

export default AdminSidebar;
