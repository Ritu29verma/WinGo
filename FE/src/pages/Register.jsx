import React, { useState, useEffect } from "react";
import {  FaLock, FaUserAlt } from "react-icons/fa";
import IntlTelInput from "react-intl-tel-input";
import "react-intl-tel-input/dist/main.css";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaPhoneAlt, FaEye, FaEyeSlash } from "react-icons/fa";
import axios from 'axios';
import "../App.css"

const Register = () => {
  const [phoneNo, setPhoneNo] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [error,setError] = useState("");
  const [agree, setAgree] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isPasswordVisible1, setIsPasswordVisible1] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
        const response = await axios.post('http://localhost:3000/auth/register', {  phoneNo, password, inviteCode,agree },
            {  headers: {
                  "Content-Type": "application/json",
                },
              }
        );
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));

        if (response.status === 201) {
            toast.success("Sign up successful");
            navigate("/login");
            }
            } catch (error) {
                setError(error.message);
                toast.error("Sign up failed");
                }
  };




  const handlePhoneNumberChange = (isValid, value, countryData) => {
    // Concatenate the country code with the phone number
    const fullPhoneNo = `+${countryData.dialCode}${value.replace(/\s+/g, "")}`;
    setPhoneNo(fullPhoneNo);
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const togglePasswordVisibility1 = () => {
    setIsPasswordVisible1(!isPasswordVisible1);
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-customBlue p-6">
      <div className="bg-gray-900 text-white rounded-lg p-8 max-w-md w-full">
        <h2 className="text-3xl font-bold mb-2 text-center">Register</h2>
        <p className="text-center text-gray-400 mb-6">Please register by phone number</p>
          <hr className="border-blue-500 mt-2 p-2" />
        

        {/* Phone Number Input */}
        <label className="block text-gray-400 text-sm font-semibold mb-2">
          <FaPhoneAlt className="inline-block mr-2" /> Phone number
        </label>
        <div className="flex items-center bg-gray-800 rounded-md p-2 mb-4">
          <IntlTelInput
            preferredCountries={['in', 'us']}
            containerClassName="intl-tel-input"
            inputClassName="phone-input "
            onPhoneNumberChange={handlePhoneNumberChange}
            formatOnInit={false}
            separateDialCode={true}
          />
        </div>
        <p className="text-xs text-gray-500 mb-4">The phone number cannot start with 0 when registering!</p>

        {/* Password Input */}
        <label className="block text-gray-400 text-sm font-semibold mb-2">
          Set Password
        </label>
        <div className="flex items-center bg-gray-800 rounded-md p-2 mb-4">
          <input
            type={isPasswordVisible ? "text" : "password"}
            placeholder="Please enter the password"
            className="bg-transparent p-2 flex-grow outline-none text-gray-200"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div onClick={togglePasswordVisibility} className="cursor-pointer text-gray-500">
            {isPasswordVisible ?  <FaEye /> : <FaEyeSlash />}
          </div>
        </div>

        {/* Confirm Password Input */}
        <label className="block text-gray-400 text-sm font-semibold mb-2">
          <FaLock className="inline-block mr-2" /> Confirm Password
        </label>
        <div className="flex items-center bg-gray-800 rounded-md p-2 mb-4">
          <input
            type={isPasswordVisible1 ? "text" : "password"}
            placeholder="Please enter the confirm password"
            className="bg-transparent p-2 flex-grow outline-none text-gray-200"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
         <div onClick={togglePasswordVisibility1} className="cursor-pointer text-gray-500">
            {isPasswordVisible1 ?  <FaEye /> : <FaEyeSlash />}
          </div>
        </div>

        {/* Invite Code Input */}
        <label className="block text-gray-400 text-sm font-semibold mb-2">
          <FaUserAlt className="inline-block mr-2" /> Invite code
        </label>
        <div className="bg-gray-800 rounded-md p-2 mb-4">
          <input
            type="text"
            placeholder="Please enter the invitation code"
            className="bg-transparent p-2 w-full outline-none text-gray-200"
            value={inviteCode}
            onChange={(e) => setInviteCode(e.target.value)}
          />
        </div>

        {/* Agreement Checkbox */}
        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            className="mr-2"
            checked={agree}
            onChange={() => setAgree(!agree)}
          />
          <label className="text-sm text-gray-400">
            I have read and agree{" "}
            <a href="#" className="text-red-500 underline">
              [Privacy Agreement]
            </a>
          </label>
        </div>

        {/* Register Button */}
        <button
          className="w-full bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700 transition-colors mb-4"
          onClick={handleRegister}
          disabled={!agree}
        >
          Register
        </button>

        {/* Navigate to Login Page */}
        <p className="text-center text-gray-400 text-sm">
          Already have an account?{" "}
          <span
            className="text-blue-400 cursor-pointer hover:underline"
            onClick={() => navigate("/login")}
          >
            Log in
          </span>
        </p>
      </div>
    </div>
  );
};

export default Register;
