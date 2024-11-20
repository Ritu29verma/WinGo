import { useState } from 'react';
import { FaPhoneAlt, FaLock,FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { ToastContainer,toast } from 'react-toastify'; // Importing toast for notifications
import axios from 'axios';
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

function LoginPage() {
  const [phoneNo, setPhoneNo] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [countryCode, setCountryCode] = useState("");
  const navigate = useNavigate();

  // Handle phone number change
  const handlePhoneNumberChange = (value, countryData) => {
    setPhoneNo(value); // Set phone number
    setCountryCode(countryData.dialCode); 
    setError('')
  };

  const handlePasswordChange = (value) => {
    setPassword(value);
    setError('');  // Clear previous error when user starts typing
  };

  // Handle login
  const handleSubmit = async () => {
    if (!phoneNo || !password) {
      toast.error("Both fields are required");
      return;
    }
    const phoneNumber = phoneNo.slice(countryCode.length);
  
    // Ensure phone number is valid (e.g., has at least 10 digits after removing the country code)
    if (phoneNumber.length < 10) {
      toast.error("Please enter a valid phone number");
      return;
    }

    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/auth/login`, 
        { phoneNo:phoneNumber, 
          password }, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.status === 200) {
        toast.success("Login successful");
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user_id", JSON.stringify(response.data.user.id));
        localStorage.setItem("isAdmin",false)
        setTimeout(() => {
          navigate("/");
        }, 1500); 
      }
    } catch (error) {
      // Log the full error object for debugging
      console.error("Error during login:", error);
  
      if (error.code === 'ERR_NETWORK') {
        // Handle network error explicitly
        toast.error("Network error. Please check your connection and try again.");
      } else if (error.response?.data?.error) {
        // Handle specific backend error messages
        if (Array.isArray(error.response.data.error)) {
          error.response.data.error.forEach((err) => toast.error(err.message));
        } else {
          toast.error(error.response.data.error);
        }
      } else {
        // Fallback error message if no specific error is provided
        toast.error("Login failed. Please try again.");
      }
    }
  };

  
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-customBlue p-6">
      <div className="bg-gray-900 text-white rounded-lg p-8 max-w-md w-full">
        <h2 className="text-3xl font-bold mb-2 text-center">Login</h2>
        <p className="text-center text-gray-400 mb-6">Please login with your phone number</p>
        <hr className="border-blue-500 mt-2 p-2" />

        {/* Phone Number Input */}
        <label className="block text-gray-400 text-sm font-semibold mb-2">
          <FaPhoneAlt className="inline-block mr-2" /> Phone number
        </label>
        <div className="">
      <PhoneInput
          country={"in"}
          value={phoneNo}
          onChange={(value, countryData) => handlePhoneNumberChange(value, countryData)}
          specialLabel="Phone Number"
          placeholder="XXXXXXXXXX"
          inputClass=""
    
          containerStyle={{
            backgroundColor: "#1f2937", // Matches bg-gray-800
            borderRadius: "8px", // Matches rounded-md
            padding: "8px", // Matches p-2
            marginBottom: "16px", // Matches mb-4
          }}
          
          disableDropdown={false}
        />

        </div>

        {/* Password Input */}
        <label className="block text-gray-400 text-sm font-semibold mb-2">
          <FaLock className="inline-block mr-2" /> Password
        </label>
        <div className="flex items-center bg-gray-800 rounded-md p-2 mb-4">
          <input
               type={isPasswordVisible ? "text" : "password"}
            placeholder="Please enter your password"
            className="bg-transparent p-2 flex-grow outline-none text-gray-200"
            value={password}
            onChange={(e) => handlePasswordChange(e.target.value)}
          />
            <div onClick={togglePasswordVisibility} className="cursor-pointer text-gray-500">
            {isPasswordVisible ?  <FaEye /> : <FaEyeSlash />}
          </div>
        </div>

        {/* Error Message */}
        {error && <p className="text-red-500 text-xs text-center mb-4">{error}</p>}

        {/* Login Button */}
        <button
          className="w-full bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700 transition-colors mb-4"
          onClick={handleSubmit}
        >
          Login
        </button>

        {/* Navigate to Register Page */}
        <p className="text-center text-gray-400 text-sm">
          Don't have an account?{" "}
          <span
            className="text-blue-400 cursor-pointer hover:underline"
            onClick={() => navigate("/register")}
          >
            Sign up
          </span>
        </p>
      </div>
      <ToastContainer />
    </div>
  );
}

export default LoginPage;
