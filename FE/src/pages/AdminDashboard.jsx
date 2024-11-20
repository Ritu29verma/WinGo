// pages/Dashboard.js
import React from 'react';
import AdminNavbar from '../components/AdminNavbar';

const AdminDashboard = () => {
  return (<>
  
    <AdminNavbar/>
    <div className="bg-gray-700 text-white min-h-screen p-6">
        
      {/* Wingo Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-orange-500 rounded-lg p-4 text-center font-bold">1M WINGO 1 MIN</div>
        <div className="bg-orange-500 rounded-lg p-4 text-center font-bold">3M WINGO 3 MIN</div>
        <div className="bg-orange-500 rounded-lg p-4 text-center font-bold">5M WINGO 5 MIN</div>
        <div className="bg-orange-500 rounded-lg p-4 text-center font-bold">10S WINGO 30S</div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-red rounded-lg p-4 text-center font-bold">JOIN RED</div>
        <div className="bg-violet rounded-lg p-4 text-center font-bold">JOIN VIOLET</div>
        <div className="bg-green rounded-lg p-4 text-center font-bold">JOIN GREEN</div>
        <div className="bg-teal-500 rounded-lg p-4 text-center font-bold">TOTAL AMOUNT</div>
      </div>

      {/* Numbered Grid */}
      <div className="grid grid-cols-5 gap-4">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="bg-gray-800 rounded-lg p-4 text-center font-bold text-xl"
          >
            {i === 9 ? "B" : i === 8 ? "S" : i}
          </div>
        ))}
      </div>
    </div>
    </>
  );
};

export default AdminDashboard;
