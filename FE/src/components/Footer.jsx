import React from 'react'
import { MdEmail } from 'react-icons/md';
import { MdOutlineAccountBalanceWallet ,  MdOutlineAccountBox , MdDiamond } from "react-icons/md";
import { FaHome, FaCrown, FaGamepad, FaEllipsisH } from 'react-icons/fa';
function Footer() {
  return (
    <div>
        {/* Footer */}
        <footer className="fixed bottom-0 w-full flex justify-around bg-gray-800 py-2">
        <div className="text-center flex flex-col items-center">
          <FaHome className="text-xl" />
          <p className="text-xs">Home</p>
        </div>
        <div className="text-center flex flex-col items-center">
          <FaCrown className="text-xl" />
          <p className="text-xs">Activity</p>
        </div>
        <div className="relative">
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-400 to-teal-500 rounded-full p-3 border-4 border-white">
            <MdDiamond className="text-white text-3xl" />
          </div>
          <p className="mt-8 text-white">Promotion</p>
        </div>
        <div className="text-center flex flex-col items-center">
        <MdOutlineAccountBalanceWallet className="text-xl" />
          <p className="text-xs">Wallet</p>
        </div>
        <div className="text-center flex flex-col items-center">
        < MdOutlineAccountBox className="text-xl" />
          <p className="text-xs">Account</p>
        </div>
      </footer>
    </div>
  )
}

export default Footer
