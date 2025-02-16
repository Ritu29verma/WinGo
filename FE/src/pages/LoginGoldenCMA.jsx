import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Loader from "../components/Loader";

const Login = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const checkClient = async (username, password) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/auth/check-client`, {
        params: {
          code: username,
          password: password,
        },
      });

      const { token, user } = response.data;
      sessionStorage.setItem("token", token);
      sessionStorage.setItem("user_id", user.id);
      sessionStorage.setItem("phoneNumber",user.phoneNo);
      sessionStorage.setItem("username",username);

      navigate("/");
    } catch (error) {
      console.error("Error calling the API:", error.response?.data || error.message);
    }
  };

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const username = queryParams.get("username");
    const password = queryParams.get("password");

    if (username && password) {
      checkClient(username, password);
    } else {
      console.error("Missing username or password in query parameters.");
    }
  }, [location.search]); // Re-run if the URL changes

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-700">
      <Loader /> 
      {/* loading */}
    </div>
  );
};

export default Login;
