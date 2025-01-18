import React, { useEffect, useState } from "react";
import socket from "../socket";

const UserStats4 = () => {
  const [stats, setStats] = useState({
    numbers: Array(10).fill(0),
    colors: { RED: 0, GREEN: 0, VIOLET: 0 },
    size: { Big: 0, Small: 0 },
    totalAmount: {
      numbers: Array(10).fill(0),
      colors: { RED: 0, GREEN: 0, VIOLET: 0 },
      size: { Big: 0, Small: 0 },
    },
    totalGameAmount: 0, // Initialize total game amount
    uniqueUsersCount: 0, // Initialize unique users count
  });


  useEffect(() => {
    socket.on("bettingStats4", (updatedStats) => {
      setStats(updatedStats);
    });

    return () => {
      socket.off("bettingStats4");
    };
  }, []);

  return (
    <div className="bg-gray-700 text-white min-h-screen p-6 space-y-6">
      <h1 className="text-center text-2xl font-bold">User Statistics</h1>
      {/* Total Game Amount */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-6">
      <div className="p-4 rounded-lg shadow-lg text-center bg-indigo-600">
        <h2 className="text-xl font-semibold">Total Game Amount</h2>
        <p className="text-gold text-2xl font-bold">{stats.totalGameAmount}/-</p>
      </div>
        {/* Unique Users Playing */}
        <div className="p-4 rounded-lg shadow-lg text-center bg-teal-600">
        <h2 className="text-xl font-semibold">Users Playing Currently</h2>
        <p className="text-white text-2xl font-bold">{stats.uniqueUsersCount} Users</p>
      </div>
      </div>
      {/* Color Stats */}
      <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-6">
        {Object.entries(stats.colors).map(([color, count]) => (
          <div
            key={color}
            className={`p-4 rounded-lg shadow-lg text-center ${
              color === "RED" ? "bg-darkRed" : color === "GREEN" ? "bg-green-700" : "bg-violet"
            }`}
          >
            <h2 className="text-xl font-semibold">{color}</h2>
            <p>{count} Bets</p>
            <p
              className={`${
                stats.totalAmount.colors[color] > 0 ? "text-gold" : ""
              }`}
            >
              {stats.totalAmount.colors[color]}/-
            </p>
          </div>
        ))}
      </div>

      {/* Number Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-5 gap-6">
        {stats.numbers.map((count, index) => (
          <div key={index} className="bg-gray-800 p-2  rounded-lg shadow-lg text-center">
            <h2 className="text-sm md:text-xl font-semibold">Number {index}</h2>
            <p>{count} Bets</p>
            <p
              className={`${
                stats.totalAmount.numbers[index] > 0 ? "text-gold" : ""
              }`}
            >
              {stats.totalAmount.numbers[index]}/-
            </p>
          </div>
        ))}
      </div>

      {/* Size Stats */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {Object.entries(stats.size).map(([size, count]) => (
          <div
            key={size}
            className={`p-4 rounded-lg shadow-lg text-center ${
              size === "Big" ? "bg-blue-500" : "bg-yellow-600"
            }`}
          >
            <h2 className="text-xl font-semibold">{size}</h2>
            <p>{count} Bets</p>
            <p
              className={`${
                stats.totalAmount.size[size] > 0 ? "text-gold" : ""
              }`}
            >
              {stats.totalAmount.size[size]}/-
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserStats4;
