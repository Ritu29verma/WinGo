import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";
import socket from "../socket";
import Loader from "../components/Loader";

const PrivateRouteUser = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setIsAuthenticated(false);
          return;
        }
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/auth/verify`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setIsAuthenticated(response.data.isAuthenticated);
      } catch (error) {
        console.error("User authentication failed:", error);
        setIsAuthenticated(false);
      }
    };

    verifyUser();
  }, []);
  useEffect(() => {
    if (isAuthenticated) {
      const userId = localStorage.getItem("user_id");
      const token = localStorage.getItem("token");

      if (userId) {
        let parsedUserId;
        try {
          parsedUserId = JSON.parse(userId);
        } catch (e) {
          parsedUserId = userId; 
        }
        // Emit the user registration event to the socket
        socket.emit("registerUser", parsedUserId);
      }

      if (token) {
        // Call the sync-wallets API
        const syncWallets = async () => {
          try {
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/auth/sync-wallets`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            console.log("Sync Wallets Response:", response.data);
          } catch (error) {
            console.error("Error syncing wallets:", error.response?.data || error.message);
          }
        };

        syncWallets();
      }}
    
  }, [isAuthenticated]);
//loading
  if (isAuthenticated === null) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-customBlue">
        <Loader />
      </div>
    );
  }


  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default PrivateRouteUser;
