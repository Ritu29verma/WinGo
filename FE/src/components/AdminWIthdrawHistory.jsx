import React, { useState, useEffect, useRef, useCallback } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "./Loader";

const WithdrawHistoryModal = ({ isOpen, onClose }) => {
  const [withdrawHistory, setWithdrawHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef();
  const limit = 20;

  useEffect(() => {
    if (isOpen) {
      setWithdrawHistory([]);
      setPage(1);
      setHasMore(true);
      fetchWithdrawHistory(1);
    }
  }, [isOpen]);

  const fetchWithdrawHistory = async (pageNumber) => {
    if (!hasMore || loading) return;
    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/admin/get-withdraw-history?page=${pageNumber}&limit=${limit}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch withdrawal records.");
      }
      const data = await response.json();
      if (data.length < limit) {
        setHasMore(false);
      }
      setWithdrawHistory((prev) => [...prev, ...data]);
    } catch (error) {
      toast.error(error.message);
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
          setPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  useEffect(() => {
    if (page > 1) {
      fetchWithdrawHistory(page);
    }
  }, [page]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
      <div className="bg-gray-900 rounded-lg p-5 w-full max-w-md max-h-[85vh] relative overflow-hidden flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 font-bold hover:text-white"
        >
          ✕
        </button>

        <h2 className="text-xl font-bold text-white mb-3 text-center">
          Admin Withdraw History
        </h2>

        <ul className="space-y-2 overflow-y-auto max-h-[65vh] pr-2 scrollbar-hide">
          {withdrawHistory.map((withdraw, index) => (
            <li
              key={withdraw._id}
              ref={index === withdrawHistory.length - 1 ? lastElementRef : null}
              className="bg-gray-800 p-3 rounded-lg flex flex-col space-y-1"
            >
              <div className="flex flex-row justify-between">
                <span className="text-white font-medium">₹{withdraw.amount}</span>
                <span className="text-blue-400 text-sm">📞 {withdraw.adminId?.phoneNo || "N/A"}</span>
              </div>
              <span className="text-gray-400 text-sm">
                {new Date(withdraw.createdAt).toLocaleString()}
              </span>
            </li>
          ))}
           {loading && 
        <div className="text-sm">
        <Loader />
        </div>}
        <div className="flex justify-center mt-2">
          {!hasMore && !loading && (
            <p className="text-center text-gray-400">No more records.</p>
          )}
        </div>
        </ul>

       

        <ToastContainer />
      </div>
    </div>
  );
};

export default WithdrawHistoryModal;