import { useState } from 'react';
import { FaPhoneAlt, FaLock,FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'; // Importing toast for notifications
import axios from 'axios';


function LoginPage() {
  const [phoneNo, setPhoneNo] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const navigate = useNavigate();

  // Handle phone number change
  const handlePhoneNumberChange = (value) => {
    setPhoneNo(value);
    setError(''); 
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

    try {
      const response = await axios.post('http://localhost:3000/auth/login', { phoneNo, password }, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.status === 200) {
        toast.success("Login successful");
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        navigate("/"); // Navigate to the dashboard after successful login
      }
    } catch (error) {
      setError(error.response?.data?.message || error.message);
      toast.error("Login failed. Please check your credentials.");
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
        <div className="flex items-center bg-gray-800 rounded-md p-2 mb-4">
          <input
            type="text"
            placeholder="Please enter your phone number"
            className="bg-transparent p-2 flex-grow outline-none text-gray-200"
            value={phoneNo}
            onChange={(e) => handlePhoneNumberChange(e.target.value)}
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
    </div>
  );
}

export default LoginPage;
