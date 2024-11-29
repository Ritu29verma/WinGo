import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

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

        // Verify the token with the backend
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

  // Show loading or spinner while verifying user status
  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }

  // Redirect to "/login" if the user is not authenticated
  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default PrivateRouteUser;
