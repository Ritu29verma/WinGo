import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Register from "./pages/Register";
import Login from "./pages/Login";
import AdminSignup from './pages/AdminSignup';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import Home from './pages/Home';
import WinGo from "./pages/WinGo";
import DepositPage from './pages/DepositPage';
import Withdraw from './pages/Withdraw';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProtectedRoute from './components/ProtectedRoute';
import PaymentManage from './pages/Adminpayment';
import AddChannelModal from './components/Addchannel';
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem('token') ? true : false);

  useEffect(() => {
    // Update authentication status on component mount
    setIsAuthenticated(localStorage.getItem('token') ? true : false);
  }, []);

  return (
    <>
      <ToastContainer />
      <BrowserRouter>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <AdminDashboard />

              </ProtectedRoute>
            }
          />

          <Route path="/admin/paymentmanage" element={
            <ProtectedRoute>
              <PaymentManage/>
            </ProtectedRoute>
          }/>
          <Route path="/login" element={<Login />} />
          <Route path="/admin/register" element={<AdminSignup />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/" element={<Home />} />
          {/* Protected Route */}
          <Route path="/wingo" element={isAuthenticated ? <WinGo /> : <Navigate to="/login" />} />
          <Route path="/wingo/deposit" element={isAuthenticated ? <DepositPage /> : <Navigate to="/login" />} />
          <Route path="/wingo/withdraw" element={isAuthenticated ? <Withdraw /> : <Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
