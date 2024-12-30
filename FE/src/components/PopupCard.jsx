import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import socket from "../socket";

const PopupCard = ({ isOpen, onClose, content, color }) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedBalance, setSelectedBalance] = useState(null);
  const [selectedMultiplier, setSelectedMultiplier] = useState(null); 
  const [isChecked, setIsChecked] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setQuantity(1);
      setSelectedBalance(null); 
      setSelectedMultiplier(null); 
    }
  }, [isOpen]);

  const handleBalanceClick = (value) => {
    setQuantity(value); 
    setSelectedBalance(value); 
  };

  const handleMultiplierClick = (multiplier) => {
    setQuantity((prevQuantity) => prevQuantity * multiplier); 
    setSelectedMultiplier(multiplier);
  };

  const handleQuantityChange = (change) => {
    setQuantity((prevQuantity) => Math.max(1, prevQuantity + change));
  };

  const handlePlaceBet = () => {
    const userId = localStorage.getItem("user_id");
    const data = { userId, content, purchaseAmount: quantity };

    socket.emit("userBet", data, (response) => {
      if (response.success) {
        toast.success("Bet placed successfully");
      } else {
        toast.error("Failed to place bet", response.message);
      }
    });

    onClose();
  };

  const handleCheckboxChange = (e) => {
    setIsChecked(e.target.checked);
  };

  return (
    <div>
      <ToastContainer />
      {isOpen && (
       <div className="fixed inset-0 bg-black bg-opacity-50 z-10 flex items-end md:items-center justify-center">
       <div
         className="w-full md:max-w-md max-w-sm rounded-t-lg md:rounded-lg shadow-lg"
         style={{ backgroundColor: "#151621" }}
       >
         <div
           className="py-4 text-center text-2xl sm:text-xl"
           style={
             color === "red-violet"
               ? { background: "linear-gradient(150deg, red 50%, #9400D3 50%)" }
               : color === "green-violet"
               ? { background: "linear-gradient(150deg, green 50%, #9400D3 50%)" }
               : { backgroundColor: color }
           }
         >
           <h2 className="font-bold text-2xl sm:text-xl">WinGo 30s</h2>
           <div className="mt-4">
             <div className="w-5/6 mx-auto px-3 py-3 bg-white text-black text-center rounded-lg">
               SELECT {content}
             </div>
           </div>
         </div>
         <div className="bg-customBlue p-4 sm:p-3">
           <div className="mt-10 sm:mt-4">
             <div className="flex justify-between items-center mb-4 sm:mb-3">
               <span className="font-bold text-xs md:text-lg text-white">Balance</span>
               <div className="flex gap-2">
                 {[1, 10, 100, 1000].map((value) => (
                   <button
                     key={value}
                     className={`px-3 py-1 text-white text-xs md:text-lg sm:px-2 sm:py-1 rounded-lg ${
                       selectedBalance === value ? "text-white" : "bg-black"
                     }`}
                     style={{
                       backgroundColor:
                         selectedBalance === value ? color : "black",
                       transition: "background-color",
                     }}
                     onMouseEnter={(e) =>
                       selectedBalance !== value &&
                       (e.target.style.backgroundColor = color)
                     }
                     onMouseLeave={(e) =>
                       selectedBalance !== value &&
                       (e.target.style.backgroundColor = "black")
                     }
                     onClick={() => handleBalanceClick(value)}
                   >
                     {value}
                   </button>
                 ))}
               </div>
             </div>
             <div className="flex justify-between items-center mb-4 sm:mb-3">
               <span className="font-bold text-xs md:text-lg text-white">Quantity</span>
               <div className="flex items-center">
                 <button
                   className="bg-gray-700 text-white px-3 py-1 sm:px-2 sm:py-1 rounded-l-lg hover:bg-gray-600"
                   onClick={() => handleQuantityChange(-1)}
                 >
                   -
                 </button>
                 <input
                   type="text"
                   value={quantity}
                   readOnly
                   className="w-16 sm:w-12 text-white text-center bg-gray-800 border-none focus:outline-none"
                 />
                 <button
                   className="bg-gray-700 text-white px-3 py-1 sm:px-2 sm:py-1 rounded-r-lg hover:bg-gray-600"
                   onClick={() => handleQuantityChange(1)}
                 >
                   +
                 </button>
               </div>
             </div>
             <div className="flex justify-between items-center ">
               <span className="font-bold text-xs md:text-lg text-white">Multiplier</span>
               <div className="flex gap-1">
                 {["X1", "X5", "X10", "X20", "X50", "X100"].map((multiplier) => (
                   <button
                     key={multiplier}
                     className={`px-3 py-1 text-white text-xs md:text-lg sm:px-2 sm:py-1 rounded-lg ${
                       selectedMultiplier === parseInt(multiplier.slice(1))
                         ? "text-white"
                         : "bg-black"
                     }`}
                     style={{
                       backgroundColor:
                         selectedMultiplier === parseInt(multiplier.slice(1))
                           ? color
                           : "black",
                       transition: "background-color",
                     }}
                     onMouseEnter={(e) =>
                       selectedMultiplier !== parseInt(multiplier.slice(1)) &&
                       (e.target.style.backgroundColor = color)
                     }
                     onMouseLeave={(e) =>
                       selectedMultiplier !== parseInt(multiplier.slice(1)) &&
                       (e.target.style.backgroundColor = "black")
                     }
                     onClick={() =>
                       handleMultiplierClick(parseInt(multiplier.slice(1)))
                     }
                   >
                     {multiplier}
                   </button>
                 ))}
               </div>
             </div>
           </div>
           <div className="mt-6">
             <div className="flex items-center mb-4">
               <input
                 type="checkbox"
                 id="agree"
                 className="w-5 h-5 text-green-600 bg-gray-800 border-gray-700 rounded focus:ring-0"
                 checked={isChecked}
                 onChange={handleCheckboxChange}
               />
               <label htmlFor="agree" className="ml-2 text-sm text-white">
                 I agree <span className="text-red-500">Pre-sale rules</span>
               </label>
             </div>
           </div>
         </div>
         <div className="flex justify-between bg-gray-900 items-center">
           <button onClick={onClose} className="text-white md:px-20 px-16  py-5 hover:bg-gray-800">
             Cancel
           </button>
           <button
             onClick={handlePlaceBet}
             className="px-14 py-2"
             style={{
               backgroundColor:
                 color === "red-violet"
                   ? "red"
                   : color === "green-violet"
                   ? "green"
                   : color,
             }}
           >
             Total amount ₹{quantity.toFixed(2)}
           </button>
         </div>
       </div>
     </div>
     
      )}
    </div>
  );
};

export default PopupCard;
