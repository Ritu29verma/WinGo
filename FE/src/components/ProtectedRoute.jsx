import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

const ProtectedRoute = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(null);

  useEffect(() => {
    const verifyAdmin = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setIsAdmin(false);
          return;
        }

        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/admin/check`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setIsAdmin(response.data.isAdmin);
      } catch (error) {
        console.error("Authorization failed:", error);
        setIsAdmin(false);
      }
    };

    verifyAdmin();
  }, []);

  // Show loading or spinner while verifying admin status
  if (isAdmin === null) {
    return <div>Loading...</div>;
  }

  // Redirect to "/" if the user is not an admin
  return isAdmin ? children : <Navigate to="/" />;
};

export default ProtectedRoute;
