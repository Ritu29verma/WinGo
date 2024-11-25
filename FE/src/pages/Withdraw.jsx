import React, { useState,useEffect} from "react";
import { FaCreditCard, FaBitcoin, FaPlus, FaHeadset } from "react-icons/fa";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";

const Withdraw = () => {
  const [activeTab, setActiveTab] = useState("Bank Card");
  const [walletDetails, setWalletDetails] = useState({ walletNo: "", totalAmount: 0 });
  const [formData, setFormData] = useState({
    type: "Bank Card",
    accountNo: "",
    cardHolderName: "",
    bankName: "",
    ifscCode: "",
    amount: "",
  });
  const navigate = useNavigate();

  

  useEffect(() => {
    const fetchWalletDetails = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/auth/wallet-details`,
          { headers: { Authorization: `${token}` } }
        );
        setWalletDetails(response.data);
      } catch (err) {
        console.error("Error fetching wallet details:", err);
      }
    };

    fetchWalletDetails();
  }, []);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setFormData({ ...formData, type: tab });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleWithdraw = async () => {
    
    try {
      // Ensure the form data is complete
      if (
        activeTab === "Bank Card" &&
        (!formData.accountNo ||
          !formData.cardHolderName ||
          !formData.bankName ||
          !formData.ifscCode ||
          !formData.amount)
      ) {
        toast.error("Please fill in all the required fields for bank withdrawal.");
        return;
      }

      if (activeTab === "USTD" && !formData.amount) {
        toast.error("Please enter the amount for USTD withdrawal.");
        return;
      }
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/auth/withdraw`,
        {
          type: formData.type,
          accountNo: formData.accountNo,
          cardHolderName: formData.cardHolderName,
          bankName: formData.bankName,
          ifscCode: formData.ifscCode,
          amount: formData.amount,
          walletNo: walletDetails.walletNo
        },
        {
          headers: { Authorization: `${token}` },
        }
      );
      

      if (response.status === 201) {
        toast.success("Withdrawal request submitted successfully.");
        // Optionally, reset the form or navigate to another page
        setFormData({
          type: activeTab,
          accountNo: "",
          cardHolderName: "",
          bankName: "",
          ifscCode: "",
          amount: "",
        });
      } else {
        toast.error("Failed to submit withdrawal request. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting withdrawal request:", error);
      toast.error("An error occurred. Please try again later.");
    }
  };
  const goToWithdrawalHistory = () => {
    navigate("/withdrawal-history", { state: { walletNo: walletDetails.walletNo } });
  };

  return (
    <div>
    <Header isLogout={false} isWingo={false}/> 
    <div className="bg-gray-900 min-h-screen text-white p-4 flex flex-col items-center">
      {/* Header */}
      <div className="flex justify-between items-center w-full px-10 mb-4">
        <h1 className="text-lg font-bold">Withdraw</h1>
        <button onClick={goToWithdrawalHistory} className="text-sm text-blue-400">Withdraw history</button>
      </div>

      {/* Balance Card */}
      <div className="bg-gradient-to-r from-green-400 via-yellow-400 to-green-500 p-6 rounded-lg shadow-md w-full max-w-6xl mt-4 text-white">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold">Available Balance</h2>
          <button 
            className="text-sm" 
            onClick={() => window.location.reload()}
          >
            ⟳
          </button>
        </div>
        <p className="text-4xl font-bold my-4">₹{walletDetails.totalAmount.toFixed(2)}</p>
        <p className="text-right text-gray-200">{walletDetails.walletNo}</p>
      </div>

    <div className="bg-black text-white w-full max-w-7xl rounded-lg p-4 mt-4" >
          {/* Withdrawal Methods */}
      <div className="w-full max-w-7xl mt-6 mb-6 flex justify-center items-center">
      <div className="grid items-center grid-cols-2 gap-4">
          <button
            onClick={() => handleTabChange("Bank Card")}
            className={`flex flex-col items-center justify-center p-4 px-10 md:px-24 rounded-lg text-center font-bold ${
              activeTab === "Bank Card"
                ? "bg-green-500"
                : "bg-customBlue hover:bg-gradient-to-l from-blue-500 to-blue-900"
            }`}
          >
            <FaCreditCard size={24} />
            Bank Card
          </button>
          <button
            onClick={() => handleTabChange("USTD")}
            className={`flex flex-col items-center justify-center p-4 rounded-lg text-center font-bold ${
              activeTab === "USTD"
                ? "bg-green-500"
                : "bg-customBlue hover:bg-gradient-to-l from-blue-500 to-blue-900"
            }`}
          >
            <FaBitcoin size={24} />
            USTD
          </button>
        </div>
      </div>

      {/* Conditional Content */}
      {activeTab === "Bank Card" && (
        <div className="bg-gray-900 w-full max-w-6xl min-h-screen flex flex-col items-center px-4 py-6 text-white">
          

        {/* Add Bank Account */}
        <div className="space-y-6 m-4 w-full max-w-3xl">
  {/* Account Number */}
  <div className="flex items-center justify-between">
  <label className="text-white text-xl w-1/3">Account Number:</label>
    <input
      name="accountNo"
      type="number"
      placeholder="Enter Account Number"
      value={formData.accountNo}
      onChange={handleInputChange}
      className=" text-white w-2/3 bg-gray-600 rounded-md p-3 text-xl focus:outline-none"
    />
  </div>

  {/* Cardholder Name */}
  <div className="flex items-center justify-between ">
    <label className="text-white text-xl w-1/3">Cardholder Name:</label>
    <input
      name="cardHolderName"
      type="text"
      placeholder="Enter Cardholder Name"
      value={formData.cardHolderName}
      onChange={handleInputChange}
      className=" text-white bg-gray-600 rounded-md p-3  text-xl w-2/3 focus:outline-none"
    />
  </div>

  {/* Bank Name */}
  <div className="flex items-center justify-between">
    <label className="text-white text-xl w-1/3">Bank Name:</label>
    <input
      name="bankName"
      type="text"
      placeholder="Enter Bank Name"
      value={formData.bankName}
      onChange={handleInputChange}
      className=" text-white bg-gray-600 rounded-md p-3  text-xl w-2/3 focus:outline-none"
    />
  </div>

  {/* IFSC Code */}
  <div className="flex items-center justify-between ">
    <label className="text-white  text-xl w-1/3">IFSC Code:</label>
    <input
      name="ifscCode"
      type="text"
      placeholder="Enter IFSC Code"
      value={formData.ifscCode}
      onChange={handleInputChange}
      className=" text-white bg-gray-600 rounded-md p-3  text-xl w-2/3 focus:outline-none"
    />
  </div>
</div>


        {/* Beneficiary Warning */}
        <p className="text-red-500 text-center text-sm mt-4">
          Need to add beneficiary information to be able to withdraw money
        </p>

        {/* Withdrawal Form */}
        <div className="bg-gray-800 mt-6 p-6 rounded-lg shadow w-full max-w-3xl">
          <h2 className="text-lg font-bold mb-4">Select amount of USTD</h2>
          {/* Input Section */}
          <div className="space-y-4">
            <div className="flex items-center bg-gray-700 rounded-md p-3">
              <span className="text-xl font-bold mr-2">₹</span>
              <input
              name="amount"
                type="number"
                placeholder="0"
                value={formData.amount}
                onChange={handleInputChange}
                className="bg-transparent text-white text-xl w-full focus:outline-none"
              />
            </div>
          </div>

           {/* Withdrawable Balance */}
           {/* <div className="flex justify-between items-center text-gray-400 text-sm mt-4">
             <p>Withdrawable balance ₹1177.42</p>
             <button className="text-blue-400 font-medium">All</button>
           </div> */}

               {/* Withdraw Button */}
               <button
                onClick={handleWithdraw}
                className="bg-gradient-to-r from-blue-500 to-blue-700 text-white w-full py-3 rounded-lg mt-6 font-bold hover:opacity-90">
             Withdraw
           </button>

          {/* Additional Info */}
          <ul className="text-sm text-gray-400 mt-6 space-y-2">
        <li className="flex items-center">
          <span className="text-blue-500 mr-2">◆</span>
          Need to bet <span className="text-red"> ₹378.00 </span> to be able to withdraw
        </li>
        <li className="flex items-center">
          <span className="text-blue-500 mr-2">◆</span>
          With time <span className="text-red"> 00:00-23:59</span>
        </li>
        <li className="flex items-center">
          <span className="text-blue-500 mr-2">◆</span>
          Inday Remaining Withdrawal Times: <span className="text-blue-400">3</span>
        </li>
        <li className="flex items-center">
          <span className="text-blue-500 mr-2">◆</span>
          Withdrawal amount range: <span className="text-red">₹300.00-₹150,000.00</span>
        </li>
        <li className="flex items-center">
          <span className="text-blue-500 mr-2">◆</span>
          Please confirm your beneficial account information before withdrawing.
        </li>
        <li className="flex items-center">
          <span className="text-blue-500 mr-2">◆</span>
          If your beneficial information is incorrect, please contact customer service.
        </li>
      </ul>
        </div>
      </div>
      )}

      {activeTab === "USTD" && (
       
         <div className="bg-gray-900 min-h-screen w-full max-w-5xl flex flex-col items-center px-4 py-6 text-white">
         

         {/* Contact Service */}
         <div className="bg-gray-800 mt-6 p-4 rounded-lg shadow w-full max-w-2xl flex items-center justify-between">
           <div className="flex items-center">
             <FaHeadset className="text-yellow-500 text-3xl mr-4" />
             <p>Contact customer service Add USTD address</p>
           </div>
         </div>

         {/* Withdrawal Form */}
         <div className="bg-gray-800 mt-6 p-6 rounded-lg shadow w-full max-w-2xl">
           <h2 className="text-lg font-bold mb-4">Select amount of USTD</h2>
           {/* Input Section */}
           <div className="space-y-4">
             <div className="flex items-center bg-gray-700 rounded-md p-3">
               <span className="text-xl font-bold mr-2">₹</span>
               <input
                 type="number"
                 placeholder="0"
                 className="bg-transparent text-white text-xl w-full focus:outline-none"
               />
             </div>
             <div className="flex items-center bg-gray-700 rounded-md p-3">
               <span className="text-xl font-bold mr-2">$</span>
               <input
                 type="number"
                 placeholder="0.00"
                 className="bg-transparent text-white text-xl w-full focus:outline-none"
               />
             </div>
           </div>
           {/* Withdrawable Balance */}
           <div className="flex justify-between items-center text-gray-400 text-sm mt-4">
             <p>Withdrawable balance ₹1177.42</p>
             <button className="text-blue-400 font-medium">All</button>
           </div>

           {/* Withdraw Button */}
           <button className="bg-gradient-to-r from-blue-500 to-blue-700 text-white w-full py-3 rounded-lg mt-6 font-bold hover:opacity-90">
             Withdraw
           </button>

            {/* Additional Info */}
            <ul className="text-sm text-gray-400 mt-6 space-y-2">
        <li className="flex items-center">
          <span className="text-blue-500 mr-2">◆</span>
          Need to bet <span className="text-red"> ₹378.00 </span> to be able to withdraw
        </li>
        <li className="flex items-center">
          <span className="text-blue-500 mr-2">◆</span>
          With time <span className="text-red"> 00:00-23:59</span>
        </li>
        <li className="flex items-center">
          <span className="text-blue-500 mr-2">◆</span>
          Inday Remaining Withdrawal Times: <span className="text-blue-400">3</span>
        </li>
        <li className="flex items-center">
          <span className="text-blue-500 mr-2">◆</span>
          Withdrawal amount range: <span className="text-red">₹300.00-₹150,000.00</span>
        </li>
        <li className="flex items-center">
          <span className="text-blue-500 mr-2">◆</span>
          Please confirm your beneficial account information before withdrawing.
        </li>
        <li className="flex items-center">
          <span className="text-blue-500 mr-2">◆</span>
          If your beneficial information is incorrect, please contact customer service.
        </li>
      </ul>
         </div>
       </div>
      )}
    </div>
    </div>
    </div>
  );
};

export default Withdraw;
