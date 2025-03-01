import React, { useState, useEffect, useRef , useCallback} from 'react';
import axios from 'axios';
import moment from 'moment';
import AdminNavbar from '../components/AdminNavbar';
import { toast } from 'react-toastify';
import Loader from "../components/Loader";
import { FaEdit } from "react-icons/fa";
import WithdrawHistoryModal from '../components/AdminWIthdrawHistory';

const BetsData = () => {
  const today = moment().format('YYYY-MM-DD');
  const [betsData, setBetsData] = useState([]);
  const [fromDate, setFromDate] = useState(today);
  const [toDate, setToDate] = useState(today);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [expandedRows, setExpandedRows] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalProfit, setTotalProfit] = useState(0);
  const [totalLoss, setTotalLoss] = useState(0);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef();
  const initialLoad = useRef(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newReserve, setNewReserve] = useState(0);
  const [Reserve, setReserve] = useState(0);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

  const handleAdminWithdraw = async () => {
    if (!withdrawAmount || withdrawAmount <= 0) {
      toast.error("Please enter a valid amount.");
      return;
    }

    try {
      const adminId = localStorage.getItem("admin_id")
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/admin/withdraw-wallet`,
        { amount: withdrawAmount, adminId }
      );

      
      toast.success(response.data.message || "Withdrawal Successful! ");
      setIsWithdrawModalOpen(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Withdrawal failed.");
    }
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/admin/update-wallet-percent`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reservePercentage: newReserve }),
      });
  
      const data = await response.json(); // Parse response JSON
  
      if (!response.ok) {
        throw new Error(data.message || "Failed to update reserve percentage"); 
      }
  
      setReserve(data.reservePercentage);
      setNewReserve(data.reservePercentage);
      setIsModalOpen(false); // Close modal
      toast.success(data.message || "Reserve percentage updated successfully!");
    } catch (error) {
      console.error("Error updating reserve percentage:", error);
      toast.error(error.message || "Something went wrong!");
    }
  };
  
  

  useEffect(() => {
    const fetchpercent = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/admin/get-wallet-percent`);
        const data = await response.json();
        setReserve(data.percent);
        setNewReserve(data.percent);
      } catch (error) {
        console.error("Error fetching balance:", error);
      }
    };
    fetchpercent();
  }, []);

  

  const fetchTotalPurchasedAmount = async (fromDate, toDate) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/admin/total-purchased-amount`,
        { params: { fromDate, toDate } }
      );
      setTotalAmount(response.data.totalAmount || 0);
      setTotalProfit(response.data.totalProfit || 0);
      setTotalLoss(response.data.totalLoss || 0);

    } catch (error) {
      console.error("Error fetching total purchased amount:", error);
      setTotalAmount(0); 
    }
  };
  const fetchBetsDataforInitial = async (fromDate, toDate) => {
    try {
      setLoading(true);
      setError("");
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/admin/betsData`, {
        params: { fromDate, toDate, page, limit: 30 },
      });
      const newData = response.data.items || [];

      setBetsData((prev) => [...prev, ...newData]);
      setHasMore(newData.length === 30);
    } catch (err) {
      console.error("Error fetching bets data:", err);
      setError("");
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };
  const fetchBetsData = async (fromDate, toDate) => {
    try {
      setLoading(true);
      setError("");
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/admin/betsData`, {
        params: { fromDate, toDate, page, limit: 30 },
      });
      const newData = response.data.items || [];

      setBetsData((prev) => [...prev, ...newData]);
      setHasMore(newData.length === 30);
      setPage((prev) => prev + 1);
    } catch (err) {
      console.error("Error fetching bets data:", err);
      setError("");
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const today = moment().format('YYYY-MM-DD');

    if (initialLoad.current) {  
      initialLoad.current = false; 
      fetchBetsDataforInitial(today, today);
      fetchTotalPurchasedAmount(today, today);
    }

  }, []);

  const fetchBetsDatapage1 = async (fromDate, toDate) => {
    try {
      setLoading(true);
      setError("");
      setPage(1)
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/admin/betsData`, {
        params: { fromDate, toDate, page: 1, limit: 30 },
      });
      const newData = response.data.items || [];

      setBetsData((prev) => [...prev, ...newData]);
      setHasMore(newData.length === 30);
      setPage((prev) => prev + 1);
      console.log("page is set to ",page)
    } catch (err) {
      console.error("Error fetching bets data:", err);
      setError("");
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  const lastElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          fetchBetsData(fromDate, toDate);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore, fromDate, toDate, fetchBetsData]
  );


  const handleSearch = () => {
    if (!moment(fromDate, "YYYY-MM-DD", true).isValid() || !moment(toDate, "YYYY-MM-DD", true).isValid() || moment(fromDate).isAfter(moment(toDate))) {
      toast.error("Please enter valid dates and ensure 'From Date' is not after 'To Date'.");
      return;
    }
    setBetsData([]);
    setPage((prev) => 1);
    setHasMore(true);
    fetchBetsDatapage1(fromDate, toDate);
    fetchTotalPurchasedAmount(fromDate, toDate);
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
    <div className="bg-gray-700 text-white min-h-screen p-6 space-y-6">
      {loading && (
        <div className="inset-0 flex items-center justify-center bg-gray-700">
          <Loader />
        </div>
      )}

      {/* Search Section */}
      <div className={`flex flex-col space-y-4 md:flex-row md:space-y-0 justify-between ${loading ? 'opacity-50 pointer-events-none' : ''}`}>
        <div className="bg-gray-800 rounded-lg p-6 max-w-md mx-auto w-full md:w-1/3">
          <h1 className="text-xl font-bold text-center mb-6">Search Bets Data</h1>
          <div className="space-y-4">
            <div>
              <label htmlFor="fromDate" className="block text-white">From Date</label>
              <input
                id="fromDate"
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="w-full p-2 rounded border border-gray-500 bg-gray-800 focus:outline-none focus:ring focus:ring-orange-500 text-white"
              />
            </div>
            <div>
              <label htmlFor="toDate" className="block text-white">To Date</label>
              <input
                id="toDate"
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="w-full p-2 rounded border border-gray-500 bg-gray-800 focus:outline-none focus:ring focus:ring-orange-500 text-white"
              />
            </div>
            <button
              onClick={handleSearch}
              className="w-full bg-orange-500 text-white font-bold p-2 rounded-lg transform transition-transform hover:scale-95"
            >
              Search
            </button>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 max-w-md mx-auto flex flex-col gap-4">
          {/* Row 1: Total InGame Amount */}
          <div className="flex flex-col">
            <h2 className="text-xl font-bold">Total InGame Amount</h2>
            <p className="text-2xl mt-2 text-left">₹{totalAmount}</p>
          </div>
          {/* Row 2: Total Profit Amount */}
          <div className="flex flex-col">
            <h2 className="text-xl font-bold">Total Profit Amount</h2>
            <p className="text-2xl mt-2 text-left text-green-500">₹{totalProfit.toFixed(2)}</p>
          </div>

          {/* Row 3: Total Loss Amount */}
          <div className="flex flex-col">
            <h2 className="text-xl font-bold">Total Loss Amount</h2>
            <p className="text-2xl mt-2 text-left text-red">₹{totalLoss.toFixed(2)}</p>
          </div>

        </div> 
        <div className="bg-gray-800 rounded-lg p-6 max-w-md mx-auto flex flex-col items-center justify-center gap-4">
          <div className="flex flex-row space-x-2 items-center justify-center">
        <h4 className="text-xl font-bold">Reserve %</h4>
      <p className="text-2xl text-left text-green-500">{Reserve}%</p>
      <button onClick={() => setIsModalOpen(true)} className="text-white">
        <FaEdit className="text-lg cursor-pointer hover:text-blue-500" />
      </button>
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Edit Reserve Percentage</h2>
            <input
              type="number"
              value={newReserve}
              onChange={(e) => setNewReserve(e.target.value)}
              className="border p-2 w-full rounded border-gray-500 text-gray-900"
            />
            <div className="flex justify-end mt-4">
              <button onClick={() => setIsModalOpen(false)} className="mr-2 px-4 py-2 bg-gray-400 rounded">Cancel</button>
              <button onClick={handleSave}  className="px-4 py-2 bg-blue-500 text-white rounded">Save</button>
            </div>
          </div>
        </div>
      )}
      </div>
      <div className="flex flex-row space-x-2 ">
      <button
            onClick={() => setIsWithdrawModalOpen(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Withdraw Amount
          </button>

          {isWithdrawModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-80">
              <h2 className="text-xl font-bold mb-4 text-gray-800">
                Enter Withdrawal Amount
              </h2>
              <input
                type="number"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                className="border p-2 w-full rounded border-gray-500 text-gray-900"
              />
              <div className="flex justify-end mt-4">
                <button
                  onClick={() => setIsWithdrawModalOpen(false)}
                  className="mr-2 px-4 py-2 bg-gray-400 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAdminWithdraw}
                  className="px-4 py-2 bg-blue-500 text-white rounded"
                >
                  Withdraw
                </button>
              </div>
            </div>
          </div>
        )}
        

       </div>
       <button
            onClick={() => setIsHistoryModalOpen(true)}
            className="px-2 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
           View Withdraw History

          </button>
          <WithdrawHistoryModal isOpen={isHistoryModalOpen} onClose={() => setIsHistoryModalOpen(false)} />
        </div>

      </div>

      {/* Results Section */}
      <div className={`bg-gray-800 rounded-lg p-4 mx-auto ${loading ? 'opacity-50 pointer-events-none' : ''}`}>
        <h1 className="text-lg font-bold mb-4 text-center">Game Results</h1>
        {error && <p className="text-red text-center mb-4">{error}</p>}
        {betsData.length === 0 ? (
          <p className="text-center text-white">No game history found.</p>
        ) : (
          <div className="space-y-4">
            {betsData.map((result,index) => (
              <div
                key={result._id}
                className="bg-slate-800 rounded-lg shadow-md p-4 cursor-pointer hover:bg-slate-700"
                onClick={() => toggleRow(result._id)}
                ref={betsData.length - 1 === index ? lastElementRef : null}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-white text-lg">Contact: {result.userid ? result.userid.phoneNo : 'N/A'}  </p>
                    <p className="text-gray-400 text-md">{result.periodNumber} </p>
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
                      <p className="text-gray-400">Duration:</p>
                      <p className="text-gold">{result.duration}</p>
                    </div>
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
             {loading && <p className="text-center text-white">Loading...</p>}
            {!hasMore && <p className="text-center text-white">No more data to load.</p>}
          </div>
        )}
      </div>
    </div>
  </AdminNavbar>

  );
};

export default BetsData;

