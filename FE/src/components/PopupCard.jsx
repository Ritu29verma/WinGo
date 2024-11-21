import React, { useState , useEffect } from "react";
import classNames from 'classnames';
const PopupCard = ({ isOpen, onClose, content, color }) => {
  const [quantity, setQuantity] = useState(1); 
  const [balance, setBalance] = useState(1); 

  useEffect(() => {
    if (isOpen) {
      setQuantity(1);  
      setBalance(1);  
    }
  }, [isOpen]);

  const handleBalanceClick = (value) => {
    setBalance(value); 
    setQuantity(value); 
  };

  const handleQuantityChange = (change) => {
    setQuantity(prevQuantity => {
      const newQuantity = prevQuantity + change;
      if (newQuantity > 0) {
        return newQuantity;
      }
      return prevQuantity;
    });
  };

  const handleMultiplierClick = (multiplier) => {
    setQuantity(prevQuantity => {
      const newQuantity = prevQuantity * multiplier;
      return newQuantity;
    });
  };


  return (
    <div className=" ">
       
      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          {/* Card */}
        
          <div
            className="text-white w-full max-w-md rounded-lg shadow-lg"
            style={{ backgroundColor: "#151621" }} 
          >
            {/* Header */}
            <div
              className="py-4 rounded-t-lg text-center text-2xl"
              style={
                color === "red-violet"
                  ? { background: "linear-gradient(150deg, red 50%, #9400D3 50%)" }
                  : color === "green-violet"
                  ? { background: "linear-gradient(150deg, green 50%, #9400D3 50%)" }
                  : { backgroundColor: color } 
              }
            >
              <h2 className="text-2xl font-bold text-white text-center">
         
                WinGo 30s
              </h2>

            {/* Select Box */}
            <div className="mt-4">
              <div
                className="w-5/6 justify-self-center px-3 py-3 bg-white text-black text-center rounded-lg focus:outline-none"
              >
               SELECT {content}
              </div>
            </div>
            </div>
           <div className="bg-customBlue p-4 ">
             {/* Balance and Quantity Section */}
             <div className="mt-10">
              <div className="flex justify-between items-center mb-4">
                <span className="font-bold">Balance</span>
                <div className="flex gap-2">
                  {[1, 10, 100, 1000].map((value) => (
                  <button
                  key={value}
                  className={`px-3 py-1 rounded-lg`}
                  style={{
                    backgroundColor: "black",
                    transition: 'background-color',
                  }}
                  onMouseEnter={(e) => (e.target.style.backgroundColor = color)}
                  onMouseLeave={(e) => (e.target.style.backgroundColor = "black")}
                  onClick={() => handleBalanceClick(value)}  
                >
                  {value}
                </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center mb-4">
                <span className="font-bold">Quantity</span>
                <div className="flex items-center">
                  <button className="bg-gray-700 px-3 py-1 rounded-l-lg hover:bg-gray-600"
                      onClick={() => handleQuantityChange(-1)}  >
                    -
                  </button>
                  <input
                    type="text"
                    value={quantity}
                    readOnly
                    className="w-16 text-center bg-gray-800 border-none focus:outline-none"
                  />
                  <button className="bg-gray-700 px-3 py-1 rounded-r-lg hover:bg-gray-600"
                    onClick={() => handleQuantityChange(1)}>
                    +
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="font-bold">Multiplier</span>
                <div className="flex gap-2">
                  {["X1", "X5", "X10", "X20", "X50", "X100"].map((multiplier) => (
                    <button
                      key={multiplier}
                      className={`px-3 py-1 rounded-lg`}
                  style={{
                    backgroundColor: "black",
                    transition: 'background-color',
                  }}
                  onMouseEnter={(e) => (e.target.style.backgroundColor = color)}
                  onMouseLeave={(e) => (e.target.style.backgroundColor = "black")}
                  onClick={() => handleMultiplierClick(parseInt(multiplier.slice(1)))} 
                    >
                      {multiplier}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Checkbox and Footer */}
           {/* Checkbox and Footer */}
<div className="mt-6">
  <div className="flex items-center mb-4">
    <input
      type="checkbox"
      id="agree"
      className="w-5 h-5 text-green-600 bg-gray-800 border-gray-700 rounded focus:ring-0"
    />
    <label htmlFor="agree" className="ml-2 text-sm">
      I agree <span className="text-red-500">Pre-sale rules</span>
    </label>
  </div>
  </div>
  </div>
  {/* Footer buttons */}
  <div className="flex justify-between bg-gray-900 items-center">
    <button
      onClick={onClose}
      className=" px-20 py-5 hover:bg-gray-800"
    >
      Cancel
    </button>
    <button
      className="px-14 py-2"
      style={{
        backgroundColor:
          color === "red-violet"
            ? "red"
            : color === "green-violet"
            ? "green"
            : color, // Use exact value for other cases
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
