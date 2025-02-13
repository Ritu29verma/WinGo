import React, { useState, useEffect, useRef , useCallback} from 'react';
import axios from 'axios';
import moment from 'moment';
import AdminNavbar from '../components/AdminNavbar';
import { toast } from 'react-toastify';
import Loader from "../components/Loader";


const BetsData = () => {
  const today = moment().format('YYYY-MM-DD');
  const [betsData, setBetsData] = useState([]);
  const [fromDate, setFromDate] = useState(today);
  const [toDate, setToDate] = useState(today);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef();

  // Fetch Total Purchased Amount
  const fetchTotalPurchasedAmount = async (fromDate, toDate) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/admin/total-purchased-amount`,
        { params: { fromDate, toDate } }
      );
      setTotalAmount(response.data.totalAmount || 0);
    } catch (error) {
      console.error("Error fetching total purchased amount:", error);
      setTotalAmount(0);
    }
  };

  // Fetch Bets Data with Pagination
   const fetchBetsData = useCallback(async () => {
    if (!fromDate || !toDate || !hasMore) return;

    setLoading(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/admin/betsData`, {
        params: { fromDate, toDate, page, limit: 30 },
      });

      const newData = response.data.items || [];

      setBetsData((prev) => [...prev, ...newData]); 
      setHasMore(newData.length === 30);
      setPage((prev) => prev + 1); 
    } catch (err) {
      console.error("Error fetching bets data:", err);
      setBetsData([]);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [fromDate, toDate, page, hasMore]);

  // Handle Search Button Click
  const handleSearch = () => {
    if (!moment(fromDate, "YYYY-MM-DD", true).isValid() || !moment(toDate, "YYYY-MM-DD", true).isValid() || moment(fromDate).isAfter(moment(toDate))) {
      toast.error("Please enter valid dates and ensure 'From Date' is not after 'To Date'.");
      return;
    }
    setBetsData([]);
    setPage(1);
    setHasMore(true);
    fetchBetsData();
    fetchTotalPurchasedAmount();
  };

   // Observe the last element for infinite scrolling
   const lastElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          fetchBetsData();
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore, fetchBetsData]
  );

  useEffect(() => {
    fetchBetsData();
    fetchTotalPurchasedAmount();
  }, []);


  return (
    <AdminNavbar>
      <div className="bg-gray-700 text-white min-h-screen p-6 space-y-10 relative">
        {loading && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50 z-50">
            <Loader />
          </div>
        )}

        {/* Search Section */}
        <div className="flex justify-between">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md mx-auto w-1/3">
            <h1 className="text-xl font-bold text-center mb-6">Search Bets Data</h1>
            <div className="space-y-4">
              <div>
                <label htmlFor="fromDate" className="block text-white">From Date</label>
                <input
                  id="fromDate"
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="w-full p-2 rounded border border-gray-500 bg-gray-800 text-white"
                />
              </div>
              <div>
                <label htmlFor="toDate" className="block text-white">To Date</label>
                <input
                  id="toDate"
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="w-full p-2 rounded border border-gray-500 bg-gray-800 text-white"
                />
              </div>
              <button onClick={handleSearch} className="w-full bg-orange-500 text-white font-bold p-2 rounded-lg">Search</button>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 max-w-md mx-auto">
            <h2 className="text-xl font-bold mb-6">Total Purchased Amount</h2>
            <p className="text-2xl mt-4">₹{totalAmount}</p>
          </div>
        </div>

        {/* Results Section */}
        <div className="bg-gray-800 rounded-lg p-4 mx-auto">
          <h1 className="text-lg font-bold mb-4 text-center">Game Results</h1>
          {error && <p className="text-red text-center mb-4">{error}</p>}
          {betsData.length === 0 && !loading ? (
            <p className="text-center text-white">No game history found.</p>
          ) : (
            <div className="space-y-4">
              {betsData.map((result, index) => (
                <div key={index} className="bg-slate-800 rounded-lg shadow-md p-4 flex justify-between">
                  <div>
                    <p className="text-white text-lg">Contact: {result.userid ? result.userid.phoneNo : 'N/A'}</p>
                    <p className="text-gray-400 text-md">{result.periodNumber}</p>
                  </div>
                  <div>
                    <p className={`text-lg ${result.status === "succeed" ? "text-green-400" : "text-red"}`}>
                      {result.status === "succeed" ? "Win" : "Loss"}
                    </p>
                    <p className={result.winLoss > 0 ? "text-green-400" : "text-red"}>₹{result.winLoss.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Observer Target (Invisible) */}
        <div ref={lastElementRef} style={{ height: "20px" }}></div>
      </div>
    </AdminNavbar>
  );
};

export default BetsData;
