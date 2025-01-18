import { useParams, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import AdminNavbar from "./AdminNavbar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "../components/Loader";

const UserGameHistory = () => {
  const { userId } = useParams();
  const { state } = useLocation(); 
  const phone = state?.phone || "Unknown"; 

  const [gameData, setGameData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGameResults = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/game/getGameResults-by-id?userId=${userId}`
        );
        setGameData(response.data.gameData || []);
      } catch (error) {
        console.error("Error fetching game results:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGameResults();
  }, [userId]);

  return (
    <AdminNavbar>
      <div className="bg-gray-700 min-h-screen p-4 relative">
      {loading ? (
      <div className="absolute inset-0 flex items-center justify-center bg-gray-700">
        <Loader />
      </div>
    ) : (
      <>
        <h2 className="text-center text-xl font-bold mb-4 text-white">
          User: {phone}
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-gray-400 text-center">
            <thead className="bg-gray-600 text-gray-200">
              <tr>
                <th className="px-4 py-2">Period Number</th>
                <th className="px-4 py-2">Purchase Amount</th>
                <th className="px-4 py-2">TimeSlot</th>
                
                <th className="px-4 py-2">Result</th>
                <th className="px-4 py-2">Select</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Tax</th>
                <th className="px-4 py-2">Amount After Tax</th>
                <th className="px-4 py-2">Time</th>
              </tr>
            </thead>
            <tbody>
             {gameData.length > 0 ? (
                gameData.map((data, index) => (
                  <tr key={index} className="bg-gray-900 border-t border-gray-600">
                    <td className="px-4 py-2">{data.periodNumber}</td>
                    <td className="px-4 py-2">₹{data.purchaseAmount}</td>
                    <td className="px-4 py-2">{data.duration}</td>
                    
                    <td className="px-4 py-2">{data.result}</td>
                    <td className="px-4 py-2">{data.select}</td>
                    <td className="px-4 py-2">
                      {data.status === "succeed" ? (
                        <button className="bg-green-500 text-white px-4 py-1 rounded-full">
                          Win
                        </button>
                      ) : (
                        <button className="bg-red text-white px-4 py-1 rounded-full">
                          Loss
                        </button>
                      )}
                    </td>
                    <td className="px-4 py-2">₹{data.tax}</td>
                    <td className="px-4 py-2">₹{data.amountAfterTax}</td>
                    <td className="px-4 py-2">{new Date(data.time).toLocaleString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="px-4 py-2" colSpan="9">
                    No game history available.
                  </td>
                </tr>
              )}
             </tbody>
          </table>
        </div>
      </>
    )}
    <ToastContainer />
  </div>
</AdminNavbar>
  );
};

export default UserGameHistory;
