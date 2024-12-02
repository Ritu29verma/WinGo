import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import AdminNavbar from "../components/AdminNavbar";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BetsData = () => {
  const [betsData, setBetsData] = useState([]);
  const [searchDate, setSearchDate] = useState(moment().format("YYYY-MM-DD")); // Default to today's date
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [expandedRows, setExpandedRows] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    const fetchTotalPurchasedAmount = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/admin/total-purchased-amount`); // Adjust this URL based on your setup
        setTotalAmount(response.data.totalAmount);
      } catch (error) {
        console.error('Error fetching total purchased amount:', error);
      }
    };

    fetchTotalPurchasedAmount();

    // Polling to check for updates every 10 seconds (you can adjust the interval)
    const interval = setInterval(fetchTotalPurchasedAmount, 10000);
    return () => clearInterval(interval); // Cleanup on component unmount
  }, []);


  const fetchBetsData = async (date) => {
    try {
      setLoading(true);
      setError("");
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/admin/betsData`, {
        params: { date },
      });
      setBetsData(response.data);
    } catch (err) {
      setError("Failed to fetch data");
      toast.error("An error occurred while fetching game results.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Fetch data for today's date on component mount
    fetchBetsData(moment().format("YYYY-MM-DD"));
  }, []);

  const handleSearch = () => {
    if (!moment(searchDate, "YYYY-MM-DD", true).isValid() || moment(searchDate).isAfter(moment())) {
      toast.error("Please enter a valid date (not in the future).");
      return;
    }
    fetchBetsData(searchDate);
  };

  const toggleRow = (id) => {
    setExpandedRows((prevExpandedRows) =>
      prevExpandedRows.includes(id)
        ? prevExpandedRows.filter((rowId) => rowId !== id)
        : [...prevExpandedRows, id]
    );
  };

  return (
    <AdminNavbar>
      <div className="bg-gray-700 text-white min-h-screen p-6 space-y-10">
        {/* Search Section */}
      <div className="flex justify-between">
      <div className="bg-gray-800 rounded-lg p-6 max-w-md mx-auto w-1/3">
          <h1 className="text-xl font-bold text-center mb-6">Search Bets Data</h1>
          <div className="space-y-4">
            <input
              type="date"
              value={searchDate}
              onChange={(e) => setSearchDate(e.target.value)}
              className="w-full p-2 rounded border border-gray-500 bg-gray-800 focus:outline-none focus:ring focus:ring-orange-500 text-white"
            />
            <button
              onClick={handleSearch}
              className="w-full bg-orange-500 text-white font-bold p-2 rounded-lg transform transition-transform hover:scale-95"
            >
              Search
            </button>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 max-w-md mx-auto">
        <h2 className="text-xl font-bold mb-6">Today's Total Purchased Amount</h2>
        <p className="text-2xl mt-4">₹{totalAmount}</p>
      </div>
     
    </div>

        {/* Results Section */}
        <div className="bg-gray-800 rounded-lg p-4 mx-auto">
          <h1 className="text-lg font-bold mb-4 text-center">Game Results</h1>
          {error && <p className="text-red text-center mb-4">{error}</p>}
          {loading ? (
            <p className="text-center">Loading...</p>
          ) : betsData.length === 0 ? (
            <p className="text-center text-white">No game history found.</p>
          ) : (
            <div className="space-y-4">
              {betsData.map((result) => (
                <div
                  key={result._id}
                  className="bg-slate-800 rounded-lg shadow-md p-4 cursor-pointer hover:bg-slate-700"
                  onClick={() => toggleRow(result._id)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-white text-lg">Contact: {result.userid.phoneNo}</p>
                      <p className="text-gray-400 text-md">{result.periodNumber}</p>
                    </div>
                    <div>
                      <p
                        className={`text-lg ${
                          result.status === "succeed" ? "text-green-400" : "text-red"
                        }`}
                      >
                        {result.status === "succeed" ? "Win" : "Loss"}
                      </p>
                      <p
                        className={`${
                          result.winLoss > 0 ? "text-green-400" : "text-red"
                        }`}
                      >
                        ₹{result.winLoss.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  {expandedRows.includes(result._id) && (
                    <div className="mt-4 bg-gray-900 rounded-lg p-3 text-sm">
                      <div className="flex justify-between mb-2">
                        <p className="text-gray-400">Purchase Amount:</p>
                        <p className="text-white">₹{result.purchaseAmount.toFixed(2)}</p>
                      </div>
                      <div className="flex justify-between mb-2">
                        <p className="text-gray-400">Amount After Tax:</p>
                        <p className="text-white">₹{result.amountAfterTax.toFixed(2)}</p>
                      </div>
                      <div className="flex justify-between mb-2">
                        <p className="text-gray-400">Tax:</p>
                        <p className="text-white">₹{result.tax.toFixed(2)}</p>
                      </div>
                      <div className="flex justify-between mb-2">
                        <p className="text-gray-400">Result:</p>
                        <p className="text-white">{result.result}</p>
                      </div>
                      <div className="flex justify-between mb-2">
                        <p className="text-gray-400">Selection:</p>
                        <p className="text-white">{result.select}</p>
                      </div>
                      <div className="flex justify-between">
                        <p className="text-gray-400">Date & Time:</p>
                        <p className="text-white">
                          {moment(result.time).format("YYYY-MM-DD HH:mm:ss")}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminNavbar>
  );
};

export default BetsData;
