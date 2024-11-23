    import React, { useState,useEffect } from "react";
    import AdminNavbar from "../components/AdminNavbar";
    import PaymentChannels from "../components/PaymentChannels";
    import axios from 'axios';
    import { toast } from 'react-toastify';
    import 'react-toastify/dist/ReactToastify.css';


    const PaymentManage = () => {
    const [minAmount, setMinAmount] = useState("");
    const [currentMinAmount, setCurrentMinAmount] = useState(null);



    useEffect(() => {
        const fetchMinAmount = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/admin/getminamount`); // Replace with your API endpoint
            setCurrentMinAmount(response.data.minAmount);
        } catch (error) {
            console.error("Error fetching minimum amount:", error);
            toast.error("Failed to fetch the current minimum amount.");
        }
        };

        fetchMinAmount();
    }, []);
    const handleSetMinAmount = async () => {
        if (!minAmount || isNaN(minAmount) || Number(minAmount) <= 0) {
            toast.error("Please enter a valid positive number.");
        return;
        }

        try {
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/admin/minamount`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ value: Number(minAmount) }),
        });

        if (response.ok) {
            toast.success("Minimum amount updated successfully.");
            setMinAmount(""); // Clear the input field
            const updatedAmount = await response.json();
            setCurrentMinAmount(updatedAmount.minAmount.value);
        } else {
            toast.error("Failed to update minimum amount.");
        }
        } catch (error) {
        console.error("Error setting minimum amount:", error);
        toast.error("An error occurred. Please try again.");
        }
    };

    return (
        <>
  
        <AdminNavbar>
        <div className="bg-gray-700 text-white min-h-screen p-6 space-y-10">
            {/* Set Minimum Amount Section */}
            <div className="bg-gray-800 rounded-lg p-6 max-w-md mx-auto">
        <h1 className="text-xl font-bold text-center mb-6">Set Minimum Amount for New Users</h1>
        <div className="space-y-4">
            <input
            type="number"
            value={minAmount}
            onChange={(e) => setMinAmount(e.target.value)}
            className="w-full p-2 rounded border border-gray-500 bg-gray-800 focus:outline-none focus:ring focus:ring-orange-500 text-white"
            placeholder="Enter minimum amount"
            />
            {currentMinAmount !== null && (
            <p className="text-gray-300 text-sm">
                Current minimum amount: <span className="font-bold">{currentMinAmount}</span>
            </p>
            )}
            <button
            onClick={handleSetMinAmount}
            className="w-full bg-orange-500 text-white font-bold p-2 rounded-lg transform transition-transform hover:scale-95"
            >
            Submit
            </button>
        </div>
        </div>

            {/* Payment Channels Section */}
            <PaymentChannels baseUrl={import.meta.env.VITE_BASE_URL} />
        </div>

        </AdminNavbar>
               </> 
    );
    };

    export default PaymentManage;
